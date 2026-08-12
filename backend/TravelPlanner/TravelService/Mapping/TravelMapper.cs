using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TravelService.DTOs;
using TravelService.Models;

namespace TravelService.Mapping
{
    public static class TravelMapper
    {
        public static DestinationDto ToDto(this Destination destination) => new DestinationDto
        {
            Id = destination.Id,
            TravelPlanId = destination.TravelPlanId,
            Name = destination.Name,
            Location = destination.Location,
            ArrivalDate = destination.ArrivalDate,
            DepartureDate = destination.DepartureDate,
            Description = destination.Description,
            Notes = destination.Notes
        };

        public static ActivityDto ToDto(this Activity activity) => new ActivityDto
        {
            Id = activity.Id,
            TravelPlanId = activity.TravelPlanId,
            Name = activity.Name,
            Date = activity.Date,
            Time = activity.Time?.ToString(@"hh\:mm"),
            Location = activity.Location,
            Description = activity.Description,
            EstimatedCost = activity.EstimatedCost,
            Status = activity.Status.ToString()
        };

        public static ExpenseDto ToDto(this Expense expense) => new ExpenseDto
        {
            Id = expense.Id,
            TravelPlanId = expense.TravelPlanId,
            Name = expense.Name,
            Category = expense.Category.ToString(),
            Amount = expense.Amount,
            Date = expense.Date,
            Description = expense.Description
        };

        public static ChecklistItemDto ToDto(this ChecklistItem item) => new ChecklistItemDto
        {
            Id = item.Id,
            TravelPlanId = item.TravelPlanId,
            Name = item.Name,
            IsCompleted = item.IsCompleted
        };

        public static TravelPlanDto ToDto(this TravelPlan plan)
        {
            var totalExpenses = plan.Expenses.Sum(e => e.Amount);

            return new TravelPlanDto
            {
                Id = plan.Id,
                UserId = plan.UserId,
                Name = plan.Name,
                Description = plan.Description,
                StartDate = plan.StartDate,
                EndDate = plan.EndDate,
                Budget = plan.Budget,
                TotalExpenses = totalExpenses,
                RemainingBudget = plan.Budget - totalExpenses,
                Notes = plan.Notes,
                CreatedAt = plan.CreatedAt,

                Destinations = plan.Destinations
                    .OrderBy(d => d.ArrivalDate)
                    .Select(d => d.ToDto()).ToList(),

                Activities = plan.Activities
                    .OrderBy(a => a.Date).ThenBy(a => a.Time ?? TimeSpan.Zero)
                    .Select(a => a.ToDto()).ToList(),

                Expenses = plan.Expenses
                    .OrderBy(e => e.Date)
                    .Select(e => e.ToDto()).ToList(),

                ChecklistItems = plan.ChecklistItems
                    .OrderBy(c => c.Id)
                    .Select(c => c.ToDto()).ToList()
            };
        }
    }
}
