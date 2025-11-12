using Entity.DTOs.System;

namespace Business.Repository.Interfaces.Specific.System
{
    /// <summary>
    /// Define la lógica de negocio para la gestión de las estaciones juego de la aplicación.
    /// </summary>
    public interface IConsultingRoomBusiness : IGenericBusiness<ConsultingRoomDTO, ConsultingRoomDTO>
    {
        // General

        /// <summary>
        /// Obtiene todos las estaciones juego registradas, incluyendo las inactivas.
        /// </summary>
        Task<IEnumerable<ConsultingRoomDTO>> GetAllTotalConsultingRoomsAsync();
    }
}