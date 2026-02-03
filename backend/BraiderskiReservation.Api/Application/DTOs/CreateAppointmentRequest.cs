namespace BraiderskiReservation.Api.Application.DTOs;

public sealed record CreateAppointmentRequest(
    Guid ClientId,
    Guid ServiceId,
    DateTime StartAt,
    DateTime EndAt,
    string Notes
);
