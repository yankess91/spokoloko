using BraiderskiReservation.Api.Application.Interfaces;
using BraiderskiReservation.Api.Application.Scrapers;
using BraiderskiReservation.Api.Application.Scrapers.AltHair;
using BraiderskiReservation.Api.Application.Scrapers.Magfactory;
using BraiderskiReservation.Api.Application.Services;
using BraiderskiReservation.Api.Application.Settings;
using BraiderskiReservation.Domain.Interfaces;
using BraiderskiReservation.Infrastructure.Data;
using BraiderskiReservation.Infrastructure.Options;
using BraiderskiReservation.Infrastructure.Repositories;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace BraiderskiReservation.Api.Configuration;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        services.AddControllers();
        services.AddEndpointsApiExplorer();
        services.AddSwaggerGen();

        services.AddTransient<IClientService, ClientService>();
        services.AddTransient<IProductCatalogService, ProductCatalogService>();
        services.AddTransient<IServiceCatalogService, ServiceCatalogService>();
        services.AddTransient<IAppointmentService, AppointmentService>();
        services.AddTransient<IAuthService, AuthService>();
        services.AddTransient<IScrapingImportService, ScrapingImportService>();
        services.AddSingleton<IScraperResolver, ScraperResolver>();

        return services;
    }

    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        services.Configure<ScrapingOptions>(configuration.GetSection("Scraping"));

        services.AddDbContext<AppDbContext>(options =>
        {
            var connectionString = configuration.GetConnectionString("Default");
            options.UseNpgsql(connectionString);
        });

        services.AddScoped<IClientRepository, ClientRepository>();
        services.AddScoped<IProductRepository, ProductRepository>();
        services.AddScoped<IServiceRepository, ServiceRepository>();
        services.AddScoped<IAppointmentRepository, AppointmentRepository>();
        services.AddScoped<IUserRepository, UserRepository>();

        services.AddHttpClient<IListingScraper, MagfactoryListingScraper>(ConfigureScraperHttpClient);
        services.AddHttpClient<IMagfactoryImageUrlProvider, MagfactoryImageUrlProvider>(ConfigureScraperHttpClient);
        services.AddHttpClient<IListingScraper, AlthairListingScraper>(ConfigureScraperHttpClient);

        return services;
    }

    public static IServiceCollection AddJwtAuthentication(this IServiceCollection services, IConfiguration configuration)
    {
        services.Configure<JwtSettings>(configuration.GetSection("Jwt"));

        var jwtSettings = configuration.GetSection("Jwt").Get<JwtSettings>();
        var signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings?.SigningKey ?? string.Empty));

        services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        }).AddJwtBearer(options =>
        {
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer = jwtSettings?.Issuer,
                ValidAudience = jwtSettings?.Audience,
                IssuerSigningKey = signingKey
            };
        });

        services.AddAuthorization();
        return services;
    }

    public static IServiceCollection AddConfiguredCors(this IServiceCollection services, IConfiguration configuration)
    {
        var allowedCorsOrigins = configuration
            .GetSection("Cors:AllowedOrigins")
            .Get<string[]>()?
            .Select(origin => origin.TrimEnd('/'))
            .Where(origin => !string.IsNullOrWhiteSpace(origin))
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .ToArray() ?? Array.Empty<string>();

        services.AddCors(options =>
        {
            options.AddPolicy("Frontend", policy =>
            {
                if (allowedCorsOrigins.Length > 0)
                {
                    policy.WithOrigins(allowedCorsOrigins);
                }

                policy.AllowAnyHeader().AllowAnyMethod();
            });
        });

        return services;
    }

    public static IServiceCollection AddApiBehavior(this IServiceCollection services)
    {
        services.Configure<ApiBehaviorOptions>(options =>
        {
            options.InvalidModelStateResponseFactory = context =>
            {
                var errors = context.ModelState
                    .Where(x => x.Value?.Errors.Count > 0)
                    .ToDictionary(
                        x => x.Key,
                        x => x.Value!.Errors.Select(e => string.IsNullOrWhiteSpace(e.ErrorMessage)
                            ? "Invalid value."
                            : e.ErrorMessage).ToArray());

                return new BadRequestObjectResult(new Application.Common.ApiErrorResponse
                {
                    Code = "validation_error",
                    Message = "Nieprawidłowe dane wejściowe.",
                    Errors = errors,
                    TraceId = context.HttpContext.TraceIdentifier
                });
            };
        });

        return services;
    }

    private static void ConfigureScraperHttpClient(HttpClient client)
    {
        client.Timeout = TimeSpan.FromSeconds(25);
        client.DefaultRequestHeaders.UserAgent.ParseAdd("Mozilla/5.0 ...");
        client.DefaultRequestHeaders.Accept.ParseAdd("text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8");
        client.DefaultRequestHeaders.AcceptLanguage.ParseAdd("pl-PL,pl;q=0.9,en-US;q=0.7,en;q=0.6");
    }
}