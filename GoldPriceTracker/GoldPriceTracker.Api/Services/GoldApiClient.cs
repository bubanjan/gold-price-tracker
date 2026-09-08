using GoldPriceTracker.Api.Models;

namespace GoldPriceTracker.Api.Services
{
    public class GoldApiClient
    {
        private readonly HttpClient _httpClient;

        public GoldApiClient(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<GoldPriceResponse?> GetGoldPriceAsync(
            CancellationToken cancellationToken)
        {
            return await _httpClient.GetFromJsonAsync<GoldPriceResponse>("https://api.gold-api.com/price/XAU", cancellationToken);
        }
    }
}