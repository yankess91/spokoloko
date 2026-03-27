using BraiderskiReservation.Api.Application.DTOs;
using BraiderskiReservation.Api.Application.Interfaces;
using BraiderskiReservation.Domain.Entities;
using BraiderskiReservation.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace BraiderskiReservation.Api.Application.Services;

public sealed class AppointmentService : IAppointmentService
{
    private readonly IAppointmentRepository _appointmentRepository;
    private readonly IClientRepository _clientRepository;
    private readonly IProductRepository _productRepository;

    public AppointmentService(
        IAppointmentRepository appointmentRepository,
        IClientRepository clientRepository,
        IProductRepository productRepository)
    {
        _appointmentRepository = appointmentRepository;
        _clientRepository = clientRepository;
        _productRepository = productRepository;
    }

    public async Task<List<AppointmentResponse>> GetAllAsync(CancellationToken cancellationToken)
    {
        var appointments = await _appointmentRepository.GetAllAsync(cancellationToken);
        return appointments
            .Where(appointment => appointment.ClientProfile?.IsActive != false)
            .Select(appointment => appointment.ToResponse())
            .ToList();
    }

    public async Task<AppointmentResponse?> GetNearestUpcomingAsync(CancellationToken cancellationToken)
    {
        var appointment = await _appointmentRepository.GetNearestUpcomingAsync(DateTime.UtcNow, cancellationToken);
        return appointment?.ToResponse();
    }

    public async Task<AppointmentResponse?> GetByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        var appointment = await _appointmentRepository.GetByIdAsync(id, cancellationToken);
        if (appointment?.ClientProfile?.IsActive is false)
        {
            return null;
        }

        return appointment?.ToResponse();
    }

    public async Task<AppointmentResponse> CreateAsync(CreateAppointmentRequest request, CancellationToken cancellationToken)
    {
        var normalizedProductIds = NormalizeProductIds(request.ProductIds);
        await EnsureProductsExistAsync(normalizedProductIds, cancellationToken);

        var client = await _clientRepository.GetByIdAsync(request.ClientId, cancellationToken);
        if (client is null || !client.IsActive)
        {
            throw new InvalidOperationException("Nie można utworzyć wizyty dla nieaktywnego klienta.");
        }

        var appointment = new Appointment
        {
            ClientId = request.ClientId,
            ServiceId = request.ServiceId,
            StartAt = request.StartAt,
            EndAt = request.EndAt,
            Notes = request.Notes,
            AppointmentProducts = BuildAppointmentProducts(normalizedProductIds)
        };

        await _appointmentRepository.AddAsync(appointment, cancellationToken);
        await _appointmentRepository.SaveChangesAsync(cancellationToken);
        return appointment.ToResponse();
    }

    public async Task<AppointmentResponse?> UpdateAsync(Guid id, UpdateAppointmentRequest request, CancellationToken cancellationToken)
    {
        var normalizedProductIds = NormalizeProductIds(request.ProductIds);
        await EnsureProductsExistAsync(normalizedProductIds, cancellationToken);

        var client = await _clientRepository.GetByIdAsync(request.ClientId, cancellationToken);
        if (client is null || !client.IsActive)
        {
            throw new InvalidOperationException("Nie można zapisać wizyty dla nieaktywnego klienta.");
        }

        var appointment = await _appointmentRepository.GetByIdForUpdateAsync(id, cancellationToken);
        if (appointment is null)
        {
            return null;
        }

        appointment.ClientId = request.ClientId;
        appointment.ServiceId = request.ServiceId;
        appointment.StartAt = request.StartAt;
        appointment.EndAt = request.EndAt;
        appointment.Notes = request.Notes;

        foreach (var appointmentProduct in BuildAppointmentProducts(normalizedProductIds))
        {
            appointment.AppointmentProducts.Add(appointmentProduct);

        }

        await _appointmentRepository.SaveChangesAsync(cancellationToken);


        return appointment.ToResponse();
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken)
    {
        var deleted = await _appointmentRepository.DeleteAsync(id, cancellationToken);
        if (!deleted)
        {
            return false;
        }

        await _appointmentRepository.SaveChangesAsync(cancellationToken);
        return true;
    }

    private async Task EnsureProductsExistAsync(IReadOnlyCollection<Guid> productIds, CancellationToken cancellationToken)
    {
        if (productIds.Count == 0)
        {
            return;
        }

        var existingIds = await _productRepository.GetExistingIdsAsync(productIds, cancellationToken);
        var missingIds = productIds.Except(existingIds).ToList();

        if (missingIds.Count == 0)
        {
            return;
        }

        throw new InvalidOperationException(
            $"Nie można przypisać produktów do wizyty. Brak produktów o ID: {string.Join(", ", missingIds)}");
    }

    private static List<Guid> NormalizeProductIds(IEnumerable<Guid>? productIds) =>
        (productIds ?? new List<Guid>())
            .Where(id => id != Guid.Empty)
            .Distinct()
            .ToList();

    private static List<AppointmentProduct> BuildAppointmentProducts(IEnumerable<Guid> productIds) =>
        productIds
            .Select(productId => new AppointmentProduct
            {
                Id = new Guid(),
                ProductId = productId
            })
            .ToList();
}
