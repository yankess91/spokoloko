using BraiderskiReservation.Api.Application.DTOs;
using BraiderskiReservation.Api.Application.Interfaces;
using BraiderskiReservation.Domain.Entities;
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
    public async Task<ActionResult<IEnumerable<ServiceItem>>> GetAll(CancellationToken cancellationToken) =>
        Ok(await _serviceCatalog.GetAllAsync(cancellationToken));

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ServiceItem>> GetById(Guid id, CancellationToken cancellationToken)
    {
        var service = await _serviceCatalog.GetByIdAsync(id, cancellationToken);
        return service is null ? NotFound() : Ok(service);
    }

    [HttpPost]
    public async Task<ActionResult<ServiceItem>> Create(CreateServiceRequest request, CancellationToken cancellationToken)
    {
        var service = await _serviceCatalog.CreateAsync(request, cancellationToken);
        return CreatedAtAction(nameof(GetById), new { id = service.Id }, service);
    }
}
