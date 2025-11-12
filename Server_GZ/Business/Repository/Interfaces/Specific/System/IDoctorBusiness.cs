using Entity.DTOs.System;

namespace Business.Repository.Interfaces.Specific.System
{
    /// <summary>
    /// Interfaz para la lógica de negocio de doctores
    /// </summary>
    public interface IDoctorBusiness : IGenericBusiness<DoctorDTO, DoctorDTO>
    {
        /// <summary>
        /// Obtiene todos los doctores registrados en el sistema, incluyendo los inactivos.
        /// </summary>
        Task<IEnumerable<DoctorDTO>> GetAllTotalDoctorsAsync();
    }
}