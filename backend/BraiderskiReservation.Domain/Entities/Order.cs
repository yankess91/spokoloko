namespace BraiderskiReservation.Domain.Entities;

public sealed class Order
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Number { get; set; } = string.Empty;
    public Guid ClientId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public OrderStatus Status { get; set; } = OrderStatus.New;
    public OrderDeliveryMethod DeliveryMethod { get; set; } = OrderDeliveryMethod.Pickup;
    public DateOnly? DueDate { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public decimal TotalAmount { get; set; }
    public List<OrderItem> Items { get; set; } = new();
    public ClientProfile? ClientProfile { get; set; }
}
