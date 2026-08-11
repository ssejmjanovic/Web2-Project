using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using UserService.Data;
using UserService.DTOs;
using UserService.Exceptions;
using UserService.Mapping;
using UserService.Models;

namespace UserService.Services
{

    public interface IAuthService
    {
        Task<AuthResponseDto> RegisterAsync(RegisterDto dto);
        Task<AuthResponseDto> LoginAsync(LoginDto dto);
    }

    public class AuthService : IAuthService
    {

        private readonly UserDbContext _dbContext;
        private readonly IJwtService _jwtService;

        public AuthService(UserDbContext dbContext, IJwtService jwtService)
        {
            _dbContext = dbContext;
            _jwtService = jwtService;
        }

        public async Task<AuthResponseDto> RegisterAsync(RegisterDto dto)
        {
            var email = dto.Email.Trim().ToLowerInvariant();

            if (await _dbContext.Users.AnyAsync(u => u.Email == email))
                throw new ConflictException("An account with this email already exists.");

            var user = new User
            {
                FirstName = dto.FirstName.Trim(),
                LastName = dto.LastName.Trim(),
                Email = email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                Role = UserRole.User,
                CreatedAt = DateTime.UtcNow,
                IsActive = true
            };

            _dbContext.Users.Add(user);
            await _dbContext.SaveChangesAsync();

            return BuildAuthResponse(user);
        }

        public async Task<AuthResponseDto> LoginAsync(LoginDto dto)
        {
            var email = dto.Email.Trim().ToLowerInvariant();

            var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Email == email);

            if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
                throw new UnauthorizedException("Invalid email or password.");

            if (!user.IsActive)
                throw new ForbiddenException("This account has been deactivated.");

            return BuildAuthResponse(user);
        }

        private AuthResponseDto BuildAuthResponse(User user)
        {
            var generated = _jwtService.GenerateToken(user);

            return new AuthResponseDto
            {
                Token = generated.Token,
                ExpiresAtUtc = generated.ExpiresAtUtc,
                User = user.ToDto()
            };
        }


    }
}
