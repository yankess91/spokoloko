using BraiderskiReservation.Api.Models;

namespace BraiderskiReservation.Api.Services;

public interface IProductCatalogService
{
    IEnumerable<Product> GetAll();
    Product? GetById(Guid id);
    Product Create(Product product);
}
