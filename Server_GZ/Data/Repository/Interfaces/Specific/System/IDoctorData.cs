using Entity.Models.System;

namespace Data.Repository.Interfaces.Specific.System
{
    /// <summary>
    /// Repositorio para doctores del sistema
    /// </summary>
    public interface IDoctorData : IGenericData<Doctor>
    {
        /// <summary>
        /// Verifica si un email ya está registrado
        /// </summary>
        Task<bool> EmailExistsAsync(string email);

        /// <summary>
        /// Verifica si un número de licencia ya está registrado
        /// </summary>
        Task<bool> LicenseNumberExistsAsync(string licenseNumber);
    }
}