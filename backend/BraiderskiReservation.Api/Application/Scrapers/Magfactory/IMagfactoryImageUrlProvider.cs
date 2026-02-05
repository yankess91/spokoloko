namespace BraiderskiReservation.Api.Application.Scrapers.Magfactory
{
    public interface IMagfactoryImageUrlProvider
    {
        Task<string?> GetMainImageUrlAsync(string productUrl, CancellationToken ct = default);
    }
}