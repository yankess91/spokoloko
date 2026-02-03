namespace BraiderskiReservation.Api.DTOs;

public sealed record CreateClientRequest(
    string FullName,
    string Email,
    string PhoneNumber
);
