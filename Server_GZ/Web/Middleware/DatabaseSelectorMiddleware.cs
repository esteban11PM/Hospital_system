using Business.Services.DatabaseProviderService.Interfaces;
using Utilities.Enums;

namespace Web.Middleware
{
    /// <summary>
    /// Middleware para leer el header 'X-Db-Provider' y configurar
    /// el servicio IDatabaseProviderService para la petición actual.
    /// </summary>
    public class DatabaseSelectorMiddleware
    {
        private readonly RequestDelegate _next;
        public const string HeaderName = "X-Db-Provider";

        public DatabaseSelectorMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context, IDatabaseProviderService providerService)
        {
            // Intentar leer el header
            if (context.Request.Headers.TryGetValue(HeaderName, out var providerHeader))
            {
                var providerString = providerHeader.ToString().ToLowerInvariant();

                // Convertir el string del header a nuestro enum
                switch (providerString)
                {
                    case "postgresql":
                        providerService.Provider = DbProvider.PostgreSql;
                        break;
                    case "mysql":
                        providerService.Provider = DbProvider.MySql;
                        break;
                    // "sqlserver" o cualquier otro valor usará el default
                    case "sqlserver":
                    default:
                        providerService.Provider = DbProvider.SqlServer;
                        break;
                }
            }
            // Si no viene el header, providerService usará el valor por defecto 
            // que definimos en la clase (SqlServer).

            // Continuar con el siguiente middleware en el pipeline
            await _next(context);
        }
    }
}
