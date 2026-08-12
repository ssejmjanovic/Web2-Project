using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TravelService.DTOs
{
    public class ExpenseDto
    {
        public int Id { get; set; }
        public int TravelPlanId { get; set; }
        public string Name { get; set; }
        public string Category { get; set; }
        public decimal Amount { get; set; }
        public DateTime Date { get; set; }
        public string Description { get; set; }
    }
}
