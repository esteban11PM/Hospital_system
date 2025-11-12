using Microsoft.OpenApi.Models;
using Web.Middleware; 

namespace Web.Extensions
{
    /// <summary>
    /// Extensiones para configurar documentación Swagger/OpenAPI
    /// </summary>
    public static class SwaggerServiceExtensions
    {
        /// <summary>
        /// Configura Swagger con documentación, soporte para JWT y header global de proveedor de BD
        /// </summary>
        public static IServiceCollection AddSwaggerDocumentation(this IServiceCollection services)
        {
            services.AddEndpointsApiExplorer();

            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "Mi API", Version = "v1" });

                // --- 1. Definición de Seguridad para JWT (Bearer) ---
                c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    // Descripción actualizada para el usuario
                    Description = "Autorización JWT usando el esquema Bearer.",
                    Name = "Authorization",
                    In = ParameterLocation.Header,
                    Type = SecuritySchemeType.Http, 
                    Scheme = "Bearer",              
                    BearerFormat = "JWT"            
                });

                // --- 2. Definición de Seguridad para X-Db-Provider ---
                c.AddSecurityDefinition(DatabaseSelectorMiddleware.HeaderName, new OpenApiSecurityScheme
                {
                    Description = "Proveedor de BD a usar (sqlserver, postgresql, mysql). Default: sqlserver.",
                    Name = DatabaseSelectorMiddleware.HeaderName, // "X-Db-Provider"
                    In = ParameterLocation.Header,
                    Type = SecuritySchemeType.ApiKey,
                    Scheme = "DbProviderScheme" // Un ID único para este esquema
                });


                // --- 3. Requerimiento de Seguridad (Aplica AMBOS globalmente) ---
                c.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                    {
                        // Requerimiento para Bearer
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                            {
                                Type = ReferenceType.SecurityScheme,
                                Id = "Bearer"
                            }
                        },
                        Array.Empty<string>()
                    },
                    {
                        // Requerimiento para X-Db-Provider
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                            {
                                Type = ReferenceType.SecurityScheme,
                                Id = DatabaseSelectorMiddleware.HeaderName // "X-Db-Provider"
                            }
                        },
                        Array.Empty<string>()
                    }
                });
            });

            return services;
        }
    }
}