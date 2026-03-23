namespace BraiderskiReservation.Api.Application.DTOs;

public sealed record UpdateAppointmentRequest(
    Guid ClientId,
    Guid ServiceId,
    DateTime StartAt,
    DateTime EndAt,
    string Notes,
    List<Guid>? ProductIds);
