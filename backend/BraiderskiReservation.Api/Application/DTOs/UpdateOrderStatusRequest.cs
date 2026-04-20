using System.ComponentModel.DataAnnotations;

namespace BraiderskiReservation.Api.Application.DTOs;

public sealed record UpdateOrderStatusRequest([Required] string Status);
