using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using TravelService.Data;
using TravelService.DTOs;
using TravelService.Exceptions;
using TravelService.Mapping;
using TravelService.Models;

namespace TravelService.Services
{
    public interface IExpenseService
    {
        Task<List<ExpenseDto>> GetForPlanAsync(int planId);
        Task<ExpenseDto> GetByIdAsync(int planId, int expenseId);
        Task<ExpenseDto> CreateAsync(int planId, ExpenseInputDto dto);
        Task<ExpenseDto> UpdateAsync(int planId, int expenseId, ExpenseInputDto dto);
        Task DeleteAsync(int planId, int expenseId);
    }

    public class ExpenseService : IExpenseService
    {
        private readonly TravelDbContext _dbContext;
        private readonly IPlanAccessService _planAccess;

        public ExpenseService(TravelDbContext dbContext, IPlanAccessService planAccess)
        {
            _dbContext = dbContext;
            _planAccess = planAccess;
        }

        public async Task<List<ExpenseDto>> GetForPlanAsync(int planId)
        {
            await _planAccess.RequirePlanAsync(planId, PlanAction.Read);

            var expenses = await _dbContext.Expenses
                .Where(e => e.TravelPlanId == planId)
                .OrderBy(e => e.Date)
                .ToListAsync();

            return expenses.Select(e => e.ToDto()).ToList();
        }

        public async Task<ExpenseDto> GetByIdAsync(int planId, int expenseId)
        {
            await _planAccess.RequirePlanAsync(planId, PlanAction.Read);

            var expense = await FindOrThrowAsync(planId, expenseId);
            return expense.ToDto();
        }

        public async Task<ExpenseDto> CreateAsync(int planId, ExpenseInputDto dto)
        {
            await _planAccess.RequirePlanAsync(planId, PlanAction.ModifyChildren);

            var category = ParseCategory(dto.Category);
            ValidateAmount(dto.Amount);

            var expense = new Expense
            {
                TravelPlanId = planId,
                Name = dto.Name.Trim(),
                Category = category,
                Amount = dto.Amount,
                Date = dto.Date.Date,
                Description = dto.Description?.Trim()
            };

            _dbContext.Expenses.Add(expense);
            await _dbContext.SaveChangesAsync();

            return expense.ToDto();
        }

        public async Task<ExpenseDto> UpdateAsync(
            int planId, int expenseId, ExpenseInputDto dto)
        {
            await _planAccess.RequirePlanAsync(planId, PlanAction.ModifyChildren);

            var category = ParseCategory(dto.Category);
            ValidateAmount(dto.Amount);

            var expense = await FindOrThrowAsync(planId, expenseId);

            expense.Name = dto.Name.Trim();
            expense.Category = category;
            expense.Amount = dto.Amount;
            expense.Date = dto.Date.Date;
            expense.Description = dto.Description?.Trim();

            await _dbContext.SaveChangesAsync();

            return expense.ToDto();
        }

        public async Task DeleteAsync(int planId, int expenseId)
        {
            await _planAccess.RequirePlanAsync(planId, PlanAction.ModifyChildren);

            var expense = await FindOrThrowAsync(planId, expenseId);

            _dbContext.Expenses.Remove(expense);
            await _dbContext.SaveChangesAsync();
        }

        //-----------------------------------------------------------------------------------------------------
        //-----------------------------------------------------------------------------------------------------
        private async Task<Expense> FindOrThrowAsync(int planId, int expenseId)
        {
            var expense = await _dbContext.Expenses
                .FirstOrDefaultAsync(e => e.Id == expenseId && e.TravelPlanId == planId);

            if (expense == null)
                throw new NotFoundException(
                    $"Expense with id {expenseId} was not found in this travel plan.");

            return expense;
        }

        private static void ValidateAmount(decimal amount)
        {
            if (amount <= 0)
                throw new ValidationException("Expense amount must be greater than zero.");
        }

        private static ExpenseCategory ParseCategory(string category)
        {
            if (!Enum.TryParse<ExpenseCategory>(category, true, out var parsed)
                || !Enum.IsDefined(typeof(ExpenseCategory), parsed))
                throw new ValidationException($"'{category}' is not a valid expense category.");

            return parsed;
        }
    }
}
