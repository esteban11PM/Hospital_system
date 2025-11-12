using Business.Services.DatabaseProviderService.Interfaces;
using Entity.Context;
using Microsoft.EntityFrameworkCore;
using Utilities.Enums;
using Pomelo.EntityFrameworkCore.MySql.Infrastructure;

namespace Web.Extensions
{
    /// <summary>
    /// Extensiones para configurar la capa de persistencia (DbContext)
    /// </summary>
    public static class PersistenceExtensions
    {
        /// <summary>
        /// Registra el AppDbContext de forma dinámica, permitiendo cambiar 
        /// de proveedor de BD en tiempo de ejecución.
        /// </summary>
        public static IServiceCollection AddDynamicPersistence(
            this IServiceCollection services,
            IConfiguration configuration)
        {
            // Registramos el AppDbContext dinámicamente
            services.AddDbContext<AppDbContext>((serviceProvider, options) =>
            {
                // Obtenemos los servicios necesarios dentro del scope de la petición
                var providerService = serviceProvider.GetRequiredService<IDatabaseProviderService>();

                // Obtenemos el proveedor que el Middleware seleccionó
                var provider = providerService.Provider;

                string? connectionString;
                var migrationsAssembly = typeof(AppDbContext).Assembly.FullName;

                switch (provider)
                {
                    case DbProvider.SqlServer:
                        connectionString = configuration.GetConnectionString("DefaultConnection");
                        options.UseSqlServer(connectionString,
                            b => b.MigrationsAssembly(migrationsAssembly));
                        break;

                    case DbProvider.PostgreSql:
                        connectionString = configuration.GetConnectionString("PostgreSQL");
                        options.UseNpgsql(connectionString,
                            b => b.MigrationsAssembly(migrationsAssembly));
                        break;

                    case DbProvider.MySql:
                        connectionString = configuration.GetConnectionString("MySql");
                        options.UseMySql(
                            connectionString,
                            new MySqlServerVersion(new Version(8, 0, 40)),
                            b => b.MigrationsAssembly(migrationsAssembly)
                                 .SchemaBehavior(MySqlSchemaBehavior.Ignore)
                        );
                        break;

                    default:
                        throw new InvalidOperationException($"Proveedor no soportado: {provider}");
                }
            });

            return services;
        }
    }
}