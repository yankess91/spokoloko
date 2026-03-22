using BraiderskiReservation.Api.Application.DTOs;
using BraiderskiReservation.Api.Application.Interfaces;
using System.Linq;
using BraiderskiReservation.Domain.Interfaces;
using BraiderskiReservation.Domain.Entities;

namespace BraiderskiReservation.Api.Application.Services;

public sealed class AppointmentService : IAppointmentService
{
    private readonly IAppointmentRepository _appointmentRepository;
    private readonly IClientRepository _clientRepository;

    public AppointmentService(IAppointmentRepository appointmentRepository, IClientRepository clientRepository)
    {
        _appointmentRepository = appointmentRepository;
        _clientRepository = clientRepository;
    }

    public async Task<List<AppointmentResponse>> GetAllAsync(CancellationToken cancellationToken)
    {
        var appointments = await _appointmentRepository.GetAllAsync(cancellationToken);
        return appointments
            .Where(appointment => appointment.ClientProfile?.IsActive != false)
            .Select(appointment => appointment.ToResponse())
            .ToList();
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
            AppointmentProducts = (request.ProductIds ?? new List<Guid>())
                .Distinct()
                .Select(productId => new AppointmentProduct
                {
                    ProductId = productId
                })
                .ToList()
        };

        await _appointmentRepository.AddAsync(appointment, cancellationToken);
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
}
