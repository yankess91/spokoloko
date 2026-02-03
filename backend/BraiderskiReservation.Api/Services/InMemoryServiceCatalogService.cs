using BraiderskiReservation.Api.Models;

namespace BraiderskiReservation.Api.Services;

public sealed class InMemoryServiceCatalogService : IServiceCatalogService
{
    private readonly List<ServiceItem> _services = new();

    public IEnumerable<ServiceItem> GetAll() => _services;

    public ServiceItem? GetById(Guid id) => _services.FirstOrDefault(service => service.Id == id);

    public ServiceItem Create(ServiceItem service)
    {
        _services.Add(service);
        return service;
    }
}
