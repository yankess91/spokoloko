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
        var today = DateTime.Now.Date.ToString();
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

            await productRepository.AddAsync(new Product
            {
                Name = p.name,
                Brand = "magfactory.eu",
                Notes = $"Pobrane {today}",
                Price = p.price,
                ImageUrl = imgUrl,
                ShopUrl = p.productUrl
            }, ct);
        }

        await productRepository.SaveChangesAsync(ct);
    }
}
