using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.IO;
using System.Xml.Linq;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace TravelService.Data
{

    // Used only by the EF Core tooling (Add-Migration / Update-Database), where the
    // Service Fabric runtime is not available to supply configuration
    public class TravelDbContextFactory : IDesignTimeDbContextFactory<TravelDbContext>
    {
        public TravelDbContext CreateDbContext(string[] args)
        {
            var settingsPath = Path.Combine(
                Directory.GetCurrentDirectory(), "PackageRoot", "Config", "Settings.xml");

            var connectionString = XDocument.Load(settingsPath)
                .Descendants()
                .First(e => (string)e.Attribute("Name") == "ConnectionString")
                .Attribute("Value").Value;

            var optionsBuilder = new DbContextOptionsBuilder<TravelDbContext>();
            optionsBuilder.UseSqlServer(connectionString);

            return new TravelDbContext(optionsBuilder.Options);
        }
    }
}
