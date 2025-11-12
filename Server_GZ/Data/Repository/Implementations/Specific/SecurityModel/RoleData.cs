using Data.Repository.Interfaces.Specific.SecurityModel;
using Entity.Context;
using Entity.Models.SecurityModel;
using Microsoft.Extensions.Logging;

namespace Data.Repository.Implementations.Specific.SecurityModel
{
    /// <summary>
    /// Repositorio para gestión de roles del sistema
    /// </summary>
    public class RoleData : GenericData<Role>, IRoleData
    {
        public RoleData(AppDbContext context, ILogger<Role> logger) : base(context, logger) { }
    }
}