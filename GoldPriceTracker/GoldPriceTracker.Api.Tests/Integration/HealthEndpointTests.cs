using GoldPriceTracker.Api.Services;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.Extensions.Hosting;
using System.Net;
using Xunit;

namespace GoldPriceTracker.Api.Tests.Integration
{
    public class HealthEndpointTests
    {
        [Fact]
        public async Task GetHealth_ReturnsOkAndHealthy()
        {
            // Arrange
            await using var factory = new WebApplicationFactory<Program>()
                .WithWebHostBuilder(builder =>
                {
                    builder.ConfigureTestServices(services =>
                    {
                        var workers = services.Where(service =>
                            service.ServiceType == typeof(IHostedService) &&
                            (service.ImplementationType == typeof(GoldPriceBackgroundService) ||
                             service.ImplementationType == typeof(NotificationBackgroundService)))
                            .ToList();

                        foreach (var worker in workers)
                        {
                            services.Remove(worker);
                        }
                    });
                });

            using var client = factory.CreateClient(new WebApplicationFactoryClientOptions
            {
                BaseAddress = new Uri("https://localhost"),
                AllowAutoRedirect = false
            });

            // Act
            using var response = await client.GetAsync("/health");
            var body = await response.Content.ReadAsStringAsync();

            // Assert
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
            Assert.Equal("Healthy", body);
        }
    }
}
