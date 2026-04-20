using BraiderskiReservation.Domain.Entities;
using BraiderskiReservation.Domain.Interfaces;
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
        BuildServiceQuery(includeProducts: true)
            .OrderBy(service => service.Name)
            .ToListAsync(cancellationToken);

    public Task<List<ServiceItem>> SearchAsync(string? searchTerm, CancellationToken cancellationToken)
    {
        var query = BuildServiceQuery(includeProducts: false);
        var normalizedSearch = NormalizeSearch(searchTerm);

        if (normalizedSearch is not null)
        {
            var searchPattern = ToContainsPattern(normalizedSearch);
            query = query.Where(service =>
                EF.Functions.ILike(service.Name, searchPattern) ||
                EF.Functions.ILike(service.Description, searchPattern));
        }

        return query
            .OrderBy(service => service.Name)
            .ToListAsync(cancellationToken);
    }

    public Task<ServiceItem?> GetByIdAsync(Guid id, CancellationToken cancellationToken) =>
        BuildServiceQuery(includeProducts: true)
            .FirstOrDefaultAsync(service => service.Id == id, cancellationToken);

    public async Task AddAsync(ServiceItem service, CancellationToken cancellationToken) =>
        await _context.Services.AddAsync(service, cancellationToken);

    public async Task<ServiceItem?> UpdateAsync(
        Guid id,
        string name,
        string description,
        TimeSpan durationFrom,
        TimeSpan durationTo,
        decimal priceFrom,
        decimal priceTo,
        ServiceType type,
        List<Guid> requiredProductIds,
        CancellationToken cancellationToken)
    {
        var service = await _context.Services
            .Include(item => item.ServiceProducts)
            .FirstOrDefaultAsync(item => item.Id == id, cancellationToken);

        if (service is null)
        {
            return null;
        }

        service.Name = name;
        service.Description = description;
        service.DurationFrom = durationFrom;
        service.DurationTo = durationTo;
        service.PriceFrom = priceFrom;
        service.PriceTo = priceTo;
        service.Type = type;

        var normalizedRequiredProductIds = (requiredProductIds ?? new List<Guid>())
            .Distinct()
            .ToHashSet();

        service.ServiceProducts.RemoveAll(serviceProduct => !normalizedRequiredProductIds.Contains(serviceProduct.ProductId));

        var assignedProductIds = service.ServiceProducts
            .Select(serviceProduct => serviceProduct.ProductId)
            .ToHashSet();

        foreach (var productId in normalizedRequiredProductIds)
        {
            if (assignedProductIds.Contains(productId))
            {
                continue;
            }

            service.ServiceProducts.Add(new ServiceProduct
            {
                ServiceId = id,
                ProductId = productId
            });
        }

        return await GetByIdAsync(id, cancellationToken);
    }

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

    private IQueryable<ServiceItem> BuildServiceQuery(bool includeProducts)
    {
        var query = _context.Services.AsNoTracking();

        if (!includeProducts)
        {
            return query;
        }

        return query
            .Include(service => service.ServiceProducts)
            .ThenInclude(serviceProduct => serviceProduct.Product)
            .AsSplitQuery();
    }

    private static string? NormalizeSearch(string? searchTerm) =>
        string.IsNullOrWhiteSpace(searchTerm) ? null : searchTerm.Trim();

    private static string ToContainsPattern(string searchTerm) => $"%{searchTerm.Replace("%", "\\%").Replace("_", "\\_")}%";
}
