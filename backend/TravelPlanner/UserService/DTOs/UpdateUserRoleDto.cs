using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace UserService.DTOs
{
    public class UpdateUserRoleDto
    {
        [Required]
        public string Role { get; set; }
    }
}
