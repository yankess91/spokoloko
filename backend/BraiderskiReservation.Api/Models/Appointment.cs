namespace BraiderskiReservation.Api.Models;

public sealed class Appointment
{
    public Guid Id { get; init; } = Guid.NewGuid();
    public Guid ClientId { get; set; }
    public Guid ServiceId { get; set; }
    public DateTime StartAt { get; set; }
    public DateTime EndAt { get; set; }
    public string Notes { get; set; } = string.Empty;
}
