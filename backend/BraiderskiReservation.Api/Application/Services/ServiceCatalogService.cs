using BraiderskiReservation.Api.Application.DTOs;
using BraiderskiReservation.Api.Application.Interfaces;
using BraiderskiReservation.Domain.Entities;
using BraiderskiReservation.Domain.Interfaces;

namespace BraiderskiReservation.Api.Application.Services;

public sealed class ServiceCatalogService : IServiceCatalogService
{
    private readonly IServiceRepository _serviceRepository;
    private readonly IProductRepository _productRepository;

    public ServiceCatalogService(IServiceRepository serviceRepository, IProductRepository productRepository)
    {
        _serviceRepository = serviceRepository;
        _productRepository = productRepository;
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
        if (request.DurationToMinutes < request.DurationFromMinutes)
        {
            throw new InvalidOperationException("Pole DurationToMinutes musi być większe lub równe DurationFromMinutes.");
        }

        if (request.PriceTo < request.PriceFrom)
        {
            throw new InvalidOperationException("Pole PriceTo musi być większe lub równe PriceFrom.");
        }

        var serviceType = ParseServiceType(request.Type);

        var service = new ServiceItem
        {
            Name = request.Name,
            Description = request.Description,
            DurationFrom = TimeSpan.FromMinutes(request.DurationFromMinutes),
            DurationTo = TimeSpan.FromMinutes(request.DurationToMinutes),
            PriceFrom = request.PriceFrom,
            PriceTo = request.PriceTo,
            Type = serviceType,
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

    public async Task<ServiceItemResponse?> UpdateAsync(Guid id, CreateServiceRequest request, CancellationToken cancellationToken)
    {
        if (request.DurationToMinutes < request.DurationFromMinutes)
        {
            throw new InvalidOperationException("Pole DurationToMinutes musi być większe lub równe DurationFromMinutes.");
        }

        if (request.PriceTo < request.PriceFrom)
        {
            throw new InvalidOperationException("Pole PriceTo musi być większe lub równe PriceFrom.");
        }

        var updated = await _serviceRepository.UpdateAsync(
            id,
            request.Name,
            request.Description,
            TimeSpan.FromMinutes(request.DurationFromMinutes),
            TimeSpan.FromMinutes(request.DurationToMinutes),
            request.PriceFrom,
            request.PriceTo,
            ParseServiceType(request.Type),
            request.RequiredProductIds ?? new List<Guid>(),
            cancellationToken);

        if (updated is null)
        {
            return null;
        }

        await _serviceRepository.SaveChangesAsync(cancellationToken);

        var refreshed = await _serviceRepository.GetByIdAsync(id, cancellationToken);
        return refreshed?.ToResponse();
    }

    public async Task<ServiceItemResponse?> AddProductAsync(Guid serviceId, Guid productId, CancellationToken cancellationToken)
    {
        var product = await _productRepository.GetByIdAsync(productId, cancellationToken);
        if (product is null)
        {
            return null;
        }

        var service = await _serviceRepository.AddProductAsync(serviceId, productId, cancellationToken);
        if (service is null)
        {
            return null;
        }

        await _serviceRepository.SaveChangesAsync(cancellationToken);

        var refreshed = await _serviceRepository.GetByIdAsync(serviceId, cancellationToken);
        return refreshed?.ToResponse();
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken)
    {
        var deleted = await _serviceRepository.DeleteAsync(id, cancellationToken);
        if (!deleted)
        {
            return false;
        }

        await _serviceRepository.SaveChangesAsync(cancellationToken);
        return true;
    }

    private static ServiceType ParseServiceType(string type)
    {
        if (Enum.TryParse<ServiceType>(type, true, out var serviceType))
        {
            return serviceType;
        }

        throw new InvalidOperationException("Pole Type musi mieć wartość OnSite albo CustomOrder.");
    }
}
