namespace BraiderskiReservation.Api.Application.DTOs;

public sealed record CreateClientRequest(
    string FullName,
    string Email,
    string PhoneNumber,
    string Notes,
    bool IsActive
);
