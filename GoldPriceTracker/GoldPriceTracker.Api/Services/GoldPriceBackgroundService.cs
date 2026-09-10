using GoldPriceTracker.Api.Data;
using GoldPriceTracker.Api.Entities;

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
            using var timer = new PeriodicTimer(TimeSpan.FromSeconds(5));

            while (await timer.WaitForNextTickAsync(stoppingToken))
            {
                var goldPrice = await _goldApiClient.GetGoldPriceAsync(stoppingToken);

                if (goldPrice is not null)
                {
                    // Keep the latest price in memory
                    _goldPriceStore.Current = goldPrice;

                    // Create a scope for AppDbContext
                    using var scope = _scopeFactory.CreateScope();

                    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();

                    // Convert API response DTO → database entity
                    var entity = new GoldPrice
                    {
                        Price = goldPrice.Price,
                        Currency = goldPrice.Currency,
                        Symbol = goldPrice.Symbol,
                        UpdatedAt = goldPrice.UpdatedAt,
                        FetchedAt = DateTime.UtcNow
                    };

                    dbContext.GoldPrices.Add(entity);

                    await dbContext.SaveChangesAsync(stoppingToken);

                    Console.WriteLine($"Saved gold price with ID: {entity.Id}");

                    Console.WriteLine($"Gold price: {goldPrice.CurrencySymbol}{goldPrice.Price} {goldPrice.Currency}");

                }
            }
        }
    }
}