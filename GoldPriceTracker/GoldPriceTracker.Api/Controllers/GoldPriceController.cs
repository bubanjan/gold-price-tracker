using GoldPriceTracker.Api.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace GoldPriceTracker.Api.Controllers
{
    [Route("api/goldprice")]
    [ApiController]
    public class GoldPriceController : ControllerBase
    {
        private readonly GoldPriceStore _goldPriceStore;

        public GoldPriceController(GoldPriceStore goldPriceStore)
        {
            _goldPriceStore = goldPriceStore;
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
    }
}
