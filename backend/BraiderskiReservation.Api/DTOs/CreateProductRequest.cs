namespace BraiderskiReservation.Api.DTOs;

public sealed record CreateProductRequest(
    string Name,
    string Brand,
    string Notes
);
