using Microsoft.EntityFrameworkCore;

namespace WebAPI.Models
{
    public class Context : DbContext
    {
        public DbSet<User> Users { get; set; }
        public DbSet<Note> Notes { get; set; }

        public string dbPath { get; }

        public Context()
        {
            var folder = Environment.SpecialFolder.LocalApplicationData;
            string path = Environment.GetFolderPath(folder);

            dbPath = System.IO.Path.Join(path, "notes.db");
        }

        protected override void OnConfiguring(DbContextOptionsBuilder options)
        {
            options.UseSqlite($"Data Source={dbPath}");
        }
        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.Entity<Models.User>().ToTable("Users");
            builder.Entity<Models.User>().HasKey(u => u.id);
            builder.Entity<Models.Note>().ToTable("Notes");
            builder.Entity<Models.Note>().HasKey(n => n.id);
            builder.Entity<Models.Note>()
                .HasOne(n => n.User)
                .WithMany(u => u.Notes)
                .HasForeignKey(n => n.idUser)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
