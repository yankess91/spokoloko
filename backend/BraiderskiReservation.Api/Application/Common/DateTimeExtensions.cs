namespace BraiderskiReservation.Api.Application.Common;

public static class DateTimeExtensions
{
    public static DateTime ToUtc(this DateTime value)
    {
        if (value.Kind == DateTimeKind.Utc)
        {
            return value;
        }

        if (value.Kind == DateTimeKind.Local)
        {
            return value.ToUniversalTime();
        }

        return DateTime.SpecifyKind(value, DateTimeKind.Utc);
    }

    public static DateTime? ToUtc(this DateTime? value) =>
        value is null ? null : value.Value.ToUtc();
}
