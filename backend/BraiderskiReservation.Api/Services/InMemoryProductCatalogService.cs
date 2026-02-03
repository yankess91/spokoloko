using BraiderskiReservation.Api.Models;

namespace BraiderskiReservation.Api.Services;

public sealed class InMemoryProductCatalogService : IProductCatalogService
{
    private readonly List<Product> _products = new();

    public IEnumerable<Product> GetAll() => _products;

    public Product? GetById(Guid id) => _products.FirstOrDefault(product => product.Id == id);

    public Product Create(Product product)
    {
        _products.Add(product);
        return product;
    }
}
