using AutoMapper;
using Business.Repository.Interfaces.Specific.System;
using Data.Factory;
using Data.Repository.Interfaces.General;
using Data.Repository.Interfaces.Strategy.Delete;
using Entity.DTOs.System;
using Entity.Models.System;
using Microsoft.Extensions.Logging;

namespace Business.Repository.Implementations.Specific.System
{
    /// <summary>
    /// Implementación de la lógica de negocio para doctores
    /// </summary>
    public class DoctorBusiness :
        GenericBusinessSingleDTO<Doctor, DoctorDTO>,
        IDoctorBusiness
    {
        private readonly IGeneral<Doctor> _general;
        public DoctorBusiness(
            IDataFactoryGlobal factory,
            IGeneral<Doctor> general,
            IDeleteStrategyResolver<Doctor> deleteStrategyResolver,
            ILogger<Doctor> logger,
            IMapper mapper)
            : base(factory.CreateDoctorData(), deleteStrategyResolver, logger, mapper)
        {
            _general = general;
        }

        /// <summary>
        /// Obtiene todos los doctores registrados en el sistema, incluyendo los inactivos.
        /// </summary>
        public async Task<IEnumerable<DoctorDTO>> GetAllTotalDoctorsAsync()
        {
            var all = await _general.GetAllTotalAsync();
            return _mapper.Map<IEnumerable<DoctorDTO>>(all);
        }
    }
}