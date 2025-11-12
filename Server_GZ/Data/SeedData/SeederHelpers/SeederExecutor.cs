using Entity.Context; 
using Entity.Context.MySQL; 
using Entity.Context.PostgreSQL; 
using Entity.Context.SQLServer; 
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Pomelo.EntityFrameworkCore.MySql.Infrastructure; 
using Utilities.Enums;

namespace Data.SeedData.SeederHelpers
{
    /// <summary>
    /// Ejecutor principal para inicializar todos los sembradores de datos
    /// </summary>
    public static class SeederExecutor
    {
        /// <summary>
        /// Ejecuta migraciones y sembrado para TODOS los proveedores configurados
        /// </summary>
        public static async Task SeedAllAsync(IServiceProvider services, IConfiguration config)
        {
            // Obtenemos el 'GeneralSeeder' que contiene todos los IDataSeeder
            var generalSeeder = services.GetRequiredService<GeneralSeeder>();

            // 1. Ejecutar para SQL Server
            Console.WriteLine("[SeederExecutor] Iniciando SQL Server...");
            await MigrateAndSeedProviderAsync(config, generalSeeder, DbProvider.SqlServer);

            // 2. Ejecutar para PostgreSQL
            Console.WriteLine("[SeederExecutor] Iniciando PostgreSQL...");
            await MigrateAndSeedProviderAsync(config, generalSeeder, DbProvider.PostgreSql);

            // 3. Ejecutar para MySQL
            Console.WriteLine("[SeederExecutor] Iniciando MySQL...");
            await MigrateAndSeedProviderAsync(config, generalSeeder, DbProvider.MySql);

            Console.WriteLine("[SeederExecutor] Todas las bases de datos han sido migradas y sembradas.");
        }

        /// <summary>
        /// Crea un DbContext para un proveedor específico, aplica migraciones y ejecuta el seeder.
        /// </summary>
        private static async Task MigrateAndSeedProviderAsync(IConfiguration config, GeneralSeeder seeder, DbProvider provider)
        {
            var optionsBuilder = new DbContextOptionsBuilder<AppDbContext>();
            string? connectionString;
            var migrationsAssembly = typeof(AppDbContext).Assembly.FullName;

            try
            {
                // Configuración específica del proveedor (Patrón Factory)
                // Esto crea el 'optionsBuilder' con la configuración correcta
                switch (provider)
                {
                    case DbProvider.SqlServer:
                        connectionString = config.GetConnectionString("DefaultConnection");
                        optionsBuilder.UseSqlServer(connectionString, b => b.MigrationsAssembly(migrationsAssembly));
                        break;

                    case DbProvider.PostgreSql:
                        connectionString = config.GetConnectionString("PostgreSQL");
                        optionsBuilder.UseNpgsql(connectionString, b => b.MigrationsAssembly(migrationsAssembly));
                        break;

                    case DbProvider.MySql:
                        connectionString = config.GetConnectionString("MySql");
                        optionsBuilder.UseMySql(
                            connectionString,
                            new MySqlServerVersion(new Version(8, 0, 40)),
                            b =>
                            {
                                b.MigrationsAssembly(migrationsAssembly);
                                b.SchemaBehavior(MySqlSchemaBehavior.Ignore);
                            }
                        );
                        break;

                    default:
                        throw new InvalidOperationException("Proveedor no soportado");
                }

                if (string.IsNullOrEmpty(connectionString))
                {
                    Console.WriteLine($"[SeederExecutor] No se encontró ConnectionString para {provider}. Omitiendo.");
                    return;
                }

                // 1. Declaramos la variable de contexto usando la clase base
                AppDbContext context;

                // 2. Instanciamos el CONTEXTO PROXY específico
                switch (provider)
                {
                    case DbProvider.SqlServer:
                        context = new SqlServerAppDbContext(optionsBuilder.Options, config);
                        break;
                    case DbProvider.PostgreSql:
                        context = new PostgreSqlAppDbContext(optionsBuilder.Options, config);
                        break;
                    case DbProvider.MySql:
                        context = new MySqlAppDbContext(optionsBuilder.Options, config);
                        break;
                    default:
                        throw new InvalidOperationException("Proveedor no soportado");
                }

                // 3. Usamos 'await using' para gestionar la vida del contexto instanciado
                await using (context)
                {
                    // 4. Aplicar Migraciones
                    Console.WriteLine($"[SeederExecutor] Aplicando migraciones para {provider}...");
                    await context.Database.MigrateAsync();
                    Console.WriteLine($"[SeederExecutor] Migraciones aplicadas para {provider}.");

                    // 5. Ejecutar Seeder
                    //    Pasamos el contexto específico (que hereda de AppDbContext)
                    await seeder.SeedAsync(context);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[SeederExecutor] ERROR al migrar/sembrar {provider}: {ex.Message}{Environment.NewLine}{ex.StackTrace}");
            }
        }
    }
}