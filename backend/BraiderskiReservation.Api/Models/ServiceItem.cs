namespace BraiderskiReservation.Api.Models;

public sealed class ServiceItem
{
    public Guid Id { get; init; } = Guid.NewGuid();
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public TimeSpan Duration { get; set; } = TimeSpan.FromMinutes(60);
}
