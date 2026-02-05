using BraiderskiReservation.Api.Application.DTOs;
using BraiderskiReservation.Api.Application.Interfaces;
using System.Linq;
using BraiderskiReservation.Domain.Interfaces;
using BraiderskiReservation.Domain.Entities;

namespace BraiderskiReservation.Api.Application.Services;

public sealed class ProductCatalogService : IProductCatalogService
{
    private readonly IProductRepository _productRepository;

    public ProductCatalogService(IProductRepository productRepository)
    {
        _productRepository = productRepository;
    }

    public async Task<List<ProductResponse>> GetAllAsync(CancellationToken cancellationToken)
    {
        return await SearchAsync(null, cancellationToken);
    }

    public async Task<List<ProductResponse>> SearchAsync(string? searchTerm, CancellationToken cancellationToken)
    {
        var products = await _productRepository.SearchAsync(searchTerm, cancellationToken);
        return products.Select(product => product.ToResponse()).ToList();
    }

    public async Task<ProductResponse?> GetByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        var product = await _productRepository.GetByIdAsync(id, cancellationToken);
        return product?.ToResponse();
    }

    public async Task<ProductResponse> CreateAsync(CreateProductRequest request, CancellationToken cancellationToken)
    {
        var product = new Product
        {
            Name = request.Name,
            Brand = request.Brand,
            Notes = request.Notes,
            ImageUrl = request.ImageUrl ?? string.Empty,
            Price = request.Price,
            ShopUrl = request.ShopUrl ?? string.Empty,
            IsAvailable = request.IsAvailable,
            AvailabilityCheckedAt = request.AvailabilityCheckedAt
        };

        await _productRepository.AddAsync(product, cancellationToken);
        await _productRepository.SaveChangesAsync(cancellationToken);
        return product.ToResponse();
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken)
    {
        var deleted = await _productRepository.DeleteAsync(id, cancellationToken);
        if (!deleted)
        {
            return false;
        }

        await _productRepository.SaveChangesAsync(cancellationToken);
        return true;
    }
}
