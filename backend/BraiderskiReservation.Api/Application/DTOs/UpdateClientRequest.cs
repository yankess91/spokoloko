using System.ComponentModel.DataAnnotations;

namespace BraiderskiReservation.Api.Application.DTOs;

public sealed record UpdateClientRequest(
    [property: Required, MaxLength(120)] string FullName,
    [property: Required, EmailAddress] string Email,
    [property: Required, MaxLength(40)] string PhoneNumber,
    [property: MaxLength(1000)] string? Notes,
    bool IsActive);