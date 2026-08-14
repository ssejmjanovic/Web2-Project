using System;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;

namespace TravelService.Services
{
    public class ShareValidationResult
    {
        public bool IsValid { get; set; }
        public int TravelPlanId { get; set; }
        public string AccessLevel { get; set; }
        public string Reason { get; set; }
    }

    public interface IShareValidationClient
    {
        Task<ShareValidationResult> ValidateAsync(string token);
    }



    public class ShareValidationClient : IShareValidationClient
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly string _sharingServiceUrl;
        
        public ShareValidationClient(IHttpClientFactory httpClientFactory, IConfiguration configuration)
        {
            _httpClientFactory = httpClientFactory;
            _sharingServiceUrl = configuration["Services:SharingService"];
        }

        public async Task<ShareValidationResult> ValidateAsync(string token)
        {
            var client = _httpClientFactory.CreateClient();

            var payload = JsonSerializer.Serialize(new { token });
            var content = new StringContent(payload, Encoding.UTF8, "application/json");

            var response = await client.PostAsync($"{_sharingServiceUrl.TrimEnd('/')}/api/shares/validate", content);

            if (!response.IsSuccessStatusCode)
                return new ShareValidationResult
                {
                    IsValid = false,
                    Reason = "Share link could not be verified."
                };

            var body = await response.Content.ReadAsStringAsync();

            return JsonSerializer.Deserialize<ShareValidationResult>(body, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
        }
    
    }


}
