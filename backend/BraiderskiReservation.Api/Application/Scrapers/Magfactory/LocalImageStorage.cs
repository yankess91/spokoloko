using System.Security.Cryptography;

namespace BraiderskiReservation.Api.Application.Scrapers.Magfactory;

public sealed class LocalImageStorage(HttpClient httpClient, IWebHostEnvironment environment, ILogger<LocalImageStorage> logger) : ILocalImageStorage
{
    private const string RootFolder = "scraped-images";

    public async Task<string?> SaveFromUrlIfNeededAsync(string? imageUrl, string sourceName, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(imageUrl))
            return null;

        if (!Uri.TryCreate(imageUrl, UriKind.Absolute, out var imageUri))
            return null;

        byte[] imageBytes;
        string extension;

        try
        {
            using var response = await httpClient.GetAsync(imageUri, HttpCompletionOption.ResponseHeadersRead, ct);
            response.EnsureSuccessStatusCode();

            imageBytes = await response.Content.ReadAsByteArrayAsync(ct);
            if (imageBytes.Length == 0)
                return null;

            extension = ResolveExtension(response.Content.Headers.ContentType?.MediaType, imageUri);
        }
        catch (Exception ex)
        {
            logger.LogWarning(ex, "Nie udało się pobrać zdjęcia {ImageUrl}.", imageUrl);
            return null;
        }

        var hash = Convert.ToHexString(SHA256.HashData(imageBytes)).ToLowerInvariant();

        var webRootPath = environment.WebRootPath;
        if (string.IsNullOrWhiteSpace(webRootPath))
        {
            webRootPath = Path.Combine(environment.ContentRootPath, "wwwroot");
        }

        var sourceFolder = sourceName.Trim().ToLowerInvariant();
        var destinationDirectory = Path.Combine(webRootPath, RootFolder, sourceFolder);
        Directory.CreateDirectory(destinationDirectory);

        var existingFile = Directory
            .EnumerateFiles(destinationDirectory, $"{hash}.*", SearchOption.TopDirectoryOnly)
            .Select(Path.GetFileName)
            .FirstOrDefault();

        if (existingFile is not null)
            return $"/{RootFolder}/{sourceFolder}/{existingFile}";

        var fileName = $"{hash}{extension}";
        var filePath = Path.Combine(destinationDirectory, fileName);

        await File.WriteAllBytesAsync(filePath, imageBytes, ct);

        return $"/{RootFolder}/{sourceFolder}/{fileName}";
    }

    private static string ResolveExtension(string? mediaType, Uri imageUri)
    {
        return mediaType?.ToLowerInvariant() switch
        {
            "image/jpeg" => ".jpg",
            "image/png" => ".png",
            "image/webp" => ".webp",
            "image/gif" => ".gif",
            "image/svg+xml" => ".svg",
            _ => ResolveExtensionFromUri(imageUri)
        };
    }

    private static string ResolveExtensionFromUri(Uri imageUri)
    {
        var extension = Path.GetExtension(imageUri.AbsolutePath);
        if (string.IsNullOrWhiteSpace(extension))
            return ".jpg";

        return extension.Length > 8 ? ".jpg" : extension.ToLowerInvariant();
    }
}
