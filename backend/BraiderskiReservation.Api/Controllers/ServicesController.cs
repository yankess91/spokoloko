using BraiderskiReservation.Api.DTOs;
using BraiderskiReservation.Api.Models;
using BraiderskiReservation.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace BraiderskiReservation.Api.Controllers;

[ApiController]
[Route("api/services")]
public sealed class ServicesController : ControllerBase
{
    private readonly IServiceCatalogService _serviceCatalog;

    public ServicesController(IServiceCatalogService serviceCatalog)
    {
        _serviceCatalog = serviceCatalog;
    }

    [HttpGet]
    public ActionResult<IEnumerable<ServiceItem>> GetAll() => Ok(_serviceCatalog.GetAll());

    [HttpGet("{id:guid}")]
    public ActionResult<ServiceItem> GetById(Guid id)
    {
        var service = _serviceCatalog.GetById(id);
        return service is null ? NotFound() : Ok(service);
    }

    [HttpPost]
    public ActionResult<ServiceItem> Create(CreateServiceRequest request)
    {
        var service = new ServiceItem
        {
            Name = request.Name,
            Description = request.Description,
            Duration = TimeSpan.FromMinutes(request.DurationMinutes)
        };

        _serviceCatalog.Create(service);
        return CreatedAtAction(nameof(GetById), new { id = service.Id }, service);
    }
}
