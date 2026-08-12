using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TravelService.DTOs
{
    public class ChecklistItemDto
    {
        public int Id { get; set; }
        public int TravelPlanId { get; set; }
        public string Name { get; set; }
        public bool IsCompleted { get; set; }
    }
}
