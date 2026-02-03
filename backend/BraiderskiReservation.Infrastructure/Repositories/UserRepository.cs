using BraiderskiReservation.Domain.Entities;
using BraiderskiReservation.Domain.Interfaces;
using BraiderskiReservation.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace BraiderskiReservation.Infrastructure.Repositories;

public sealed class UserRepository : IUserRepository
{
    private readonly AppDbContext _context;

    public UserRepository(AppDbContext context)
    {
        _context = context;
    }

    public Task<UserAccount?> GetByEmailAsync(string email, CancellationToken cancellationToken) =>
        _context.Users.AsNoTracking().FirstOrDefaultAsync(user => user.Email == email, cancellationToken);

    public async Task AddAsync(UserAccount userAccount, CancellationToken cancellationToken) =>
        await _context.Users.AddAsync(userAccount, cancellationToken);

    public Task SaveChangesAsync(CancellationToken cancellationToken) =>
        _context.SaveChangesAsync(cancellationToken);
}
