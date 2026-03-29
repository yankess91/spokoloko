using BraiderskiReservation.Api.Application.Scrapers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BraiderskiReservation.Api.Controllers;

[ApiController]
[Route("api/scraping")]
public sealed class ScrapingController(
    IScrapingImportService scrapingImportService,
    ILogger<ScrapingController> logger) : ControllerBase
{
    [HttpPost]
    public async Task<ActionResult> Run(CancellationToken cancellationToken)
    {
        logger.LogInformation("Scraping import started by {User}", User.Identity?.Name ?? "unknown");
        await scrapingImportService.ImportAllAsync(cancellationToken);
        logger.LogInformation("Scraping import finished successfully.");
        return NoContent();
    }
}