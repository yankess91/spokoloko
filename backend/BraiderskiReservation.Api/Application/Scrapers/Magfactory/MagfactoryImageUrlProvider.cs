using System.Net;
using HtmlAgilityPack;

namespace BraiderskiReservation.Api.Application.Scrapers.Magfactory;

public sealed class MagfactoryImageUrlProvider(HttpClient http) : IMagfactoryImageUrlProvider
{
    public async Task<string?> GetMainImageUrlAsync(string productUrl, CancellationToken ct = default)
    {
        if (!Uri.TryCreate(productUrl, UriKind.Absolute, out var productUri))
            throw new ArgumentException("Nieprawidłowy URL produktu.", nameof(productUrl));

        using var req = new HttpRequestMessage(HttpMethod.Get, productUri);
        using var resp = await http.SendAsync(req, HttpCompletionOption.ResponseHeadersRead, ct);
        resp.EnsureSuccessStatusCode();

        var html = await resp.Content.ReadAsStringAsync(ct);

        var doc = new HtmlDocument();
        doc.LoadHtml(html);

        var ogImg = doc.DocumentNode
            .SelectSingleNode("//meta[translate(@property,'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz')='og:image']")
            ?.GetAttributeValue("content", null);

        if (!string.IsNullOrWhiteSpace(ogImg))
            return MakeAbsolute(productUri, WebUtility.HtmlDecode(ogImg)).ToString();

        var imgNode =
            doc.DocumentNode.SelectSingleNode("//img[contains(concat(' ', normalize-space(@class), ' '), ' js-qv-product-cover ')]")
            ?? doc.DocumentNode.SelectSingleNode("//div[contains(concat(' ', normalize-space(@class), ' '), ' product-cover ')]//img")
            ?? doc.DocumentNode.SelectSingleNode("//img[@id='zoom_product']");

        if (imgNode is null) return null;

        var url =
            imgNode.GetAttributeValue("data-large-src", null)
            ?? imgNode.GetAttributeValue("data-full-size-image-url", null)
            ?? imgNode.GetAttributeValue("src", null);

        if (string.IsNullOrWhiteSpace(url)) return null;

        return MakeAbsolute(productUri, WebUtility.HtmlDecode(url)).ToString();
    }

    private static Uri MakeAbsolute(Uri baseUri, string urlOrPath)
        => Uri.TryCreate(urlOrPath, UriKind.Absolute, out var abs) ? abs : new Uri(baseUri, urlOrPath);
}
