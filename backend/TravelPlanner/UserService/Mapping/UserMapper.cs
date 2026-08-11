using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using UserService.DTOs;
using UserService.Models;

namespace UserService.Mapping
{
    public static class UserMapper
    {
        public static UserDto ToDto(this User user) => new UserDto
        {
            Id = user.Id,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Email = user.Email,
            Role = user.Role.ToString(),
            CreatedAt = user.CreatedAt,
            IsActive = user.IsActive
        };
    }
}
