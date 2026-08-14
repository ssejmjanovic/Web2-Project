using System.Security.Claims;
using System.Text.Encodings.Web;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using TravelService.Services;

namespace TravelService.Authentication
{
    public class ShareTokenAuthenticationOptions : AuthenticationSchemeOptions { }

    public class ShareTokenAuthenticationHandler : AuthenticationHandler<ShareTokenAuthenticationOptions>
    {
        public const string SchemeName = "ShareToken";
        public const string HeaderName = "X-Share-Token";

        public const string PlanIdClaim = "share_plan_id";
        public const string AccessClaim = "share_access";

        private readonly IShareValidationClient _shareValidationClient;

        public ShareTokenAuthenticationHandler(
            IOptionsMonitor<ShareTokenAuthenticationOptions> options,
            ILoggerFactory logger,
            UrlEncoder encoder,
            ISystemClock clock,
            IShareValidationClient shareValidationClient) : base(options, logger, encoder, clock)
        {
            _shareValidationClient = shareValidationClient;
        }

        protected override async Task<AuthenticateResult> HandleAuthenticateAsync()
        {
            if (!Request.Headers.TryGetValue(HeaderName, out var headerValues))
                return AuthenticateResult.NoResult();

            var token = headerValues.ToString();

            if (string.IsNullOrWhiteSpace(token))
                return AuthenticateResult.NoResult();

            var result = await _shareValidationClient.ValidateAsync(token.Trim());

            if (result == null || !result.IsValid)
                return AuthenticateResult.Fail(result?.Reason ?? "Invalid share link.");

            var claims = new[]
            {
                new Claim(PlanIdClaim, result.TravelPlanId.ToString()),
                new Claim(AccessClaim, result.AccessLevel)
            };

            var identity = new ClaimsIdentity(claims, Scheme.Name);
            var principal = new ClaimsPrincipal(identity);
            var ticket = new AuthenticationTicket(principal, Scheme.Name);

            return AuthenticateResult.Success(ticket);
        }
    }
}
