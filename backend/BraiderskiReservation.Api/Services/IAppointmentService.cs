using BraiderskiReservation.Api.Models;

namespace BraiderskiReservation.Api.Services;

public interface IAppointmentService
{
    IEnumerable<Appointment> GetAll();
    Appointment? GetById(Guid id);
    Appointment Create(Appointment appointment);
}
