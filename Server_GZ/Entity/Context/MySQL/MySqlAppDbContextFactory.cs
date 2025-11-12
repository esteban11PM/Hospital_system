using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace Entity.Context.MySQL
{
    public class MySqlAppDbContextFactory : IDesignTimeDbContextFactory<MySqlAppDbContext>
    {
        public MySqlAppDbContext CreateDbContext(string[] args)
        {
            var environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Development";

            IConfigurationRoot configuration = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json", optional: true)
                .AddJsonFile($"appsettings.{environment}.json", optional: true)
                .Build();

            var connectionString = configuration.GetConnectionString("MySql");
            if (string.IsNullOrWhiteSpace(connectionString))
                throw new InvalidOperationException("No se encontró 'MySql'");

            var optionsBuilder = new DbContextOptionsBuilder<AppDbContext>();
            var migrationsAssembly = typeof(AppDbContext).Assembly.FullName;

            optionsBuilder.UseMySql(
                connectionString,
                new MySqlServerVersion(new Version(8, 0, 40)), 
                b =>
                {
                    b.MigrationsAssembly(migrationsAssembly);
                    b.SchemaBehavior(Pomelo.EntityFrameworkCore.MySql.Infrastructure.MySqlSchemaBehavior.Ignore);
                }
            );

            return new MySqlAppDbContext(optionsBuilder.Options, configuration);
        }
    }
}
