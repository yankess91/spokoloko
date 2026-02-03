using BraiderskiReservation.Api.DTOs;
using BraiderskiReservation.Api.Models;
using BraiderskiReservation.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace BraiderskiReservation.Api.Controllers;

[ApiController]
[Route("api/clients")]
public sealed class ClientsController : ControllerBase
{
    private readonly IClientService _clientService;

    public ClientsController(IClientService clientService)
    {
        _clientService = clientService;
    }

    [HttpGet]
    public ActionResult<IEnumerable<ClientProfile>> GetAll() => Ok(_clientService.GetAll());

    [HttpGet("{id:guid}")]
    public ActionResult<ClientProfile> GetById(Guid id)
    {
        var client = _clientService.GetById(id);
        return client is null ? NotFound() : Ok(client);
    }

    [HttpPost]
    public ActionResult<ClientProfile> Create(CreateClientRequest request)
    {
        var client = new ClientProfile
        {
            FullName = request.FullName,
            Email = request.Email,
            PhoneNumber = request.PhoneNumber
        };

        _clientService.Create(client);
        return CreatedAtAction(nameof(GetById), new { id = client.Id }, client);
    }

    [HttpPost("{id:guid}/used-products")]
    public IActionResult AddUsedProduct(Guid id, AddUsedProductRequest request)
    {
        var added = _clientService.AddUsedProduct(id, new UsedProduct
        {
            Name = request.Name,
            Notes = request.Notes,
            UsedAt = request.UsedAt
        });

        return added ? NoContent() : NotFound();
    }
}
