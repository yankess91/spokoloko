namespace BraiderskiReservation.Api.Models;

public sealed class ClientProfile
{
    public Guid Id { get; init; } = Guid.NewGuid();
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public List<UsedProduct> UsedProducts { get; } = new();
}

public sealed class UsedProduct
{
    public Guid Id { get; init; } = Guid.NewGuid();
    public string Name { get; set; } = string.Empty;
    public string Notes { get; set; } = string.Empty;
    public DateTime UsedAt { get; set; } = DateTime.UtcNow;
}
