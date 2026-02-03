using BraiderskiReservation.Api.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace BraiderskiReservation.Api.Infrastructure.Data;

public sealed class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<ClientProfile> Clients => Set<ClientProfile>();
    public DbSet<UsedProduct> UsedProducts => Set<UsedProduct>();
    public DbSet<Product> Products => Set<Product>();
    public DbSet<ServiceItem> Services => Set<ServiceItem>();
    public DbSet<Appointment> Appointments => Set<Appointment>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<ClientProfile>(entity =>
        {
            entity.ToTable("clients");
            entity.HasKey(client => client.Id);
            entity.Property(client => client.FullName).HasColumnName("full_name");
            entity.Property(client => client.Email).HasColumnName("email");
            entity.Property(client => client.PhoneNumber).HasColumnName("phone_number");
            entity.HasMany(client => client.UsedProducts)
                .WithOne(usedProduct => usedProduct.ClientProfile)
                .HasForeignKey(usedProduct => usedProduct.ClientId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<UsedProduct>(entity =>
        {
            entity.ToTable("used_products");
            entity.HasKey(product => product.Id);
            entity.Property(product => product.ClientId).HasColumnName("client_id");
            entity.Property(product => product.Name).HasColumnName("name");
            entity.Property(product => product.Notes).HasColumnName("notes");
            entity.Property(product => product.UsedAt).HasColumnName("used_at");
        });

        modelBuilder.Entity<Product>(entity =>
        {
            entity.ToTable("products");
            entity.HasKey(product => product.Id);
            entity.Property(product => product.Name).HasColumnName("name");
            entity.Property(product => product.Brand).HasColumnName("brand");
            entity.Property(product => product.Notes).HasColumnName("notes");
        });

        modelBuilder.Entity<ServiceItem>(entity =>
        {
            entity.ToTable("services");
            entity.HasKey(service => service.Id);
            entity.Property(service => service.Name).HasColumnName("name");
            entity.Property(service => service.Description).HasColumnName("description");
            entity.Property(service => service.Duration).HasColumnName("duration");
            entity.HasMany(service => service.Appointments)
                .WithOne(appointment => appointment.ServiceItem)
                .HasForeignKey(appointment => appointment.ServiceId);
        });

        modelBuilder.Entity<Appointment>(entity =>
        {
            entity.ToTable("appointments");
            entity.HasKey(appointment => appointment.Id);
            entity.Property(appointment => appointment.ClientId).HasColumnName("client_id");
            entity.Property(appointment => appointment.ServiceId).HasColumnName("service_id");
            entity.Property(appointment => appointment.StartAt).HasColumnName("start_at");
            entity.Property(appointment => appointment.EndAt).HasColumnName("end_at");
            entity.Property(appointment => appointment.Notes).HasColumnName("notes");
            entity.HasOne(appointment => appointment.ClientProfile)
                .WithMany()
                .HasForeignKey(appointment => appointment.ClientId);
        });
    }
}
