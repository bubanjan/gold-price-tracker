namespace GoldPriceTracker.Api.Services
{
    public class GoldApiClient
    {
        private readonly HttpClient _httpClient;

        public GoldApiClient(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<string> GetGoldPriceAsync(
            CancellationToken cancellationToken)
        {
            var response = await _httpClient.GetAsync("https://api.gold-api.com/price/XAU", cancellationToken);

            response.EnsureSuccessStatusCode();

            return await response.Content.ReadAsStringAsync(cancellationToken);
        }
    }
}