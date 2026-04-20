using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace BraiderskiReservation.Infrastructure.Data;

public sealed class AppDbContextFactory : IDesignTimeDbContextFactory<AppDbContext>
{
    public AppDbContext CreateDbContext(string[] args)
    {
        var configuration = BuildConfiguration();
        var connectionString = ResolveConnectionString(configuration);

        var optionsBuilder = new DbContextOptionsBuilder<AppDbContext>();
        optionsBuilder.UseNpgsql(connectionString, npgsql =>
            npgsql.MigrationsAssembly(typeof(AppDbContext).Assembly.FullName));

        return new AppDbContext(optionsBuilder.Options);
    }

    private static IConfiguration BuildConfiguration()
    {
        var builder = new ConfigurationBuilder();

        var apiProjectDirectory = FindApiProjectDirectory();
        if (apiProjectDirectory is not null)
        {
            builder.SetBasePath(apiProjectDirectory)
                .AddJsonFile("appsettings.json", optional: true)
                .AddJsonFile("appsettings.Development.json", optional: true);
        }

        builder.AddEnvironmentVariables();

        return builder.Build();
    }

    private static string ResolveConnectionString(IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("Default")
                               ?? configuration["ConnectionStrings:Default"]
                               ?? configuration["ConnectionStrings__Default"];

        if (!string.IsNullOrWhiteSpace(connectionString))
        {
            return connectionString;
        }

        throw new InvalidOperationException(
            "Could not resolve connection string 'Default'. Set ConnectionStrings__Default or configure appsettings.json in BraiderskiReservation.Api.");
    }

    private static string? FindApiProjectDirectory()
    {
        var searchRoots = new[]
        {
            Directory.GetCurrentDirectory(),
            AppContext.BaseDirectory
        };

        foreach (var searchRoot in searchRoots)
        {
            var directory = new DirectoryInfo(searchRoot);

            while (directory is not null)
            {
                var apiPath = Path.Combine(directory.FullName, "BraiderskiReservation.Api");
                var appSettingsPath = Path.Combine(apiPath, "appsettings.json");
                if (File.Exists(appSettingsPath))
                {
                    return apiPath;
                }

                directory = directory.Parent;
            }
        }

        return null;
    }
}
