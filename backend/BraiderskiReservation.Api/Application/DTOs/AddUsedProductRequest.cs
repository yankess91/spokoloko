namespace BraiderskiReservation.Api.Application.DTOs;

public sealed record AddUsedProductRequest(
    string Name,
    string Notes,
    DateTime UsedAt
);
