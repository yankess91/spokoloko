using BraiderskiReservation.Domain.Entities;

namespace BraiderskiReservation.Domain.Interfaces;

public interface IAppointmentRepository
{
    Task<List<Appointment>> GetAllAsync(CancellationToken cancellationToken);
    Task<Appointment?> GetNearestUpcomingAsync(DateTime from, CancellationToken cancellationToken);
    Task<Appointment?> GetByIdAsync(Guid id, CancellationToken cancellationToken);
    Task AddAsync(Appointment appointment, CancellationToken cancellationToken);
    Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken);
    Task SaveChangesAsync(CancellationToken cancellationToken);
}
