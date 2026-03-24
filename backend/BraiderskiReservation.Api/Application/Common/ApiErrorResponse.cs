namespace BraiderskiReservation.Api.Application.Common;

public sealed class ApiErrorResponse
{
    public required string Code { get; init; }
    public required string Message { get; init; }
    public Dictionary<string, string[]>? Errors { get; init; }
    public string? TraceId { get; init; }
}
