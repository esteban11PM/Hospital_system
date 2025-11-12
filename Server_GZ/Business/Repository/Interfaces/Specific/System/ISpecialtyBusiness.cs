using Entity.DTOs.System;

namespace Business.Repository.Interfaces.Specific.System
{
    /// <summary>
    /// Define la lógica de negocio para la gestión de los juegos de la aplicación.
    /// </summary>
    public interface ISpecialtyBusiness : IGenericBusiness<SpecialtyDTO, SpecialtyDTO>
    {
        // General

        /// <summary>
        /// Obtiene todos los juegos registrados, incluyendo los inactivos.
        /// </summary>
        Task<IEnumerable<SpecialtyDTO>> GetAllTotalSpecialtysAsync();
    }
}