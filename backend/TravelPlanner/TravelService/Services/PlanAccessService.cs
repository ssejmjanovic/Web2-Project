using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using TravelService.Data;
using TravelService.Exceptions;
using TravelService.Models;

namespace TravelService.Services
{

    public interface IPlanAccessService
    {
        Task<TravelPlan> RequirePlanAsync(int planId, int userId, bool includeChuldren = false);
    }

    public class PlanAccessService : IPlanAccessService
    {
        private readonly TravelDbContext _dbContext;

        public PlanAccessService(TravelDbContext dbContext)
        {
            _dbContext = dbContext;
        }


        public async Task<TravelPlan> RequirePlanAsync(int planId, int userId, bool includeChuldren = false)
        {
            var query = _dbContext.TravelPlans.AsQueryable();

            if (includeChuldren)
            {
                query = query
                    .Include(p => p.Destinations)
                    .Include(p => p.Activities)
                    .Include(p => p.Expenses)
                    .Include(p => p.ChecklistItems);
            }

            var plan = await query.FirstOrDefaultAsync(p => p.Id == planId);

            if (plan == null || plan.UserId != userId)
                throw new NotFoundException($"Travel plan with id {planId} was not found.");

            return plan;
        }
    }
}
