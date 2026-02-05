namespace BraiderskiReservation.Api.Application.DTOs;

public record ProductDto(
    string name,
    decimal price,
    string? imgUrl,
    string productUrl
);
