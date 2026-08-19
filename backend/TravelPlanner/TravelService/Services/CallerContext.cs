using System;
using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using TravelService.Authentication;
using TravelService.Exceptions;

namespace TravelService.Services
{

    public enum ShareAccess
    {
        None = 0,
        View = 1,
        Edit = 2,
    }

    public interface ICallerContext
    {
        bool IsShareVisitor { get; }
        bool IsAdmin { get; }
        int UserId { get; }
        int SharePlanId { get; }
        ShareAccess ShareAccess { get; }

    }

    public class CallerContext : ICallerContext
    {
        private readonly ClaimsPrincipal _user;

        public CallerContext(IHttpContextAccessor httpContextAccessor)
        {
            _user = httpContextAccessor.HttpContext?.User;
        }

        public bool IsShareVisitor => _user?.FindFirst(ShareTokenAuthenticationHandler.PlanIdClaim) != null;
        public bool IsAdmin => string.Equals(_user?.FindFirst("role")?.Value, "Admin", StringComparison.OrdinalIgnoreCase);

        public int UserId
        {
            get
            {
                var claim = _user?.FindFirst("sub");
                if (claim == null)
                    throw new ForbiddenException("This action requires a signed-in user.");

                return int.Parse(claim.Value);
            }
        }

        public int SharePlanId
        {
            get
            {
                var claim = _user?.FindFirst(ShareTokenAuthenticationHandler.PlanIdClaim);
                return claim == null ? 0 : int.Parse(claim.Value);
            }
        }

        public ShareAccess ShareAccess
        {
            get
            {
                var claim = _user?.FindFirst(ShareTokenAuthenticationHandler.AccessClaim);

                if (claim == null)
                    return ShareAccess.None;

                return Enum.TryParse<ShareAccess>(claim.Value, true, out var parsed) ? parsed : ShareAccess.None;
            }
        }
    }
}
