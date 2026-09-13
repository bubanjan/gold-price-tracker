using GoldPriceTracker.Api.Data;
using GoldPriceTracker.Api.Entities;
using GoldPriceTracker.Api.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GoldPriceTracker.Api.Controllers
{
    [Route("api/pricealerts")]
    [ApiController]
    public class PriceAlertsController : ControllerBase
    {
        private readonly AppDbContext _dbContext;

        public PriceAlertsController(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpGet]
        public async Task<ActionResult<List<PriceAlert>>> GetAll()
        {
            var alerts = await _dbContext.PriceAlerts
                .OrderByDescending(x => x.CreatedAt)
                .ToListAsync();

            return Ok(alerts);
        }

        [HttpPost]
        public async Task<ActionResult<PriceAlert>> Create(CreatePriceAlertRequest request)
        {
            var alert = new PriceAlert
            {
                TargetPrice = request.TargetPrice,
                Condition = request.Condition,
                IsActive = true,
                IsTriggered = false,
                CreatedAt = DateTime.UtcNow
            };

            _dbContext.PriceAlerts.Add(alert);

            await _dbContext.SaveChangesAsync();

            return CreatedAtAction(
                nameof(GetById),
                new { id = alert.Id },
                alert
            );
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<PriceAlert>> GetById(int id)
        {
            var alert = await _dbContext.PriceAlerts.FindAsync(id);

            if (alert is null)
            {
                return NotFound();
            }

            return Ok(alert);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(
            int id,
            UpdatePriceAlertRequest request)
        {
            var alert = await _dbContext.PriceAlerts.FindAsync(id);

            if (alert is null)
            {
                return NotFound();
            }

            alert.TargetPrice = request.TargetPrice;
            alert.Condition = request.Condition;
            alert.IsActive = request.IsActive;

            alert.IsTriggered = false;
            alert.TriggeredAt = null;

            await _dbContext.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var alert = await _dbContext.PriceAlerts.FindAsync(id);

            if (alert is null)
            {
                return NotFound();
            }

            _dbContext.PriceAlerts.Remove(alert);

            await _dbContext.SaveChangesAsync();

            return NoContent();
        }
    }
}