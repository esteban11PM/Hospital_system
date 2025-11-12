using Entity.DTOs.System.Appointment;

namespace Business.Repository.Interfaces.Specific.System
{
    /// <summary>
    /// Define la lógica de negocio para la gestión de las relaciones entre Juego y Estacion.
    /// </summary>
    public interface IAppointmentBusiness : IGenericBusiness<AppointmentDTO, AppointmentOptionsDTO>
    {
        // General

        /// <summary>
        /// Obtiene todas las relaciones de Juego y Estacion, sin filtrar por estado.
        /// </summary>
        Task<IEnumerable<AppointmentDTO>> GetAllTotalAppointmentsAsync();
    }
}