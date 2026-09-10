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

        public DbSet<GoldPrice> GoldPrices { get; set; }
    }
}
