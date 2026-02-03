using BraiderskiReservation.Api.Models;

namespace BraiderskiReservation.Api.Services;

public sealed class InMemoryClientService : IClientService
{
    private readonly List<ClientProfile> _clients = new();

    public IEnumerable<ClientProfile> GetAll() => _clients;

    public ClientProfile? GetById(Guid id) => _clients.FirstOrDefault(client => client.Id == id);

    public ClientProfile Create(ClientProfile client)
    {
        _clients.Add(client);
        return client;
    }

    public bool AddUsedProduct(Guid clientId, UsedProduct product)
    {
        var client = GetById(clientId);
        if (client is null)
        {
            return false;
        }

        client.UsedProducts.Add(product);
        return true;
    }
}
