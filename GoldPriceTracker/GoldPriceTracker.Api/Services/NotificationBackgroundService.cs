using GoldPriceTracker.Api.Data;
using GoldPriceTracker.Api.Entities;

namespace GoldPriceTracker.Api.Services
{
    public class NotificationBackgroundService : BackgroundService
    {
        private readonly NotificationChannel _notificationChannel;
        private readonly IServiceScopeFactory _scopeFactory;
        private readonly ILogger<NotificationBackgroundService> _logger;

        public NotificationBackgroundService(NotificationChannel notificationChannel, IServiceScopeFactory scopeFactory, ILogger<NotificationBackgroundService> logger)
        {
            _notificationChannel = notificationChannel;
            _scopeFactory = scopeFactory;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            await foreach (var message in _notificationChannel.Reader.ReadAllAsync(stoppingToken))
            {
                try
                {
                    using var scope = _scopeFactory.CreateScope();

                    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();

                    var notification = new Notification
                    {
                        UserId = message.UserId,
                        PriceAlertId = message.PriceAlertId,
                        TargetPrice = message.TargetPrice,
                        TriggeredPrice = message.TriggeredPrice,
                        Condition = message.Condition,
                        CreatedAt = DateTime.UtcNow,
                        IsRead = false
                    };

                    dbContext.Notifications.Add(notification);

                    await dbContext.SaveChangesAsync(stoppingToken);

                    _logger.LogInformation("Notification created for price alert {PriceAlertId}", message.PriceAlertId);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Failed to process notification for price alert {PriceAlertId}", message.PriceAlertId);
                }

            }
        }
    }
}
