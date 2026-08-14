using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TravelService.DTOs;
using TravelService.Services;

namespace TravelService.Controllers
{
    [ApiController]
    [Route("api/travel-plans/{planId}/activities")]
    [Authorize]
    public class ActivitiesController : ControllerBase
    {
        private readonly IActivityService _activityService;

        public ActivitiesController(IActivityService activityService)
        {
            _activityService = activityService;
        }

        [HttpGet]
        public async Task<ActionResult<List<ActivityDto>>> GetAll(int planId)
            => Ok(await _activityService.GetForPlanAsync(planId));

        [HttpGet("{id}")]
        public async Task<ActionResult<ActivityDto>> GetById(int planId, int id)
            => Ok(await _activityService.GetByIdAsync(planId, id));

        [HttpPost]
        public async Task<ActionResult<ActivityDto>> Create(int planId, [FromBody] ActivityInputDto dto)
        {
            var created = await _activityService.CreateAsync(planId, dto);
            return CreatedAtAction(nameof(GetById), new { planId, id = created.Id }, created);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ActivityDto>> Update(
            int planId, int id, [FromBody] ActivityInputDto dto)
            => Ok(await _activityService.UpdateAsync(planId, id, dto));

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int planId, int id)
        {
            await _activityService.DeleteAsync(planId, id);
            return NoContent();
        }
    }
}
