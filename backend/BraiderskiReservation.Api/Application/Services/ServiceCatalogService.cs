using BraiderskiReservation.Api.Application.DTOs;
using BraiderskiReservation.Api.Application.Interfaces;
using System.Linq;
using BraiderskiReservation.Domain.Interfaces;
using BraiderskiReservation.Domain.Entities;

namespace BraiderskiReservation.Api.Application.Services;

public sealed class ServiceCatalogService : IServiceCatalogService
{
    private readonly IServiceRepository _serviceRepository;

    public ServiceCatalogService(IServiceRepository serviceRepository)
    {
        _serviceRepository = serviceRepository;
    }

    public async Task<List<ServiceItemResponse>> GetAllAsync(CancellationToken cancellationToken)
    {
        return await SearchAsync(null, cancellationToken);
    }

    public async Task<List<ServiceItemResponse>> SearchAsync(string? searchTerm, CancellationToken cancellationToken)
    {
        var services = await _serviceRepository.SearchAsync(searchTerm, cancellationToken);
        return services.Select(service => service.ToResponse()).ToList();
    }

    public async Task<ServiceItemResponse?> GetByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        var service = await _serviceRepository.GetByIdAsync(id, cancellationToken);
        return service?.ToResponse();
    }

    public async Task<ServiceItemResponse> CreateAsync(CreateServiceRequest request, CancellationToken cancellationToken)
    {
        var service = new ServiceItem
        {
            Name = request.Name,
            Description = request.Description,
            Duration = TimeSpan.FromMinutes(request.DurationMinutes),
            Price = request.Price,
            ServiceProducts = (request.RequiredProductIds ?? new List<Guid>())
                .Distinct()
                .Select(productId => new ServiceProduct
                {
                    ProductId = productId
                })
                .ToList()
        };

        await _serviceRepository.AddAsync(service, cancellationToken);
        await _serviceRepository.SaveChangesAsync(cancellationToken);
        return service.ToResponse();
    }
}
