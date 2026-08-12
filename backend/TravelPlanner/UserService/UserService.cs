using System;
using System.Collections.Generic;
using System.Fabric;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.ServiceFabric.Services.Communication.AspNetCore;
using Microsoft.ServiceFabric.Services.Communication.Runtime;
using Microsoft.ServiceFabric.Services.Runtime;
using Microsoft.ServiceFabric.Data;
using Microsoft.Extensions.Configuration;

namespace UserService
{
    /// <summary>
    /// The FabricRuntime creates an instance of this class for each service type instance. 
    /// </summary>
    internal sealed class UserService : StatelessService
    {
        public UserService(StatelessServiceContext context)
            : base(context)
        { }

        /// <summary>
        /// Optional override to create listeners (like tcp, http) for this service instance.
        /// </summary>
        /// <returns>The collection of listeners.</returns>
        protected override IEnumerable<ServiceInstanceListener> CreateServiceInstanceListeners()
        {
            return new ServiceInstanceListener[]
            {
                new ServiceInstanceListener(serviceContext =>
                    new KestrelCommunicationListener(serviceContext, "ServiceEndpoint", (url, listener) =>
                    {
                        ServiceEventSource.Current.ServiceMessage(serviceContext, $"Starting Kestrel on {url}");

                        return new WebHostBuilder()
                                    .UseKestrel()
                                    .ConfigureAppConfiguration((context, config) =>
                                    {
                                        config.SetBasePath(Directory.GetCurrentDirectory());
                                        config.AddJsonFile("appsettings.json", optional: false, reloadOnChange: true);

                                        var secrets = serviceContext.CodePackageActivationContext
                                            .GetConfigurationPackageObject("Config")
                                            .Settings.Sections["Secrets"];

                                        config.AddInMemoryCollection(new Dictionary<string, string>
                                        {
                                            ["ConnectionStrings:UsersDatabase"] = secrets.Parameters["ConnectionString"].Value,
                                            ["Jwt:Key"] = secrets.Parameters["JwtKey"].Value,
                                            ["Admin:Email"] = secrets.Parameters["AdminEmail"].Value,
                                            ["Admin:Password"] = secrets.Parameters["AdminPassword"].Value
                                        });
                                    })
                                    .ConfigureServices(
                                        services => services
                                            .AddSingleton<StatelessServiceContext>(serviceContext))
                                    .UseContentRoot(Directory.GetCurrentDirectory())
                                    .UseStartup<Startup>()
                                    .UseServiceFabricIntegration(listener, ServiceFabricIntegrationOptions.None)
                                    .UseUrls(url)
                                    .Build();
                    }))
            };
        }
    }
}
