using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TravelService.DTOs;
using TravelService.Services;

namespace TravelService.Controllers
{
    [ApiController]
    [Route("api/travel-plans/{planId}/expenses")]
    [Authorize]
    public class ExpensesController : ControllerBase
    {
        private readonly IExpenseService _expenseService;

        public ExpensesController(IExpenseService expenseService)
        {
            _expenseService = expenseService;
        }

        [HttpGet]
        public async Task<ActionResult<List<ExpenseDto>>> GetAll(int planId)
            => Ok(await _expenseService.GetForPlanAsync(planId));

        [HttpGet("{id}")]
        public async Task<ActionResult<ExpenseDto>> GetById(int planId, int id)
            => Ok(await _expenseService.GetByIdAsync(planId, id));

        [HttpPost]
        public async Task<ActionResult<ExpenseDto>> Create(int planId, [FromBody] ExpenseInputDto dto)
        {
            var created = await _expenseService.CreateAsync(planId, dto);
            return CreatedAtAction(nameof(GetById), new { planId, id = created.Id }, created);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ExpenseDto>> Update(
            int planId, int id, [FromBody] ExpenseInputDto dto)
            => Ok(await _expenseService.UpdateAsync(planId, id, dto));

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int planId, int id)
        {
            await _expenseService.DeleteAsync(planId, id);
            return NoContent();
        }
    }
}
