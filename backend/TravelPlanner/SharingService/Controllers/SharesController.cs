using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SharingService.DTOs;
using SharingService.Services;

namespace SharingService.Controllers
{
    [ApiController]
    [Route("api/shares")]
    public class SharesController : ControllerBase
    {
        private readonly IShareService _shareService;

        public SharesController(IShareService shareService)
        {
            _shareService = shareService;
        }

        [HttpPost]
        [Authorize]
        public async Task<ActionResult<ShareDto>> Create([FromBody] CreateShareDto dto)
        {
            var created = await _shareService.CreateAsync(CurrentUserId, dto);
            return CreatedAtAction(nameof(GetForPlan), new { planId = created.TravelPlanId }, created);
        }

        [HttpGet("plans/{planId}")]
        [Authorize]
        public async Task<ActionResult<List<ShareDto>>> GetForPlan(int planId) => Ok(await _shareService.GetForPlanAsync(planId));

        [HttpDelete("{token}")]
        [Authorize]
        public async Task<IActionResult> Revoke(string token)
        {
            await _shareService.RevokeAsync(token, CurrentUserId);
            return NoContent();
        }

        [HttpPost("validate")]
        [AllowAnonymous]
        public async Task<ActionResult<ShareValidationResultDto>> Validate([FromBody] ValidateShareDto dto) => Ok(await _shareService.ValidateAsync(dto.Token));

        private int CurrentUserId => int.Parse(User.FindFirst("sub").Value);
    }
}
