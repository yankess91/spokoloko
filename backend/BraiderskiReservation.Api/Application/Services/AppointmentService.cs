using BraiderskiReservation.Api.Application.DTOs;
using BraiderskiReservation.Api.Application.Interfaces;
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

    public Task<List<Appointment>> GetAllAsync(CancellationToken cancellationToken) =>
        _appointmentRepository.GetAllAsync(cancellationToken);

    public Task<Appointment?> GetByIdAsync(Guid id, CancellationToken cancellationToken) =>
        _appointmentRepository.GetByIdAsync(id, cancellationToken);

    public async Task<Appointment> CreateAsync(CreateAppointmentRequest request, CancellationToken cancellationToken)
    {
        var appointment = new Appointment
        {
            ClientId = request.ClientId,
            ServiceId = request.ServiceId,
            StartAt = request.StartAt,
            EndAt = request.EndAt,
            Notes = request.Notes
        };

        await _appointmentRepository.AddAsync(appointment, cancellationToken);
        await _appointmentRepository.SaveChangesAsync(cancellationToken);
        return appointment;
    }
}
