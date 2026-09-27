using GoldPriceTracker.Api.Controllers;
using GoldPriceTracker.Api.Data;
using GoldPriceTracker.Api.Entities;
using GoldPriceTracker.Api.Models;
using GoldPriceTracker.Api.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.Sqlite;
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
        public async Task DeleteHistory_WhenPricesExist_DeletesAllPricesAndReturnsNoContent()
        {
            // Arrange
            await using var connection = new SqliteConnection("Data Source=:memory:");
            await connection.OpenAsync();

            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseSqlite(connection)
                .Options;
            await using var dbContext = new AppDbContext(options);
            await dbContext.Database.EnsureCreatedAsync();

            dbContext.GoldPrices.AddRange(
                new GoldPrice { Price = 4000m, Currency = "USD", Symbol = "XAU" },
                new GoldPrice { Price = 4100m, Currency = "USD", Symbol = "XAU" });
            await dbContext.SaveChangesAsync();

            var controller = new GoldPriceController(new GoldPriceStore(), dbContext);

            // Act
            var result = await controller.DeleteHistory(CancellationToken.None);

            // Assert
            Assert.IsType<NoContentResult>(result);
            Assert.False(await dbContext.GoldPrices.AnyAsync());
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
