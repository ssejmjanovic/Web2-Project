using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using TravelService.Models;

namespace TravelService.Data
{
    public class TravelDbContext : DbContext
    {
        public TravelDbContext(DbContextOptions<TravelDbContext> options) : base(options) { }

        public DbSet<TravelPlan> TravelPlans { get; set; }
        public DbSet<Destination> Destinations { get; set; }
        public DbSet<Activity> Activities { get; set; }
        public DbSet<Expense> Expenses { get; set; }
        public DbSet<ChecklistItem> ChecklistItems { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<TravelPlan>(entity =>
            {
                entity.HasKey(p => p.Id);

                entity.Property(p => p.Name).IsRequired().HasMaxLength(200);
                entity.Property(p => p.Description).HasMaxLength(2000);
                entity.Property(p => p.Notes).HasMaxLength(2000);
                entity.Property(p => p.Budget).HasColumnType("decimal(18,2)");
                entity.Property(p => p.StartDate).HasColumnType("date");
                entity.Property(p => p.EndDate).HasColumnType("date");

                entity.HasIndex(p => p.UserId);
            });

            modelBuilder.Entity<Destination>(entity =>
            {
                entity.HasKey(d => d.Id);

                entity.Property(d => d.Name).IsRequired().HasMaxLength(200);
                entity.Property(d => d.Location).IsRequired().HasMaxLength(300);
                entity.Property(d => d.Description).HasMaxLength(1000);
                entity.Property(d => d.Notes).HasMaxLength(1000);
                entity.Property(d => d.ArrivalDate).HasColumnType("date");
                entity.Property(d => d.DepartureDate).HasColumnType("date");

                entity.HasOne(d => d.TravelPlan)
                      .WithMany(p => p.Destinations)
                      .HasForeignKey(d => d.TravelPlanId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<Activity>(entity =>
            {
                entity.HasKey(a => a.Id);

                entity.Property(a => a.Name).IsRequired().HasMaxLength(200);
                entity.Property(a => a.Location).HasMaxLength(300);
                entity.Property(a => a.Description).HasMaxLength(1000);
                entity.Property(a => a.Date).HasColumnType("date");
                entity.Property(a => a.EstimatedCost).HasColumnType("decimal(18,2)");
                entity.Property(a => a.Status).HasConversion<int>().IsRequired();

                entity.HasOne(a => a.TravelPlan)
                      .WithMany(p => p.Activities)
                      .HasForeignKey(a => a.TravelPlanId)
                      .OnDelete(DeleteBehavior.Cascade);

                entity.HasIndex(a => new { a.TravelPlanId, a.Date });
            });

            modelBuilder.Entity<Expense>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
                entity.Property(e => e.Description).HasMaxLength(1000);
                entity.Property(e => e.Amount).HasColumnType("decimal(18,2)").IsRequired();
                entity.Property(e => e.Date).HasColumnType("date");
                entity.Property(e => e.Category).HasConversion<int>().IsRequired();

                entity.HasOne(e => e.TravelPlan)
                      .WithMany(p => p.Expenses)
                      .HasForeignKey(e => e.TravelPlanId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<ChecklistItem>(entity =>
            {
                entity.HasKey(c => c.Id);

                entity.Property(c => c.Name).IsRequired().HasMaxLength(300);

                entity.HasOne(c => c.TravelPlan)
                      .WithMany(p => p.ChecklistItems)
                      .HasForeignKey(c => c.TravelPlanId)
                      .OnDelete(DeleteBehavior.Cascade);
            });
        }

    }
}
