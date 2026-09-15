using GoldPriceTracker.Api.Entities;

namespace GoldPriceTracker.Api.Models
{
    public class CreatePriceAlertRequest
    {
        public decimal TargetPrice { get; set; }
        public AlertCondition Condition { get; set; }
    }
}
