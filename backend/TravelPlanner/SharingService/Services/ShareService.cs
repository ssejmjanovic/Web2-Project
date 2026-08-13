using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using SharingService.DTOs;
using SharingService.Exceptions;
using SharingService.Mapping;
using SharingService.Models;

namespace SharingService.Services
{

    public interface IShareService
    {
        Task<ShareDto> CreateAsync(int userId, CreateShareDto dto);
        Task<ShareValidationResultDto> ValidateAsync(string token);
        Task<List<ShareDto>> GetForPlanAsync(int travelPlanId);
        Task RevokeAsync(string toke, int userId);
    }

    public class ShareService : IShareService
    {
        private readonly IShareTokenStore _store;
        private readonly ITravelPlanOwnershipClient _ownershipClient;
        private readonly int _defaultExpiryHours;

        public ShareService(IShareTokenStore store, ITravelPlanOwnershipClient ownershipClient, IConfiguration configuration)
        {
            _store = store;
            _ownershipClient = ownershipClient;
            _defaultExpiryHours = int.Parse(configuration["Share:DefaultExpiryHours"]);
        }

        public async Task<ShareDto> CreateAsync(int userId, CreateShareDto dto)
        {
            var accessLevel = ParseAccessLevel(dto.AccessLevel);

            if (!await _ownershipClient.IsOwnedByCallerAsync(dto.TravelPlanId))
                throw new NotFoundException($"Travel plan with id {dto.TravelPlanId} was not found");

            var shareToken = new ShareToken
            {
                Token = GenerateToken(),
                TravelPlanId = dto.TravelPlanId,
                CreatedByUserId = userId,
                AccessLevel = accessLevel,
                CreatedAtUtc = DateTime.UtcNow,
                ExpiresAtUtc = DateTime.UtcNow.AddHours(dto.ExpiresInHours ?? _defaultExpiryHours),
                IsRevoked = false,
            };

            await _store.SaveAsync(shareToken);

            return shareToken.ToDto();
        }

        public async Task<ShareValidationResultDto> ValidateAsync(string token)
        {
            if (string.IsNullOrWhiteSpace(token))
                return Invalid("No token supplied.");

            var shareToken = await _store.FindAsync(token.Trim());

            if (shareToken == null)
                return Invalid("This share link is not valid.");

            if (shareToken.IsRevoked)
                return Invalid("This share link has been revoked.");

            if (shareToken.ExpiresAtUtc.HasValue && shareToken.ExpiresAtUtc.Value < DateTime.UtcNow)
                return Invalid("This share link has expired.");

            return new ShareValidationResultDto
            {
                IsValid = true,
                TravelPlanId = shareToken.TravelPlanId,
                AccessLevel = shareToken.AccessLevel.ToString(),
            };
        }

        public async Task<List<ShareDto>> GetForPlanAsync(int travelPlanId)
        {
            if (!await _ownershipClient.IsOwnedByCallerAsync(travelPlanId))
                throw new NotFoundException($"Travel plan with id {travelPlanId} was not found.");

            var tokens = await _store.GetForPlanAsync(travelPlanId);

            return tokens.OrderByDescending(t => t.CreatedAtUtc).Select(t => t.ToDto()).ToList();
        }

        public async Task RevokeAsync(string token, int userId)
        {
            var shareToken = await _store.FindAsync(token);

            if (shareToken == null || shareToken.CreatedByUserId != userId)
                throw new NotFoundException("Share link was not found.");

            shareToken.IsRevoked = true;
            await _store.SaveAsync(shareToken);
        }



        //----------------------------------------------------------------------------------------------------------------------------
        //----------------------------------------------------------------------------------------------------------------------------

        private static ShareAccessLevel ParseAccessLevel(string accessLevel)
        {
            if (!Enum.TryParse<ShareAccessLevel>(accessLevel, true, out var parsed) || !Enum.IsDefined(typeof(ShareAccessLevel), parsed))
                throw new ValidationException($"'{accessLevel}' is not a valid access level. Use View or Edit");

            return parsed;
        }

        private static string GenerateToken()
        {
            var bytes = new byte[32];

            using (var rng = RandomNumberGenerator.Create())
                rng.GetBytes(bytes);

            return Convert.ToBase64String(bytes).Replace("+", "-").Replace("/", "_").TrimEnd('=');
        }

        private static ShareValidationResultDto Invalid(string reason) => new ShareValidationResultDto { IsValid = false, Reason = reason };

    }
}
