using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SharingService.DTOs
{
    public class ShareValidationResultDto
    {
        public bool IsValid { get; set; }
        public int TravelPlanId { get; set; }
        public string AccessLevel { get; set; }
        public string Reason { get; set; }
    }
}
