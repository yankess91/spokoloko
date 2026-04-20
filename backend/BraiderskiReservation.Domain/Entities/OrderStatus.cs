namespace BraiderskiReservation.Domain.Entities;

public enum OrderStatus
{
    New = 0,
    Confirmed = 1,
    InProgress = 2,
    Ready = 3,
    Completed = 4,
    Cancelled = 5
}
