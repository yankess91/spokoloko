using BraiderskiReservation.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace BraiderskiReservation.Infrastructure.Data;

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
    public DbSet<ServiceProduct> ServiceProducts => Set<ServiceProduct>();
    public DbSet<AppointmentProduct> AppointmentProducts => Set<AppointmentProduct>();
    public DbSet<UserAccount> Users => Set<UserAccount>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<ClientProfile>(entity =>
        {
            entity.ToTable("clients");
            entity.HasKey(client => client.Id);
            entity.Property(client => client.Id).HasColumnName("id");
            entity.Property(client => client.FullName).HasColumnName("full_name");
            entity.Property(client => client.Email).HasColumnName("email");
            entity.Property(client => client.PhoneNumber).HasColumnName("phone_number");
            entity.Property(client => client.Notes).HasColumnName("notes");
            entity.HasMany(client => client.UsedProducts)
                .WithOne(usedProduct => usedProduct.ClientProfile)
                .HasForeignKey(usedProduct => usedProduct.ClientId)
                .OnDelete(DeleteBehavior.Cascade);
            entity.HasMany(client => client.Appointments)
                .WithOne(appointment => appointment.ClientProfile)
                .HasForeignKey(appointment => appointment.ClientId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<UsedProduct>(entity =>
        {
            entity.ToTable("used_products");
            entity.HasKey(product => product.Id);
            entity.Property(product => product.Id).HasColumnName("id");
            entity.Property(product => product.ClientId).HasColumnName("client_id");
            entity.Property(product => product.Name).HasColumnName("name");
            entity.Property(product => product.Notes).HasColumnName("notes");
            entity.Property(product => product.UsedAt).HasColumnName("used_at");
        });

        modelBuilder.Entity<Product>(entity =>
        {
            entity.ToTable("products");
            entity.HasKey(product => product.Id);
            entity.Property(product => product.Id).HasColumnName("id");
            entity.Property(product => product.Name).HasColumnName("name");
            entity.Property(product => product.Brand).HasColumnName("brand");
            entity.Property(product => product.Notes).HasColumnName("notes");
            entity.Property(product => product.ImageUrl).HasColumnName("image_url");
        });

        modelBuilder.Entity<ServiceItem>(entity =>
        {
            entity.ToTable("services");
            entity.HasKey(service => service.Id);
            entity.Property(service => service.Id).HasColumnName("id");
            entity.Property(service => service.Name).HasColumnName("name");
            entity.Property(service => service.Description).HasColumnName("description");
            entity.Property(service => service.Duration).HasColumnName("duration");
            entity.Property(service => service.Price).HasColumnName("price");
            entity.HasMany(service => service.Appointments)
                .WithOne(appointment => appointment.ServiceItem)
                .HasForeignKey(appointment => appointment.ServiceId);
            entity.HasMany(service => service.ServiceProducts)
                .WithOne(serviceProduct => serviceProduct.ServiceItem)
                .HasForeignKey(serviceProduct => serviceProduct.ServiceId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Appointment>(entity =>
        {
            entity.ToTable("appointments");
            entity.HasKey(appointment => appointment.Id);
            entity.Property(appointment => appointment.Id).HasColumnName("id");
            entity.Property(appointment => appointment.ClientId).HasColumnName("client_id");
            entity.Property(appointment => appointment.ServiceId).HasColumnName("service_id");
            entity.Property(appointment => appointment.StartAt).HasColumnName("start_at");
            entity.Property(appointment => appointment.EndAt).HasColumnName("end_at");
            entity.Property(appointment => appointment.Notes).HasColumnName("notes");
            entity.HasOne(appointment => appointment.ClientProfile)
                .WithMany(client => client.Appointments)
                .HasForeignKey(appointment => appointment.ClientId);
            entity.HasMany(appointment => appointment.AppointmentProducts)
                .WithOne(appointmentProduct => appointmentProduct.Appointment)
                .HasForeignKey(appointmentProduct => appointmentProduct.AppointmentId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<ServiceProduct>(entity =>
        {
            entity.ToTable("service_products");
            entity.HasKey(serviceProduct => serviceProduct.Id);
            entity.Property(serviceProduct => serviceProduct.Id).HasColumnName("id");
            entity.Property(serviceProduct => serviceProduct.ServiceId).HasColumnName("service_id");
            entity.Property(serviceProduct => serviceProduct.ProductId).HasColumnName("product_id");
            entity.HasOne(serviceProduct => serviceProduct.Product)
                .WithMany(product => product.ServiceProducts)
                .HasForeignKey(serviceProduct => serviceProduct.ProductId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<AppointmentProduct>(entity =>
        {
            entity.ToTable("appointment_products");
            entity.HasKey(appointmentProduct => appointmentProduct.Id);
            entity.Property(appointmentProduct => appointmentProduct.Id).HasColumnName("id");
            entity.Property(appointmentProduct => appointmentProduct.AppointmentId)
                .HasColumnName("appointment_id");
            entity.Property(appointmentProduct => appointmentProduct.ProductId).HasColumnName("product_id");
            entity.HasOne(appointmentProduct => appointmentProduct.Product)
                .WithMany(product => product.AppointmentProducts)
                .HasForeignKey(appointmentProduct => appointmentProduct.ProductId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<UserAccount>(entity =>
        {
            entity.ToTable("users");
            entity.HasKey(user => user.Id);
            entity.Property(user => user.Id).HasColumnName("id");
            entity.Property(user => user.FullName).HasColumnName("full_name");
            entity.Property(user => user.Email).HasColumnName("email");
            entity.Property(user => user.PasswordHash).HasColumnName("password_hash");
            entity.Property(user => user.CreatedAt).HasColumnName("created_at");
            entity.HasIndex(user => user.Email).IsUnique();
        });
    }
}
