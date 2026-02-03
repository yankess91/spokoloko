using BraiderskiReservation.Api.Application.DTOs;
using BraiderskiReservation.Api.Domain.Entities;

namespace BraiderskiReservation.Api.Application.Interfaces;

public interface IServiceCatalogService
{
    Task<List<ServiceItem>> GetAllAsync(CancellationToken cancellationToken);
    Task<ServiceItem?> GetByIdAsync(Guid id, CancellationToken cancellationToken);
    Task<ServiceItem> CreateAsync(CreateServiceRequest request, CancellationToken cancellationToken);
}
