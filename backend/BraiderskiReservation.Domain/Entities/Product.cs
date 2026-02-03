namespace BraiderskiReservation.Domain.Entities;

public sealed class Product
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = string.Empty;
    public string Brand { get; set; } = string.Empty;
    public string Notes { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    public List<ServiceProduct> ServiceProducts { get; set; } = new();
    public List<AppointmentProduct> AppointmentProducts { get; set; } = new();
}
