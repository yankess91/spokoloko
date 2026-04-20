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
    DateOnly? CompletionDeadlineDate,
    int OrderPosition,
    List<ProductResponse> RequiredProducts);
