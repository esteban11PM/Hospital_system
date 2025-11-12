using Entity.DTOs.SecurityModel.Person;

namespace Business.Repository.Interfaces.Specific.SecurityModel
{
    /// <summary>
    /// Define la lógica de negocio para la gestión de la información personal de los usuarios.
    /// </summary>
    public interface IPatientBusiness : IGenericBusiness<PatientDTO, PatientDTO>
    {
        // General

        /// <summary>
        /// Obtiene todos los registros de personas, incluyendo los inactivos.
        /// </summary>
        Task<IEnumerable<PatientDTO>> GetAllTotalPatientsAsync();


        // Specific

        /// <summary>
        /// Obtiene las personas que están disponibles para ser asignadas como usuarios o encargados.
        /// </summary>
        Task<IEnumerable<PatientAvailableDTO?>> GetPatientAvailableAsync();
    }
}
