using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using SharingService.Exceptions;

namespace SharingService.Services
{

    public interface ITravelPlanOwnershipClient
    {
        Task<bool> IsOwnedByCallerAsync(int travelPlanId);
    }
    public class TravelPlanOwnershipClient : ITravelPlanOwnershipClient
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly string _TravelServiceUrl;

        public TravelPlanOwnershipClient(IHttpClientFactory httpClientFactory, IHttpContextAccessor httpContextAccessor, IConfiguration configuration)
        {
            _httpClientFactory = httpClientFactory;
            _httpContextAccessor = httpContextAccessor;
            _TravelServiceUrl = configuration["Services:TravelService"];
        }

        public async Task<bool> IsOwnedByCallerAsync(int travelPlanId)
        {
            var authorization = _httpContextAccessor.HttpContext?
                .Request.Headers["Authorization"].ToString();

            if (string.IsNullOrWhiteSpace(authorization))
                throw new UnauthorizedException("Missing authorization header.");

            var client = _httpClientFactory.CreateClient();

            var request = new HttpRequestMessage(HttpMethod.Get, $"{_TravelServiceUrl.TrimEnd('/')}/api/travel-plans/{travelPlanId}");

            request.Headers.TryAddWithoutValidation("Authorization", authorization);

            var response = await client.SendAsync(request);

            if (response.StatusCode == HttpStatusCode.OK)
                return true;
            if (response.StatusCode == HttpStatusCode.NotFound)
                return false;
            if (response.StatusCode == HttpStatusCode.Unauthorized)
                throw new UnauthorizedException("Your session is no longer valid.");

            throw new HttpRequestException($"TravelService returned {(int)response.StatusCode} while checking plan ownership.");
        }
    }
}
