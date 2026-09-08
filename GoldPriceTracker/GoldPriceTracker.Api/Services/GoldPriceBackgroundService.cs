namespace GoldPriceTracker.Api.Services
{
    public class GoldPriceBackgroundService : BackgroundService
    {
        private readonly GoldApiClient _goldApiClient;

        public GoldPriceBackgroundService(GoldApiClient goldApiClient)
        {
            _goldApiClient = goldApiClient;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            using var timer = new PeriodicTimer(TimeSpan.FromSeconds(8));

            while (await timer.WaitForNextTickAsync(stoppingToken))
            {
                var result = await _goldApiClient.GetGoldPriceAsync(stoppingToken);

                Console.WriteLine(result);
            }
        }
    }
}