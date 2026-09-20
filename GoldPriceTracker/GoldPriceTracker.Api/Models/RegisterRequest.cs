using System.ComponentModel.DataAnnotations;

namespace GoldPriceTracker.Api.Models
{
    public class RegisterRequest
    {
        [Required]
        [MaxLength(50)]
        public string UserName { get; set; } = string.Empty;

        [Required]
        [MinLength(6)]
        public string Password { get; set; } = string.Empty;
    }
}
