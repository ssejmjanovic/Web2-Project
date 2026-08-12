using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TravelService.Models
{
    public class ChecklistItem
    {
        public int Id { get; set; }
        public int TravelPlanId { get; set; }
        public string Name { get; set; }
        public bool IsCompleted { get; set; }

        public TravelPlan TravelPlan { get; set; }
    }
}
