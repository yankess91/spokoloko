using BraiderskiReservation.Api.Configuration;

var builder = WebApplication.CreateBuilder(args);

builder.AddEnvironmentConfiguration();
builder.Services
    .AddApplicationServices()
    .AddInfrastructure(builder.Configuration)
    .AddJwtAuthentication(builder.Configuration)
    .AddConfiguredCors(builder.Configuration)
    .AddApiBehavior();

var app = builder.Build();

await app.InitializeDatabaseAsync();

app.UseGlobalExceptionHandling();
app.UseSwaggerIfDevelopment();
app.UseStatusCodeProblemDetails();
app.UseConfiguredCors();
app.UseStaticFiles();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();