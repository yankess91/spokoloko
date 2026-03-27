using BraiderskiReservation.Api.Application.DTOs;
using BraiderskiReservation.Api.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BraiderskiReservation.Api.Controllers;

[ApiController]
[Route("api/auth")]
public sealed class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly ILogger<AuthController> _logger;

    public AuthController(IAuthService authService, ILogger<AuthController> logger)
    {
        _authService = authService;
        _logger = logger;
    }

    [HttpPost("register")]
    [AllowAnonymous]
    public async Task<ActionResult<AuthResponse>> Register([FromBody] RegisterRequest request, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Registration attempt for email: {Email}", request.Email);

        var result = await _authService.RegisterAsync(request, cancellationToken);
        if (result is null)
        {
            _logger.LogWarning("Registration conflict for email: {Email}", request.Email);
            return Conflict(new { code = "conflict", message = "Użytkownik o tym adresie już istnieje." });
        }

        _logger.LogInformation("Registration successful for email: {Email}", request.Email);
        return Ok(result);
    }

    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<ActionResult<AuthResponse>> Login([FromBody] LoginRequest request, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Login attempt for email: {Email}", request.Email);

        var result = await _authService.LoginAsync(request, cancellationToken);
        if (result is null)
        {
            _logger.LogWarning("Failed login for email: {Email}", request.Email);
            return Unauthorized(new { code = "unauthorized", message = "Niepoprawny email lub hasło." });
        }

        _logger.LogInformation("Login successful for email: {Email}", request.Email);
        return Ok(result);
    }
}