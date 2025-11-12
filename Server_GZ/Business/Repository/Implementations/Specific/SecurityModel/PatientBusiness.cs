using AutoMapper;
using Business.Repository.Interfaces.Specific.SecurityModel;
using Data.Factory;
using Data.Repository.Interfaces.General;
using Data.Repository.Interfaces.Specific.SecurityModel;
using Data.Repository.Interfaces.Strategy.Delete;
using Entity.DTOs.SecurityModel.Person;
using Entity.Models.SecurityModel;
using Microsoft.Extensions.Logging;
using Utilities.Exceptions;
using Utilities.Helpers;

namespace Business.Repository.Implementations.Specific.SecurityModel
{
    /// <summary>
    /// Implementación de la lógica de negocio para la gestión de la información de las personas (datos demográficos, contacto, etc.).
    /// </summary>
    public class PatientBusiness : 
        GenericBusinessSingleDTO<Patient, PatientDTO>, 
        IPatientBusiness

    {
        private readonly IPatientData _personData;
        private readonly IGeneral<Patient> _general;
        public PatientBusiness(
            IDataFactoryGlobal factory,
            IGeneral<Patient> general,
            IDeleteStrategyResolver<Patient> deleteStrategyResolver, 
            ILogger<Patient> logger, 
            IMapper mapper)
            : base(factory.CreatePatientData(), deleteStrategyResolver, logger, mapper) 
        {
            _personData = factory.CreatePatientData();
            _general = general;
        }

        // General 

        /// <summary>
        /// Obtiene todas las personas registradas en el sistema, incluyendo las inactivas.
        /// </summary>
        public async Task<IEnumerable<PatientDTO>> GetAllTotalPatientsAsync()
        {
            var active = await _general.GetAllTotalAsync();
            return _mapper.Map<IEnumerable<PatientDTO>>(active);
        }


        // Specific

        /// <summary>
        /// Obtiene una lista de personas que aún no están asociadas a un usuario en el sistema.
        /// </summary>
        public async Task<IEnumerable<PatientAvailableDTO?>> GetPatientAvailableAsync()
        {
            var entities = await _personData.GetAvailablePatients();
            return _mapper.Map<IEnumerable<PatientAvailableDTO?>>(entities);

        }


        // Actions

        /// <summary>
        /// Hook para validar la obligatoriedad de campos (ej. Name) antes de la creación de una persona.
        /// </summary>
        protected override Task BeforeCreateMap(PatientDTO dto, Patient entity)
        {
            ValidationHelper.ThrowIfEmpty(dto.Name, "Name");
            return Task.CompletedTask;
        }

        /// <summary>
        /// Hook para validar la obligatoriedad de campos (ej. Name) antes de la actualización de una persona.
        /// </summary>
        protected override Task BeforeUpdateMap(PatientDTO dto, Patient entity)
        {
            ValidationHelper.ThrowIfEmpty(dto.Name, "Name");
            return Task.CompletedTask;
        }

        /// <summary>
        /// Realiza validaciones asíncronas para asegurar la unicidad de Email, Documento y Teléfono antes de la creación.
        /// </summary>
        protected override async Task ValidateBeforeCreateAsync(PatientDTO dto)
        {
            var existing = await _data.GetAllAsync();
            if (existing.Any(e => StringHelper.EqualsNormalized(e.Email, dto.Email)))
                throw new ValidationException("Email", $"Correo ya Registrado '{dto.Email}'.");

            if (existing.Any(e => StringHelper.EqualsNormalized(e.Phone, dto.Phone)))
                throw new ValidationException("Phone", $"Telefono ya Registrado '{dto.Phone}'.");
        }

        /// <summary>
        /// Realiza validaciones asíncronas para asegurar la unicidad de Documento y Teléfono antes de la actualización, excluyendo el registro actual.
        /// </summary>
        protected override async Task ValidateBeforeUpdateAsync(PatientDTO dto, Patient existingEntity)
        {
            var phoneNormalized = StringHelper.EqualsNormalized(existingEntity.Phone, dto.Phone);

            if (phoneNormalized)
            {
                var others = await _data.GetAllAsync();

                if (others.Any(e => e.Id != dto.Id && StringHelper.EqualsNormalized(e.Phone, dto.Phone)))
                    throw new ValidationException("Phone", $"Phone Ya Registrado '{dto.Phone}'.");
            }
        }

    }
}