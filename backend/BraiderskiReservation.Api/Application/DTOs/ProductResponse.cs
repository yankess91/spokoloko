namespace BraiderskiReservation.Api.Application.DTOs;

public sealed record ProductResponse(
    Guid Id,
    string Name,
    string Brand,
    string Notes,
    string ImageUrl,
    decimal Price,
    string ShopUrl,
    bool IsAvailable,
    DateTimeOffset? AvailabilityCheckedAt);
