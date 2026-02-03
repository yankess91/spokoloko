namespace BraiderskiReservation.Domain.Entities;

public sealed class ServiceProduct
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid ServiceId { get; set; }
    public Guid ProductId { get; set; }
    public ServiceItem? ServiceItem { get; set; }
    public Product? Product { get; set; }
}
