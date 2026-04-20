using System.ComponentModel.DataAnnotations;

namespace BraiderskiReservation.Api.Application.DTOs;

public sealed record CreateServiceRequest(
    string Name,
    string Description,
    int DurationFromMinutes,
    int DurationToMinutes,
    decimal PriceFrom,
    decimal PriceTo,
    string Type,
    List<Guid> RequiredProductIds
);
