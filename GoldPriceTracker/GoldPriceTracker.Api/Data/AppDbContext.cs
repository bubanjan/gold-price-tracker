using GoldPriceTracker.Api.Entities;
using Microsoft.EntityFrameworkCore;

namespace GoldPriceTracker.Api.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>()
                .HasIndex(u => u.UserName)
                .IsUnique();
        }

        public DbSet<GoldPrice> GoldPrices { get; set; }
        public DbSet<PriceAlert> PriceAlerts { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Notification> Notifications { get; set; }
    }
}
