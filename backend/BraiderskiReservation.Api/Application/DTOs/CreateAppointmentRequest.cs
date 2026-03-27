using System.ComponentModel.DataAnnotations;

namespace BraiderskiReservation.Api.Application.DTOs;

public sealed record CreateAppointmentRequest(
    Guid ClientId,
    Guid ServiceId,
    DateTime StartAt,
    DateTime EndAt,
    [property: MaxLength(1000)] string Notes,
    List<Guid> ProductIds
);