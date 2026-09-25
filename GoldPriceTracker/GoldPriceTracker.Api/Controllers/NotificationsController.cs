using GoldPriceTracker.Api.Data;
using GoldPriceTracker.Api.Entities;
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

        private int GetCurrentUserId()
        {
            return int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        }

    }
}
