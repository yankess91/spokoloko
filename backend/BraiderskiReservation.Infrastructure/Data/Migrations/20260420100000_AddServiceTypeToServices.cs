using BraiderskiReservation.Domain.Entities;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BraiderskiReservation.Infrastructure.Data.Migrations
{
    public partial class AddServiceTypeToServices : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "type",
                table: "services",
                type: "integer",
                nullable: false,
                defaultValue: (int)ServiceType.OnSite);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "type",
                table: "services");
        }
    }
}
