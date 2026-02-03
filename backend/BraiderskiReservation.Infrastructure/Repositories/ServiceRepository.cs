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
        _context.Services
            .AsNoTracking()
            .ToListAsync(cancellationToken);

    public Task<ServiceItem?> GetByIdAsync(Guid id, CancellationToken cancellationToken) =>
        _context.Services
            .AsNoTracking()
            .FirstOrDefaultAsync(service => service.Id == id, cancellationToken);

    public async Task AddAsync(ServiceItem service, CancellationToken cancellationToken) =>
        await _context.Services.AddAsync(service, cancellationToken);

    public Task SaveChangesAsync(CancellationToken cancellationToken) =>
        _context.SaveChangesAsync(cancellationToken);
}
