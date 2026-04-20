namespace BraiderskiReservation.Api.Application.DTOs;

public sealed record ServiceItemResponse(
    Guid Id,
    string Name,
    string Description,
    TimeSpan DurationFrom,
    TimeSpan DurationTo,
    decimal PriceFrom,
    decimal PriceTo,
    string Type,
    int? MaxCompletionTimeDays,
    int OrderPosition,
    List<ProductResponse> RequiredProducts);
