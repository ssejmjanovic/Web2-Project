using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace TravelService.DTOs
{
    public class ChecklistItemInputDto
    {
        [Required]
        [MaxLength(300)]
        public string Name { get; set; }

        public bool IsCompleted { get; set; }
    }
}
