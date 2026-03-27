using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;

#nullable disable

namespace BraiderskiReservation.Infrastructure.Data.Migrations;

[DbContext(typeof(AppDbContext))]
internal partial class AppDbContextModelSnapshot : ModelSnapshot
{
    protected override void BuildModel(ModelBuilder modelBuilder)
    {
#pragma warning disable 612, 618
        modelBuilder
            .HasAnnotation("ProductVersion", "8.0.10")
            .HasAnnotation("Relational:MaxIdentifierLength", 63);

        NpgsqlModelBuilderExtensions.UseIdentityByDefaultColumns(modelBuilder);

        modelBuilder.Entity("BraiderskiReservation.Domain.Entities.Appointment", b =>
            {
                b.Property<Guid>("Id").HasColumnType("uuid").HasColumnName("id");
                b.Property<Guid>("ClientId").HasColumnType("uuid").HasColumnName("client_id");
                b.Property<DateTime>("EndAt").HasColumnType("timestamp with time zone").HasColumnName("end_at");
                b.Property<string>("Notes").IsRequired().HasColumnType("text").HasColumnName("notes");
                b.Property<Guid>("ServiceId").HasColumnType("uuid").HasColumnName("service_id");
                b.Property<DateTime>("StartAt").HasColumnType("timestamp with time zone").HasColumnName("start_at");
                b.HasKey("Id");
                b.HasIndex("ClientId");
                b.HasIndex("ServiceId");
                b.ToTable("appointments", (string)null);
            });

        modelBuilder.Entity("BraiderskiReservation.Domain.Entities.AppointmentProduct", b =>
            {
                b.Property<Guid>("Id").HasColumnType("uuid").HasColumnName("id");
                b.Property<Guid>("AppointmentId").HasColumnType("uuid").HasColumnName("appointment_id");
                b.Property<Guid>("ProductId").HasColumnType("uuid").HasColumnName("product_id");
                b.HasKey("Id");
                b.HasIndex("AppointmentId");
                b.HasIndex("ProductId");
                b.ToTable("appointment_products", (string)null);
            });

        modelBuilder.Entity("BraiderskiReservation.Domain.Entities.ClientProfile", b =>
            {
                b.Property<Guid>("Id").HasColumnType("uuid").HasColumnName("id");
                b.Property<string>("Email").IsRequired().HasColumnType("text").HasColumnName("email");
                b.Property<string>("FullName").IsRequired().HasColumnType("text").HasColumnName("full_name");
                b.Property<bool>("IsActive").HasColumnType("boolean").HasColumnName("is_active");
                b.Property<string>("Notes").IsRequired().HasColumnType("text").HasColumnName("notes");
                b.Property<string>("PhoneNumber").IsRequired().HasColumnType("text").HasColumnName("phone_number");
                b.HasKey("Id");
                b.HasIndex("Email");
                b.HasIndex("FullName");
                b.HasIndex("PhoneNumber");
                b.ToTable("clients", (string)null);
            });

        modelBuilder.Entity("BraiderskiReservation.Domain.Entities.Product", b =>
            {
                b.Property<Guid>("Id").HasColumnType("uuid").HasColumnName("id");
                b.Property<DateTimeOffset?>("AvailabilityCheckedAt").HasColumnType("timestamp with time zone").HasColumnName("availability_checked_at");
                b.Property<string>("Brand").IsRequired().HasColumnType("text").HasColumnName("brand");
                b.Property<string>("ImageUrl").IsRequired().HasColumnType("text").HasColumnName("image_url");
                b.Property<bool>("IsAvailable").HasColumnType("boolean").HasColumnName("is_available");
                b.Property<string>("Name").IsRequired().HasColumnType("text").HasColumnName("name");
                b.Property<string>("Notes").IsRequired().HasColumnType("text").HasColumnName("notes");
                b.Property<decimal>("Price").HasColumnType("numeric").HasColumnName("price");
                b.Property<string>("ShopUrl").IsRequired().HasColumnType("text").HasColumnName("shop_url");
                b.HasKey("Id");
                b.HasIndex("Brand");
                b.HasIndex("Name");
                b.ToTable("products", (string)null);
            });

        modelBuilder.Entity("BraiderskiReservation.Domain.Entities.ServiceItem", b =>
            {
                b.Property<Guid>("Id").HasColumnType("uuid").HasColumnName("id");
                b.Property<string>("Description").IsRequired().HasColumnType("text").HasColumnName("description");
                b.Property<TimeSpan>("DurationFrom").HasColumnType("interval").HasColumnName("duration_from");
                b.Property<TimeSpan>("DurationTo").HasColumnType("interval").HasColumnName("duration_to");
                b.Property<string>("Name").IsRequired().HasColumnType("text").HasColumnName("name");
                b.Property<decimal>("PriceFrom").HasColumnType("numeric").HasColumnName("price_from");
                b.Property<decimal>("PriceTo").HasColumnType("numeric").HasColumnName("price_to");
                b.HasKey("Id");
                b.HasIndex("Name");
                b.ToTable("services", (string)null);
            });

        modelBuilder.Entity("BraiderskiReservation.Domain.Entities.ServiceProduct", b =>
            {
                b.Property<Guid>("Id").HasColumnType("uuid").HasColumnName("id");
                b.Property<Guid>("ProductId").HasColumnType("uuid").HasColumnName("product_id");
                b.Property<Guid>("ServiceId").HasColumnType("uuid").HasColumnName("service_id");
                b.HasKey("Id");
                b.HasIndex("ProductId");
                b.HasIndex("ServiceId");
                b.ToTable("service_products", (string)null);
            });

        modelBuilder.Entity("BraiderskiReservation.Domain.Entities.UsedProduct", b =>
            {
                b.Property<Guid>("Id").HasColumnType("uuid").HasColumnName("id");
                b.Property<Guid>("ClientId").HasColumnType("uuid").HasColumnName("client_id");
                b.Property<string>("Name").IsRequired().HasColumnType("text").HasColumnName("name");
                b.Property<string>("Notes").IsRequired().HasColumnType("text").HasColumnName("notes");
                b.Property<DateTime>("UsedAt").HasColumnType("timestamp with time zone").HasColumnName("used_at");
                b.HasKey("Id");
                b.HasIndex("ClientId");
                b.ToTable("used_products", (string)null);
            });

        modelBuilder.Entity("BraiderskiReservation.Domain.Entities.UserAccount", b =>
            {
                b.Property<Guid>("Id").HasColumnType("uuid").HasColumnName("id");
                b.Property<DateTime>("CreatedAt").HasColumnType("timestamp with time zone").HasColumnName("created_at");
                b.Property<string>("Email").IsRequired().HasColumnType("text").HasColumnName("email");
                b.Property<string>("FullName").IsRequired().HasColumnType("text").HasColumnName("full_name");
                b.Property<string>("PasswordHash").IsRequired().HasColumnType("text").HasColumnName("password_hash");
                b.HasKey("Id");
                b.HasIndex("Email").IsUnique();
                b.ToTable("users", (string)null);
            });

        modelBuilder.Entity("BraiderskiReservation.Domain.Entities.Appointment", b =>
            {
                b.HasOne("BraiderskiReservation.Domain.Entities.ClientProfile", "ClientProfile")
                    .WithMany("Appointments")
                    .HasForeignKey("ClientId")
                    .OnDelete(DeleteBehavior.Cascade)
                    .IsRequired();

                b.HasOne("BraiderskiReservation.Domain.Entities.ServiceItem", "ServiceItem")
                    .WithMany("Appointments")
                    .HasForeignKey("ServiceId")
                    .IsRequired();
            });

        modelBuilder.Entity("BraiderskiReservation.Domain.Entities.AppointmentProduct", b =>
            {
                b.HasOne("BraiderskiReservation.Domain.Entities.Appointment", "Appointment")
                    .WithMany("AppointmentProducts")
                    .HasForeignKey("AppointmentId")
                    .OnDelete(DeleteBehavior.Cascade)
                    .IsRequired();

                b.HasOne("BraiderskiReservation.Domain.Entities.Product", "Product")
                    .WithMany("AppointmentProducts")
                    .HasForeignKey("ProductId")
                    .OnDelete(DeleteBehavior.Cascade)
                    .IsRequired();
            });

        modelBuilder.Entity("BraiderskiReservation.Domain.Entities.ServiceProduct", b =>
            {
                b.HasOne("BraiderskiReservation.Domain.Entities.Product", "Product")
                    .WithMany("ServiceProducts")
                    .HasForeignKey("ProductId")
                    .OnDelete(DeleteBehavior.Cascade)
                    .IsRequired();

                b.HasOne("BraiderskiReservation.Domain.Entities.ServiceItem", "ServiceItem")
                    .WithMany("ServiceProducts")
                    .HasForeignKey("ServiceId")
                    .OnDelete(DeleteBehavior.Cascade)
                    .IsRequired();
            });

        modelBuilder.Entity("BraiderskiReservation.Domain.Entities.UsedProduct", b =>
            {
                b.HasOne("BraiderskiReservation.Domain.Entities.ClientProfile", "ClientProfile")
                    .WithMany("UsedProducts")
                    .HasForeignKey("ClientId")
                    .OnDelete(DeleteBehavior.Cascade)
                    .IsRequired();
            });
#pragma warning restore 612, 618
    }
}