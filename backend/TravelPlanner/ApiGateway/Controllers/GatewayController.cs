using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ApiGateway.Services;
using Microsoft.AspNetCore.Mvc;

namespace ApiGateway.Controllers
{
    [ApiController]
    public class GatewayController : ControllerBase
    {
        private readonly IProxyService _proxyService;
        private readonly IServiceRouteResolver _routeResolver;

        public GatewayController(IProxyService proxyService, IServiceRouteResolver routeResolver)
        {
            _proxyService = proxyService;
            _routeResolver = routeResolver;
        }

        [HttpGet("/")]
        public IActionResult Root()
        {
            return Ok(new
            {
                service = "Travel Planner API Gateway",
                status = "running",
                routes = new[]
                {
            "/api/auth",
            "/api/users",
            "/api/travel-plans",
            "/api/shares"
        }
            });
        }

        [Route("api/{**path}")]
        [AcceptVerbs("GET", "POST", "PUT", "PATCH", "DELETE")]
        public async Task<IActionResult> Forward()
        {
            if (!_routeResolver.TryResolve(Request.Path.Value, out var targetBaseUrl))
                return NotFound(new { message = "Unknown API route" });

            using (var response = await _proxyService.ForwardAsync(Request, targetBaseUrl))
            {
                var body = await response.Content.ReadAsStringAsync();

                return new ContentResult
                {
                    StatusCode = (int)response.StatusCode,
                    Content = body,
                    ContentType = response.Content.Headers.ContentType?.ToString() ?? "appication/json"
                };
            }
        }
    }
}
