namespace BraiderskiReservation.Api.DTOs;

public sealed record CreateServiceRequest(
    string Name,
    string Description,
    int DurationMinutes
);
