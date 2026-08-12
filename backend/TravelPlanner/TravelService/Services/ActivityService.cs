using System;
using System.Collections.Generic;
using System.Globalization;
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

    public interface IActivityService
    {
        Task<List<ActivityDto>> GetForPlanAsync(int planId, int userId);
        Task<ActivityDto> GetByIdAsync(int planId, int activityId, int userId);
        Task<ActivityDto> CreateAsync(int planId, int userId, ActivityInputDto dto);
        Task<ActivityDto> UpdateAsync(int planId, int activityId, int userId, ActivityInputDto dto);
        Task DeleteAsync(int planId, int activityId, int userId);
    }
    public class ActivityService : IActivityService
    {
        private readonly TravelDbContext _dbContext;
        private readonly IPlanAccessService _planAccess;

        public ActivityService(TravelDbContext dbContext, IPlanAccessService planAccess)
        {
            _dbContext = dbContext;
            _planAccess = planAccess;
        }

        public async Task<List<ActivityDto>> GetForPlanAsync(int planId, int userId)
        {
            await _planAccess.RequirePlanAsync(planId, userId);

            var activities = await _dbContext.Activities
                .Where(a => a.TravelPlanId == planId)
                .OrderBy(a => a.Date).ThenBy(a => a.Time)
                .ToListAsync();

            return activities.Select(a => a.ToDto()).ToList();
        }

        public async Task<ActivityDto> GetByIdAsync(int planId, int activityId, int userId)
        {
            await _planAccess.RequirePlanAsync(planId, userId);

            var activity = await FindOrThrowAsync(planId, activityId);
            return activity.ToDto();
        }

        public async Task<ActivityDto> CreateAsync(int planId, int userId, ActivityInputDto dto)
        {
            var plan = await _planAccess.RequirePlanAsync(planId, userId);

            var date = ValidateDate(plan, dto.Date);
            var time = ParseTime(dto.Time);
            var status = ParseStatus(dto.Status);

            var activity = new Activity
            {
                TravelPlanId = planId,
                Name = dto.Name.Trim(),
                Date = date,
                Time = time,
                Location = dto.Location?.Trim(),
                Description = dto.Description?.Trim(),
                EstimatedCost = dto.EstimatedCost,
                Status = status
            };

            _dbContext.Activities.Add(activity);
            await _dbContext.SaveChangesAsync();

            return activity.ToDto();
        }

        public async Task<ActivityDto> UpdateAsync(
            int planId, int activityId, int userId, ActivityInputDto dto)
        {
            var plan = await _planAccess.RequirePlanAsync(planId, userId);

            var date = ValidateDate(plan, dto.Date);
            var time = ParseTime(dto.Time);
            var status = ParseStatus(dto.Status);

            var activity = await FindOrThrowAsync(planId, activityId);

            activity.Name = dto.Name.Trim();
            activity.Date = date;
            activity.Time = time;
            activity.Location = dto.Location?.Trim();
            activity.Description = dto.Description?.Trim();
            activity.EstimatedCost = dto.EstimatedCost;
            activity.Status = status;

            await _dbContext.SaveChangesAsync();

            return activity.ToDto();
        }

        public async Task DeleteAsync(int planId, int activityId, int userId)
        {
            await _planAccess.RequirePlanAsync(planId, userId);

            var activity = await FindOrThrowAsync(planId, activityId);

            _dbContext.Activities.Remove(activity);
            await _dbContext.SaveChangesAsync();
        }

        //------------------------------------------------------------------------------------------------
        //------------------------------------------------------------------------------------------------

        private async Task<Activity> FindOrThrowAsync(int planId, int activityId)
        {
            var activity = await _dbContext.Activities
                .FirstOrDefaultAsync(a => a.Id == activityId && a.TravelPlanId == planId);

            if (activity == null)
                throw new NotFoundException(
                    $"Activity with id {activityId} was not found in this travel plan.");

            return activity;
        }

        private static DateTime ValidateDate(TravelPlan plan, DateTime date)
        {
            var value = date.Date;

            if (value < plan.StartDate || value > plan.EndDate)
                throw new ValidationException(
                    "Activity date must fall within the travel plan dates.");

            return value;
        }

        private static TimeSpan? ParseTime(string time)
        {
            if (string.IsNullOrWhiteSpace(time))
                return null;

            if (!TimeSpan.TryParseExact(
                    time.Trim(), @"hh\:mm", CultureInfo.InvariantCulture, out var parsed))
                throw new ValidationException("Time must be in HH:mm format.");

            return parsed;
        }

        private static ActivityStatus ParseStatus(string status)
        {
            if (!Enum.TryParse<ActivityStatus>(status, true, out var parsed)
                || !Enum.IsDefined(typeof(ActivityStatus), parsed))
                throw new ValidationException($"'{status}' is not a valid activity status.");

            return parsed;
        }
    }
}
