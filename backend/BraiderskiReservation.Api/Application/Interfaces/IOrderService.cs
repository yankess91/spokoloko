using BraiderskiReservation.Api.Application.DTOs;

namespace BraiderskiReservation.Api.Application.Interfaces;

public interface IOrderService
{
    Task<List<OrderListItemResponse>> SearchAsync(
        string? search,
        string? status,
        string? deliveryMethod,
        Guid? clientId,
        CancellationToken cancellationToken);

    Task<OrderResponse?> GetByIdAsync(Guid id, CancellationToken cancellationToken);

    Task<List<OrderListItemResponse>> GetByClientIdAsync(Guid clientId, CancellationToken cancellationToken);

    Task<OrderResponse> CreateAsync(CreateOrderRequest request, CancellationToken cancellationToken);

    Task<OrderResponse?> UpdateAsync(Guid id, UpdateOrderRequest request, CancellationToken cancellationToken);

    Task<OrderResponse?> UpdateStatusAsync(Guid id, UpdateOrderStatusRequest request, CancellationToken cancellationToken);

    Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken);
}
