using BraiderskiReservation.Api.Application.Common;
using BraiderskiReservation.Api.Middleware;
using BraiderskiReservation.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace BraiderskiReservation.Api.Configuration;

public static class WebApplicationExtensions
{
    public static WebApplicationBuilder AddEnvironmentConfiguration(this WebApplicationBuilder builder)
    {
        var projectRoot = Path.GetFullPath(Path.Combine(builder.Environment.ContentRootPath, "..", ".."));
        var envConfiguration = EnvFileConfiguration.Load(projectRoot);

        if (envConfiguration.Count > 0)
        {
            builder.Configuration.AddInMemoryCollection(envConfiguration);
        }

        return builder;
    }

    public static async Task InitializeDatabaseAsync(this WebApplication app)
    {
        var applyMigrations = app.Configuration.GetValue("Database:ApplyMigrationsOnStartup", true);
        var runDevelopmentSeed = app.Environment.IsDevelopment() &&
                                 app.Configuration.GetValue("Database:RunSeedOnStartup", false);

        if (!applyMigrations && !runDevelopmentSeed)
        {
            return;
        }

        await using var scope = app.Services.CreateAsyncScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var logger = scope.ServiceProvider.GetRequiredService<ILoggerFactory>().CreateLogger("DatabaseBootstrap");

        if (applyMigrations)
        {
            logger.LogInformation("Applying EF Core migrations.");
            await dbContext.Database.MigrateAsync();
        }

        if (runDevelopmentSeed)
        {
            var seedFilePath = Path.Combine(app.Environment.ContentRootPath, "database", "seed-data.sql");
            if (!File.Exists(seedFilePath))
            {
                logger.LogWarning("Seed file not found at {SeedPath}.", seedFilePath);
                return;
            }

            logger.LogInformation("Executing development seed from {SeedPath}.", seedFilePath);
            var sql = await File.ReadAllTextAsync(seedFilePath);
            await dbContext.Database.ExecuteSqlRawAsync(sql);
        }
    }

    public static IApplicationBuilder UseGlobalExceptionHandling(this IApplicationBuilder app) =>
        app.UseMiddleware<GlobalExceptionHandlingMiddleware>();

    public static IApplicationBuilder UseSwaggerIfDevelopment(this IApplicationBuilder app)
    {
        if (app.ApplicationServices.GetRequiredService<IWebHostEnvironment>().IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
        }

        return app;
    }

    public static IApplicationBuilder UseConfiguredCors(this IApplicationBuilder app)
    {
        app.UseCors("Frontend");
        return app;
    }

    public static IApplicationBuilder UseStatusCodeProblemDetails(this IApplicationBuilder app)
    {
        app.UseStatusCodePages(async context =>
        {
            var response = context.HttpContext.Response;
            if (response.ContentLength > 0 || !string.IsNullOrWhiteSpace(response.ContentType))
            {
                return;
            }

            response.ContentType = "application/json";
            var payload = new ApiErrorResponse
            {
                Code = response.StatusCode switch
                {
                    StatusCodes.Status400BadRequest => "bad_request",
                    StatusCodes.Status401Unauthorized => "unauthorized",
                    StatusCodes.Status403Forbidden => "forbidden",
                    StatusCodes.Status404NotFound => "not_found",
                    StatusCodes.Status409Conflict => "conflict",
                    _ => "http_error"
                },
                Message = response.StatusCode switch
                {
                    StatusCodes.Status400BadRequest => "Nieprawidłowe żądanie.",
                    StatusCodes.Status401Unauthorized => "Brak autoryzacji.",
                    StatusCodes.Status403Forbidden => "Brak uprawnień.",
                    StatusCodes.Status404NotFound => "Nie znaleziono zasobu.",
                    StatusCodes.Status409Conflict => "Konflikt stanu zasobu.",
                    _ => "Błąd HTTP."
                },
                TraceId = context.HttpContext.TraceIdentifier
            };

            await response.WriteAsync(JsonSerializer.Serialize(payload));
        });

        return app;
    }
}