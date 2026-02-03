namespace BraiderskiReservation.Domain.Entities;

public sealed class Appointment
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid ClientId { get; set; }
    public Guid ServiceId { get; set; }
    public DateTime StartAt { get; set; }
    public DateTime EndAt { get; set; }
    public string Notes { get; set; } = string.Empty;
    public ClientProfile? ClientProfile { get; set; }
    public ServiceItem? ServiceItem { get; set; }
}
