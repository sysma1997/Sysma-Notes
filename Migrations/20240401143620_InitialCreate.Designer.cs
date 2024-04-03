﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using WebAPI.Models;

#nullable disable

namespace WebAPI.Migrations
{
    [DbContext(typeof(Context))]
    [Migration("20240401143620_InitialCreate")]
    partial class InitialCreate
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder.HasAnnotation("ProductVersion", "7.0.17");

            modelBuilder.Entity("WebAPI.Models.Notes", b =>
                {
                    b.Property<Guid>("id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("TEXT");

                    b.Property<Guid>("Userid")
                        .HasColumnType("TEXT");

                    b.Property<DateTime>("date")
                        .HasColumnType("TEXT");

                    b.Property<string>("description")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<Guid>("idUser")
                        .HasColumnType("TEXT");

                    b.Property<string>("title")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.HasKey("id");

                    b.HasIndex("Userid");

                    b.ToTable("Notes");
                });

            modelBuilder.Entity("WebAPI.Models.User", b =>
                {
                    b.Property<Guid>("id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("TEXT");

                    b.Property<string>("email")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("name")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("password")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("phone")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.HasKey("id");

                    b.ToTable("Users");
                });

            modelBuilder.Entity("WebAPI.Models.Notes", b =>
                {
                    b.HasOne("WebAPI.Models.User", "User")
                        .WithMany("notes")
                        .HasForeignKey("Userid")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("User");
                });

            modelBuilder.Entity("WebAPI.Models.User", b =>
                {
                    b.Navigation("notes");
                });
#pragma warning restore 612, 618
        }
    }
}