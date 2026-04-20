namespace BraiderskiReservation.Api.Application.DTOs;

public sealed record CreateServiceRequest(
    string Name,
    string Description,
    int DurationFromMinutes,
    int DurationToMinutes,
    decimal PriceFrom,
    decimal PriceTo,
    List<Guid> RequiredProductIds
);
