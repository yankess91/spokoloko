using BraiderskiReservation.Domain.Entities;
using BraiderskiReservation.Domain.Interfaces;
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
        BuildProductQuery()
            .OrderBy(product => product.Name)
            .ThenBy(product => product.Brand)
            .ToListAsync(cancellationToken);

    public Task<List<Product>> GetByBrandAsync(string brandName, CancellationToken cancellationToken) =>
        _context.Products
            .Where(product => product.Brand == brandName)
            .OrderBy(product => product.Name)
            .ThenBy(product => product.Brand)
            .ToListAsync(cancellationToken);

    public Task<List<Product>> SearchAsync(string? searchTerm, CancellationToken cancellationToken)
    {
        var query = BuildProductQuery();
        var normalizedSearch = NormalizeSearch(searchTerm);

        if (normalizedSearch is not null)
        {
            var searchPattern = ToContainsPattern(normalizedSearch);
            query = query.Where(product =>
                EF.Functions.ILike(product.Name, searchPattern) ||
                EF.Functions.ILike(product.Brand, searchPattern) ||
                EF.Functions.ILike(product.Notes, searchPattern));
        }

        return query
            .OrderBy(product => product.Name)
            .ThenBy(product => product.Brand)
            .ToListAsync(cancellationToken);
    }

    public Task<Product?> GetByIdAsync(Guid id, CancellationToken cancellationToken) =>
        BuildProductQuery()
            .FirstOrDefaultAsync(product => product.Id == id, cancellationToken);

    public Task<Product?> GetByIdForUpdateAsync(Guid id, CancellationToken cancellationToken) =>
        _context.Products.FirstOrDefaultAsync(product => product.Id == id, cancellationToken);

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

    private static string? NormalizeSearch(string? searchTerm) =>
        string.IsNullOrWhiteSpace(searchTerm) ? null : searchTerm.Trim();

    private static string ToContainsPattern(string searchTerm) => $"%{searchTerm.Replace("%", "\\%").Replace("_", "\\_")}%";
}
