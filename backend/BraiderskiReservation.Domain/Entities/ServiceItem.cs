namespace BraiderskiReservation.Domain.Entities;

public sealed class ServiceItem
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public TimeSpan DurationFrom { get; set; } = TimeSpan.FromMinutes(60);
    public TimeSpan DurationTo { get; set; } = TimeSpan.FromMinutes(60);
    public decimal PriceFrom { get; set; }
    public decimal PriceTo { get; set; }
    public ServiceType Type { get; set; } = ServiceType.OnSite;
    public int? MaxCompletionTimeDays { get; set; }
    public int OrderPosition { get; set; }
    public List<Appointment> Appointments { get; set; } = new();
    public List<ServiceProduct> ServiceProducts { get; set; } = new();
}
