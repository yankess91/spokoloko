namespace BraiderskiReservation.Api.Application.DTOs;

public sealed record OrderItemResponse(
    Guid Id,
    string Name,
    string Notes,
    decimal Quantity,
    decimal UnitPrice,
    decimal LineTotal);

public sealed record OrderListItemResponse(
    Guid Id,
    string Number,
    Guid ClientId,
    string ClientName,
    string Title,
    string Status,
    string DeliveryMethod,
    DateOnly? DueDate,
    DateTime CreatedAt,
    decimal TotalAmount);

public sealed record OrderResponse(
    Guid Id,
    string Number,
    Guid ClientId,
    string ClientName,
    string Title,
    string Description,
    string Status,
    string DeliveryMethod,
    DateOnly? DueDate,
    DateTime CreatedAt,
    DateTime UpdatedAt,
    decimal TotalAmount,
    List<OrderItemResponse> Items);
