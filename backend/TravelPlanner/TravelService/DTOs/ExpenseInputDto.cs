using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace TravelService.DTOs
{
    public class ExpenseInputDto
    {
        [Required]
        [MaxLength(200)]
        public string Name { get; set; }

        [Required]
        public string Category { get; set; }

        [Range(0.01, 9999999999)]
        public decimal Amount { get; set; }

        [Required]
        public DateTime Date { get; set; }

        [MaxLength(1000)]
        public string Description { get; set; }
    }
}
