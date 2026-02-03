using BraiderskiReservation.Api.DTOs;
using BraiderskiReservation.Api.Models;
using BraiderskiReservation.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace BraiderskiReservation.Api.Controllers;

[ApiController]
[Route("api/products")]
public sealed class ProductsController : ControllerBase
{
    private readonly IProductCatalogService _productService;

    public ProductsController(IProductCatalogService productService)
    {
        _productService = productService;
    }

    [HttpGet]
    public ActionResult<IEnumerable<Product>> GetAll() => Ok(_productService.GetAll());

    [HttpGet("{id:guid}")]
    public ActionResult<Product> GetById(Guid id)
    {
        var product = _productService.GetById(id);
        return product is null ? NotFound() : Ok(product);
    }

    [HttpPost]
    public ActionResult<Product> Create(CreateProductRequest request)
    {
        var product = new Product
        {
            Name = request.Name,
            Brand = request.Brand,
            Notes = request.Notes
        };

        _productService.Create(product);
        return CreatedAtAction(nameof(GetById), new { id = product.Id }, product);
    }
}
