using BraiderskiReservation.Api.Application.DTOs;
using BraiderskiReservation.Api.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BraiderskiReservation.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/services")]
public sealed class ServicesController : ControllerBase
{
    private readonly IServiceCatalogService _serviceCatalog;

    public ServicesController(IServiceCatalogService serviceCatalog)
    {
        _serviceCatalog = serviceCatalog;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ServiceItemResponse>>> GetAll(
        [FromQuery] string? search,
        CancellationToken cancellationToken) =>
        Ok(await _serviceCatalog.SearchAsync(search, cancellationToken));

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ServiceItemResponse>> GetById(Guid id, CancellationToken cancellationToken)
    {
        var service = await _serviceCatalog.GetByIdAsync(id, cancellationToken);
        return service is null ? NotFound() : Ok(service);
    }

    [HttpPost]
    public async Task<ActionResult<ServiceItemResponse>> Create(CreateServiceRequest request, CancellationToken cancellationToken)
    {
        var service = await _serviceCatalog.CreateAsync(request, cancellationToken);
        return CreatedAtAction(nameof(GetById), new { id = service.Id }, service);
    }

    [HttpPost("{id:guid}/products")]
    public async Task<ActionResult<ServiceItemResponse>> AddProduct(
        Guid id,
        AddServiceProductRequest request,
        CancellationToken cancellationToken)
    {
        var service = await _serviceCatalog.AddProductAsync(id, request.ProductId, cancellationToken);
        return service is null ? NotFound() : Ok(service);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        var deleted = await _serviceCatalog.DeleteAsync(id, cancellationToken);
        return deleted ? NoContent() : NotFound();
    }
}
