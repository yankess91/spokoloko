namespace BraiderskiReservation.Api.Application.DTOs;

public sealed record UsedProductResponse(
    Guid Id,
    Guid ClientId,
    string Name,
    string Notes,
    DateTime UsedAt);
