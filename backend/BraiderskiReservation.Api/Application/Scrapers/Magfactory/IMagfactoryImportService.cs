
namespace BraiderskiReservation.Api.Application.Scrapers.Magfactory
{
    public interface IMagfactoryImportService
    {
        Task ImportCategoryAsync(string categoryUrl, CancellationToken ct = default);
    }
}