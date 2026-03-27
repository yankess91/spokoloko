using BraiderskiReservation.Api.Application.DTOs;
using BraiderskiReservation.Api.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BraiderskiReservation.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/clients")]
public sealed class ClientsController : ControllerBase
{
    private readonly IClientService _clientService;

    public ClientsController(IClientService clientService)
    {
        _clientService = clientService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ClientProfileResponse>>> GetAll(
        [FromQuery] string? search,
        CancellationToken cancellationToken) =>
        Ok(await _clientService.SearchAsync(search, cancellationToken));

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ClientProfileResponse>> GetById(Guid id, CancellationToken cancellationToken)
    {
        var client = await _clientService.GetByIdAsync(id, cancellationToken);
        return client is null ? NotFound() : Ok(client);
    }

    [HttpPost]
    public async Task<ActionResult<ClientProfileResponse>> Create([FromBody] CreateClientRequest request, CancellationToken cancellationToken)
    {
        var client = await _clientService.CreateAsync(request, cancellationToken);
        return CreatedAtAction(nameof(GetById), new { id = client.Id }, client);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<ClientProfileResponse>> Update(Guid id, [FromBody] UpdateClientRequest request, CancellationToken cancellationToken)
    {
        var client = await _clientService.UpdateAsync(id, request, cancellationToken);
        return client is null ? NotFound() : Ok(client);
    }

    [HttpPatch("{id:guid}/status")]
    public async Task<ActionResult<ClientProfileResponse>> UpdateStatus(
        Guid id,
        [FromBody] UpdateClientStatusRequest request,
        CancellationToken cancellationToken)
    {
        var client = await _clientService.UpdateStatusAsync(id, request, cancellationToken);
        return client is null ? NotFound() : Ok(client);
    }

    [HttpPost("{id:guid}/used-products")]
    public async Task<IActionResult> AddUsedProduct(Guid id, [FromBody] AddUsedProductRequest request, CancellationToken cancellationToken)
    {
        var added = await _clientService.AddUsedProductAsync(id, request, cancellationToken);

        return added ? NoContent() : NotFound();
    }
}