namespace BraiderskiReservation.Api.Application.DTOs;

public sealed record CreateServiceRequest(
    string Name,
    string Description,
    int DurationMinutes,
    decimal Price,
    List<Guid> RequiredProductIds
);
