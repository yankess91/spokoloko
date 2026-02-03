namespace BraiderskiReservation.Api.Application.DTOs;

public sealed class AuthResponse
{
    public string Token { get; set; } = string.Empty;
    public DateTime ExpiresAt { get; set; }
    public UserProfileResponse User { get; set; } = new();
}
