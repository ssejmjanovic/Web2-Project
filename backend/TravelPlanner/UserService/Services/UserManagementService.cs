using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using UserService.Data;
using UserService.DTOs;
using UserService.Exceptions;
using UserService.Mapping;
using UserService.Models;

namespace UserService.Services
{
    public interface IUserManagementService
    {
        Task<List<UserDto>> GetAllAsync();
        Task<UserDto> GetByIdAsync(int id);
        Task<UserDto> UpdateProfileAsync(int userId, UpdateUserDto dto);
        Task ChangePasswordAsync(int userId, ChangePasswordDto dto);
        Task<UserDto> UpdateRoleAsync(int userId, UpdateUserRoleDto dto);
        Task<UserDto> SetActiveAsync(int userId, bool isActive);
    }


    public class UserManagementService : IUserManagementService
    {
        private readonly UserDbContext _dbContext;

        public UserManagementService(UserDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<List<UserDto>> GetAllAsync()
        {
            var users = await _dbContext.Users
                .OrderBy(u => u.Id)
                .ToListAsync();
            return users.Select(u => u.ToDto()).ToList();
        }

        public async Task<UserDto> GetByIdAsync(int id)
        {
            var user = await FindOrThrowAsync(id);
            return user.ToDto();
        }

        public async Task<UserDto> UpdateProfileAsync(int userId, UpdateUserDto dto)
        {
            var user = await FindOrThrowAsync(userId);

            user.FirstName = dto.FirstName.Trim();
            user.LastName = dto.LastName.Trim();

            await _dbContext.SaveChangesAsync();
            return user.ToDto();

        }

        public async Task ChangePasswordAsync(int userId, ChangePasswordDto dto)
        {
            var user = await FindOrThrowAsync(userId);

            if (!BCrypt.Net.BCrypt.Verify(dto.CurrentPassword, user.PasswordHash))
                throw new UnauthorizedException("Current password is incorrect.");

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);
            await _dbContext.SaveChangesAsync();
        }

        public async Task<UserDto> UpdateRoleAsync(int userId, UpdateUserRoleDto dto)
        {
            var user = await FindOrThrowAsync(userId);

            if (!Enum.TryParse<UserRole>(dto.Role, true, out var role))
                throw new ValidationException($"'{dto.Role}' is not a valid role.");

            user.Role = role;
            await _dbContext.SaveChangesAsync();
            return user.ToDto();
        }


        public async Task<UserDto> SetActiveAsync(int userId, bool isActive)
        {
            var user = await FindOrThrowAsync(userId);

            user.IsActive = isActive;
            await _dbContext.SaveChangesAsync();
            return user.ToDto();
        }


        private async Task<User> FindOrThrowAsync(int id)
        {
            var user = await _dbContext.Users.FindAsync(id);
            if (user == null)
                throw new NotFoundException($"User with id {id} was not found");

            return user;
        }
    }
}
