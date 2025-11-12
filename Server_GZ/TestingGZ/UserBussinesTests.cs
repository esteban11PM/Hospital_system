using AutoMapper;
using Business.Repository.Implementations.Specific.SecurityModel;
using Data.Factory;
using Data.Repository.Interfaces.General;
using Data.Repository.Interfaces.Specific.SecurityModel;
using Data.Repository.Interfaces.Strategy.Delete;
using Entity.DTOs.SecurityModel.User;
using Entity.Models.SecurityModel;
using Microsoft.Extensions.Logging;
using Moq;
using Utilities.Enums;
using Utilities.Exceptions;

namespace TestingGZ
{
    public class UserBusinessTests
    {
        // --- Dependencias simuladas (Mocks) ---
        private readonly Mock<IDataFactoryGlobal> _mockFactory;
        private readonly Mock<IUserData> _mockUserData;
        private readonly Mock<IGeneral<User>> _mockGeneral;
        private readonly Mock<ILogger<User>> _mockLogger;
        private readonly Mock<IMapper> _mockMapper;

        // Mocks NUEVOS para Delete Strategy
        private readonly Mock<IDeleteStrategyResolver<User>> _mockDeleteResolver;
        private readonly Mock<IDeleteStrategy<User>> _mockDeleteStrategyInstance; 

        // --- El SUT (System Under Test) ---
        private readonly UserBusiness _service;

        public UserBusinessTests()
        {
            // 1. Inicializamos todos los mocks
            _mockFactory = new Mock<IDataFactoryGlobal>();
            _mockUserData = new Mock<IUserData>();
            _mockGeneral = new Mock<IGeneral<User>>();
            _mockLogger = new Mock<ILogger<User>>();
            _mockMapper = new Mock<IMapper>();
            _mockDeleteResolver = new Mock<IDeleteStrategyResolver<User>>();
            _mockDeleteStrategyInstance = new Mock<IDeleteStrategy<User>>(); 

            // 2. Configuramos el comportamiento clave
            _mockFactory.Setup(f => f.CreateUserData()).Returns(_mockUserData.Object);

            // 3. Creamos la instancia real del servicio, inyectando los mocks
            _service = new UserBusiness(
                _mockFactory.Object,
                _mockGeneral.Object,
                _mockDeleteResolver.Object, 
                _mockLogger.Object,
                _mockMapper.Object
            );
        }

        #region Pruebas CreateAsync

        [Fact]
        public async Task CreateAsync_Should_ThrowValidationException_When_UsernameAlreadyExists()
        {
            // --- 1. Arrange (Organizar) ---
            var inputDto = new UserOptionsDTO { Username = "TestUser", Password = "Password123", PatientId = 1 };
            var existingUsers = new List<User> { new() { Id = 99, Username = "TestUser", PatientId = 99 } };

            _mockUserData.Setup(data => data.GetAllAsync()).ReturnsAsync(existingUsers);
            _mockMapper.Setup(m => m.Map<User>(It.IsAny<UserOptionsDTO>())).Returns(new User());

            // --- 2. Act (Actuar) ---
            var act = () => _service.CreateAsync(inputDto);

            // --- 3. Assert (Afirmar) ---
            var exception = await Assert.ThrowsAsync<ValidationException>(act);
            Assert.Contains("Ya existe un User con el Username", exception.Message);
        }

        [Fact]
        public async Task CreateAsync_Should_ReturnCreatedDto_When_DataIsValid()
        {
            // --- 1. Arrange ---
            var inputDto = new UserOptionsDTO { Username = "NewValidUser", Password = "PlainPassword123", PatientId = 5 };
            var mappedEntity = new User { Username = "NewValidUser", Password = "PlainPassword123", PatientId = 5 };
            var savedEntity = new User { Id = 1, Username = "NewValidUser", Password = "¡¡HASHED_PASSWORD!!", PatientId = 5 };
            var resultDto = new UserOptionsDTO { Id = 1, Username = "NewValidUser", PatientId = 5 };

            _mockUserData.Setup(data => data.GetAllAsync()).ReturnsAsync([]); // No hay usuarios existentes
            _mockMapper.Setup(m => m.Map<User>(inputDto)).Returns(mappedEntity);
            _mockUserData.Setup(data => data.CreateAsync(It.IsAny<User>())).ReturnsAsync(savedEntity);
            _mockMapper.Setup(m => m.Map<UserOptionsDTO>(savedEntity)).Returns(resultDto);

            // --- 2. Act ---
            var result = await _service.CreateAsync(inputDto);

            // --- 3. Assert ---
            Assert.NotNull(result);
            Assert.Equal(1, result.Id);
            _mockUserData.Verify(data => data.GetAllAsync(), Times.Once());
            _mockUserData.Verify(data => data.CreateAsync(It.IsAny<User>()), Times.Once());
        }

        #endregion

        #region Pruebas UpdateAsync

        [Fact]
        public async Task UpdateAsync_Should_Succeed_When_DataIsValid()
        {
            // --- 1. Arrange ---
            // DTO con los datos actualizados
            var inputDto = new UserOptionsDTO { Id = 1, Username = "UpdatedUser", PatientId = 10, Password = string.Empty };

            // Entidad tal como existe en la "DB" antes del update
            var existingEntity = new User { Id = 1, Username = "OriginalUser", PatientId = 5, Password = "HashedPassword" };

            // Lista de "otros" usuarios en la DB (solo contiene la entidad que estamos actualizando)
            var otherUsers = new List<User> { existingEntity };

            // Configuración de Mocks
            // 1. Simula que GetByIdAsync encuentra la entidad a actualizar
            _mockUserData.Setup(data => data.GetByIdAsync(inputDto.Id)).ReturnsAsync(existingEntity);

            // 2. Simula GetAllAsync (para la validación)
            _mockUserData.Setup(data => data.GetAllAsync()).ReturnsAsync(otherUsers);

            // 3. Simula UpdateAsync
            _mockUserData.Setup(data => data.UpdateAsync(It.IsAny<User>())).ReturnsAsync(existingEntity);

            // 4. Simula el mapeo de respuesta
            _mockMapper.Setup(m => m.Map<UserOptionsDTO>(existingEntity))
                       .Returns(new UserOptionsDTO { Id = inputDto.Id, Username = inputDto.Username, PatientId = inputDto.PatientId });

            // --- 2. Act ---
            var result = await _service.UpdateAsync(inputDto);

            // --- 3. Assert ---
            Assert.NotNull(result);
            Assert.Equal(inputDto.Username, result.Username); // El nombre se actualizó
            _mockUserData.Verify(data => data.GetByIdAsync(inputDto.Id), Times.Once());
            _mockUserData.Verify(data => data.GetAllAsync(), Times.Once()); // Se llamó la validación
            _mockUserData.Verify(data => data.UpdateAsync(It.IsAny<User>()), Times.Once()); // Se llamó al update
        }

        [Fact]
        public async Task UpdateAsync_Should_ThrowValidationException_When_UsernameIsTakenByAnotherUser()
        {
            // --- 1. Arrange ---
            // DTO con el intento de actualización
            var inputDto = new UserOptionsDTO { Id = 1, Username = "TakenUsername" }; // Intenta tomar "TakenUsername"

            // Entidad que estamos intentando actualizar
            var existingEntity = new User { Id = 1, Username = "OriginalUser" };

            // Otro usuario que YA TIENE ese nombre
            var anotherUser = new User { Id = 2, Username = "TakenUsername" };

            // La "DB" contiene ambas entidades
            var allUsers = new List<User> { existingEntity, anotherUser };

            // Configuración de Mocks
            _mockUserData.Setup(data => data.GetByIdAsync(inputDto.Id)).ReturnsAsync(existingEntity);
            _mockUserData.Setup(data => data.GetAllAsync()).ReturnsAsync(allUsers); // La validación encontrará el conflicto

            // --- 2. Act ---
            var act = () => _service.UpdateAsync(inputDto);

            // --- 3. Assert ---
            var exception = await Assert.ThrowsAsync<ValidationException>(act);
            Assert.Contains("Ya existe un User con el Username", exception.Message);
            _mockUserData.Verify(data => data.UpdateAsync(It.IsAny<User>()), Times.Never()); // El guardado NUNCA debe llamarse
        }

        #endregion

        #region Pruebas DeleteAsync

        [Fact]
        public async Task DeleteAsync_Should_CallLogicalStrategy_When_DeleteTypeIsLogical()
        {
            // --- 1. Arrange ---
            int idToDelete = 1;
            var deleteType = DeleteType.Logical;
            var entityToDelete = new User { Id = idToDelete };

            // 1. Simula que encontramos la entidad
            _mockUserData.Setup(data => data.GetByIdAsync(idToDelete)).ReturnsAsync(entityToDelete);

            // 2. Simula el RESOLVER: cuando pida "Logical", devuelve nuestra instancia de estrategia mock
            _mockDeleteResolver.Setup(r => r.Resolve(deleteType)).Returns(_mockDeleteStrategyInstance.Object);

            // 3. Simula la ESTRATEGIA: el método DeleteAsync de la instancia devolverá 'true'
            _mockDeleteStrategyInstance.Setup(s => s.DeleteAsync(idToDelete, _mockUserData.Object)).ReturnsAsync(true);

            // --- 2. Act ---
            var result = await _service.DeleteAsync(idToDelete, deleteType);

            // --- 3. Assert ---
            Assert.True(result);
            _mockDeleteResolver.Verify(r => r.Resolve(DeleteType.Logical), Times.Once()); // Verificamos que se pidió la estrategia LÓGICA
            _mockDeleteStrategyInstance.Verify(s => s.DeleteAsync(idToDelete, _mockUserData.Object), Times.Once()); // Verificamos que se ejecutó
        }

        [Fact]
        public async Task DeleteAsync_Should_CallPersistenceStrategy_When_DeleteTypeIsPersistence()
        {
            // --- 1. Arrange ---
            int idToDelete = 1;
            var deleteType = DeleteType.Permanent; // Cambiamos el tipo
            var entityToDelete = new User { Id = idToDelete };

            // 1. Simula que encontramos la entidad
            _mockUserData.Setup(data => data.GetByIdAsync(idToDelete)).ReturnsAsync(entityToDelete);

            // 2. Simula el RESOLVER: cuando pida "Persistence", devuelve nuestra instancia
            _mockDeleteResolver.Setup(r => r.Resolve(deleteType)).Returns(_mockDeleteStrategyInstance.Object);

            // 3. Simula la ESTRATEGIA
            _mockDeleteStrategyInstance.Setup(s => s.DeleteAsync(idToDelete, _mockUserData.Object)).ReturnsAsync(true);

            // --- 2. Act ---
            var result = await _service.DeleteAsync(idToDelete, deleteType);

            // --- 3. Assert ---
            Assert.True(result);
            _mockDeleteResolver.Verify(r => r.Resolve(DeleteType.Permanent), Times.Once()); // Verificamos que se pidió la estrategia de PERSISTENCIA
            _mockDeleteStrategyInstance.Verify(s => s.DeleteAsync(idToDelete, _mockUserData.Object), Times.Once());
        }

        #endregion
    }
}
