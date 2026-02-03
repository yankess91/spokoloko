using BraiderskiReservation.Domain.Interfaces;
using BraiderskiReservation.Domain.Entities;
using BraiderskiReservation.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace BraiderskiReservation.Infrastructure.Repositories;

public sealed class ClientRepository : IClientRepository
{
    private readonly AppDbContext _context;

    public ClientRepository(AppDbContext context)
    {
        _context = context;
    }

    public Task<List<ClientProfile>> GetAllAsync(CancellationToken cancellationToken) =>
        _context.Clients
            .Include(client => client.UsedProducts)
            .AsNoTracking()
            .ToListAsync(cancellationToken);

    public Task<ClientProfile?> GetByIdAsync(Guid id, CancellationToken cancellationToken) =>
        _context.Clients
            .Include(client => client.UsedProducts)
            .AsNoTracking()
            .FirstOrDefaultAsync(client => client.Id == id, cancellationToken);

    public async Task AddAsync(ClientProfile client, CancellationToken cancellationToken) =>
        await _context.Clients.AddAsync(client, cancellationToken);

    public async Task AddUsedProductAsync(UsedProduct usedProduct, CancellationToken cancellationToken) =>
        await _context.UsedProducts.AddAsync(usedProduct, cancellationToken);

    public Task SaveChangesAsync(CancellationToken cancellationToken) =>
        _context.SaveChangesAsync(cancellationToken);
}
