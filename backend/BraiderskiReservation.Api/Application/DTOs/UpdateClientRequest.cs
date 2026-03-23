namespace BraiderskiReservation.Api.Application.DTOs;

public sealed record UpdateClientRequest(
    string FullName,
    string Email,
    string PhoneNumber,
    string? Notes,
    bool IsActive);
