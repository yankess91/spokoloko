using BraiderskiReservation.Api.Application.DTOs;
using BraiderskiReservation.Api.Application.Interfaces;
using System.Linq;
using BraiderskiReservation.Domain.Interfaces;
using BraiderskiReservation.Domain.Entities;

namespace BraiderskiReservation.Api.Application.Services;

public sealed class AppointmentService : IAppointmentService
{
    private readonly IAppointmentRepository _appointmentRepository;

    public AppointmentService(IAppointmentRepository appointmentRepository)
    {
        _appointmentRepository = appointmentRepository;
    }

    public async Task<List<AppointmentResponse>> GetAllAsync(CancellationToken cancellationToken)
    {
        var appointments = await _appointmentRepository.GetAllAsync(cancellationToken);
        return appointments.Select(appointment => appointment.ToResponse()).ToList();
    }

    public async Task<AppointmentResponse?> GetByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        var appointment = await _appointmentRepository.GetByIdAsync(id, cancellationToken);
        return appointment?.ToResponse();
    }

    public async Task<AppointmentResponse> CreateAsync(CreateAppointmentRequest request, CancellationToken cancellationToken)
    {
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
}
