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

    public enum PlanAction
    {
        Read,
        ModifyChildren,
        ModifyPlan
    }

    public interface IPlanAccessService
    {
        Task<TravelPlan> RequirePlanAsync(int planId, PlanAction action, bool includeChildren = false);
    }

    public class PlanAccessService : IPlanAccessService
    {
        private readonly TravelDbContext _dbContext;
        private readonly ICallerContext _caller;

        public PlanAccessService(TravelDbContext dbContext, ICallerContext caller)
        {
            _dbContext = dbContext;
            _caller = caller;
        }


        public async Task<TravelPlan> RequirePlanAsync(int planId, PlanAction action, bool includeChildren = false)
        {
            var query = _dbContext.TravelPlans.AsQueryable();

            if (includeChildren)
            {
                query = query
                    .Include(p => p.Destinations)
                    .Include(p => p.Activities)
                    .Include(p => p.Expenses)
                    .Include(p => p.ChecklistItems);
            }

            var plan = await query.FirstOrDefaultAsync(p => p.Id == planId);

            if (plan == null)
                throw new NotFoundException($"Travel plan with id {planId} was not found.");

            if (_caller.IsShareVisitor)
            {
                if (_caller.SharePlanId != planId)
                    throw new NotFoundException($"Travel plan with id {planId} was not found.");
                if (action == PlanAction.ModifyPlan)
                    throw new ForbiddenException("A shared link cannot change or delete the travel plan itself.");
                if (action == PlanAction.ModifyChildren && _caller.ShareAccess != ShareAccess.Edit)
                    throw new ForbiddenException("This share link is read-only.");

                return plan;
            }

            if (plan.UserId != _caller.UserId)
                throw new NotFoundException($"Travel plan with id {planId} was not found.");

            return plan;
        }
    }
}
