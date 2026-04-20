using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BraiderskiReservation.Infrastructure.Data.Migrations
{
    public partial class ReplaceMaxCompletionTimeDaysWithCompletionDeadlineDate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateOnly>(
                name: "completion_deadline_date",
                table: "services",
                type: "date",
                nullable: true);

            migrationBuilder.Sql("""
                UPDATE services
                SET completion_deadline_date = (CURRENT_DATE + (max_completion_time_days || ' days')::interval)::date
                WHERE type = 1
                  AND max_completion_time_days IS NOT NULL
                  AND max_completion_time_days > 0;
                """);

            migrationBuilder.DropColumn(
                name: "max_completion_time_days",
                table: "services");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "max_completion_time_days",
                table: "services",
                type: "integer",
                nullable: true);

            migrationBuilder.Sql("""
                UPDATE services
                SET max_completion_time_days = GREATEST((completion_deadline_date - CURRENT_DATE), 0)
                WHERE type = 1
                  AND completion_deadline_date IS NOT NULL;
                """);

            migrationBuilder.DropColumn(
                name: "completion_deadline_date",
                table: "services");
        }
    }
}
