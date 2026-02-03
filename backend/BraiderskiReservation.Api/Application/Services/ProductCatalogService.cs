using BraiderskiReservation.Api.Application.DTOs;
using BraiderskiReservation.Api.Application.Interfaces;
using BraiderskiReservation.Api.Domain.Entities;

namespace BraiderskiReservation.Api.Application.Services;

public sealed class ProductCatalogService : IProductCatalogService
{
    private readonly IProductRepository _productRepository;

    public ProductCatalogService(IProductRepository productRepository)
    {
        _productRepository = productRepository;
    }

    public Task<List<Product>> GetAllAsync(CancellationToken cancellationToken) =>
        _productRepository.GetAllAsync(cancellationToken);

    public Task<Product?> GetByIdAsync(Guid id, CancellationToken cancellationToken) =>
        _productRepository.GetByIdAsync(id, cancellationToken);

    public async Task<Product> CreateAsync(CreateProductRequest request, CancellationToken cancellationToken)
    {
        var product = new Product
        {
            Name = request.Name,
            Brand = request.Brand,
            Notes = request.Notes
        };

        await _productRepository.AddAsync(product, cancellationToken);
        await _productRepository.SaveChangesAsync(cancellationToken);
        return product;
    }
}
