namespace BraiderskiReservation.Api.Application.DTOs;

public sealed record ServiceSummaryResponse(
    Guid Id,
    string Name,
    TimeSpan Duration,
    decimal Price);
