using AutoMapper;
using Business.Repository.Interfaces.Specific.System;
using Data.Factory;
using Data.Repository.Interfaces.General;
using Data.Repository.Interfaces.Strategy.Delete;
using Entity.DTOs.System.DoctorSpecialty;
using Entity.Models.System;
using Microsoft.Extensions.Logging;

namespace Business.Repository.Implementations.Specific.System
{
    /// <summary>
    /// Implementación de la lógica de negocio para especialidades de doctores
    /// </summary>
    public class DoctorSpecialtyBusiness :
        GenericBusinessSingleDTO<DoctorSpecialty, DoctorSpecialtyDTO>,
        IDoctorSpecialtyBusiness
    {
        private readonly IGeneral<DoctorSpecialty> _general;
        public DoctorSpecialtyBusiness(
            IDataFactoryGlobal factory,
            IGeneral<DoctorSpecialty> general,
            IDeleteStrategyResolver<DoctorSpecialty> deleteStrategyResolver,
            ILogger<DoctorSpecialty> logger,
            IMapper mapper)
            : base(factory.CreateDoctorSpecialtyData(), deleteStrategyResolver, logger, mapper)
        {
            _general = general;
        }
    }
}