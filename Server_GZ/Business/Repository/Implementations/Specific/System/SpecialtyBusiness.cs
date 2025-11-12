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
    /// Implementación de la lógica de negocio para la gestión de juegos del sistema.
    /// </summary>
    public class SpecialtyBusiness : 
        GenericBusinessSingleDTO<Specialty, SpecialtyDTO>, 
        ISpecialtyBusiness
    {

        private readonly IGeneral<Specialty> _general;
        public SpecialtyBusiness(
            IDataFactoryGlobal factory,
            IGeneral<Specialty> general,
            IDeleteStrategyResolver<Specialty> deleteStrategyResolver,
            ILogger<Specialty> logger, 
            IMapper mapper)
            : base(factory.CreateSpecialtyData(), deleteStrategyResolver, logger, mapper) 
        {
            _general = general;
        }

        // General 

        /// <summary>
        /// Obtiene todos los juegos registrados en el sistema, incluyendo los inactivos.
        /// </summary>
        public async Task<IEnumerable<SpecialtyDTO>> GetAllTotalSpecialtysAsync()
        {
            var active = await _general.GetAllTotalAsync();
            return _mapper.Map<IEnumerable<SpecialtyDTO>>(active);
        }


        // Specific


        // Actions

        /// <summary>
        /// Hook para validar la obligatoriedad de campos (ej. Name) antes de la creación de un juego.
        /// </summary>
        protected override Task BeforeCreateMap(SpecialtyDTO dto, Specialty entity)
        {
            ValidationHelper.ThrowIfEmpty(dto.Name, "Name");
            return Task.CompletedTask;
        }

        /// <summary>
        /// Hook para validar la obligatoriedad de campos (ej. Name) antes de la actualización de un juego.
        /// </summary>
        protected override Task BeforeUpdateMap(SpecialtyDTO dto, Specialty entity)
        {
            ValidationHelper.ThrowIfEmpty(dto.Name, "Name");
            return Task.CompletedTask;
        }

        /// <summary>
        /// Realiza validaciones asíncronas de unicidad del nombre antes de la creación.
        /// </summary>
        protected override async Task ValidateBeforeCreateAsync(SpecialtyDTO dto)
        {
            var existing = await _data.GetAllAsync();
            if (existing.Any(e => StringHelper.EqualsNormalized(e.Name, dto.Name)))
                throw new ValidationException("Name", $"Ya existe un Specialty con el Name '{dto.Name}'.");
        }

        /// <summary>
        /// Realiza validaciones asíncronas de unicidad del nombre antes de la actualización.
        /// </summary>
        protected override async Task ValidateBeforeUpdateAsync(SpecialtyDTO dto, Specialty existingEntity)
        {
            if (!StringHelper.EqualsNormalized(existingEntity.Name, dto.Name))
            {
                var others = await _data.GetAllAsync();
                if (others.Any(e => e.Id != dto.Id && StringHelper.EqualsNormalized(e.Name, dto.Name)))
                    throw new ValidationException("Name", $"Ya existe un Specialty con el Name '{dto.Name}'.");
            }
        }
    }
}