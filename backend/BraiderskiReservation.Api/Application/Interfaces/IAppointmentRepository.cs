using BraiderskiReservation.Api.Domain.Entities;

namespace BraiderskiReservation.Api.Application.Interfaces;

public interface IAppointmentRepository
{
    Task<List<Appointment>> GetAllAsync(CancellationToken cancellationToken);
    Task<Appointment?> GetByIdAsync(Guid id, CancellationToken cancellationToken);
    Task AddAsync(Appointment appointment, CancellationToken cancellationToken);
    Task SaveChangesAsync(CancellationToken cancellationToken);
}
