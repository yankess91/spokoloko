using BraiderskiReservation.Api.Application.DTOs;
namespace BraiderskiReservation.Api.Application.Interfaces;

public interface IServiceCatalogService
{
    Task<List<ServiceItemResponse>> GetAllAsync(CancellationToken cancellationToken);
    Task<ServiceItemResponse?> GetByIdAsync(Guid id, CancellationToken cancellationToken);
    Task<ServiceItemResponse> CreateAsync(CreateServiceRequest request, CancellationToken cancellationToken);
}
