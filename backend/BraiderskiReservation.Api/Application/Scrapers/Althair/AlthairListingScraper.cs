using BraiderskiReservation.Api.Application.DTOs;
using HtmlAgilityPack;
using System.Globalization;
using System.Text.RegularExpressions;

namespace BraiderskiReservation.Api.Application.Scrapers.AltHair;

public sealed class AlthairListingScraper(HttpClient httpClient) : IListingScraper
{
    public string Name => "Althair";

    public async Task<List<ProductDto>> ScrapeProductsAsync(
        string categoryUrl,
        int maxPages,
        CancellationToken ct = default)
    {
        var results = new List<ProductDto>();
        var visitedUrls = new HashSet<string>(StringComparer.OrdinalIgnoreCase);

        for (var page = 1; page <= 10; page++)
        {
            ct.ThrowIfCancellationRequested();

            var pageUrl = page == 1
                ? categoryUrl.TrimEnd('/')
                : $"{categoryUrl.TrimEnd('/')}/page/{page}/";

            var html = await GetHtmlAsync(pageUrl, ct);
            if (string.IsNullOrWhiteSpace(html))
                break;

            var doc = new HtmlDocument();
            doc.LoadHtml(html);

            var productNodes = doc.DocumentNode.SelectNodes("//li[contains(@class,'product')]");
            if (productNodes is null || productNodes.Count == 0)
                break;

            var addedOnPage = 0;

            foreach (var node in productNodes)
            {
                ct.ThrowIfCancellationRequested();

                var productLink = GetRealProductLink(node);
                if (productLink is null)
                    continue;

                var productUrl = NormalizeUrl(productLink.GetAttributeValue("href", string.Empty));
                if (string.IsNullOrWhiteSpace(productUrl))
                    continue;

                if (!visitedUrls.Add(productUrl))
                    continue;

                var name = NormalizeWhitespace(HtmlEntity.DeEntitize(productLink.InnerText));
                if (string.IsNullOrWhiteSpace(name))
                    continue;

                var price = ParsePrice(node);
                var imgUrl = GetImageUrl(node, pageUrl);

                results.Add(new ProductDto(
                    Name: name,
                    Price: price,
                    ImgUrl: imgUrl,
                    ProductUrl: productUrl));

                addedOnPage++;
            }

            if (addedOnPage == 0)
                break;
        }

        return results;
    }

    private static HtmlNode? GetRealProductLink(HtmlNode productNode)
    {
        var links = productNode.SelectNodes(".//a[@href]");
        if (links is null || links.Count == 0)
            return null;

        return links
            .Where(a =>
            {
                var href = a.GetAttributeValue("href", string.Empty);
                var text = NormalizeWhitespace(HtmlEntity.DeEntitize(a.InnerText));

                return href.Contains("/product/", StringComparison.OrdinalIgnoreCase)
                    && !string.IsNullOrWhiteSpace(text)
                    && !text.Equals("Dodaj do koszyka", StringComparison.OrdinalIgnoreCase);
            })
            .OrderByDescending(a => NormalizeWhitespace(HtmlEntity.DeEntitize(a.InnerText)).Length)
            .FirstOrDefault();
    }

    private static decimal ParsePrice(HtmlNode productNode)
    {
        var priceText = productNode
            .SelectSingleNode(".//*[contains(@class,'price')]")
            ?.InnerText;

        if (string.IsNullOrWhiteSpace(priceText))
            return 0m;

        var cleaned = HtmlEntity.DeEntitize(priceText)
            .Replace("zł", "", StringComparison.OrdinalIgnoreCase)
            .Replace("\u00A0", " ")
            .Trim();

        var matches = Regex.Matches(cleaned, @"\d+(?:[.,]\d{1,2})?");
        if (matches.Count == 0)
            return 0m;

        var lastNumber = matches[^1].Value.Replace(",", ".");

        return decimal.TryParse(
            lastNumber,
            NumberStyles.Any,
            CultureInfo.InvariantCulture,
            out var value)
            ? value
            : 0m;
    }

    private static string? GetImageUrl(HtmlNode productNode, string pageUrl)
    {
        var imgNode =
            productNode.SelectSingleNode(".//img[@data-lazy-src]") ??
            productNode.SelectSingleNode(".//img[@data-src]") ??
            productNode.SelectSingleNode(".//img[@src]");

        if (imgNode is null)
            return null;

        var rawUrl =
            imgNode.GetAttributeValue("data-lazy-src", null) ??
            imgNode.GetAttributeValue("data-src", null) ??
            imgNode.GetAttributeValue("src", null);

        if (string.IsNullOrWhiteSpace(rawUrl))
            return null;

        if (Uri.TryCreate(rawUrl, UriKind.Absolute, out var absolute))
            return absolute.ToString();

        if (Uri.TryCreate(new Uri(pageUrl), rawUrl, out var combined))
            return combined.ToString();

        return rawUrl;
    }

    private async Task<string> GetHtmlAsync(string url, CancellationToken ct)
    {
        using var request = new HttpRequestMessage(HttpMethod.Get, url);
        request.Headers.UserAgent.ParseAdd(
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
            "(KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36");

        using var response = await httpClient.SendAsync(
            request,
            HttpCompletionOption.ResponseHeadersRead,
            ct);

        if (!response.IsSuccessStatusCode)
            return string.Empty;

        return await response.Content.ReadAsStringAsync(ct);
    }

    private static string NormalizeUrl(string url)
    {
        if (string.IsNullOrWhiteSpace(url))
            return string.Empty;

        return url.Split('?')[0].TrimEnd('/');
    }

    private static string NormalizeWhitespace(string value)
    {
        if (string.IsNullOrWhiteSpace(value))
            return string.Empty;

        return Regex.Replace(value, @"\s+", " ").Trim();
    }
}