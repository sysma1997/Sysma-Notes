using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebAPI.Migrations
{
    /// <inheritdoc />
    public partial class UpdateForeignKeys : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Notes_Users_Userid",
                table: "Notes");

            migrationBuilder.DropIndex(
                name: "IX_Notes_Userid",
                table: "Notes");

            migrationBuilder.DropColumn(
                name: "Userid",
                table: "Notes");

            migrationBuilder.CreateIndex(
                name: "IX_Notes_idUser",
                table: "Notes",
                column: "idUser");

            migrationBuilder.AddForeignKey(
                name: "FK_Notes_Users_idUser",
                table: "Notes",
                column: "idUser",
                principalTable: "Users",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Notes_Users_idUser",
                table: "Notes");

            migrationBuilder.DropIndex(
                name: "IX_Notes_idUser",
                table: "Notes");

            migrationBuilder.AddColumn<Guid>(
                name: "Userid",
                table: "Notes",
                type: "TEXT",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                name: "IX_Notes_Userid",
                table: "Notes",
                column: "Userid");

            migrationBuilder.AddForeignKey(
                name: "FK_Notes_Users_Userid",
                table: "Notes",
                column: "Userid",
                principalTable: "Users",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
