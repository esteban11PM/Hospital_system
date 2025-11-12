using AutoMapper;
using Business.Repository.Implementations;
using Business.Repository.Interfaces.Specific.System;
using Data.Factory;
using Data.Repository.Interfaces.Strategy.Delete;
using Entity.DTOs.System.DoctorConsultingRoom;
using Entity.Models.System;
using Microsoft.Extensions.Logging;

namespace Business.Repository.Implementations.Specific.System
{
    /// <summary>
    /// Implementación de la lógica de negocio para consultorios de doctores
    /// </summary>
    public class DoctorConsultingRoomBusiness :
        GenericBusinessDualDTO<DoctorConsultingRoom, DoctorConsultingRoomDTO, DoctorConsultingRoomOptionsDTO>,
        IDoctorConsultingRoomBusiness
    {
        public DoctorConsultingRoomBusiness(
            IDataFactoryGlobal factory,
            IDeleteStrategyResolver<DoctorConsultingRoom> deleteStrategyResolver,
            ILogger<DoctorConsultingRoom> logger,
            IMapper mapper)
            : base(factory.CreateDoctorConsultingRoomData(), deleteStrategyResolver, logger, mapper)
        {
        }
    }
}