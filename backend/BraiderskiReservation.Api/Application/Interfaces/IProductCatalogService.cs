using BraiderskiReservation.Api.Application.DTOs;
using BraiderskiReservation.Domain.Entities;

namespace BraiderskiReservation.Api.Application.Interfaces;

public interface IProductCatalogService
{
    Task<List<Product>> GetAllAsync(CancellationToken cancellationToken);
    Task<Product?> GetByIdAsync(Guid id, CancellationToken cancellationToken);
    Task<Product> CreateAsync(CreateProductRequest request, CancellationToken cancellationToken);
}
