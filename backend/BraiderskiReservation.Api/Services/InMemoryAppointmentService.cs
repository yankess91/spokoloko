using BraiderskiReservation.Api.Models;

namespace BraiderskiReservation.Api.Services;

public sealed class InMemoryAppointmentService : IAppointmentService
{
    private readonly List<Appointment> _appointments = new();

    public IEnumerable<Appointment> GetAll() => _appointments;

    public Appointment? GetById(Guid id) => _appointments.FirstOrDefault(appointment => appointment.Id == id);

    public Appointment Create(Appointment appointment)
    {
        _appointments.Add(appointment);
        return appointment;
    }
}
