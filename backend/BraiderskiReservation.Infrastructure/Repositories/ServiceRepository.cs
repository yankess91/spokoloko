using BraiderskiReservation.Domain.Interfaces;
using BraiderskiReservation.Domain.Entities;
using BraiderskiReservation.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace BraiderskiReservation.Infrastructure.Repositories;

public sealed class ServiceRepository : IServiceRepository
{
    private readonly AppDbContext _context;

    public ServiceRepository(AppDbContext context)
    {
        _context = context;
    }

    public Task<List<ServiceItem>> GetAllAsync(CancellationToken cancellationToken) =>
        BuildServiceQuery().ToListAsync(cancellationToken);

    public Task<List<ServiceItem>> SearchAsync(string? searchTerm, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(searchTerm))
        {
            return GetAllAsync(cancellationToken);
        }

        var normalized = searchTerm.Trim().ToLowerInvariant();

        return BuildServiceQuery()
            .Where(service =>
                service.Name.ToLower().Contains(normalized) ||
                service.Description.ToLower().Contains(normalized))
            .ToListAsync(cancellationToken);
    }

    public Task<ServiceItem?> GetByIdAsync(Guid id, CancellationToken cancellationToken) =>
        BuildServiceQuery()
            .FirstOrDefaultAsync(service => service.Id == id, cancellationToken);

    public async Task AddAsync(ServiceItem service, CancellationToken cancellationToken) =>
        await _context.Services.AddAsync(service, cancellationToken);

    public async Task<ServiceItem?> AddProductAsync(Guid serviceId, Guid productId, CancellationToken cancellationToken)
    {
        var serviceExists = await _context.Services
            .AnyAsync(s => s.Id == serviceId, cancellationToken);

        if (!serviceExists)
            return null;

        var alreadyAssigned = await _context.Set<ServiceProduct>()
            .AnyAsync(sp => sp.ServiceId == serviceId && sp.ProductId == productId, cancellationToken);

        if (alreadyAssigned)
            return null;

        _context.Set<ServiceProduct>().Add(new ServiceProduct
        {
            ServiceId = serviceId,
            ProductId = productId
        });

        return await GetByIdAsync(serviceId, cancellationToken);
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken)
    {
        var service = await _context.Services.FirstOrDefaultAsync(item => item.Id == id, cancellationToken);
        if (service is null)
        {
            return false;
        }

        _context.Services.Remove(service);
        return true;
    }

    public Task SaveChangesAsync(CancellationToken cancellationToken) =>
        _context.SaveChangesAsync(cancellationToken);

    private IQueryable<ServiceItem> BuildServiceQuery() =>
        _context.Services
            .Include(service => service.ServiceProducts)
            .ThenInclude(serviceProduct => serviceProduct.Product)
            .AsNoTracking();
}
