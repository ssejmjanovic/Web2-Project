using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SharingService.DTOs;
using SharingService.Models;

namespace SharingService.Mapping
{
    public static class ShareMapper
    {

        public static ShareDto ToDto(this ShareToken token) => new ShareDto
        {
            Token = token.Token,
            TravelPlanId = token.TravelPlanId,
            AccessLevel = token.AccessLevel.ToString(),
            CreatedAtUtc = token.CreatedAtUtc,
            ExpiresAtUtc = token.ExpiresAtUtc,
            IsRevoked = token.IsRevoked
        };

    }
}
