using AutoMapper;
using Business.Repository.Interfaces.Specific.System;
using Data.Factory;
using Data.Repository.Interfaces.General;
using Data.Repository.Interfaces.Strategy.Delete;
using Entity.DTOs.System.Appointment;
using Entity.Models.System;
using Microsoft.Extensions.Logging;
using Utilities.Exceptions;
using Utilities.Helpers;

namespace Business.Repository.Implementations.Specific.System
{
    /// <summary>
    /// Implementación de la lógica de negocio para gestionar la relación entre Specialty y Estacion.
    /// </summary>
    public class AppointmentBusiness :
        GenericBusinessDualDTO<Appointment, AppointmentDTO, AppointmentOptionsDTO>,
        IAppointmentBusiness
    {

        private readonly IGeneral<Appointment> _general;

        public AppointmentBusiness(
            IDataFactoryGlobal factory,
            IGeneral<Appointment> general,
            IDeleteStrategyResolver<Appointment> deleteStrategyResolver,
            ILogger<Appointment> logger, 
            IMapper mapper)
            : base(factory.CreateAppointmentData(), deleteStrategyResolver, logger, mapper) 
        { 
            _general = general;
        }

        // General 
        /// <summary>
        /// Obtiene todas las relaciones Juego-Estacion, incluyendo las inactivas.
        /// </summary>
        public async Task<IEnumerable<AppointmentDTO>> GetAllTotalAppointmentsAsync()
        {
            var active = await _general.GetAllTotalAsync();
            return _mapper.Map<IEnumerable<AppointmentDTO>>(active);
        }


        // Specific


        // Actions

        /// <summary>
        /// Hook para validar que los IDs de Juego y Estacion sean válidos antes de la creación de la relación.
        /// </summary>
        protected override Task BeforeCreateMap(AppointmentOptionsDTO dto, Appointment entity)
        {
            ValidationHelper.EnsureValidId(dto.SpecialtyId, "SpecialtyId");
            ValidationHelper.EnsureValidId(dto.ConsultingRoomId, "RolId");
            return Task.CompletedTask;
        }

        /// <summary>
        /// Hook para validar que los IDs de Juego y Estacion sean válidos antes de la actualización de la relación.
        /// </summary>
        protected override Task BeforeUpdateMap(AppointmentOptionsDTO dto, Appointment entity)
        {
            ValidationHelper.EnsureValidId(dto.SpecialtyId, "SpecialtyId");
            ValidationHelper.EnsureValidId(dto.ConsultingRoomId, "RolId");
            return Task.CompletedTask;
        }

        /// <summary>
        /// Realiza validaciones asíncronas para asegurar la unicidad de la combinación Juego-Estacion antes de la creación.
        /// </summary>
        protected override async Task ValidateBeforeCreateAsync(AppointmentOptionsDTO dto)
        {
            var existing = await _data.GetAllAsync();
            if (existing.Any(e => e.SpecialtyId == dto.SpecialtyId && e.ConsultingRoomId == dto.ConsultingRoomId))
                throw new ValidationException("Combinación", "Ya existe una relación Specialty-ConsultingRoom con esos IDs.");
        }

        /// <summary>
        /// Realiza validaciones asíncronas para asegurar la unicidad de la combinación Juego-Estacion antes de la actualización.
        /// </summary>
        protected override async Task ValidateBeforeUpdateAsync(AppointmentOptionsDTO dto, Appointment existingEntity)
        {
            if (dto.SpecialtyId != existingEntity.SpecialtyId || dto.ConsultingRoomId != existingEntity.ConsultingRoomId)
            {
                var existing = await _data.GetAllAsync();
                if (existing.Any(e => e.SpecialtyId == dto.SpecialtyId && e.ConsultingRoomId == dto.ConsultingRoomId && e.Id != dto.Id))
                    throw new ValidationException("Combinación", "Ya existe una relación Specialty-ConsultingRoom con esos IDs.");
            }
        }
    }
}