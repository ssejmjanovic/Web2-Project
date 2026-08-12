using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using UserService.DTOs;
using UserService.Services;

namespace UserService.Controllers
{
    [ApiController]
    [Route("api/users")]
    [Authorize]
    public class UsersController : ControllerBase
    {
        private readonly IUserManagementService _userManagementService;

        public UsersController(IUserManagementService userManagementService)
        {
            _userManagementService = userManagementService;
        }

        [HttpGet("me")]
        public async Task<ActionResult<UserDto>> GetCurrentUser() => Ok(await _userManagementService.GetByIdAsync(CurrentUserId));

        [HttpPut("me")]
        public async Task<ActionResult<UserDto>> UpdateCurrentUser([FromBody] UpdateUserDto dto) => Ok(await _userManagementService.UpdateProfileAsync(CurrentUserId, dto));

        [HttpPut("me/password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto dto)
        {
            await _userManagementService.ChangePasswordAsync(CurrentUserId, dto);
            return NoContent();
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<List<UserDto>>> GetAll() => Ok(await _userManagementService.GetAllAsync());

        [HttpGet("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<UserDto>> GetById(int id) => Ok(await _userManagementService.GetByIdAsync(id));

        [HttpPut("{id}/role")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<UserDto>> UpdateRole(int id, [FromBody] UpdateUserRoleDto dto) => Ok(await _userManagementService.UpdateRoleAsync(id, dto));

        [HttpPut("{id}/status")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<UserDto>> UpdateStatus(int id, [FromBody] UpdateUserStatusDto dto) => Ok(await _userManagementService.SetActiveAsync(id, dto.IsActive));


        private int CurrentUserId => int.Parse(User.FindFirst("sub").Value);
    }
}
