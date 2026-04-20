namespace BraiderskiReservation.Domain.Entities;

public sealed class OrderItem
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid OrderId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Notes { get; set; } = string.Empty;
    public decimal Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public decimal LineTotal { get; set; }
    public Order? Order { get; set; }
}
