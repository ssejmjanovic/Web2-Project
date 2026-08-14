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

    public interface IDestinationService
    {
        Task<List<DestinationDto>> GetForPlanAsync(int planId);
        Task<DestinationDto> GetByIdAsync(int planId, int destinationId);
        Task<DestinationDto> CreateAsync(int planId, DestinationInputDto dto);
        Task<DestinationDto> UpdateAsync(int planId, int destinationId, DestinationInputDto dto);
        Task DeleteAsync(int planId, int destinationId);
    }


    public class DestinationService : IDestinationService
    {
        private readonly TravelDbContext _dbContext;
        private readonly IPlanAccessService _planAccess;

        public DestinationService(TravelDbContext dbContext, IPlanAccessService planAccess)
        {
            _dbContext = dbContext;
            _planAccess = planAccess;
        }

        public async Task<List<DestinationDto>> GetForPlanAsync(int planId)
        {
            await _planAccess.RequirePlanAsync(planId, PlanAction.Read);

            var destinations = await _dbContext.Destinations
                .Where(d => d.TravelPlanId == planId)
                .OrderBy(d => d.ArrivalDate)
                .ToListAsync();

            return destinations.Select(d => d.ToDto()).ToList();
        }

        public async Task<DestinationDto> GetByIdAsync(int planId, int destinationId)
        {
            await _planAccess.RequirePlanAsync(planId, PlanAction.Read);

            var destination = await FindOrThrowAsync(planId, destinationId);
            return destination.ToDto();
        }

        public async Task<DestinationDto> CreateAsync(
           int planId, DestinationInputDto dto)
        {
            var plan = await _planAccess.RequirePlanAsync(planId, PlanAction.ModifyChildren);
            ValidateDates(plan, dto);

            var destination = new Destination
            {
                TravelPlanId = planId,
                Name = dto.Name.Trim(),
                Location = dto.Location.Trim(),
                ArrivalDate = dto.ArrivalDate.Date,
                DepartureDate = dto.DepartureDate.Date,
                Description = dto.Description?.Trim(),
                Notes = dto.Notes?.Trim()
            };

            _dbContext.Destinations.Add(destination);
            await _dbContext.SaveChangesAsync();

            return destination.ToDto();
        }

        public async Task<DestinationDto> UpdateAsync(
           int planId, int destinationId, DestinationInputDto dto)
        {
            var plan = await _planAccess.RequirePlanAsync(planId, PlanAction.ModifyChildren);
            ValidateDates(plan, dto);

            var destination = await FindOrThrowAsync(planId, destinationId);

            destination.Name = dto.Name.Trim();
            destination.Location = dto.Location.Trim();
            destination.ArrivalDate = dto.ArrivalDate.Date;
            destination.DepartureDate = dto.DepartureDate.Date;
            destination.Description = dto.Description?.Trim();
            destination.Notes = dto.Notes?.Trim();

            await _dbContext.SaveChangesAsync();

            return destination.ToDto();
        }

        public async Task DeleteAsync(int planId, int destinationId)
        {
            await _planAccess.RequirePlanAsync(planId, PlanAction.ModifyChildren);

            var destination = await FindOrThrowAsync(planId, destinationId);

            _dbContext.Destinations.Remove(destination);
            await _dbContext.SaveChangesAsync();
        }



        //-----------------------------------------------------------------------------------------------
        //-----------------------------------------------------------------------------------------------

        private async Task<Destination> FindOrThrowAsync(int planId, int destinationId)
        {
            var destination = await _dbContext.Destinations
                .FirstOrDefaultAsync(d => d.Id == destinationId && d.TravelPlanId == planId);

            if (destination == null)
                throw new NotFoundException($"Destination with id {destinationId} was not found in this travel plan.");

            return destination;
        }

        private static void ValidateDates(TravelPlan plan, DestinationInputDto dto)
        {
            if (dto.DepartureDate.Date < dto.ArrivalDate.Date)
                throw new ValidationException("Departure date cannot be before arrival date.");

            if (dto.ArrivalDate.Date < plan.StartDate || dto.DepartureDate.Date > plan.EndDate)
                throw new ValidationException(
                    "Destination dates must fall within the travel plan dates.");
        }
    }
}
