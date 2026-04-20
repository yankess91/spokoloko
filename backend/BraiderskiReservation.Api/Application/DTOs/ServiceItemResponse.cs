namespace BraiderskiReservation.Api.Application.DTOs;

public sealed record ServiceItemResponse(
    Guid Id,
    string Name,
    string Description,
    TimeSpan DurationFrom,
    TimeSpan DurationTo,
    decimal PriceFrom,
    decimal PriceTo,
    List<ProductResponse> RequiredProducts);
