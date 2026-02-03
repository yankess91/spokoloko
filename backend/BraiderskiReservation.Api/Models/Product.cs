namespace BraiderskiReservation.Api.Models;

public sealed class Product
{
    public Guid Id { get; init; } = Guid.NewGuid();
    public string Name { get; set; } = string.Empty;
    public string Brand { get; set; } = string.Empty;
    public string Notes { get; set; } = string.Empty;
}
