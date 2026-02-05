using BraiderskiReservation.Api.Application.DTOs;
using HtmlAgilityPack;
using System.Globalization;
using System.Net;
using System.Text.RegularExpressions;

namespace BraiderskiReservation.Api.Application.Scrapers.Magfactory;


public class MagfactoryListingScraper(HttpClient http) : IMagfactoryListingScraper
{
    public async Task<List<ProductDto>> ScrapeProductsAsync(
        string categoryUrl,
        int maxPagesSafety = 200,
        CancellationToken ct = default)
    {
        if (!Uri.TryCreate(categoryUrl, UriKind.Absolute, out var baseUri))
            throw new ArgumentException("Nieprawidłowy URL kategorii.", nameof(categoryUrl));

        var results = new List<ProductDto>();
        var seen = new HashSet<string>(StringComparer.OrdinalIgnoreCase);

        for (int page = 1; page <= maxPagesSafety; page++)
        {
            ct.ThrowIfCancellationRequested();

            var pageUri = WithPage(baseUri, page);
            var html = await GetHtmlAsync(pageUri, ct);

            var doc = new HtmlDocument();
            doc.LoadHtml(html);

            var productsOnPage = ListingParser.ExtractProducts(doc, pageUri).ToList();

            if (productsOnPage.Count == 0)
                break;

            foreach (var p in productsOnPage)
            {
                if (seen.Add(p.productUrl))
                    results.Add(p);
            }
        }

        return results;
    }

    private async Task<string> GetHtmlAsync(Uri url, CancellationToken ct)
    {
        using var req = new HttpRequestMessage(HttpMethod.Get, url);
        using var resp = await http.SendAsync(req, HttpCompletionOption.ResponseHeadersRead, ct);
        resp.EnsureSuccessStatusCode();
        return await resp.Content.ReadAsStringAsync(ct);
    }

    private static class ListingParser
    {
        public static IEnumerable<ProductDto> ExtractProducts(HtmlDocument doc, Uri baseUri)
        {
            var items =
                doc.DocumentNode.SelectNodes("//article[contains(@class,'product-miniature')]")
                ?? doc.DocumentNode.SelectNodes("//*[contains(@class,'product-miniature')]")
                ?? doc.DocumentNode.SelectNodes("//*[contains(@class,'product-container')]");

            if (items is null) yield break;

            foreach (var item in items)
            {
                var a =
                    item.SelectSingleNode(".//h2[contains(@class,'product-title')]//a[@href]")
                    ?? item.SelectSingleNode(".//a[contains(@class,'product-title') and @href]")
                    ?? item.SelectSingleNode(".//a[contains(@class,'product-thumbnail') and @href]")
                    ?? item.SelectSingleNode(".//a[@href]");

                var href = a?.GetAttributeValue("href", null);
                if (string.IsNullOrWhiteSpace(href)) continue;

                var productUrl = MakeAbsolute(baseUri, WebUtility.HtmlDecode(href)).ToString();

                var name =
                    Clean(a!.InnerText)
                    ?? Clean(a.GetAttributeValue("title", null))
                    ?? Clean(a.GetAttributeValue("aria-label", null));

                if (string.IsNullOrWhiteSpace(name)) continue;

                var priceRaw =
                    item.SelectSingleNode(".//*[contains(@class,'product-price-and-shipping')]//*[contains(@class,'price')]")?.InnerText
                    ?? item.SelectSingleNode(".//span[contains(@class,'price')]")?.InnerText
                    ?? item.SelectSingleNode(".//*[contains(@class,'price')]")?.InnerText;

                var price = NormalizeToDecimal(Clean(priceRaw)) ?? 0m;

                yield return new ProductDto(
                    name: name,
                    price: price,
                    imgUrl: null,
                    productUrl: productUrl
                );
            }
        }
    }
    private static decimal? NormalizeToDecimal(string? s)
    {
        if (string.IsNullOrWhiteSpace(s)) return null;

        var t = s.Replace("\u00A0", " ").Trim();
        var m = Regex.Match(t, @"\d+[.,]\d{2}");
        if (!m.Success) return null;

        var normalized = m.Value.Replace(',', '.');
        return decimal.TryParse(normalized, NumberStyles.Number, CultureInfo.InvariantCulture, out var price)
            ? price
            : null;
    }

    private static string? Clean(string? s)
    {
        if (string.IsNullOrWhiteSpace(s)) return null;
        s = WebUtility.HtmlDecode(s);
        s = Regex.Replace(s, @"\s+", " ").Trim();
        return s.Length == 0 ? null : s;
    }

    private static Uri MakeAbsolute(Uri baseUri, string urlOrPath)
           => Uri.TryCreate(urlOrPath, UriKind.Absolute, out var abs) ? abs : new Uri(baseUri, urlOrPath);

    private static Uri WithPage(Uri baseUri, int page)
    {
        var ub = new UriBuilder(baseUri);
        var query = Parse(ub.Query);
        query["page"] = page.ToString(CultureInfo.InvariantCulture);
        ub.Query = Build(query);
        return ub.Uri;
    }

    private static Dictionary<string, string> Parse(string query)
    {
        var dict = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);
        if (string.IsNullOrWhiteSpace(query)) return dict;

        var q = query.TrimStart('?');
        foreach (var part in q.Split('&', StringSplitOptions.RemoveEmptyEntries))
        {
            var kv = part.Split('=', 2);
            var key = Uri.UnescapeDataString(kv[0]);
            var val = kv.Length > 1 ? Uri.UnescapeDataString(kv[1]) : "";
            if (!string.IsNullOrWhiteSpace(key))
                dict[key] = val;
        }
        return dict;
    }

    private static string Build(Dictionary<string, string> query)
        => string.Join("&", query.Select(kv =>
            $"{Uri.EscapeDataString(kv.Key)}={Uri.EscapeDataString(kv.Value)}"));
}
