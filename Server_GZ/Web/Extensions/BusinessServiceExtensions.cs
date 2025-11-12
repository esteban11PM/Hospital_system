using Business.Services.DatabaseProviderService;
using Business.Services.DatabaseProviderService.Interfaces;
using Business.Services.Jwt;
using Business.Services.Jwt.Interfaces;
using Data.Factory;
using Data.Repository.Implementations.Strategy.Delete;
using Data.Repository.Interfaces.Strategy.Delete;

namespace Web.Extensions
{
    /// <summary>
    /// Extensiones para registro de servicios de la capa Business
    /// </summary>
    public static class BusinessServiceExtensions
    {
        /// <summary>
        /// Registra todos los servicios de negocio, factories, estrategias y servicios externos
        /// </summary>
        /// <param name="services">Colección de servicios</param>
        /// <param name="configuration">Configuración de la aplicación</param>
        public static IServiceCollection AddBusinessServices(this IServiceCollection services, IConfiguration configuration)
        {
            // =============== [ Database Provider Service ] ===============
            services.AddScoped<IDatabaseProviderService, DatabaseProviderService>();

            // =============== [ JWT Service ] ===============
            services.AddScoped<IJwtService, JwtService>();
            services.AddScoped<AuthService>();

            // =============== [ Factory ] ===============
            services.AddScoped<IDataFactoryGlobal, GlobalFactory>();


            // =============== [ Strategy Services ] ===============
            services.AddScoped(typeof(LogicalDeleteStrategy<>));
            services.AddScoped(typeof(PermanentDeleteStrategy<>));
            services.AddScoped(typeof(IDeleteStrategyResolver<>), typeof(DeleteStrategyResolver<>));


            // =============== [ Extra Services ] ===============
            services.AddScoped<IRefreshTokenService, RefreshTokenService>();

            return services;
        }
    }
}
