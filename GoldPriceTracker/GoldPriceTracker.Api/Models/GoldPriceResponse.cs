namespace GoldPriceTracker.Api.Models
{
    public class GoldPriceResponse
    {
        public string Currency { get; set; }
        public string CurrencySymbol { get; set; }
        public decimal ExchangeRate { get; set; }
        public string Name { get; set; }
        public decimal Price { get; set; }
        public string Symbol { get; set; }
        public DateTime UpdatedAt { get; set; }
        public string UpdatedAtReadable { get; set; }
    }
}
