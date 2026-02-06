namespace BraiderskiReservation.Api.Application.DTOs;

public sealed record ProductDto(
    string Name,
    decimal Price,
    string? ImgUrl,
    string ProductUrl
);
