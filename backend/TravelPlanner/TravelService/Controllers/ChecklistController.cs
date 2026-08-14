using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TravelService.DTOs;
using TravelService.Services;

namespace TravelService.Controllers
{
    [ApiController]
    [Route("api/travel-plans/{planId}/checklist")]
    [Authorize]
    public class ChecklistController : ControllerBase
    {
        private readonly IChecklistService _checklistService;

        public ChecklistController(IChecklistService checklistService)
        {
            _checklistService = checklistService;
        }

        [HttpGet]
        public async Task<ActionResult<List<ChecklistItemDto>>> GetAll(int planId)
            => Ok(await _checklistService.GetForPlanAsync(planId));

        [HttpGet("{id}")]
        public async Task<ActionResult<ChecklistItemDto>> GetById(int planId, int id)
            => Ok(await _checklistService.GetByIdAsync(planId, id));

        [HttpPost]
        public async Task<ActionResult<ChecklistItemDto>> Create(int planId, [FromBody] ChecklistItemInputDto dto)
        {
            var created = await _checklistService.CreateAsync(planId, dto);
            return CreatedAtAction(nameof(GetById), new { planId, id = created.Id }, created);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ChecklistItemDto>> Update(
            int planId, int id, [FromBody] ChecklistItemInputDto dto)
            => Ok(await _checklistService.UpdateAsync(planId, id, dto));

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int planId, int id)
        {
            await _checklistService.DeleteAsync(planId, id);
            return NoContent();
        }
    }
}
