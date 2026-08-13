using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Runtime.Serialization;

namespace SharingService.Models
{
    [DataContract]
    public class ShareToken
    {
        [DataMember] public string Token { get; set; }
        [DataMember] public int TravelPlanId { get; set; }
        [DataMember] public int CreatedByUserId { get; set; }
        [DataMember] public ShareAccessLevel AccessLevel { get; set; }
        [DataMember] public DateTime CreatedAtUtc { get; set; }
        [DataMember] public DateTime? ExpiresAtUtc { get; set; }
        [DataMember] public bool IsRevoked { get; set; }
    }
}
