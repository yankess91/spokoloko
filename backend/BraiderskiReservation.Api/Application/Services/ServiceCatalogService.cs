using BraiderskiReservation.Api.Application.DTOs;
using BraiderskiReservation.Api.Application.Interfaces;
using BraiderskiReservation.Api.Domain.Entities;

namespace BraiderskiReservation.Api.Application.Services;

public sealed class ServiceCatalogService : IServiceCatalogService
{
    private readonly IServiceRepository _serviceRepository;

    public ServiceCatalogService(IServiceRepository serviceRepository)
    {
        _serviceRepository = serviceRepository;
    }

    public Task<List<ServiceItem>> GetAllAsync(CancellationToken cancellationToken) =>
        _serviceRepository.GetAllAsync(cancellationToken);

    public Task<ServiceItem?> GetByIdAsync(Guid id, CancellationToken cancellationToken) =>
        _serviceRepository.GetByIdAsync(id, cancellationToken);

    public async Task<ServiceItem> CreateAsync(CreateServiceRequest request, CancellationToken cancellationToken)
    {
        var service = new ServiceItem
        {
            Name = request.Name,
            Description = request.Description,
            Duration = TimeSpan.FromMinutes(request.DurationMinutes)
        };

        await _serviceRepository.AddAsync(service, cancellationToken);
        await _serviceRepository.SaveChangesAsync(cancellationToken);
        return service;
    }
}
