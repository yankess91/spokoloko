using BraiderskiReservation.Api.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddSingleton<IClientService, InMemoryClientService>();
builder.Services.AddSingleton<IProductCatalogService, InMemoryProductCatalogService>();
builder.Services.AddSingleton<IServiceCatalogService, InMemoryServiceCatalogService>();
builder.Services.AddSingleton<IAppointmentService, InMemoryAppointmentService>();

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();

app.MapControllers();

app.Run();
