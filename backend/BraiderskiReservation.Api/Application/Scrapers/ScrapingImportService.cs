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
        foreach (var source in options.Value.Sources)
        {
            ct.ThrowIfCancellationRequested();
            await ImportSourceInternalAsync(source, ct);
        }
    }

    private async Task ImportSourceInternalAsync(ScrapingSource source, CancellationToken ct)
    {
        var scraper = scraperResolver.Get(source.Name);

        var scrapedProducts = new Dictionary<string, ProductDto>(StringComparer.OrdinalIgnoreCase);

        foreach (var categoryUrl in source.CategoryUrls)
        {
            ct.ThrowIfCancellationRequested();

            var products = await scraper.ScrapeProductsAsync(categoryUrl, source.MaxPages, ct);

            foreach (var product in products)
            {
                var normalizedUrl = NormalizeUrl(product.ProductUrl);
                if (string.IsNullOrWhiteSpace(normalizedUrl))
                    continue;

                scrapedProducts.TryAdd(normalizedUrl, product);
            }
        }

        if (scrapedProducts.Count == 0)
        {
            logger.LogWarning("Scraper {ScraperName} nie zwrócił żadnych produktów.", source.Name);
            return;
        }

        var existingProducts = (await productRepository.GetByBrandAsync(source.Name, ct))
            .ToDictionary(
                x => NormalizeUrl(x.ShopUrl),
                x => x,
                StringComparer.OrdinalIgnoreCase);

        var todayDate = DateTime.UtcNow.Date;
        var today = todayDate.ToString("yyyy-MM-dd");
        var toInsert = new List<Product>(scrapedProducts.Count);
        var disabledCount = 0;

        foreach (var (normalizedUrl, scraped) in scrapedProducts)
        {
            ct.ThrowIfCancellationRequested();

            if (existingProducts.ContainsKey(normalizedUrl))
                continue;

            toInsert.Add(new Product
            {
                Name = scraped.Name,
                Brand = source.Name,
                Notes = $"Pobrane {today}",
                Price = scraped.Price,
                ImageUrl = scraped.ImgUrl ?? string.Empty,
                ShopUrl = scraped.ProductUrl,
                IsAvailable = true,
                AvailabilityCheckedAt = todayDate
            });
        }

        foreach (var (normalizedUrl, existingProduct) in existingProducts)
        {
            ct.ThrowIfCancellationRequested();
            existingProduct.AvailabilityCheckedAt = todayDate;
            if (scrapedProducts.ContainsKey(normalizedUrl))
                continue;

            if (existingProduct.IsAvailable)
            {
                existingProduct.IsAvailable = false;
                disabledCount++;
            }
        }

        if (toInsert.Count > 0)
        {
            await productRepository.AddRangeAsync(toInsert, ct);
        }

        await productRepository.SaveChangesAsync(ct);

        logger.LogInformation(
            "Synchronizacja {SourceName} zakończona. Scraped: {ScrapedCount}, inserted: {InsertedCount}, disabled: {DisabledCount}, existing in db: {ExistingCount}.",
            source.Name,
            scrapedProducts.Count,
            toInsert.Count,
            disabledCount,
            existingProducts.Count);
    }

    private static string NormalizeUrl(string? url)
    {
        if (string.IsNullOrWhiteSpace(url))
            return string.Empty;

        return url.Trim().TrimEnd('/');
    }
}