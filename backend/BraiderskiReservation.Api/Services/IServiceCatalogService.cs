using BraiderskiReservation.Api.Models;

namespace BraiderskiReservation.Api.Services;

public interface IServiceCatalogService
{
    IEnumerable<ServiceItem> GetAll();
    ServiceItem? GetById(Guid id);
    ServiceItem Create(ServiceItem service);
}
