using BraiderskiReservation.Domain.Entities;
using BraiderskiReservation.Domain.Interfaces;
using BraiderskiReservation.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace BraiderskiReservation.Infrastructure.Repositories;

public sealed class OrderRepository : IOrderRepository
{
    private readonly AppDbContext _context;

    public OrderRepository(AppDbContext context)
    {
        _context = context;
    }

    public Task<List<Order>> SearchAsync(
        string? search,
        OrderStatus? status,
        OrderDeliveryMethod? deliveryMethod,
        Guid? clientId,
        CancellationToken cancellationToken)
    {
        var query = BuildQuery(tracked: false);

        if (!string.IsNullOrWhiteSpace(search))
        {
            var pattern = $"%{search.Trim().Replace("%", "\\%").Replace("_", "\\_")}%";
            query = query.Where(order =>
                EF.Functions.ILike(order.Number, pattern) ||
                EF.Functions.ILike(order.Title, pattern) ||
                EF.Functions.ILike(order.Description, pattern));
        }

        if (status.HasValue)
        {
            query = query.Where(order => order.Status == status.Value);
        }

        if (deliveryMethod.HasValue)
        {
            query = query.Where(order => order.DeliveryMethod == deliveryMethod.Value);
        }

        if (clientId.HasValue)
        {
            query = query.Where(order => order.ClientId == clientId.Value);
        }

        return query
            .OrderByDescending(order => order.CreatedAt)
            .ToListAsync(cancellationToken);
    }

    public Task<List<Order>> GetByClientIdAsync(Guid clientId, CancellationToken cancellationToken) =>
        BuildQuery(tracked: false)
            .Where(order => order.ClientId == clientId)
            .OrderByDescending(order => order.CreatedAt)
            .ToListAsync(cancellationToken);

    public Task<Order?> GetByIdAsync(Guid id, CancellationToken cancellationToken) =>
        BuildQuery(tracked: false)
            .FirstOrDefaultAsync(order => order.Id == id, cancellationToken);

    public Task<Order?> GetByIdForUpdateAsync(Guid id, CancellationToken cancellationToken) =>
        BuildQuery(tracked: true)
            .FirstOrDefaultAsync(order => order.Id == id, cancellationToken);

    public Task<int> CountByDayAsync(DateOnly date, CancellationToken cancellationToken)
    {
        var dayStart = date.ToDateTime(TimeOnly.MinValue, DateTimeKind.Utc);
        var dayEnd = dayStart.AddDays(1);
        return _context.Orders.CountAsync(order => order.CreatedAt >= dayStart && order.CreatedAt < dayEnd, cancellationToken);
    }

    public Task AddAsync(Order order, CancellationToken cancellationToken) =>
        _context.Orders.AddAsync(order, cancellationToken).AsTask();

    public Task SaveChangesAsync(CancellationToken cancellationToken) =>
        _context.SaveChangesAsync(cancellationToken);

    public async Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken)
    {
        var order = await _context.Orders.FirstOrDefaultAsync(item => item.Id == id, cancellationToken);
        if (order is null)
        {
            return false;
        }

        _context.Orders.Remove(order);
        return true;
    }

    private IQueryable<Order> BuildQuery(bool tracked)
    {
        var query = tracked ? _context.Orders : _context.Orders.AsNoTracking();

        return query
            .Include(order => order.ClientProfile)
            .Include(order => order.Items)
            .AsSplitQuery();
    }
}
