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
        private readonly ILogger<GoldPriceBackgroundService> _logger;

        public GoldPriceBackgroundService(
            GoldApiClient goldApiClient,
            GoldPriceStore goldPriceStore,
            IServiceScopeFactory scopeFactory,
            ILogger<GoldPriceBackgroundService> logger)
        {
            _goldApiClient = goldApiClient;
            _goldPriceStore = goldPriceStore;
            _scopeFactory = scopeFactory;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(
            CancellationToken stoppingToken)
        {
            await TryFetchAndProcessGoldPrice(stoppingToken);

            using var timer = new PeriodicTimer(TimeSpan.FromSeconds(60));

            try
            {
                while (await timer.WaitForNextTickAsync(stoppingToken))
                {
                    await TryFetchAndProcessGoldPrice(stoppingToken);
                }
            }
            catch (OperationCanceledException)
                when (stoppingToken.IsCancellationRequested)
            {
                _logger.LogInformation(
                    "Gold price background service stopped.");
            }
        }

        private async Task FetchAndProcessGoldPrice(
            CancellationToken stoppingToken)
        {
            var goldPrice = await _goldApiClient
                .GetGoldPriceAsync(stoppingToken);

            if (goldPrice is null)
            {
                _logger.LogWarning("Gold API returned no price data.");

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
                _logger.LogInformation(
                    "Saved gold price with ID: {Id}",
                    entity.Id);
            }

            _logger.LogInformation(
                "Gold price: {Symbol}{Price} {Currency}",
                goldPrice.CurrencySymbol,
                goldPrice.Price,
                goldPrice.Currency);
        }

        private async Task TryFetchAndProcessGoldPrice(
            CancellationToken stoppingToken)
        {
            try
            {
                await FetchAndProcessGoldPrice(stoppingToken);
            }
            catch (OperationCanceledException)
                when (stoppingToken.IsCancellationRequested)        
            {
                _logger.LogInformation("Gold price background service is stopping.");
            }
            catch (Exception ex)
            {
                _logger.LogError(
                    ex,
                    "Failed to fetch and process gold price.");
            }
        }
    }
}