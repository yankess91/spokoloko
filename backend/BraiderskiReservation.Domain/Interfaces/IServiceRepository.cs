using BraiderskiReservation.Domain.Entities;

namespace BraiderskiReservation.Domain.Interfaces;

public interface IServiceRepository
{
    Task<List<ServiceItem>> GetAllAsync(CancellationToken cancellationToken);
    Task<List<ServiceItem>> SearchAsync(string? searchTerm, CancellationToken cancellationToken);
    Task<ServiceItem?> GetByIdAsync(Guid id, CancellationToken cancellationToken);
    Task AddAsync(ServiceItem service, CancellationToken cancellationToken);
    Task<ServiceItem?> AddProductAsync(Guid serviceId, Guid productId, CancellationToken cancellationToken);
    Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken);
    Task SaveChangesAsync(CancellationToken cancellationToken);
}
