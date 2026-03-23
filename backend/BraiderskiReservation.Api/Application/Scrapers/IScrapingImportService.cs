namespace BraiderskiReservation.Api.Application.Scrapers
{
    public interface IScrapingImportService
    {
        Task ImportAllAsync(CancellationToken ct = default);
    }
}