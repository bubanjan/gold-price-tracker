using GoldPriceTracker.Api.Messages;
using System.Threading.Channels;

namespace GoldPriceTracker.Api.Services
{
    public class NotificationChannel
    {
        private readonly Channel<PriceAlertTriggered> _channel;

        public NotificationChannel()
        {
            _channel = Channel.CreateUnbounded<PriceAlertTriggered>();
        }

        public ChannelWriter<PriceAlertTriggered> Writer => _channel.Writer;

        public ChannelReader<PriceAlertTriggered> Reader => _channel.Reader;
    }
}
