namespace BraiderskiReservation.Domain.Entities;

public sealed class ServiceItem
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public TimeSpan Duration { get; set; } = TimeSpan.FromMinutes(60);
    public List<Appointment> Appointments { get; set; } = new();
}
