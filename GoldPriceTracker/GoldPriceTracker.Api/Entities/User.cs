using System.ComponentModel.DataAnnotations;

namespace GoldPriceTracker.Api.Entities
{
    public class User
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(50)]
        public string UserName { get; set; } = string.Empty;

        [Required]
        public string PasswordHash { get; set; } = string.Empty;

        public ICollection<PriceAlert> PriceAlerts { get; set; } = new List<PriceAlert>();
    }
}
