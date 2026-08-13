using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SharingService.DTOs
{
    public class ShareDto
    {
        public string Token { get; set; }
        public int TravelPlanId { get; set; }
        public string AccessLevel { get; set; }
        public DateTime CreatedAtUtc { get; set; }
        public DateTime? ExpiresAtUtc { get; set; }
        public bool IsRevoked { get; set; }
    }
}
