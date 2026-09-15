using GoldPriceTracker.Api.Data;
using GoldPriceTracker.Api.Entities;
using Microsoft.EntityFrameworkCore;

namespace GoldPriceTracker.Api.Services
{
    public class GoldPriceBackgroundService : BackgroundService
    {
        private readonly GoldApiClient _goldApiClient;
        private readonly GoldPriceStore _goldPriceStore;
        private readonly IServiceScopeFactory _scopeFactory;

        public GoldPriceBackgroundService(
            GoldApiClient goldApiClient,
            GoldPriceStore goldPriceStore,
            IServiceScopeFactory scopeFactory)
        {
            _goldApiClient = goldApiClient;
            _goldPriceStore = goldPriceStore;
            _scopeFactory = scopeFactory;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            await FetchAndProcessGoldPrice(stoppingToken);

            using var timer = new PeriodicTimer(TimeSpan.FromSeconds(60));

            while (await timer.WaitForNextTickAsync(stoppingToken))
            {
                await FetchAndProcessGoldPrice(stoppingToken);
            }
        }

        private async Task FetchAndProcessGoldPrice(
            CancellationToken stoppingToken)
        {
            var goldPrice = await _goldApiClient
                .GetGoldPriceAsync(stoppingToken);

            if (goldPrice is null)
            {
                return;
            }

            // Keep the latest price in memory
            _goldPriceStore.Current = goldPrice;

            // Create a scope for AppDbContext
            using var scope = _scopeFactory.CreateScope();

            var dbContext = scope.ServiceProvider
                .GetRequiredService<AppDbContext>();

            // Convert API response DTO → database entity
            var entity = new GoldPrice
            {
                Price = goldPrice.Price,
                Currency = goldPrice.Currency,
                Symbol = goldPrice.Symbol,
                UpdatedAt = goldPrice.UpdatedAt,
                FetchedAt = DateTime.UtcNow
            };

            var priceAlerts = await dbContext.PriceAlerts
                .Where(x => x.IsActive && !x.IsTriggered)
                .ToListAsync(stoppingToken);

            foreach (var pa in priceAlerts)
            {
                if (pa.Condition == AlertCondition.Above &&
                    entity.Price > pa.TargetPrice)
                {
                    pa.IsTriggered = true;
                    pa.TriggeredAt = DateTime.UtcNow;
                }

                if (pa.Condition == AlertCondition.Below &&
                    entity.Price < pa.TargetPrice)
                {
                    pa.IsTriggered = true;
                    pa.TriggeredAt = DateTime.UtcNow;
                }
            }

            var lastFetchedPrice = await dbContext.GoldPrices
                .OrderByDescending(x => x.FetchedAt)
                .FirstOrDefaultAsync(stoppingToken);

            var priceWasSaved = false;

            if (lastFetchedPrice is null ||
                entity.Price != lastFetchedPrice.Price)
            {
                dbContext.GoldPrices.Add(entity);
                priceWasSaved = true;
            }

            await dbContext.SaveChangesAsync(stoppingToken);

            if (priceWasSaved)
            {
                Console.WriteLine(
                    $"Saved gold price with ID: {entity.Id}");
            }

            Console.WriteLine(
                $"Gold price: {goldPrice.CurrencySymbol}" +
                $"{goldPrice.Price} {goldPrice.Currency}");
        }
    }
}