using GoldPriceTracker.Api.Data;
using GoldPriceTracker.Api.Entities;
using GoldPriceTracker.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace GoldPriceTracker.Api.Controllers
{
    [Authorize]
    [Route("api/notifications")]
    [ApiController]
    public class NotificationsController : ControllerBase
    {
        private readonly AppDbContext _dbContext;
        public NotificationsController(AppDbContext dbContext)

        {
            _dbContext = dbContext;
        }

        [HttpGet]
        public async Task<ActionResult<List<Notification>>> GetNotifications(CancellationToken cancellationToken)
        {
            var userId = GetCurrentUserId();

            var notifications = await _dbContext.Notifications
                .Where(x => x.UserId == userId)
                .OrderByDescending(x => x.CreatedAt)
                .ToListAsync(cancellationToken);

            return Ok(notifications);
        }

        [HttpPatch("{id}/read")]
        public async Task<IActionResult> UpdateIsRead(int id)
        {
            var userId = GetCurrentUserId();

            var notification = await _dbContext.Notifications.FirstOrDefaultAsync(x => x.Id == id && x.UserId == userId);

            if (notification is null)
            {
                return NotFound();
            }

            notification.IsRead = true;

            await _dbContext.SaveChangesAsync();

            return NoContent();
        }

        private int GetCurrentUserId()
        {
            return int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        }

    }
}
