using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BraiderskiReservation.Infrastructure.Data.Migrations
{
    public partial class AddCustomOrderFieldsToServices : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "max_completion_time_days",
                table: "services",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "order_position",
                table: "services",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.Sql(@"
                UPDATE services
                SET order_position = ranked.rn
                FROM (
                    SELECT id, ROW_NUMBER() OVER (ORDER BY name) AS rn
                    FROM services
                ) AS ranked
                WHERE services.id = ranked.id;
            ");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "max_completion_time_days",
                table: "services");

            migrationBuilder.DropColumn(
                name: "order_position",
                table: "services");
        }
    }
}
