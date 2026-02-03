namespace BraiderskiReservation.Api.Application.DTOs;

public sealed record ServiceItemResponse(
    Guid Id,
    string Name,
    string Description,
    TimeSpan Duration);
