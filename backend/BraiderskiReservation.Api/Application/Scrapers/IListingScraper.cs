using BraiderskiReservation.Api.Application.DTOs;

namespace BraiderskiReservation.Api.Application.Scrapers;

public interface IListingScraper
{
    string Name { get; }

    Task<List<ProductDto>> ScrapeProductsAsync(
        string categoryUrl,
        int maxPages,
        CancellationToken ct = default);
}