using BraiderskiReservation.Domain.Interfaces;
using BraiderskiReservation.Domain.Entities;
using BraiderskiReservation.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace BraiderskiReservation.Infrastructure.Repositories;

public sealed class ProductRepository : IProductRepository
{
    private readonly AppDbContext _context;

    public ProductRepository(AppDbContext context)
    {
        _context = context;
    }

    public Task<List<Product>> GetAllAsync(CancellationToken cancellationToken) =>
        BuildProductQuery().ToListAsync(cancellationToken);

    public Task<List<Product>> SearchAsync(string? searchTerm, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(searchTerm))
        {
            return GetAllAsync(cancellationToken);
        }

        var normalized = searchTerm.Trim().ToLowerInvariant();

        return BuildProductQuery()
            .Where(product =>
                product.Name.ToLower().Contains(normalized) ||
                product.Brand.ToLower().Contains(normalized))
            .ToListAsync(cancellationToken);
    }

    public Task<Product?> GetByIdAsync(Guid id, CancellationToken cancellationToken) =>
        BuildProductQuery()
            .FirstOrDefaultAsync(product => product.Id == id, cancellationToken);

    public async Task AddAsync(Product product, CancellationToken cancellationToken) =>
        await _context.Products.AddAsync(product, cancellationToken);

    public async Task AddRangeAsync(IEnumerable<Product> products, CancellationToken cancellationToken) =>
      await _context.Products.AddRangeAsync(products, cancellationToken);

    public async Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken)
    {
        var product = await _context.Products.FirstOrDefaultAsync(item => item.Id == id, cancellationToken);
        if (product is null)
        {
            return false;
        }

        _context.Products.Remove(product);
        return true;
    }

    public Task SaveChangesAsync(CancellationToken cancellationToken) =>
        _context.SaveChangesAsync(cancellationToken);

    private IQueryable<Product> BuildProductQuery() =>
        _context.Products.AsNoTracking();
}
