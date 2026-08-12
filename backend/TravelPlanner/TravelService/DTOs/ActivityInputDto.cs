using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;


namespace TravelService.DTOs
{
    public class ActivityInputDto
    {
        [Required]
        [MaxLength(200)]
        public string Name { get; set; }

        [Required]
        public DateTime Date { get; set; }

        [RegularExpression(@"^([01][0-9]|2[0-3]):[0-5][0-9]$",
            ErrorMessage = "Time must be in HH:mm format.")]
        public string Time { get; set; }

        [MaxLength(300)]
        public string Location { get; set; }

        [MaxLength(1000)]
        public string Description { get; set; }

        [Range(0, 9999999999)]
        public decimal? EstimatedCost { get; set; }

        [Required]
        public string Status { get; set; }
    }
}
