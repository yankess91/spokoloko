namespace BraiderskiReservation.Api.DTOs;

public sealed record AddUsedProductRequest(
    string Name,
    string Notes,
    DateTime UsedAt
);
