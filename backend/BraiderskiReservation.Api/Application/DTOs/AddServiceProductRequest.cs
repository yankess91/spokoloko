using System.ComponentModel.DataAnnotations;

namespace BraiderskiReservation.Api.Application.DTOs;

public sealed record AddServiceProductRequest([property: Required] Guid ProductId);
