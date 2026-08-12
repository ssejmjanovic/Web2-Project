using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TravelService.DTOs
{
    public class TravelPlanSummaryDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public decimal Budget { get; set; }
        public decimal TotalExpenses { get; set; }
        public decimal RemainingBudget { get; set; }
        public DateTime CreatedAt { get; set; }

        public int DestinationCount { get; set; }
        public int ActivityCount { get; set; }
        public int ChecklistItemCount { get; set; }
        public int CompletedChecklistItemCount { get; set; }
    }
}
