namespace BraiderskiReservation.Api.Application.DTOs;

public sealed record UpdateProductRequest(
    string Name,
    string Brand,
    string Notes,
    string? ImageUrl,
    decimal Price,
    string? ShopUrl,
    bool IsAvailable,
    DateTime? AvailabilityCheckedAt);
