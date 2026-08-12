using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using UserService.Models;

namespace UserService.Data
{
    public static class UserDbSeeder
    {
        public static void SeedAdmin(UserDbContext dbContext, IConfiguration configuration)
        {
            var email = configuration["Admin:Email"].Trim().ToLowerInvariant();

            if (dbContext.Users.Any(u => u.Email == email))
                return;

            dbContext.Users.Add(new User
            {
                FirstName = "System",
                LastName = "Administrator",
                Email = email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(configuration["Admin:Password"]),
                Role = UserRole.Admin,
                CreatedAt = DateTime.UtcNow,
                IsActive = true
            });

            dbContext.SaveChanges();
        }
    }
}
