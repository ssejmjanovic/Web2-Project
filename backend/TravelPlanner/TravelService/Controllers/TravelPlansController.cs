using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TravelService.DTOs;
using TravelService.Services;

namespace TravelService.Controllers
{
    [ApiController]
    [Route("api/travel-plans")]
    [Authorize]
    public class TravelPlansController : ApiControllerBase
    {
        private readonly ITravelPlanService _travelPlanService;

        public TravelPlansController(ITravelPlanService travelPlanService)
        {
            _travelPlanService = travelPlanService;
        }

        [HttpGet]
        public async Task<ActionResult<List<TravelPlanSummaryDto>>> GetAll()
            => Ok(await _travelPlanService.GetAllForUserAsync(CurrentUserId));

        [HttpGet("{id}")]
        public async Task<ActionResult<TravelPlanDto>> GetById(int id)
            => Ok(await _travelPlanService.GetByIdAsync(id, CurrentUserId));

        [HttpPost]
        public async Task<ActionResult<TravelPlanDto>> Create([FromBody] TravelPlanInputDto dto)
        {
            var created = await _travelPlanService.CreateAsync(CurrentUserId, dto);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<TravelPlanDto>> Update(
            int id, [FromBody] TravelPlanInputDto dto)
            => Ok(await _travelPlanService.UpdateAsync(id, CurrentUserId, dto));

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _travelPlanService.DeleteAsync(id, CurrentUserId);
            return NoContent();
        }
    }
}
