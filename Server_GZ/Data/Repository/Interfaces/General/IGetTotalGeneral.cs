namespace Data.Repository.Interfaces.General
{
    /// <summary>
    /// Interfaz para consultas totales y específicas del sistema
    /// </summary>
    public interface IGetTotalGeneral<T> where T : class
    {
        /// <summary>
        /// Obtiene todos los registros incluyendo inactivos
        /// </summary>
        Task<IEnumerable<T>> GetAllTotalAsync();
    }
}