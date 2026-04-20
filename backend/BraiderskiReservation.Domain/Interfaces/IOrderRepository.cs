using BraiderskiReservation.Domain.Entities;

namespace BraiderskiReservation.Domain.Interfaces;

public interface IOrderRepository
{
    Task<List<Order>> SearchAsync(
        string? search,
        OrderStatus? status,
        OrderDeliveryMethod? deliveryMethod,
        Guid? clientId,
        CancellationToken cancellationToken);

    Task<List<Order>> GetByClientIdAsync(Guid clientId, CancellationToken cancellationToken);

    Task<Order?> GetByIdAsync(Guid id, CancellationToken cancellationToken);

    Task<Order?> GetByIdForUpdateAsync(Guid id, CancellationToken cancellationToken);

    Task<int> CountByDayAsync(DateOnly date, CancellationToken cancellationToken);

    Task AddAsync(Order order, CancellationToken cancellationToken);

    Task SaveChangesAsync(CancellationToken cancellationToken);

    Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken);
}
