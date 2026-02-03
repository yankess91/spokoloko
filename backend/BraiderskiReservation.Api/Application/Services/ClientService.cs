using BraiderskiReservation.Api.Application.DTOs;
using BraiderskiReservation.Api.Application.Interfaces;
using BraiderskiReservation.Api.Domain.Entities;

namespace BraiderskiReservation.Api.Application.Services;

public sealed class ClientService : IClientService
{
    private readonly IClientRepository _clientRepository;

    public ClientService(IClientRepository clientRepository)
    {
        _clientRepository = clientRepository;
    }

    public Task<List<ClientProfile>> GetAllAsync(CancellationToken cancellationToken) =>
        _clientRepository.GetAllAsync(cancellationToken);

    public Task<ClientProfile?> GetByIdAsync(Guid id, CancellationToken cancellationToken) =>
        _clientRepository.GetByIdAsync(id, cancellationToken);

    public async Task<ClientProfile> CreateAsync(CreateClientRequest request, CancellationToken cancellationToken)
    {
        var client = new ClientProfile
        {
            FullName = request.FullName,
            Email = request.Email,
            PhoneNumber = request.PhoneNumber
        };

        await _clientRepository.AddAsync(client, cancellationToken);
        await _clientRepository.SaveChangesAsync(cancellationToken);
        return client;
    }

    public async Task<bool> AddUsedProductAsync(Guid clientId, AddUsedProductRequest request, CancellationToken cancellationToken)
    {
        var client = await _clientRepository.GetByIdAsync(clientId, cancellationToken);
        if (client is null)
        {
            return false;
        }

        var usedProduct = new UsedProduct
        {
            ClientId = clientId,
            Name = request.Name,
            Notes = request.Notes,
            UsedAt = request.UsedAt
        };

        await _clientRepository.AddUsedProductAsync(usedProduct, cancellationToken);
        await _clientRepository.SaveChangesAsync(cancellationToken);
        return true;
    }
}
