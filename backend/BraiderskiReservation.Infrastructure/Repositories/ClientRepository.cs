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
        BuildClientQuery().ToListAsync(cancellationToken);

    public Task<List<ClientProfile>> SearchAsync(string? searchTerm, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(searchTerm))
        {
            return GetAllAsync(cancellationToken);
        }

        var normalized = searchTerm.Trim().ToLowerInvariant();

        return BuildClientQuery()
            .Where(client =>
                client.FullName.ToLower().Contains(normalized) ||
                client.Email.ToLower().Contains(normalized) ||
                client.PhoneNumber.ToLower().Contains(normalized))
            .ToListAsync(cancellationToken);
    }

    public Task<ClientProfile?> GetByIdAsync(Guid id, CancellationToken cancellationToken) =>
        BuildClientQuery()
            .FirstOrDefaultAsync(client => client.Id == id, cancellationToken);

    public async Task AddAsync(ClientProfile client, CancellationToken cancellationToken) =>
        await _context.Clients.AddAsync(client, cancellationToken);

    public async Task AddUsedProductAsync(UsedProduct usedProduct, CancellationToken cancellationToken) =>
        await _context.UsedProducts.AddAsync(usedProduct, cancellationToken);

    public Task SaveChangesAsync(CancellationToken cancellationToken) =>
        _context.SaveChangesAsync(cancellationToken);

    private IQueryable<ClientProfile> BuildClientQuery() =>
        _context.Clients
            .Include(client => client.UsedProducts)
            .Include(client => client.Appointments)
            .ThenInclude(appointment => appointment.ServiceItem)
            .Include(client => client.Appointments)
            .ThenInclude(appointment => appointment.AppointmentProducts)
            .ThenInclude(appointmentProduct => appointmentProduct.Product)
            .AsNoTracking();
}
