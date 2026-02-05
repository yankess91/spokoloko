using BraiderskiReservation.Domain.Entities;
using BraiderskiReservation.Domain.Interfaces;

namespace BraiderskiReservation.Api.Application.Scrapers.Magfactory;

public sealed class MagfactoryImportService(
IMagfactoryListingScraper listingScraper,
IMagfactoryImageUrlProvider imageUrlProvider,
IProductRepository productRepository) : IMagfactoryImportService
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
                imgUrl = await imageUrlProvider.GetMainImageUrlAsync(p.productUrl, ct);
            }
            catch
            {
            }

            toInsert.Add(new Product
            {
                Name = p.name,
                Brand = "magfactory.eu",
                Notes = $"Pobrane {today}",
                Price = p.price,
                ImageUrl = imgUrl,
                ShopUrl = p.productUrl
            });
        }

        if (toInsert.Count == 0)
            return;

        await productRepository.AddRangeAsync(toInsert, ct);
        await productRepository.SaveChangesAsync(ct);
    }
}
