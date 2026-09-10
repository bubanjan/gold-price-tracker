using GoldPriceTracker.Api.Entities;

namespace GoldPriceTracker.Api.Models
{
    public class GoldPriceHistoryResponse
    {
        public List<GoldPrice> Items { get; set; } = [];
        public int Page { get; set; }
        public int PageSize { get; set; }
        public int TotalCount { get; set; }
        public int TotalPages { get; set; }
    }
}
