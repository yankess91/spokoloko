using System.ComponentModel.DataAnnotations;

namespace BraiderskiReservation.Api.Application.DTOs;

public sealed record CreateServiceRequest(
    [property: Required, MaxLength(120)] string Name,
    [property: MaxLength(1200)] string Description,
    [property: Range(1, 1440)] int DurationFromMinutes,
    [property: Range(1, 1440)] int DurationToMinutes,
    [property: Range(0, 100000)] decimal PriceFrom,
    [property: Range(0, 100000)] decimal PriceTo,
    List<Guid> RequiredProductIds
);
