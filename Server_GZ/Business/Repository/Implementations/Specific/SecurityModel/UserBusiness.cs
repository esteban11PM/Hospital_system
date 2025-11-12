using AutoMapper;
using Business.Repository.Interfaces.Specific.SecurityModel;
using Data.Factory;
using Data.Repository.Interfaces.General;
using Data.Repository.Interfaces.Specific.SecurityModel;
using Data.Repository.Interfaces.Strategy.Delete;
using Entity.DTOs.SecurityModel.User;
using Entity.Models.SecurityModel;
using Microsoft.Extensions.Logging;
using Utilities.Exceptions;
using Utilities.Helpers;

namespace Business.Repository.Implementations.Specific.SecurityModel
{
    /// <summary>
    /// Implementación de la lógica de negocio para la gestión de usuarios y autenticación.
    /// </summary>
    public class UserBusiness :
        GenericBusinessDualDTO<User, UserDTO, UserOptionsDTO>,
        IUserBusiness
    {

        private readonly IUserData _userData;
        private readonly IGeneral<User> _general;

        public UserBusiness(
            IDataFactoryGlobal factory,
            IGeneral<User> general,
            IDeleteStrategyResolver<User> deleteStrategyResolver,
            ILogger<User> logger,
            IMapper mapper)
            : base(factory.CreateUserData(), deleteStrategyResolver, logger, mapper)
        {
            _userData = factory.CreateUserData();
            _general = general;
        }

        // General 

        /// <summary>
        /// Obtiene todos los usuarios registrados en el sistema, incluyendo los inactivos.
        /// </summary>
        public async Task<IEnumerable<UserDTO>> GetAllTotalUsersAsync()
        {
            var active = await _general.GetAllTotalAsync();
            return _mapper.Map<IEnumerable<UserDTO>>(active);
        }


        // Specific

        /// <summary>
        /// Obtiene un usuario por su nombre de usuario.
        /// </summary>
        public async Task<UserDTO?> GetByUsernameAsync(string username)
        {
            var entity = await _userData.GetByUsernameAsync(username);
            return _mapper.Map<UserDTO>(entity);
        }


        // Actions

        /// <summary>
        /// Hook para validar la obligatoriedad de Username y PatientId, y realizar el hash de la contraseña antes de la creación.
        /// </summary>
        protected override Task BeforeCreateMap(UserOptionsDTO dto, User entity)
        {
            ValidationHelper.ThrowIfEmpty(dto.Username, "Username");
            ValidationHelper.ThrowIfEmpty(dto.Password, "Password");
            ValidationHelper.EnsureValidId(dto.PatientId, "PatientId");

            entity.Password = PasswordHelper.Hash(dto.Password);
            return Task.CompletedTask;
        }

        /// <summary>
        /// Hook para validar la obligatoriedad de Username y PatientId. Si se proporciona una contraseña, realiza el hash antes de la actualización.
        /// </summary>
        protected override Task BeforeUpdateMap(UserOptionsDTO dto, User entity)
        {
            ValidationHelper.ThrowIfEmpty(dto.Username, "Username");
            ValidationHelper.EnsureValidId(dto.PatientId, "PatientId");

            if (!string.IsNullOrWhiteSpace(dto.Password))
                entity.Password = PasswordHelper.Hash(dto.Password);

            return Task.CompletedTask;
        }

        /// <summary>
        /// Realiza validaciones asíncronas para asegurar la unicidad del Username y que el PatientId no esté ya asignado a otro usuario.
        /// </summary>
        protected override async Task ValidateBeforeCreateAsync(UserOptionsDTO dto)
        {
            var existing = await _data.GetAllAsync();
            if (existing.Any(f => StringHelper.EqualsNormalized(f.Username, dto.Username)))
                throw new ValidationException("Name", $"Ya existe un User con el Username '{dto.Username}'.");

            if (existing.Any(e => e.PatientId == dto.PatientId))
                throw new ValidationException("Combinación", "Ya existe una un User con el ID asociado de Patient");
        }

        /// <summary>
        /// Realiza validaciones asíncronas para asegurar la unicidad del Username y que el PatientId (si se cambia) no esté ya asignado a otro usuario.
        /// </summary>
        protected override async Task ValidateBeforeUpdateAsync(UserOptionsDTO dto, User existingEntity)
        {
            var allUsers = await _data.GetAllAsync();

            // 1. Validar Username
            if (!StringHelper.EqualsNormalized(existingEntity.Username, dto.Username))
            {
                if (allUsers.Any(e => e.Id != dto.Id && StringHelper.EqualsNormalized(e.Username, dto.Username)))
                    throw new ValidationException("Name", $"Ya existe un User con el Username '{dto.Username}'.");
            }

            // 2. Validar PatientId
            if (dto.PatientId != existingEntity.PatientId)
            {
                if (allUsers.Any(e => e.PatientId == dto.PatientId))
                    throw new ValidationException("Combinación", "Ya existe una un User con el ID asociado de Patient");
            }
        }
    }
}