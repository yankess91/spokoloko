using BraiderskiReservation.Domain.Entities;
using BraiderskiReservation.Domain.Interfaces;
using Microsoft.Extensions.Logging;

namespace BraiderskiReservation.Api.Application.Scrapers.Magfactory;

public sealed class MagfactoryImportService(
    IMagfactoryListingScraper listingScraper,
    IMagfactoryImageUrlProvider imageUrlProvider,
    IProductRepository productRepository,
    ILogger<MagfactoryImportService> logger) : IMagfactoryImportService
{
    public async Task ImportCategoryAsync(string categoryUrl, CancellationToken ct = default)
    {
        var products = await listingScraper.ScrapeProductsAsync(categoryUrl, ct: ct);

        var today = DateTime.UtcNow.Date.ToString("yyyy-MM-dd");
        var toInsert = new List<Product>(products.Count);

        foreach (var p in products)
        {
            ct.ThrowIfCancellationRequested();

            string? imgUrl = null;
            try
            {
                imgUrl = await imageUrlProvider.GetMainImageUrlAsync(p.ProductUrl, ct);
            }
            catch (Exception ex)
            {
                logger.LogWarning(ex, "Failed to fetch image URL for product {ProductUrl}.", p.ProductUrl);
            }

            toInsert.Add(new Product
            {
                Name = p.Name,
                Brand = "magfactory.eu",
                Notes = $"Pobrane {today}",
                Price = p.Price,
                ImageUrl = imgUrl,
                ShopUrl = p.ProductUrl
            });
        }

        if (toInsert.Count == 0)
            return;

        await productRepository.AddRangeAsync(toInsert, ct);
        await productRepository.SaveChangesAsync(ct);
    }
}
