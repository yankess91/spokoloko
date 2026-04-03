using BraiderskiReservation.Api.Application.DTOs;
using BraiderskiReservation.Domain.Entities;
using BraiderskiReservation.Domain.Interfaces;
using BraiderskiReservation.Infrastructure.Options;
using Microsoft.Extensions.Options;

namespace BraiderskiReservation.Api.Application.Scrapers;

public sealed class ScrapingImportService(
    IScraperResolver scraperResolver,
    IProductRepository productRepository,
    IOptions<ScrapingOptions> options,
    ILogger<ScrapingImportService> logger) : IScrapingImportService
{
    public async Task ImportAllAsync(CancellationToken ct = default)
    {
        var sources = options.Value.Sources;

        if (sources is null || sources.Count == 0)
        {
            logger.LogWarning("Brak skonfigurowanych źródeł scrapingu.");
            return;
        }

        foreach (var source in sources)
        {
            ct.ThrowIfCancellationRequested();

            if (!IsValidSource(source))
            {
                logger.LogWarning(
                    "Pomijam nieprawidłową konfigurację źródła. Name: {SourceName}",
                    source?.Name);
                continue;
            }

            await ImportSourceInternalAsync(source, ct);
        }
    }

    private async Task ImportSourceInternalAsync(ScrapingSource source, CancellationToken ct)
    {
        var scraper = scraperResolver.Get(source.Name);
        var today = DateTime.UtcNow.Date;

        var scrapedProducts = await ScrapeProductsByNormalizedUrlAsync(scraper, source, ct);

        if (scrapedProducts.Count == 0)
        {
            logger.LogWarning("Scraper {ScraperName} nie zwrócił żadnych produktów.", source.Name);
            return;
        }

        var existingProducts = await GetExistingProductsByNormalizedUrlAsync(source.Name, ct);

        var toInsert = new List<Product>(capacity: scrapedProducts.Count);
        var insertedCount = 0;
        var updatedCount = 0;
        var disabledCount = 0;
        var restoredCount = 0;

        foreach (var (normalizedUrl, scrapedProduct) in scrapedProducts)
        {
            ct.ThrowIfCancellationRequested();

            if (existingProducts.TryGetValue(normalizedUrl, out var existingProduct))
            {
                var updateResult = UpdateExistingProduct(existingProduct, scrapedProduct, today);

                if (updateResult.WasUpdated)
                    updatedCount++;

                if (updateResult.WasRestored)
                    restoredCount++;

                continue;
            }

            toInsert.Add(CreateNewProduct(scrapedProduct, source.Name, today));
            insertedCount++;
        }

        foreach (var (normalizedUrl, existingProduct) in existingProducts)
        {
            ct.ThrowIfCancellationRequested();

            existingProduct.AvailabilityCheckedAt = today;

            if (scrapedProducts.ContainsKey(normalizedUrl))
                continue;

            if (!existingProduct.IsAvailable)
                continue;

            existingProduct.IsAvailable = false;
            disabledCount++;
        }

        if (toInsert.Count > 0)
        {
            await productRepository.AddRangeAsync(toInsert, ct);
        }

        await productRepository.SaveChangesAsync(ct);

        logger.LogInformation(
            """
            Synchronizacja {SourceName} zakończona.
            Scraped: {ScrapedCount},
            inserted: {InsertedCount},
            updated: {UpdatedCount},
            restored: {RestoredCount},
            disabled: {DisabledCount},
            existing in db: {ExistingCount}.
            """,
            source.Name,
            scrapedProducts.Count,
            insertedCount,
            updatedCount,
            restoredCount,
            disabledCount,
            existingProducts.Count);
    }

    private async Task<Dictionary<string, ProductDto>> ScrapeProductsByNormalizedUrlAsync(
        IListingScraper scraper,
        ScrapingSource source,
        CancellationToken ct)
    {
        var scrapedProducts = new Dictionary<string, ProductDto>(StringComparer.OrdinalIgnoreCase);

        foreach (var categoryUrl in source.CategoryUrls)
        {
            ct.ThrowIfCancellationRequested();

            if (string.IsNullOrWhiteSpace(categoryUrl))
                continue;

            var products = await scraper.ScrapeProductsAsync(categoryUrl, source.MaxPages, ct);

            foreach (var product in products)
            {
                var normalizedUrl = NormalizeUrl(product.ProductUrl);

                if (string.IsNullOrWhiteSpace(normalizedUrl))
                    continue;

                scrapedProducts.TryAdd(normalizedUrl, product);
            }
        }

        return scrapedProducts;
    }

    private async Task<Dictionary<string, Product>> GetExistingProductsByNormalizedUrlAsync(
        string brand,
        CancellationToken ct)
    {
        var existingProducts = await productRepository.GetByBrandAsync(brand, ct);

        return existingProducts
            .Where(x => !string.IsNullOrWhiteSpace(x.ShopUrl))
            .GroupBy(x => NormalizeUrl(x.ShopUrl), StringComparer.OrdinalIgnoreCase)
            .ToDictionary(
                g => g.Key,
                g => g.First(),
                StringComparer.OrdinalIgnoreCase);
    }

    private static Product CreateNewProduct(ProductDto scrapedProduct, string brand, DateTime today)
    {
        return new Product
        {
            Name = scrapedProduct.Name,
            Brand = brand,
            Notes = BuildImportNote(today),
            Price = scrapedProduct.Price,
            ImageUrl = NormalizeImageUrl(scrapedProduct.ImgUrl),
            ShopUrl = scrapedProduct.ProductUrl,
            IsAvailable = true,
            AvailabilityCheckedAt = today
        };
    }

    private static UpdateExistingProductResult UpdateExistingProduct(
        Product existingProduct,
        ProductDto scrapedProduct,
        DateTime today)
    {
        var wasUpdated = false;
        var wasRestored = false;

        if (!string.Equals(existingProduct.Name, scrapedProduct.Name, StringComparison.Ordinal))
        {
            existingProduct.Name = scrapedProduct.Name;
            wasUpdated = true;
        }

        var normalizedImageUrl = NormalizeImageUrl(scrapedProduct.ImgUrl);
        if (!string.Equals(existingProduct.ImageUrl, normalizedImageUrl, StringComparison.Ordinal))
        {
            existingProduct.ImageUrl = normalizedImageUrl;
            wasUpdated = true;
        }

        if (existingProduct.Price != scrapedProduct.Price)
        {
            existingProduct.Price = scrapedProduct.Price;
            wasUpdated = true;
        }

        if (!string.Equals(existingProduct.ShopUrl, scrapedProduct.ProductUrl, StringComparison.Ordinal))
        {
            existingProduct.ShopUrl = scrapedProduct.ProductUrl;
            wasUpdated = true;
        }

        if (!existingProduct.IsAvailable)
        {
            existingProduct.IsAvailable = true;
            wasUpdated = true;
            wasRestored = true;
        }

        if (existingProduct.AvailabilityCheckedAt != today)
        {
            existingProduct.AvailabilityCheckedAt = today;
            wasUpdated = true;
        }

        var expectedNote = BuildImportNote(today);
        if (!string.Equals(existingProduct.Notes, expectedNote, StringComparison.Ordinal))
        {
            existingProduct.Notes = expectedNote;
            wasUpdated = true;
        }

        return new UpdateExistingProductResult(wasUpdated, wasRestored);
    }

    private static bool IsValidSource(ScrapingSource? source)
    {
        return source is not null
            && !string.IsNullOrWhiteSpace(source.Name)
            && source.CategoryUrls is not null
            && source.CategoryUrls.Count > 0;
    }

    private static string BuildImportNote(DateTime date)
    {
        return $"Pobrane {date:yyyy-MM-dd}";
    }

    private static string NormalizeImageUrl(string? imageUrl)
    {
        return imageUrl?.Trim() ?? string.Empty;
    }

    private static string NormalizeUrl(string? url)
    {
        if (string.IsNullOrWhiteSpace(url))
            return string.Empty;

        return url.Trim().TrimEnd('/');
    }

    private readonly record struct UpdateExistingProductResult(bool WasUpdated, bool WasRestored);
}