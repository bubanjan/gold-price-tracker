using GoldPriceTracker.Api.Entities;

namespace GoldPriceTracker.Api.Models
{
    public class UpdatePriceAlertRequest
    {
        public decimal TargetPrice { get; set; }
        public AlertCondition Condition { get; set; }
        public bool IsActive { get; set; }
    }
}
