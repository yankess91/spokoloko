namespace BraiderskiReservation.Api.Application.Common;

public sealed class ApiErrorResponse
{
    public string Code { get; init; }
    public string Message { get; init; }
    public Dictionary<string, string[]>? Errors { get; init; }
    public string? TraceId { get; init; }
}