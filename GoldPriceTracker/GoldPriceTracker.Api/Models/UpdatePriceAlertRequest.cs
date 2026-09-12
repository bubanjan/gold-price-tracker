namespace GoldPriceTracker.Api.Models
{
    public class UpdatePriceAlertRequest
    {
        public decimal TargetPrice { get; set; }
        public string Condition { get; set; } = string.Empty;
        public bool IsActive { get; set; }
    }
}
