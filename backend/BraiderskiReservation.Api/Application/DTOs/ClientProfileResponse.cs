namespace BraiderskiReservation.Api.Application.DTOs;

public sealed record ClientProfileResponse(
    Guid Id,
    string FullName,
    string Email,
    string PhoneNumber,
    string Notes,
    bool IsActive,
    List<UsedProductResponse> UsedProducts,
    List<ClientServiceHistoryResponse> ServiceHistory);
