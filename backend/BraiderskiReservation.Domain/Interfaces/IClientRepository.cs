using BraiderskiReservation.Domain.Entities;

namespace BraiderskiReservation.Domain.Interfaces;

public interface IClientRepository
{
    Task<List<ClientProfile>> GetAllAsync(CancellationToken cancellationToken);
    Task<ClientProfile?> GetByIdAsync(Guid id, CancellationToken cancellationToken);
    Task AddAsync(ClientProfile client, CancellationToken cancellationToken);
    Task AddUsedProductAsync(UsedProduct usedProduct, CancellationToken cancellationToken);
    Task SaveChangesAsync(CancellationToken cancellationToken);
}
