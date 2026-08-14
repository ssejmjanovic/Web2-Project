using System.IO;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace ApiGateway.Services
{

    public interface IProxyService
    {
        Task<HttpResponseMessage> ForwardAsync(HttpRequest request, string targetBaseUrl);
    }

    public class ProxyService : IProxyService
    {
        private static readonly string[] ForwardedHeaders = { "Authorization", "X-Share-Token", "Accept" };

        private readonly IHttpClientFactory _httpClientFactory;

        public ProxyService(IHttpClientFactory httpClientFactory)
        {
            _httpClientFactory = httpClientFactory;
        }

        public async Task<HttpResponseMessage> ForwardAsync(HttpRequest request, string targetBaseUrl)
        {
            var targetUrl = $"{targetBaseUrl.TrimEnd('/')}{request.Path}{request.QueryString}";

            var forwarded = new HttpRequestMessage(new HttpMethod(request.Method), targetUrl);

            if (request.ContentLength > 0)
            {
                using (var reader = new StreamReader(request.Body))
                {
                    var body = await reader.ReadToEndAsync();
                    var mediaType = request.ContentType?.Split(';')[0] ?? "application/json";

                    forwarded.Content = new StringContent(body, Encoding.UTF8, mediaType);
                }
            }
            foreach(var headerName in ForwardedHeaders)
            {
                if (request.Headers.TryGetValue(headerName, out var values))
                    forwarded.Headers.TryAddWithoutValidation(headerName, values.ToArray());
            }

            var client = _httpClientFactory.CreateClient();
            return await client.SendAsync(forwarded, HttpCompletionOption.ResponseHeadersRead);
        }
    }
}
