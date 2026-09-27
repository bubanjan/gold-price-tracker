using GoldPriceTracker.Api.Controllers;
using GoldPriceTracker.Api.Data;
using GoldPriceTracker.Api.Models;
using GoldPriceTracker.Api.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace GoldPriceTracker.Api.Tests.Controllers
{
    public class GoldPriceControllerTests
    {
        [Fact]
        public void Get_WhenNoCurrentPrice_ReturnsNotFound()
        {
            // Arrange
            var goldPriceStore = new GoldPriceStore { Current = null };
            var options = new DbContextOptionsBuilder<AppDbContext>().Options;
            using var dbContext = new AppDbContext(options);
            var controller = new GoldPriceController(goldPriceStore, dbContext);

            // Act
            var result = controller.Get();

            // Assert
            Assert.IsType<NotFoundResult>(result);
        }

        [Fact]
        public void Get_WhenCurrentPriceExists_ReturnsOk()
        {
            // Arrange
            var goldPriceResponse = new GoldPriceResponse
            {
                Currency = "USD",
                CurrencySymbol = "$",
                ExchangeRate = 10,
                Name = "Gold price",
                Price = 4000,
            };
            var goldPriceStore = new GoldPriceStore { Current = goldPriceResponse };
            var options = new DbContextOptionsBuilder<AppDbContext>().Options;
            using var dbContext = new AppDbContext(options);
            var controller = new GoldPriceController(goldPriceStore, dbContext);

            // Act
            var result = controller.Get();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.Same(goldPriceResponse, okResult.Value);
        }
    }
}
