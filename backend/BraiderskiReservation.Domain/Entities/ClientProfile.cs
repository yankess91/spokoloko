namespace BraiderskiReservation.Domain.Entities;

public sealed class ClientProfile
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public string Notes { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;
    public List<UsedProduct> UsedProducts { get; set; } = new();
    public List<Appointment> Appointments { get; set; } = new();
}

public sealed class UsedProduct
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid ClientId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Notes { get; set; } = string.Empty;
    public DateTime UsedAt { get; set; } = DateTime.UtcNow;
    public ClientProfile? ClientProfile { get; set; }
}
