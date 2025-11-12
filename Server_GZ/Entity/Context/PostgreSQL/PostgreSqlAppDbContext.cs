using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace Entity.Context.PostgreSQL
{
    /// <summary>
    /// Contexto proxy solo para diseño (migraciones) de PostgreSQL
    /// </summary>
    public class PostgreSqlAppDbContext : AppDbContext
    {
        public PostgreSqlAppDbContext(DbContextOptions<AppDbContext> options, IConfiguration configuration)
            : base(options, configuration)
        {
        }
    }
}
