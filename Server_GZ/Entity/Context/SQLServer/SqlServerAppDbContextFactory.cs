using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace Entity.Context.SQLServer
{
    public class SqlServerAppDbContextFactory : IDesignTimeDbContextFactory<SqlServerAppDbContext>
    {
        public SqlServerAppDbContext CreateDbContext(string[] args)
        {
            var environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Development";

            IConfigurationRoot configuration = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json", optional: true)
                .AddJsonFile($"appsettings.{environment}.json", optional: true)
                .Build();

            var connectionString = configuration.GetConnectionString("DefaultConnection");
            if (string.IsNullOrWhiteSpace(connectionString))
                throw new InvalidOperationException("No se encontró 'DefaultConnection'");

            var optionsBuilder = new DbContextOptionsBuilder<AppDbContext>(); // Sigue siendo de AppDbContext
            var migrationsAssembly = typeof(AppDbContext).Assembly.FullName;

            optionsBuilder.UseSqlServer(connectionString, b => b.MigrationsAssembly(migrationsAssembly));

            // Retornamos el CONTEXTO DE DISEÑO
            return new SqlServerAppDbContext(optionsBuilder.Options, configuration);
        }
    }
}
