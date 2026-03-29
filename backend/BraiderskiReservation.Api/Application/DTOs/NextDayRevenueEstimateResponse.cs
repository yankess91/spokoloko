namespace BraiderskiReservation.Api.Application.DTOs;

public sealed record NextDayRevenueEstimateResponse(
    DateOnly Date,
    decimal AmountFrom,
    decimal AmountTo,
    int AppointmentsCount);
