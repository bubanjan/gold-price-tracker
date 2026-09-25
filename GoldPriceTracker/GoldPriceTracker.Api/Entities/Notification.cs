namespace GoldPriceTracker.Api.Entities
{
    public class Notification
    {
        public int Id { get; set; }

        public decimal TargetPrice { get; set; }

        public decimal TriggeredPrice { get; set; }

        public AlertCondition Condition { get; set; }

        public bool IsRead { get; set; }

        public DateTime CreatedAt { get; set; }


        public int UserId { get; set; }

        public User User { get; set; } = null!;

        public int PriceAlertId { get; set; }

        public PriceAlert PriceAlert { get; set; } = null!;
    }
}
