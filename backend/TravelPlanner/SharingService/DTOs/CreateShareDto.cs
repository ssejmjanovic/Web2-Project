using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace SharingService.DTOs
{
    public class CreateShareDto
    {
        [Required]
        public int TravelPlanId { get; set; }
        [Required]
        public string AccessLevel { get; set; }
        [Range(1, 8760)]
        public int? ExpiresInHours { get; set; }
    }
}
