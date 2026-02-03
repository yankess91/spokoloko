using BraiderskiReservation.Api.Application.DTOs;
namespace BraiderskiReservation.Api.Application.Interfaces;

public interface IClientService
{
    Task<List<ClientProfileResponse>> GetAllAsync(CancellationToken cancellationToken);
    Task<ClientProfileResponse?> GetByIdAsync(Guid id, CancellationToken cancellationToken);
    Task<ClientProfileResponse> CreateAsync(CreateClientRequest request, CancellationToken cancellationToken);
    Task<bool> AddUsedProductAsync(Guid clientId, AddUsedProductRequest request, CancellationToken cancellationToken);
}
