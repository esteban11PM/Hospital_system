using Entity.Models.SecurityModel;

namespace Data.Repository.Interfaces.Specific.SecurityModel
{
    /// <summary>
    /// Repositorio para personas del sistema
    /// </summary>
    public interface IPatientData : IGenericData<Patient>
    {
        /// <summary>
        /// Obtiene personas que no tienen usuario asignado
        /// </summary>
        Task<IEnumerable<Patient?>> GetAvailablePatients();

        /// <summary>
        /// Verifica si un email ya está registrado
        /// </summary>
        Task<bool> EmailExistsAsync(string email);

        /// <summary>
        /// Verifica si un teléfono ya está registrado
        /// </summary>
        Task<bool> PhoneExistsAsync(string phone);
    }
}