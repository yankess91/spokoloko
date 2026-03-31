namespace BraiderskiReservation.Api.Application.Scrapers.Magfactory;

public interface ILocalImageStorage
{
    Task<string?> SaveFromUrlIfNeededAsync(string? imageUrl, string sourceName, CancellationToken ct = default);
}
