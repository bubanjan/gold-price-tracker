namespace GoldPriceTracker.Api.Services
{
    public class GoldPriceBackgroundService : BackgroundService
    {
        private readonly GoldApiClient _goldApiClient;
        private readonly GoldPriceStore _goldPriceStore;

        public GoldPriceBackgroundService(GoldApiClient goldApiClient, GoldPriceStore goldPriceStore)
        {
            _goldApiClient = goldApiClient;
            _goldPriceStore = goldPriceStore;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            using var timer = new PeriodicTimer(TimeSpan.FromSeconds(5));

            while (await timer.WaitForNextTickAsync(stoppingToken))
            {
                var goldPrice = await _goldApiClient.GetGoldPriceAsync(stoppingToken);

                if (goldPrice is not null)
                {
                    _goldPriceStore.Current = goldPrice;
                    Console.WriteLine($"Gold price: {goldPrice.CurrencySymbol}{goldPrice.Price} {goldPrice.Currency}");
                }

            }
        }
    }
}