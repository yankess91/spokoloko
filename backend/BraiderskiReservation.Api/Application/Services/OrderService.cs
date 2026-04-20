using BraiderskiReservation.Api.Application.DTOs;
using BraiderskiReservation.Api.Application.Interfaces;
using BraiderskiReservation.Domain.Entities;
using BraiderskiReservation.Domain.Interfaces;

namespace BraiderskiReservation.Api.Application.Services;

public sealed class OrderService : IOrderService
{
    private readonly IOrderRepository _orderRepository;
    private readonly IClientRepository _clientRepository;

    public OrderService(IOrderRepository orderRepository, IClientRepository clientRepository)
    {
        _orderRepository = orderRepository;
        _clientRepository = clientRepository;
    }

    public async Task<List<OrderListItemResponse>> SearchAsync(
        string? search,
        string? status,
        string? deliveryMethod,
        Guid? clientId,
        CancellationToken cancellationToken)
    {
        var parsedStatus = ParseStatus(status);
        var parsedDeliveryMethod = ParseDeliveryMethod(deliveryMethod);

        var orders = await _orderRepository.SearchAsync(search, parsedStatus, parsedDeliveryMethod, clientId, cancellationToken);
        return orders.Select(order => order.ToListItemResponse()).ToList();
    }

    public async Task<OrderResponse?> GetByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        var order = await _orderRepository.GetByIdAsync(id, cancellationToken);
        return order?.ToResponse();
    }

    public async Task<List<OrderListItemResponse>> GetByClientIdAsync(Guid clientId, CancellationToken cancellationToken)
    {
        var orders = await _orderRepository.GetByClientIdAsync(clientId, cancellationToken);
        return orders.Select(order => order.ToListItemResponse()).ToList();
    }

    public async Task<OrderResponse> CreateAsync(CreateOrderRequest request, CancellationToken cancellationToken)
    {
        var client = await _clientRepository.GetByIdAsync(request.ClientId, cancellationToken);
        if (client is null)
        {
            throw new InvalidOperationException("Wybrany klient nie istnieje.");
        }

        var items = BuildOrderItems(request.Items ?? new List<CreateOrderItemRequest>());

        var createdAt = DateTime.UtcNow;
        var order = new Order
        {
            ClientId = request.ClientId,
            Number = await GenerateOrderNumberAsync(createdAt, cancellationToken),
            Title = request.Title.Trim(),
            Description = request.Description?.Trim() ?? string.Empty,
            Status = ParseStatus(request.Status) ?? OrderStatus.New,
            DeliveryMethod = ParseDeliveryMethod(request.DeliveryMethod) ?? OrderDeliveryMethod.Pickup,
            DueDate = request.DueDate,
            CreatedAt = createdAt,
            UpdatedAt = createdAt,
            Items = items,
            TotalAmount = items.Sum(item => item.LineTotal)
        };

        await _orderRepository.AddAsync(order, cancellationToken);
        await _orderRepository.SaveChangesAsync(cancellationToken);

        var created = await _orderRepository.GetByIdAsync(order.Id, cancellationToken);
        return created!.ToResponse();
    }

    public async Task<OrderResponse?> UpdateAsync(Guid id, UpdateOrderRequest request, CancellationToken cancellationToken)
    {
        var client = await _clientRepository.GetByIdAsync(request.ClientId, cancellationToken);
        if (client is null)
        {
            throw new InvalidOperationException("Wybrany klient nie istnieje.");
        }

        var order = await _orderRepository.GetByIdForUpdateAsync(id, cancellationToken);
        if (order is null)
        {
            return null;
        }

        var items = BuildOrderItems(request.Items ?? new List<CreateOrderItemRequest>());

        order.ClientId = request.ClientId;
        order.Title = request.Title.Trim();
        order.Description = request.Description?.Trim() ?? string.Empty;
        order.Status = ParseStatus(request.Status) ?? order.Status;
        order.DeliveryMethod = ParseDeliveryMethod(request.DeliveryMethod) ?? order.DeliveryMethod;
        order.DueDate = request.DueDate;
        order.UpdatedAt = DateTime.UtcNow;
        order.Items = items;
        order.TotalAmount = items.Sum(item => item.LineTotal);

        await _orderRepository.SaveChangesAsync(cancellationToken);

        var updated = await _orderRepository.GetByIdAsync(id, cancellationToken);
        return updated?.ToResponse();
    }

    public async Task<OrderResponse?> UpdateStatusAsync(Guid id, UpdateOrderStatusRequest request, CancellationToken cancellationToken)
    {
        var order = await _orderRepository.GetByIdForUpdateAsync(id, cancellationToken);
        if (order is null)
        {
            return null;
        }

        order.Status = ParseStatus(request.Status)
            ?? throw new InvalidOperationException("Nieprawidłowy status zamówienia.");
        order.UpdatedAt = DateTime.UtcNow;

        await _orderRepository.SaveChangesAsync(cancellationToken);
        var updated = await _orderRepository.GetByIdAsync(id, cancellationToken);
        return updated?.ToResponse();
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken)
    {
        var deleted = await _orderRepository.DeleteAsync(id, cancellationToken);
        if (!deleted)
        {
            return false;
        }

        await _orderRepository.SaveChangesAsync(cancellationToken);
        return true;
    }

    private async Task<string> GenerateOrderNumberAsync(DateTime createdAt, CancellationToken cancellationToken)
    {
        var createdDate = DateOnly.FromDateTime(createdAt);
        var countForDay = await _orderRepository.CountByDayAsync(createdDate, cancellationToken);
        var sequence = countForDay + 1;
        return $"ORD-{createdAt:yyyyMMdd}-{sequence:0000}";
    }

    private static List<OrderItem> BuildOrderItems(List<CreateOrderItemRequest> requestItems)
    {
        return requestItems.Select(item =>
        {
            var name = item.Name?.Trim() ?? string.Empty;
            if (string.IsNullOrWhiteSpace(name))
            {
                throw new InvalidOperationException("Każda pozycja zamówienia musi mieć nazwę.");
            }

            if (item.Quantity <= 0)
            {
                throw new InvalidOperationException("Ilość w pozycji zamówienia musi być większa od zera.");
            }

            if (item.UnitPrice < 0)
            {
                throw new InvalidOperationException("Cena jednostkowa w pozycji zamówienia nie może być ujemna.");
            }

            var lineTotal = decimal.Round(item.Quantity * item.UnitPrice, 2, MidpointRounding.AwayFromZero);

            return new OrderItem
            {
                Name = name,
                Notes = item.Notes?.Trim() ?? string.Empty,
                Quantity = item.Quantity,
                UnitPrice = item.UnitPrice,
                LineTotal = lineTotal
            };
        }).ToList();
    }

    private static OrderStatus? ParseStatus(string? status)
    {
        if (string.IsNullOrWhiteSpace(status))
        {
            return null;
        }

        if (Enum.TryParse<OrderStatus>(status, true, out var parsed))
        {
            return parsed;
        }

        throw new InvalidOperationException("Nieprawidłowy status zamówienia.");
    }

    private static OrderDeliveryMethod? ParseDeliveryMethod(string? deliveryMethod)
    {
        if (string.IsNullOrWhiteSpace(deliveryMethod))
        {
            return null;
        }

        if (Enum.TryParse<OrderDeliveryMethod>(deliveryMethod, true, out var parsed))
        {
            return parsed;
        }

        throw new InvalidOperationException("Nieprawidłowa metoda dostawy. Dozwolone: Pickup albo Shipping.");
    }
}
