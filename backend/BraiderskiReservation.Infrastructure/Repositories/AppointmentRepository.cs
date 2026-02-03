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
            .AsNoTracking()
            .ToListAsync(cancellationToken);

    public Task<Appointment?> GetByIdAsync(Guid id, CancellationToken cancellationToken) =>
        _context.Appointments
            .AsNoTracking()
            .FirstOrDefaultAsync(appointment => appointment.Id == id, cancellationToken);

    public async Task AddAsync(Appointment appointment, CancellationToken cancellationToken) =>
        await _context.Appointments.AddAsync(appointment, cancellationToken);

    public Task SaveChangesAsync(CancellationToken cancellationToken) =>
        _context.SaveChangesAsync(cancellationToken);
}
