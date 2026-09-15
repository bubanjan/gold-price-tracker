using GoldPriceTracker.Api.Entities;
using System.ComponentModel.DataAnnotations;

namespace GoldPriceTracker.Api.Models
{
    public class UpdatePriceAlertRequest
    {
        [Range(0.01, double.MaxValue)]
        public decimal TargetPrice { get; set; }
        public AlertCondition Condition { get; set; }
        public bool IsActive { get; set; }
    }
}
