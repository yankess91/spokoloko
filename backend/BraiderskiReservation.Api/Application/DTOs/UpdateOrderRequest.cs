using System.ComponentModel.DataAnnotations;

namespace BraiderskiReservation.Api.Application.DTOs;

public sealed record UpdateOrderRequest(
    [Required] Guid ClientId,
    [Required] string Title,
    string? Description,
    string? Status,
    string? DeliveryMethod,
    DateOnly? DueDate,
    List<CreateOrderItemRequest>? Items);
