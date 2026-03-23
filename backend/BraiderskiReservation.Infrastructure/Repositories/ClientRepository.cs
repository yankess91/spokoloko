using BraiderskiReservation.Domain.Entities;
using BraiderskiReservation.Domain.Interfaces;
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
        BuildClientQuery(includeDetails: true)
            .OrderBy(client => client.FullName)
            .ToListAsync(cancellationToken);

    public Task<List<ClientProfile>> SearchAsync(string? searchTerm, CancellationToken cancellationToken)
    {
        var query = BuildClientQuery(includeDetails: false);
        var normalizedSearch = NormalizeSearch(searchTerm);

        if (normalizedSearch is not null)
        {
            var searchPattern = ToContainsPattern(normalizedSearch);
            query = query.Where(client =>
                EF.Functions.ILike(client.FullName, searchPattern) ||
                EF.Functions.ILike(client.Email, searchPattern) ||
                EF.Functions.ILike(client.PhoneNumber, searchPattern));
        }

        return query
            .OrderBy(client => client.FullName)
            .ToListAsync(cancellationToken);
    }

    public Task<ClientProfile?> GetByIdAsync(Guid id, CancellationToken cancellationToken) =>
        BuildClientQuery(includeDetails: true)
            .FirstOrDefaultAsync(client => client.Id == id, cancellationToken);

    public Task<ClientProfile?> GetByIdForUpdateAsync(Guid id, CancellationToken cancellationToken) =>
        BuildTrackedClientQuery()
            .FirstOrDefaultAsync(client => client.Id == id, cancellationToken);

    public async Task AddAsync(ClientProfile client, CancellationToken cancellationToken) =>
        await _context.Clients.AddAsync(client, cancellationToken);

    public async Task AddUsedProductAsync(UsedProduct usedProduct, CancellationToken cancellationToken) =>
        await _context.UsedProducts.AddAsync(usedProduct, cancellationToken);

    public Task SaveChangesAsync(CancellationToken cancellationToken) =>
        _context.SaveChangesAsync(cancellationToken);

    private IQueryable<ClientProfile> BuildClientQuery(bool includeDetails)
    {
        var query = _context.Clients.AsNoTracking();

        if (!includeDetails)
        {
            return query;
        }

        return query
            .Include(client => client.UsedProducts)
            .Include(client => client.Appointments)
            .ThenInclude(appointment => appointment.ServiceItem)
            .Include(client => client.Appointments)
            .ThenInclude(appointment => appointment.AppointmentProducts)
            .ThenInclude(appointmentProduct => appointmentProduct.Product)
            .AsSplitQuery();
    }

    private IQueryable<ClientProfile> BuildTrackedClientQuery() =>
        _context.Clients
            .Include(client => client.UsedProducts)
            .Include(client => client.Appointments)
            .ThenInclude(appointment => appointment.ServiceItem)
            .Include(client => client.Appointments)
            .ThenInclude(appointment => appointment.AppointmentProducts)
            .ThenInclude(appointmentProduct => appointmentProduct.Product)
            .AsSplitQuery();

    private static string? NormalizeSearch(string? searchTerm) =>
        string.IsNullOrWhiteSpace(searchTerm) ? null : searchTerm.Trim();

    private static string ToContainsPattern(string searchTerm) => $"%{searchTerm.Replace("%", "\\%").Replace("_", "\\_")}%";
}
