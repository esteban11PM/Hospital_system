using Data.Repository.Interfaces.Specific.System;
using Entity.Context;
using Entity.Models.System;
using Microsoft.Extensions.Logging;

namespace Data.Repository.Implementations.Specific.System
{
    /// <summary>
    /// Repositorio para gestión de consultorios de doctores
    /// </summary>
    public class DoctorConsultingRoomData : GenericData<DoctorConsultingRoom>, IDoctorConsultingRoomData
    {
        public DoctorConsultingRoomData(AppDbContext context, ILogger<DoctorConsultingRoom> logger) : base(context, logger) { }
    }
}