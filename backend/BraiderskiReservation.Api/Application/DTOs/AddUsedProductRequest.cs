using System.ComponentModel.DataAnnotations;

namespace BraiderskiReservation.Api.Application.DTOs;

public sealed record AddUsedProductRequest(
    [property: Required, MaxLength(120)] string Name,
    [property: MaxLength(1000)] string Notes,
    DateTime UsedAt
);
