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
    public interface ITravelPlanService
    {
        Task<List<TravelPlanSummaryDto>> GetAllForUserAsync(int userId);
        Task<TravelPlanDto> GetByIdAsync(int planId, int userId);
        Task<TravelPlanDto> CreateAsync(int userId, TravelPlanInputDto dto);
        Task<TravelPlanDto> UpdateAsync(int planId, int userId, TravelPlanInputDto dto);
        Task DeleteAsync(int planId, int userId);
    }


    public class TravelPlanService : ITravelPlanService
    {
        private readonly TravelDbContext _dbContext;
        private readonly IPlanAccessService _planAccess;

        public TravelPlanService(TravelDbContext dbContext, IPlanAccessService planAccess)
        {
            _dbContext = dbContext;
            _planAccess = planAccess;
        }

        public async Task<List<TravelPlanSummaryDto>> GetAllForUserAsync(int userId)
        {
            return await _dbContext.TravelPlans
                .Where(p => p.UserId == userId)
                .OrderByDescending(p => p.StartDate)
                .Select(p => new TravelPlanSummaryDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    Description = p.Description,
                    StartDate = p.StartDate,
                    EndDate = p.EndDate,
                    Budget = p.Budget,
                    TotalExpenses = p.Expenses.Sum(e => (decimal?)e.Amount) ?? 0m,
                    RemainingBudget = p.Budget - (p.Expenses.Sum(e => (decimal?)e.Amount) ?? 0m),
                    CreatedAt = p.CreatedAt,
                    DestinationCount = p.Destinations.Count,
                    ActivityCount = p.Activities.Count,
                    ChecklistItemCount = p.ChecklistItems.Count,
                    CompletedChecklistItemCount = p.ChecklistItems.Count(c => c.IsCompleted)
                })
                .ToListAsync();
        }

        public async Task<TravelPlanDto> GetByIdAsync(int planId, int userId)
        {
            var plan = await _planAccess.RequirePlanAsync(planId, userId, includeChuldren: true);
            return plan.ToDto();
        }

        public async Task<TravelPlanDto> CreateAsync(int userId, TravelPlanInputDto dto)
        {
            ValidateDateRange(dto.StartDate, dto.EndDate);

            var plan = new TravelPlan
            {
                UserId = userId,
                Name = dto.Name.Trim(),
                Description = dto.Description?.Trim(),
                StartDate = dto.StartDate.Date,
                EndDate = dto.EndDate.Date,
                Budget = dto.Budget,
                Notes = dto.Notes?.Trim(),
                CreatedAt = DateTime.UtcNow
            };

            _dbContext.TravelPlans.Add(plan);
            await _dbContext.SaveChangesAsync();

            return plan.ToDto();
        }

        public async Task<TravelPlanDto> UpdateAsync(int planId, int userId, TravelPlanInputDto dto)
        {
            ValidateDateRange(dto.StartDate, dto.EndDate);

            var plan = await _planAccess.RequirePlanAsync(planId, userId, includeChuldren: true);

            var newStart = dto.StartDate.Date;
            var newEnd = dto.EndDate.Date;

            if (plan.Activities.Any(a => a.Date < newStart || a.Date > newEnd))
                throw new ValidationException(
                    "Some activities fall outside the new date range. Move or remove them first.");

            plan.Name = dto.Name.Trim();
            plan.Description = dto.Description?.Trim();
            plan.StartDate = newStart;
            plan.EndDate = newEnd;
            plan.Budget = dto.Budget;
            plan.Notes = dto.Notes?.Trim();

            await _dbContext.SaveChangesAsync();

            return plan.ToDto();
        }

        public async Task DeleteAsync(int planId, int userId)
        {
            var plan = await _planAccess.RequirePlanAsync(planId, userId, includeChuldren: true);

            _dbContext.TravelPlans.Remove(plan);
            await _dbContext.SaveChangesAsync();
        }

        //---------------------------------------------------------------------------------
        //---------------------------------------------------------------------------------


        private static void ValidateDateRange(DateTime startDate, DateTime endDate)
        {
            if (endDate.Date < startDate.Date)
                throw new ValidationException("End date cannot be before start date.");
        }
    }
}
