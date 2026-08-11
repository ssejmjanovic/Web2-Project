using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using UserService.Models;

namespace UserService.Data
{
    public class UserDbContext : DbContext
    {
        public UserDbContext(DbContextOptions<UserDbContext> options) : base(options) { }
        public DbSet<User> Users { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(u => u.Id);

                entity.Property(u => u.FirstName).IsRequired().HasMaxLength(100);
                entity.Property(u => u.LastName).IsRequired().HasMaxLength(100);
                entity.Property(u => u.Email).IsRequired().HasMaxLength(256);
                entity.Property(u => u.PasswordHash).IsRequired().HasMaxLength(100);
                entity.Property(u => u.Role).HasConversion<int>().IsRequired();
                entity.Property(u => u.CreatedAt).IsRequired();
                entity.Property(u => u.IsActive).IsRequired();

                entity.HasIndex(u => u.Email).IsUnique();
            });
        }
    }
}
