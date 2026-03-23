using BraiderskiReservation.Api.Application.Interfaces;
using BraiderskiReservation.Api.Application.Scrapers;
using BraiderskiReservation.Api.Application.Scrapers.AltHair;
using BraiderskiReservation.Api.Application.Scrapers.Magfactory;
using BraiderskiReservation.Api.Application.Services;
using BraiderskiReservation.Api.Application.Settings;
using BraiderskiReservation.Api.Configuration;
using BraiderskiReservation.Domain.Interfaces;
using BraiderskiReservation.Infrastructure.Data;
using BraiderskiReservation.Infrastructure.Options;
using BraiderskiReservation.Infrastructure.Repositories;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

var projectRoot = Path.GetFullPath(Path.Combine(builder.Environment.ContentRootPath, "..", ".."));
var envConfiguration = EnvFileConfiguration.Load(projectRoot);

if (envConfiguration.Count > 0)
{
    builder.Configuration.AddInMemoryCollection(envConfiguration);
}

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
var allowedCorsOrigins = builder.Configuration
    .GetSection("Cors:AllowedOrigins")
    .Get<string[]>()?
    .Select(origin => origin.TrimEnd('/'))
    .Where(origin => !string.IsNullOrWhiteSpace(origin))
    .Distinct(StringComparer.OrdinalIgnoreCase)
    .ToArray() ?? Array.Empty<string>();

builder.Services.AddCors(options =>
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
builder.Services.Configure<ScrapingOptions>(
    builder.Configuration.GetSection("Scraping"));
builder.Services.Configure<JwtSettings>(builder.Configuration.GetSection("Jwt"));
var jwtSettings = builder.Configuration.GetSection("Jwt").Get<JwtSettings>();
var signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings?.SigningKey ?? string.Empty));

builder.Services.AddAuthentication(options =>
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

builder.Services.AddAuthorization();

builder.Services.AddDbContext<AppDbContext>(options =>
{
    var connectionString = builder.Configuration.GetConnectionString("Default");
    options.UseNpgsql(connectionString);
});

builder.Services.AddScoped<IClientRepository, ClientRepository>();
builder.Services.AddScoped<IProductRepository, ProductRepository>();
builder.Services.AddScoped<IServiceRepository, ServiceRepository>();
builder.Services.AddScoped<IAppointmentRepository, AppointmentRepository>();
builder.Services.AddScoped<IUserRepository, UserRepository>();

builder.Services.AddTransient<IClientService, ClientService>();
builder.Services.AddTransient<IProductCatalogService, ProductCatalogService>();
builder.Services.AddTransient<IServiceCatalogService, ServiceCatalogService>();
builder.Services.AddTransient<IAppointmentService, AppointmentService>();
builder.Services.AddTransient<IAuthService, AuthService>();
builder.Services.AddTransient<IScrapingImportService, ScrapingImportService>();
builder.Services.AddSingleton<IScraperResolver, ScraperResolver>();

builder.Services.AddHttpClient<IListingScraper, MagfactoryListingScraper>(c =>
{
    c.Timeout = TimeSpan.FromSeconds(25);
    c.DefaultRequestHeaders.UserAgent.ParseAdd("Mozilla/5.0 ...");
    c.DefaultRequestHeaders.Accept.ParseAdd("text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8");
    c.DefaultRequestHeaders.AcceptLanguage.ParseAdd("pl-PL,pl;q=0.9,en-US;q=0.7,en;q=0.6");
});

builder.Services.AddHttpClient<IMagfactoryImageUrlProvider, MagfactoryImageUrlProvider>(c =>
{
    c.Timeout = TimeSpan.FromSeconds(25);
    c.DefaultRequestHeaders.UserAgent.ParseAdd("Mozilla/5.0 ...");
    c.DefaultRequestHeaders.Accept.ParseAdd("text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8");
    c.DefaultRequestHeaders.AcceptLanguage.ParseAdd("pl-PL,pl;q=0.9,en-US;q=0.7,en;q=0.6");
});

builder.Services.AddHttpClient<IListingScraper, AlthairListingScraper>(c =>
{
    c.Timeout = TimeSpan.FromSeconds(25);
    c.DefaultRequestHeaders.UserAgent.ParseAdd("Mozilla/5.0 ...");
    c.DefaultRequestHeaders.Accept.ParseAdd("text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8");
    c.DefaultRequestHeaders.AcceptLanguage.ParseAdd("pl-PL,pl;q=0.9,en-US;q=0.7,en;q=0.6");
});

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    dbContext.Database.EnsureCreated();
}

app.UseSwagger();
app.UseSwaggerUI();
app.UseCors("Frontend");
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
