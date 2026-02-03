using BraiderskiReservation.Api.Application.DTOs;
namespace BraiderskiReservation.Api.Application.Interfaces;

public interface IAppointmentService
{
    Task<List<AppointmentResponse>> GetAllAsync(CancellationToken cancellationToken);
    Task<AppointmentResponse?> GetByIdAsync(Guid id, CancellationToken cancellationToken);
    Task<AppointmentResponse> CreateAsync(CreateAppointmentRequest request, CancellationToken cancellationToken);
}
