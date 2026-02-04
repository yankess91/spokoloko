using BraiderskiReservation.Api.Application.DTOs;
namespace BraiderskiReservation.Api.Application.Interfaces;

public interface IProductCatalogService
{
    Task<List<ProductResponse>> GetAllAsync(CancellationToken cancellationToken);
    Task<List<ProductResponse>> SearchAsync(string? searchTerm, CancellationToken cancellationToken);
    Task<ProductResponse?> GetByIdAsync(Guid id, CancellationToken cancellationToken);
    Task<ProductResponse> CreateAsync(CreateProductRequest request, CancellationToken cancellationToken);
    Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken);
}
