using System.ComponentModel.DataAnnotations;

namespace BraiderskiReservation.Api.Application.DTOs;

public sealed record CreateOrderItemRequest(
    [Required] string Name,
    string? Notes,
    [Range(0.01, double.MaxValue)] decimal Quantity,
    [Range(0, double.MaxValue)] decimal UnitPrice);

public sealed record CreateOrderRequest(
    [Required] Guid ClientId,
    [Required] string Title,
    string? Description,
    string? Status,
    string? DeliveryMethod,
    DateOnly? DueDate,
    List<CreateOrderItemRequest>? Items);
