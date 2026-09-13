using GoldPriceTracker.Api.Data;
using GoldPriceTracker.Api.Models;
using GoldPriceTracker.Api.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GoldPriceTracker.Api.Controllers
{
    [Route("api/goldprice")]
    [ApiController]
    public class GoldPriceController : ControllerBase
    {
        private readonly GoldPriceStore _goldPriceStore;
        private readonly AppDbContext _dbContext;

        public GoldPriceController(GoldPriceStore goldPriceStore, AppDbContext dbContext)
        {
            _goldPriceStore = goldPriceStore;
            _dbContext = dbContext;
        }

        [HttpGet]
        public IActionResult Get()
        {
            if (_goldPriceStore.Current is null)
            {
                return NotFound();
            }

            return Ok(_goldPriceStore.Current);
        }

        [HttpGet("history")]
        public async Task<IActionResult> GetHistory(
            CancellationToken cancellationToken, 
            [FromQuery] int page = 1, 
            [FromQuery] int pageSize = 20)
        {
            var totalCount = await _dbContext.GoldPrices.CountAsync(cancellationToken);

            var history = await _dbContext.GoldPrices
             .OrderByDescending(x => x.FetchedAt)
             .Skip((page - 1) * pageSize)
             .Take(pageSize)
             .ToListAsync(cancellationToken);

            var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);

            var response = new GoldPriceHistoryResponse
            {
                Items = history,
                Page = page,
                PageSize = pageSize,
                TotalCount = totalCount,
                TotalPages = totalPages
            };

            return Ok(response);
        }

        [HttpDelete("history")]
        public async Task<IActionResult> DeleteHistory(CancellationToken cancellationToken)
        {
            await _dbContext.GoldPrices.ExecuteDeleteAsync(cancellationToken);

            return NoContent();
        }
    }
}
