using BraiderskiReservation.Api.Domain.Entities;

namespace BraiderskiReservation.Api.Application.Interfaces;

public interface IServiceRepository
{
    Task<List<ServiceItem>> GetAllAsync(CancellationToken cancellationToken);
    Task<ServiceItem?> GetByIdAsync(Guid id, CancellationToken cancellationToken);
    Task AddAsync(ServiceItem service, CancellationToken cancellationToken);
    Task SaveChangesAsync(CancellationToken cancellationToken);
}
