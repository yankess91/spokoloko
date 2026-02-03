namespace BraiderskiReservation.Api.Application.DTOs;

public sealed record ClientProfileResponse(
    Guid Id,
    string FullName,
    string Email,
    string PhoneNumber,
    List<UsedProductResponse> UsedProducts);
