using BraiderskiReservation.Api.Application.DTOs;
using BraiderskiReservation.Domain.Entities;

namespace BraiderskiReservation.Api.Application.Interfaces;

public interface IAppointmentService
{
    Task<List<Appointment>> GetAllAsync(CancellationToken cancellationToken);
    Task<Appointment?> GetByIdAsync(Guid id, CancellationToken cancellationToken);
    Task<Appointment> CreateAsync(CreateAppointmentRequest request, CancellationToken cancellationToken);
}
