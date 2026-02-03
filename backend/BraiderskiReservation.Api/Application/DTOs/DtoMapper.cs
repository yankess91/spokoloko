using System.Linq;
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
            appointment.Notes);

    public static ClientProfileResponse ToResponse(this ClientProfile client) =>
        new(
            client.Id,
            client.FullName,
            client.Email,
            client.PhoneNumber,
            client.UsedProducts.Select(product => product.ToResponse()).ToList());

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
            serviceItem.Duration);

    public static ProductResponse ToResponse(this Product product) =>
        new(
            product.Id,
            product.Name,
            product.Brand,
            product.Notes);
}
