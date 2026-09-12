namespace GoldPriceTracker.Api.Entities
{
    public class PriceAlert
    {
        public int Id { get; set; }

        public decimal TargetPrice { get; set; }

        public string Condition { get; set; } = string.Empty;

        public bool IsActive { get; set; } = true;

        public bool IsTriggered { get; set; }

        public DateTime CreatedAt { get; set; }

        public DateTime? TriggeredAt { get; set; }
    }
}
