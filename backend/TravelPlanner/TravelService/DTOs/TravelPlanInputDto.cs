using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace TravelService.DTOs
{
    public class TravelPlanInputDto
    {
        [Required]
        [MaxLength(200)]
        public string Name { get; set; }

        [MaxLength(2000)]
        public string Description { get; set; }

        [Required]
        public DateTime StartDate { get; set; }

        [Required]
        public DateTime EndDate { get; set; }

        [Range(0, 9999999999)]
        public decimal Budget { get; set; }

        [MaxLength(2000)]
        public string Notes { get; set; }
    }
}
