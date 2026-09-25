namespace GoldPriceTracker.Api.Entities
{
    public class PriceAlert
    {
        public int Id { get; set; }

        public decimal TargetPrice { get; set; }

        public AlertCondition Condition { get; set; }

        public bool IsActive { get; set; } = true;

        public bool IsTriggered { get; set; }

        public DateTime CreatedAt { get; set; }

        public DateTime? TriggeredAt { get; set; }

        public int UserId { get; set; }

        public User User { get; set; } = null!;

        public ICollection<Notification> Notifications { get; set; } = new List<Notification>();

    }
}
