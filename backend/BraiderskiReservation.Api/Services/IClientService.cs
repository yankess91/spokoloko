using BraiderskiReservation.Api.Models;

namespace BraiderskiReservation.Api.Services;

public interface IClientService
{
    IEnumerable<ClientProfile> GetAll();
    ClientProfile? GetById(Guid id);
    ClientProfile Create(ClientProfile client);
    bool AddUsedProduct(Guid clientId, UsedProduct product);
}
