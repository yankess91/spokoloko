namespace BraiderskiReservation.Api.Application.Scrapers;

public class ScraperResolver(IEnumerable<IListingScraper> scrapers) : IScraperResolver
{
    private readonly Dictionary<string, IListingScraper> _map =
        scrapers.ToDictionary(x => x.Name, StringComparer.OrdinalIgnoreCase);

    public IListingScraper Get(string name)
    {
        if (_map.TryGetValue(name, out var scraper))
            return scraper;

        throw new Exception($"Scraper '{name}' not found");
    }
}
