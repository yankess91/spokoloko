using System.ComponentModel.DataAnnotations;

namespace BraiderskiReservation.Api.Application.DTOs;

public sealed record CreateProductRequest(
    [property: Required, MaxLength(120)] string Name,
    [property: Required, MaxLength(120)] string Brand,
    [property: MaxLength(1000)] string Notes,
    [property: Url] string ImageUrl,
    [property: Range(0, 100000)] decimal Price,
    [property: Url] string ShopUrl,
    bool IsAvailable,
    DateTimeOffset? AvailabilityCheckedAt
);
