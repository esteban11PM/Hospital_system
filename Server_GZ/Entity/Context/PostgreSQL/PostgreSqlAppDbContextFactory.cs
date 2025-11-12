using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace Entity.Context.PostgreSQL
{
    public class PostgreSqlAppDbContextFactory : IDesignTimeDbContextFactory<PostgreSqlAppDbContext>
    {
        public PostgreSqlAppDbContext CreateDbContext(string[] args)
        {
            var environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Development";

            IConfigurationRoot configuration = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json", optional: true)
                .AddJsonFile($"appsettings.{environment}.json", optional: true)
                .Build();

            var connectionString = configuration.GetConnectionString("PostgreSQL");
            if (string.IsNullOrWhiteSpace(connectionString))
                throw new InvalidOperationException("No se encontró 'PostgreSQL'");

            var optionsBuilder = new DbContextOptionsBuilder<AppDbContext>();
            var migrationsAssembly = typeof(AppDbContext).Assembly.FullName;

            optionsBuilder.UseNpgsql(connectionString, b => b.MigrationsAssembly(migrationsAssembly));

            return new PostgreSqlAppDbContext(optionsBuilder.Options, configuration);
        }
    }
}
