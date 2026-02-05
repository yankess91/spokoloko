using BraiderskiReservation.Api.Application.DTOs;

namespace BraiderskiReservation.Api.Application.Scrapers.Magfactory
{
    public interface IMagfactoryListingScraper
    {
        Task<List<ProductDto>> ScrapeProductsAsync(string categoryUrl, int maxPagesSafety = 200, CancellationToken ct = default);
    }
}