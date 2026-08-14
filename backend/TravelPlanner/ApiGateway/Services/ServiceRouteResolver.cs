using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;

namespace ApiGateway.Services
{

    public interface IServiceRouteResolver
    {
        bool TryResolve(string path, out string targetBaseUrl);
    }

    public class ServiceRouteResolver
    {
        private readonly List<(string Prefix, string BaseUrl)> _routes;

        public ServiceRouteResolver(IConfiguration configuration)
        {
            var users = configuration["Services:UserService"];
            var travel = configuration["Services:TravelService"];
            var sharing = configuration["Services:SharingService"];

            _routes = new List<(string, string)>
            {
                ("/api/auth", users),
                ("/api/user", users),
                ("/api/travel-plans", travel),
                ("/api/shares", sharing)
            };
        }

        public bool TryResolve(string path, out string targetBaseUrl)
        {
            var match = _routes.FirstOrDefault(route => path.StartsWith(route.Prefix, StringComparison.OrdinalIgnoreCase));

            targetBaseUrl = match.BaseUrl;
            return targetBaseUrl != null;
        }
    }
}
