using BraiderskiReservation.Api.Application.DTOs;

namespace BraiderskiReservation.Api.Application.Interfaces;

public interface IAuthService
{
    Task<AuthResponse?> LoginAsync(LoginRequest request, CancellationToken cancellationToken);
    Task<AuthResponse?> RegisterAsync(RegisterRequest request, CancellationToken cancellationToken);
}
