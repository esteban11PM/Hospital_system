using AutoMapper;
using Business.Repository.Interfaces.Specific.System;
using Data.Factory;
using Data.Repository.Interfaces.General;
using Data.Repository.Interfaces.Strategy.Delete;
using Entity.DTOs.System;
using Entity.Models.System;
using Microsoft.Extensions.Logging;
using Utilities.Exceptions;
using Utilities.Helpers;

namespace Business.Repository.Implementations.Specific.System
{
    /// <summary>
    /// Implementación de la lógica de negocio para la gestión de las estaciones de juegos del sistema.
    /// </summary>
    public class ConsultingRoomBusiness : 
        GenericBusinessSingleDTO<ConsultingRoom, ConsultingRoomDTO>, 
        IConsultingRoomBusiness
    {

        private readonly IGeneral<ConsultingRoom> _general;
        public ConsultingRoomBusiness(
            IDataFactoryGlobal factory,
            IGeneral<ConsultingRoom> general,
            IDeleteStrategyResolver<ConsultingRoom> deleteStrategyResolver,
            ILogger<ConsultingRoom> logger, 
            IMapper mapper)
            : base(factory.CreateConsultingRoomData(), deleteStrategyResolver, logger, mapper) 
        {
            _general = general;
        }

        // General 

        /// <summary>
        /// Obtiene todos las estaciones de juegos registradas en el sistema, incluyendo las inactivas.
        /// </summary>
        public async Task<IEnumerable<ConsultingRoomDTO>> GetAllTotalConsultingRoomsAsync()
        {
            var active = await _general.GetAllTotalAsync();
            return _mapper.Map<IEnumerable<ConsultingRoomDTO>>(active);
        }


        // Specific


        // Actions

        /// <summary>
        /// Hook para validar la obligatoriedad de campos (ej. Name) antes de la creación de una estacion de juego.
        /// </summary>
        protected override Task BeforeCreateMap(ConsultingRoomDTO dto, ConsultingRoom entity)
        {
            ValidationHelper.ThrowIfEmpty(dto.Name, "Name");
            return Task.CompletedTask;
        }

        /// <summary>
        /// Hook para validar la obligatoriedad de campos (ej. Name) antes de la actualización de una estacion de juego.
        /// </summary>
        protected override Task BeforeUpdateMap(ConsultingRoomDTO dto, ConsultingRoom entity)
        {
            ValidationHelper.ThrowIfEmpty(dto.Name, "Name");
            return Task.CompletedTask;
        }

        /// <summary>
        /// Realiza validaciones asíncronas de unicidad del nombre antes de la creación.
        /// </summary>
        protected override async Task ValidateBeforeCreateAsync(ConsultingRoomDTO dto)
        {
            var existing = await _data.GetAllAsync();
            if (existing.Any(e => StringHelper.EqualsNormalized(e.Name, dto.Name)))
                throw new ValidationException("Name", $"Ya existe una ConsultingRoom con el Name '{dto.Name}'.");
        }

        /// <summary>
        /// Realiza validaciones asíncronas de unicidad del nombre antes de la actualización.
        /// </summary>
        protected override async Task ValidateBeforeUpdateAsync(ConsultingRoomDTO dto, ConsultingRoom existingEntity)
        {
            if (!StringHelper.EqualsNormalized(existingEntity.Name, dto.Name))
            {
                var others = await _data.GetAllAsync();
                if (others.Any(e => e.Id != dto.Id && StringHelper.EqualsNormalized(e.Name, dto.Name)))
                    throw new ValidationException("Name", $"Ya existe una ConsultingRoom con el Name '{dto.Name}'.");
            }
        }
    }
}