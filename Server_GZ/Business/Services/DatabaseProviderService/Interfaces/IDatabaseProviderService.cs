using Utilities.Enums;

namespace Business.Services.DatabaseProviderService.Interfaces
{
    /// <summary>
    /// Servicio Scoped para almacenar el proveedor de BD seleccionado para la petición actual
    /// </summary>
    public interface IDatabaseProviderService
    {
        DbProvider Provider { get; set; }
    }
}
