using System.Globalization;

namespace BraiderskiReservation.Api.Configuration;

internal static class EnvFileConfiguration
{
    public static IDictionary<string, string?> Load(string rootDirectory)
    {
        var envPath = Path.Combine(rootDirectory, ".env");
        var values = new Dictionary<string, string?>(StringComparer.OrdinalIgnoreCase);

        if (!File.Exists(envPath))
        {
            return values;
        }

        foreach (var rawLine in File.ReadAllLines(envPath))
        {
            var line = rawLine.Trim();

            if (string.IsNullOrWhiteSpace(line) || line.StartsWith('#'))
            {
                continue;
            }

            var separatorIndex = line.IndexOf('=');
            if (separatorIndex <= 0)
            {
                continue;
            }

            var key = line[..separatorIndex].Trim();
            if (string.IsNullOrWhiteSpace(key))
            {
                continue;
            }

            var value = line[(separatorIndex + 1)..].Trim();
            values[key] = Unquote(value);
        }

        ApplyLegacyMappings(values);
        return values;
    }

    private static void ApplyLegacyMappings(IDictionary<string, string?> values)
    {
        if (!values.ContainsKey("ConnectionStrings:Default") &&
            values.TryGetValue("POSTGRES_DB", out var database) &&
            values.TryGetValue("POSTGRES_USER", out var username) &&
            values.TryGetValue("POSTGRES_PASSWORD", out var password))
        {
            var host = values.TryGetValue("POSTGRES_HOST", out var configuredHost) && !string.IsNullOrWhiteSpace(configuredHost)
                ? configuredHost
                : "localhost";

            var port = values.TryGetValue("POSTGRES_PORT", out var configuredPort) && !string.IsNullOrWhiteSpace(configuredPort)
                ? configuredPort
                : "5432";

            values["ConnectionStrings:Default"] = string.Format(
                CultureInfo.InvariantCulture,
                "Host={0};Port={1};Database={2};Username={3};Password={4}",
                host,
                port,
                database,
                username,
                password);
        }
    }

    private static string Unquote(string value)
    {
        if (value.Length >= 2)
        {
            var first = value[0];
            var last = value[^1];
            if ((first == '"' && last == '"') || (first == '\'' && last == '\''))
            {
                return value[1..^1];
            }
        }

        return value;
    }
}
