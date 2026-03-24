using System.ComponentModel.DataAnnotations;
using System.Text.Json;
using BraiderskiReservation.Api.Application.Common;

namespace BraiderskiReservation.Api.Middleware;

public sealed class GlobalExceptionHandlingMiddleware(RequestDelegate next, ILogger<GlobalExceptionHandlingMiddleware> logger)
{
    public async Task Invoke(HttpContext context)
    {
        try
        {
            await next(context);
        }
        catch (Exception ex)
        {
            await HandleExceptionAsync(context, ex);
        }
    }

    private async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        var (statusCode, code, message, logLevel) = exception switch
        {
            ValidationException => (StatusCodes.Status400BadRequest, "validation_error", exception.Message, LogLevel.Warning),
            ArgumentException => (StatusCodes.Status400BadRequest, "invalid_request", exception.Message, LogLevel.Warning),
            UnauthorizedAccessException => (StatusCodes.Status401Unauthorized, "unauthorized", exception.Message, LogLevel.Warning),
            KeyNotFoundException => (StatusCodes.Status404NotFound, "not_found", exception.Message, LogLevel.Information),
            InvalidOperationException => (StatusCodes.Status409Conflict, "business_conflict", exception.Message, LogLevel.Warning),
            _ => (StatusCodes.Status500InternalServerError, "internal_server_error", "Wystąpił nieoczekiwany błąd serwera.", LogLevel.Error)
        };

        logger.Log(logLevel, exception, "Unhandled exception for {Path}", context.Request.Path);

        var response = new ApiErrorResponse
        {
            Code = code,
            Message = message,
            TraceId = context.TraceIdentifier
        };

        context.Response.StatusCode = statusCode;
        context.Response.ContentType = "application/json";

        await context.Response.WriteAsync(JsonSerializer.Serialize(response));
    }
}
