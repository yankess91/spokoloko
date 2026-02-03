using BraiderskiReservation.Api.Application.DTOs;
using BraiderskiReservation.Domain.Entities;

namespace BraiderskiReservation.Api.Application.Interfaces;

public interface IClientService
{
    Task<List<ClientProfile>> GetAllAsync(CancellationToken cancellationToken);
    Task<ClientProfile?> GetByIdAsync(Guid id, CancellationToken cancellationToken);
    Task<ClientProfile> CreateAsync(CreateClientRequest request, CancellationToken cancellationToken);
    Task<bool> AddUsedProductAsync(Guid clientId, AddUsedProductRequest request, CancellationToken cancellationToken);
}
