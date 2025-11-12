using Data.Repository.Interfaces.Specific.System;
using Entity.Context;
using Entity.Models.System;
using Microsoft.Extensions.Logging;

namespace Data.Repository.Implementations.Specific.System
{
    /// <summary>
    /// Repositorio para gestión de estaciones del juego del sistema
    /// </summary>
    public class ConsultingRoomData : GenericData<ConsultingRoom>, IConsultingRoomData
    {
        public ConsultingRoomData(AppDbContext context, ILogger<ConsultingRoom> logger) : base(context, logger) {}
    }
}