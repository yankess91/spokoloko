namespace BraiderskiReservation.Api.Application.Scrapers
{
    public interface IScraperResolver
    {
        IListingScraper Get(string name);
    }
}