namespace GoldPriceTracker.Api.Entities
{
    public class GoldPrice
    {
        public int Id { get; set; }
        public decimal Price { get; set; }
        public string Currency { get; set; } = string.Empty;
        public string Symbol { get; set; } = string.Empty;
        public DateTime UpdatedAt { get; set; }
        public DateTime FetchedAt { get; set; }
    }
}
