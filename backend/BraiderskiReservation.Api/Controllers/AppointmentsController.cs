using BraiderskiReservation.Api.DTOs;
using BraiderskiReservation.Api.Models;
using BraiderskiReservation.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace BraiderskiReservation.Api.Controllers;

[ApiController]
[Route("api/appointments")]
public sealed class AppointmentsController : ControllerBase
{
    private readonly IAppointmentService _appointmentService;

    public AppointmentsController(IAppointmentService appointmentService)
    {
        _appointmentService = appointmentService;
    }

    [HttpGet]
    public ActionResult<IEnumerable<Appointment>> GetAll() => Ok(_appointmentService.GetAll());

    [HttpGet("{id:guid}")]
    public ActionResult<Appointment> GetById(Guid id)
    {
        var appointment = _appointmentService.GetById(id);
        return appointment is null ? NotFound() : Ok(appointment);
    }

    [HttpPost]
    public ActionResult<Appointment> Create(CreateAppointmentRequest request)
    {
        var appointment = new Appointment
        {
            ClientId = request.ClientId,
            ServiceId = request.ServiceId,
            StartAt = request.StartAt,
            EndAt = request.EndAt,
            Notes = request.Notes
        };

        _appointmentService.Create(appointment);
        return CreatedAtAction(nameof(GetById), new { id = appointment.Id }, appointment);
    }
}
