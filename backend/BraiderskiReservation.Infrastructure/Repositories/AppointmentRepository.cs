using BraiderskiReservation.Domain.Interfaces;
using BraiderskiReservation.Domain.Entities;
using BraiderskiReservation.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace BraiderskiReservation.Infrastructure.Repositories;

public sealed class AppointmentRepository : IAppointmentRepository
{
    private readonly AppDbContext _context;

    public AppointmentRepository(AppDbContext context)
    {
        _context = context;
    }

    public Task<List<Appointment>> GetAllAsync(CancellationToken cancellationToken) =>
        _context.Appointments
            .Include(appointment => appointment.ClientProfile)
            .Include(appointment => appointment.AppointmentProducts)
            .ThenInclude(appointmentProduct => appointmentProduct.Product)
            .AsNoTracking()
            .ToListAsync(cancellationToken);

    public async Task<Appointment?> GetNearestUpcomingAsync(DateTime from, CancellationToken cancellationToken)
    {
        var appointmentId = await _context.Appointments
            .AsNoTracking()
            .Where(a => a.StartAt >= from && a.ClientProfile != null && a.ClientProfile.IsActive)
            .OrderBy(a => a.StartAt)
            .Select(a => a.Id)
            .FirstOrDefaultAsync(cancellationToken);

        if (appointmentId == default)
        {
            return null;
        }

        return await _context.Appointments
            .AsNoTracking()
            .Include(a => a.ClientProfile)
            .Include(a => a.AppointmentProducts)
                .ThenInclude(ap => ap.Product)
            .FirstOrDefaultAsync(a => a.Id == appointmentId, cancellationToken);
    }

    public Task<Appointment?> GetByIdAsync(Guid id, CancellationToken cancellationToken) =>
        _context.Appointments
            .Include(appointment => appointment.ClientProfile)
            .Include(appointment => appointment.AppointmentProducts)
            .ThenInclude(appointmentProduct => appointmentProduct.Product)
            .AsNoTracking()
            .FirstOrDefaultAsync(appointment => appointment.Id == id, cancellationToken);

    public Task<Appointment?> GetByIdForUpdateAsync(Guid id, CancellationToken cancellationToken) =>
        _context.Appointments
            .Include(appointment => appointment.AppointmentProducts)
            .FirstOrDefaultAsync(appointment => appointment.Id == id, cancellationToken);

    public async Task AddAsync(Appointment appointment, CancellationToken cancellationToken) =>
        await _context.Appointments.AddAsync(appointment, cancellationToken);

    public async Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken)
    {
        var appointment = await _context.Appointments
            .FirstOrDefaultAsync(item => item.Id == id, cancellationToken);

        if (appointment is null)
        {
            return false;
        }

        _context.Appointments.Remove(appointment);
        return true;
    }

    public Task SaveChangesAsync(CancellationToken cancellationToken) =>
        _context.SaveChangesAsync(cancellationToken);
}
