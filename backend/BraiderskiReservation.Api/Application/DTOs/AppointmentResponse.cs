namespace BraiderskiReservation.Api.Application.DTOs;

public sealed record AppointmentResponse(
    Guid Id,
    Guid ClientId,
    Guid ServiceId,
    DateTime StartAt,
    DateTime EndAt,
    string Notes);
