using BraiderskiReservation.Api.Application.Scrapers;
using BraiderskiReservation.Api.Application.Scrapers.AltHair;
using BraiderskiReservation.Api.Application.Scrapers.Magfactory;
using Microsoft.AspNetCore.Mvc;

namespace BraiderskiReservation.Api.Controllers;

[ApiController]
[Route("api/scraping")]
public class ScrapingController(IScrapingImportService scrapingImportService) : Controller
{
    [HttpPost()]
    public async Task<IActionResult> Run()
    {
        await scrapingImportService.ImportAllAsync();
        return Ok();
    }
}
