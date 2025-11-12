using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace Entity.Context.MySQL
{
    /// <summary>
    /// Contexto proxy solo para diseño (migraciones) de MySQL
    /// </summary>
    public class MySqlAppDbContext : AppDbContext
    {
        public MySqlAppDbContext(DbContextOptions<AppDbContext> options, IConfiguration configuration)
            : base(options, configuration)
        {
        }
    }
}
