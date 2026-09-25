using GoldPriceTracker.Api.Entities;

namespace GoldPriceTracker.Api.Messages
{
    public class PriceAlertTriggered
    {
        public int UserId { get; set; }
        public int PriceAlertId { get; set; }

        public decimal TargetPrice { get; set; }
        public decimal TriggeredPrice { get; set; }

        public AlertCondition Condition { get; set; }
    }
}
