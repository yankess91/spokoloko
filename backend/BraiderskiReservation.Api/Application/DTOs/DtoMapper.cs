using BraiderskiReservation.Domain.Entities;

namespace BraiderskiReservation.Api.Application.DTOs;

public static class DtoMapper
{
    public static AppointmentResponse ToResponse(this Appointment appointment) =>
        new(
            appointment.Id,
            appointment.ClientId,
            appointment.ServiceId,
            appointment.StartAt,
            appointment.EndAt,
            appointment.Notes,
            appointment.AppointmentProducts
                .Select(appointmentProduct => appointmentProduct.Product)
                .Where(product => product is not null)
                .Select(product => product!.ToResponse())
                .ToList());

    public static ClientProfileResponse ToResponse(this ClientProfile client) =>
        new(
            client.Id,
            client.FullName,
            client.Email,
            client.PhoneNumber,
            client.Notes,
            client.IsActive,
            client.UsedProducts.Select(product => product.ToResponse()).ToList(),
            client.Appointments
                .OrderByDescending(appointment => appointment.StartAt)
                .Select(appointment => appointment.ToHistoryResponse())
                .ToList());

    public static UsedProductResponse ToResponse(this UsedProduct usedProduct) =>
        new(
            usedProduct.Id,
            usedProduct.ClientId,
            usedProduct.Name,
            usedProduct.Notes,
            usedProduct.UsedAt);

    public static ServiceItemResponse ToResponse(this ServiceItem serviceItem) =>
        new(
            serviceItem.Id,
            serviceItem.Name,
            serviceItem.Description,
            serviceItem.Duration,
            serviceItem.Price,
            serviceItem.ServiceProducts
                .Select(serviceProduct => serviceProduct.Product)
                .Where(product => product is not null)
                .Select(product => product!.ToResponse())
                .ToList());

    public static ServiceSummaryResponse ToSummaryResponse(this ServiceItem serviceItem) =>
        new(
            serviceItem.Id,
            serviceItem.Name,
            serviceItem.Duration,
            serviceItem.Price);

    public static ClientServiceHistoryResponse ToHistoryResponse(this Appointment appointment) =>
        new(
            appointment.Id,
            appointment.StartAt,
            appointment.EndAt,
            appointment.Notes,
            appointment.ServiceItem?.ToSummaryResponse()
            ?? new ServiceSummaryResponse(Guid.Empty, "Nieznana usługa", TimeSpan.Zero, 0),
            appointment.AppointmentProducts
                .Select(appointmentProduct => appointmentProduct.Product)
                .Where(product => product is not null)
                .Select(product => product!.ToResponse())
                .ToList());

    public static ProductResponse ToResponse(this Product product) =>
        new(
            product.Id,
            product.Name,
            product.Brand,
            product.Notes,
            product.ImageUrl,
            product.Price,
            product.ShopUrl,
            product.IsAvailable,
            product.AvailabilityCheckedAt);
}
