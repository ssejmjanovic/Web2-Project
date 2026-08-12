using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TravelService.Models
{
    public class TravelPlan
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public decimal Budget { get; set; }
        public string Notes { get; set; }


        public List<Destination> Destinations { get; set; } = new List<Destination>();
        public List<Activity> Activities { get; set; } = new List<Activity>();
        public List<Expense> Expenses { get; set; } = new List<Expense>();
        public List<CheklistItem> CheklistItems { get; set; } = new List<CheklistItem>();
    }
}
