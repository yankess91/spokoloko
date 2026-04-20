using BraiderskiReservation.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace BraiderskiReservation.Infrastructure.Data;

public sealed class AppDbContext : DbContext
{
    private static readonly ValueConverter<DateTime, DateTime> UtcDateTimeConverter = new(
        value => value.Kind == DateTimeKind.Utc
            ? value
            : value.Kind == DateTimeKind.Local
                ? value.ToUniversalTime()
                : DateTime.SpecifyKind(value, DateTimeKind.Utc),
        value => DateTime.SpecifyKind(value, DateTimeKind.Utc));

    private static readonly ValueConverter<DateTime?, DateTime?> NullableUtcDateTimeConverter = new(
        value => value == null
            ? value
            : value.Value.Kind == DateTimeKind.Utc
                ? value
                : value.Value.Kind == DateTimeKind.Local
                    ? value.Value.ToUniversalTime()
                    : DateTime.SpecifyKind(value.Value, DateTimeKind.Utc),
        value => value == null ? value : DateTime.SpecifyKind(value.Value, DateTimeKind.Utc));

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
    public DbSet<Order> Orders => Set<Order>();
    public DbSet<OrderItem> OrderItems => Set<OrderItem>();
    public DbSet<UserAccount> Users => Set<UserAccount>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        foreach (var entityType in modelBuilder.Model.GetEntityTypes())
        {
            foreach (var property in entityType.GetProperties())
            {
                if (property.ClrType == typeof(DateTime))
                {
                    property.SetValueConverter(UtcDateTimeConverter);
                }
                else if (property.ClrType == typeof(DateTime?))
                {
                    property.SetValueConverter(NullableUtcDateTimeConverter);
                }
            }
        }

        modelBuilder.Entity<ClientProfile>(entity =>
        {
            entity.ToTable("clients");
            entity.HasKey(client => client.Id);
            entity.Property(client => client.Id).HasColumnName("id");
            entity.Property(client => client.FullName).HasColumnName("full_name");
            entity.Property(client => client.Email).HasColumnName("email");
            entity.Property(client => client.PhoneNumber).HasColumnName("phone_number");
            entity.Property(client => client.Notes).HasColumnName("notes");
            entity.Property(client => client.IsActive).HasColumnName("is_active");
            entity.HasIndex(client => client.FullName);
            entity.HasIndex(client => client.Email);
            entity.HasIndex(client => client.PhoneNumber);
            entity.HasMany(client => client.UsedProducts)
                .WithOne(usedProduct => usedProduct.ClientProfile)
                .HasForeignKey(usedProduct => usedProduct.ClientId)
                .OnDelete(DeleteBehavior.Cascade);
            entity.HasMany(client => client.Appointments)
                .WithOne(appointment => appointment.ClientProfile)
                .HasForeignKey(appointment => appointment.ClientId)
                .OnDelete(DeleteBehavior.Cascade);
            entity.HasMany(client => client.Orders)
                .WithOne(order => order.ClientProfile)
                .HasForeignKey(order => order.ClientId)
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
            entity.Property(product => product.Price).HasColumnName("price");
            entity.Property(product => product.ShopUrl).HasColumnName("shop_url");
            entity.Property(product => product.IsAvailable).HasColumnName("is_available");
            entity.Property(product => product.AvailabilityCheckedAt).HasColumnName("availability_checked_at");
            entity.HasIndex(product => product.Name);
            entity.HasIndex(product => product.Brand);
        });

        modelBuilder.Entity<ServiceItem>(entity =>
        {
            entity.ToTable("services");
            entity.HasKey(service => service.Id);
            entity.Property(service => service.Id).HasColumnName("id");
            entity.Property(service => service.Name).HasColumnName("name");
            entity.Property(service => service.Description).HasColumnName("description");
            entity.Property(service => service.DurationFrom).HasColumnName("duration_from");
            entity.Property(service => service.DurationTo).HasColumnName("duration_to");
            entity.Property(service => service.PriceFrom).HasColumnName("price_from");
            entity.Property(service => service.PriceTo).HasColumnName("price_to");
            entity.HasIndex(service => service.Name);
            entity.HasMany(service => service.Appointments)
                .WithOne(appointment => appointment.ServiceItem)
                .HasForeignKey(appointment => appointment.ServiceId);
            entity.HasMany(service => service.ServiceProducts)
                .WithOne(serviceProduct => serviceProduct.ServiceItem)
                .HasForeignKey(serviceProduct => serviceProduct.ServiceId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Order>(entity =>
        {
            entity.ToTable("orders");
            entity.HasKey(order => order.Id);
            entity.Property(order => order.Id).HasColumnName("id");
            entity.Property(order => order.Number).HasColumnName("number");
            entity.Property(order => order.ClientId).HasColumnName("client_id");
            entity.Property(order => order.Title).HasColumnName("title");
            entity.Property(order => order.Description).HasColumnName("description");
            entity.Property(order => order.Status).HasColumnName("status").HasConversion<int>();
            entity.Property(order => order.DeliveryMethod).HasColumnName("delivery_method").HasConversion<int>();
            entity.Property(order => order.DueDate).HasColumnName("due_date").HasColumnType("date");
            entity.Property(order => order.CreatedAt).HasColumnName("created_at");
            entity.Property(order => order.UpdatedAt).HasColumnName("updated_at");
            entity.Property(order => order.TotalAmount).HasColumnName("total_amount").HasColumnType("numeric");
            entity.HasIndex(order => order.Number).IsUnique();
            entity.HasIndex(order => order.ClientId);
            entity.HasIndex(order => order.Status);
            entity.HasIndex(order => order.DeliveryMethod);
            entity.HasIndex(order => order.DueDate);
            entity.HasIndex(order => order.CreatedAt);
            entity.HasMany(order => order.Items)
                .WithOne(orderItem => orderItem.Order)
                .HasForeignKey(orderItem => orderItem.OrderId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<OrderItem>(entity =>
        {
            entity.ToTable("order_items");
            entity.HasKey(item => item.Id);
            entity.Property(item => item.Id).HasColumnName("id");
            entity.Property(item => item.OrderId).HasColumnName("order_id");
            entity.Property(item => item.Name).HasColumnName("name");
            entity.Property(item => item.Notes).HasColumnName("notes");
            entity.Property(item => item.Quantity).HasColumnName("quantity").HasColumnType("numeric");
            entity.Property(item => item.UnitPrice).HasColumnName("unit_price").HasColumnType("numeric");
            entity.Property(item => item.LineTotal).HasColumnName("line_total").HasColumnType("numeric");
            entity.HasIndex(item => item.OrderId);
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
