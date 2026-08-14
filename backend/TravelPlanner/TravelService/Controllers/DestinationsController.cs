using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TravelService.DTOs;
using TravelService.Services;

namespace TravelService.Controllers
{
    [ApiController]
    [Route("api/travel-plans/{planId}/destinations")]
    [Authorize]
    public class DestinationsController : ControllerBase
    {
        private readonly IDestinationService _destinationService;

        public DestinationsController(IDestinationService destinationService)
        {
            _destinationService = destinationService;
        }

        [HttpGet]
        public async Task<ActionResult<List<DestinationDto>>> GetAll(int planId)
            => Ok(await _destinationService.GetForPlanAsync(planId));

        [HttpGet("{id}")]
        public async Task<ActionResult<DestinationDto>> GetById(int planId, int id)
            => Ok(await _destinationService.GetByIdAsync(planId, id));

        [HttpPost]
        public async Task<ActionResult<DestinationDto>> Create(int planId, [FromBody] DestinationInputDto dto)
        {
            var created = await _destinationService.CreateAsync(planId, dto);
            return CreatedAtAction(nameof(GetById), new { planId, id = created.Id }, created);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<DestinationDto>> Update(
            int planId, int id, [FromBody] DestinationInputDto dto)
            => Ok(await _destinationService.UpdateAsync(planId, id, dto));

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int planId, int id)
        {
            await _destinationService.DeleteAsync(planId, id);
            return NoContent();
        }
    }
}
