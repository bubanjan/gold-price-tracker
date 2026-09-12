namespace GoldPriceTracker.Api.Models
{
    public class CreatePriceAlertRequest
    {
        public decimal TargetPrice { get; set; }
        public string Condition { get; set; } = string.Empty;
    }
}
