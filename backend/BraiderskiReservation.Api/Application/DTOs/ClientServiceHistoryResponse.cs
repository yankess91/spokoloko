namespace BraiderskiReservation.Api.Application.DTOs;

public sealed record ClientServiceHistoryResponse(
    Guid AppointmentId,
    DateTime StartAt,
    DateTime EndAt,
    string Notes,
    ServiceSummaryResponse Service,
    List<ProductResponse> UsedProducts);
