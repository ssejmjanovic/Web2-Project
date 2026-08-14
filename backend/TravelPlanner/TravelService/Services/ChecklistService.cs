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
    public interface IChecklistService
    {
        Task<List<ChecklistItemDto>> GetForPlanAsync(int planId);
        Task<ChecklistItemDto> GetByIdAsync(int planId, int itemId);
        Task<ChecklistItemDto> CreateAsync(int planId, ChecklistItemInputDto dto);
        Task<ChecklistItemDto> UpdateAsync(int planId, int itemId, ChecklistItemInputDto dto);
        Task DeleteAsync(int planId, int itemId);
    }

    public class ChecklistService : IChecklistService
    {
        private readonly TravelDbContext _dbContext;
        private readonly IPlanAccessService _planAccess;

        public ChecklistService(TravelDbContext dbContext, IPlanAccessService planAccess)
        {
            _dbContext = dbContext;
            _planAccess = planAccess;
        }

        public async Task<List<ChecklistItemDto>> GetForPlanAsync(int planId)
        {
            await _planAccess.RequirePlanAsync(planId, PlanAction.Read);

            var items = await _dbContext.ChecklistItems
                .Where(c => c.TravelPlanId == planId)
                .OrderBy(c => c.Id)
                .ToListAsync();

            return items.Select(c => c.ToDto()).ToList();
        }

        public async Task<ChecklistItemDto> GetByIdAsync(int planId, int itemId)
        {
            await _planAccess.RequirePlanAsync(planId, PlanAction.Read);

            var item = await FindOrThrowAsync(planId, itemId);
            return item.ToDto();
        }

        public async Task<ChecklistItemDto> CreateAsync(
            int planId, ChecklistItemInputDto dto)
        {
            await _planAccess.RequirePlanAsync(planId, PlanAction.ModifyChildren);

            var item = new ChecklistItem
            {
                TravelPlanId = planId,
                Name = dto.Name.Trim(),
                IsCompleted = dto.IsCompleted
            };

            _dbContext.ChecklistItems.Add(item);
            await _dbContext.SaveChangesAsync();

            return item.ToDto();
        }

        public async Task<ChecklistItemDto> UpdateAsync(
            int planId, int itemId, ChecklistItemInputDto dto)
        {
            await _planAccess.RequirePlanAsync(planId, PlanAction.ModifyChildren);

            var item = await FindOrThrowAsync(planId, itemId);

            item.Name = dto.Name.Trim();
            item.IsCompleted = dto.IsCompleted;

            await _dbContext.SaveChangesAsync();

            return item.ToDto();
        }

        public async Task DeleteAsync(int planId, int itemId)
        {
            await _planAccess.RequirePlanAsync(planId, PlanAction.ModifyChildren);

            var item = await FindOrThrowAsync(planId, itemId);

            _dbContext.ChecklistItems.Remove(item);
            await _dbContext.SaveChangesAsync();
        }

        //----------------------------------------------------------------------------------------
        //----------------------------------------------------------------------------------------

        private async Task<ChecklistItem> FindOrThrowAsync(int planId, int itemId)
        {
            var item = await _dbContext.ChecklistItems
                .FirstOrDefaultAsync(c => c.Id == itemId && c.TravelPlanId == planId);

            if (item == null)
                throw new NotFoundException(
                    $"Checklist item with id {itemId} was not found in this travel plan.");

            return item;
        }

    }
}
