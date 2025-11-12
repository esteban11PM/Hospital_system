using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace Entity.Context.SQLServer
{
    /// <summary>
    /// Contexto proxy solo para diseño (migraciones) de SQL Server
    /// </summary>
    public class SqlServerAppDbContext : AppDbContext
    {
        public SqlServerAppDbContext(DbContextOptions<AppDbContext> options, IConfiguration configuration)
            : base(options, configuration)
        {
        }
    }
}
