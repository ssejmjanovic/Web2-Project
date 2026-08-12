using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TravelService.DTOs
{
    public class TravelPlanDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public decimal Budget { get; set; }
        public decimal TotalExpenses { get; set; }
        public decimal RemainingBudget { get; set; }
        public string Notes { get; set; }
        public DateTime CreatedAt { get; set; }

        public List<DestinationDto> Destinations { get; set; } = new List<DestinationDto>();
        public List<ActivityDto> Activities { get; set; } = new List<ActivityDto>();
        public List<ExpenseDto> Expenses { get; set; } = new List<ExpenseDto>();
        public List<ChecklistItemDto> ChecklistItems { get; set; } = new List<ChecklistItemDto>();
    }
}
