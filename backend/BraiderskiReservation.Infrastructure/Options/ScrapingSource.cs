namespace BraiderskiReservation.Infrastructure.Options;

public class ScrapingSource
{
    public string Name { get; set; } = string.Empty;
    public string BaseUrl { get; set; } = string.Empty;
    public List<string> CategoryUrls { get; set; } = [];
    public int MaxPages { get; set; } = 10;
    public int DelayMs { get; set; } = 0;
}
