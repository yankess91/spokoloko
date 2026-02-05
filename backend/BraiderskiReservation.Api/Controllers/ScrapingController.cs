using BraiderskiReservation.Api.Application.Scrapers.Magfactory;
using Microsoft.AspNetCore.Mvc;

namespace BraiderskiReservation.Api.Controllers;

[ApiController]
[Route("api/scraping")]
public class ScrapingController(IMagfactoryImportService magfactoryImportService) : Controller
{
    [HttpGet]
    public async Task<IActionResult> IndexAsync([FromQuery] string url)
    {
        await magfactoryImportService.ImportCategoryAsync(url);
        return Ok();
    }
}
