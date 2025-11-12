using Business.Services.DatabaseProviderService.Interfaces;
using Utilities.Enums;

namespace Business.Services.DatabaseProviderService
{
    public class DatabaseProviderService : IDatabaseProviderService
    {
        // Por defecto, si no se envía header, usará SQL Server.
        public DbProvider Provider { get; set; } = DbProvider.SqlServer;
    }
}
