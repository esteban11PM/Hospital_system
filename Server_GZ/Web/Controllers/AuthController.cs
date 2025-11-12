using Business.Repository.Interfaces.Specific.SecurityModel;
using Business.Services.Jwt;
using Business.Services.Jwt.Interfaces;
using Entity.Context;
using Entity.DTOs.Auth;
using Entity.DTOs.SecurityModel.Person;
using Entity.DTOs.SecurityModel.User;
using Microsoft.AspNetCore.Mvc;
using Utilities.Exceptions;

namespace Web.Controllers
{
    /// <summary>
    /// Controller para autenticación, registro y recuperación de contraseñas
    /// </summary>
    [Route("api/[controller]/")]
    [ApiController]
    [Produces("application/json")]
    public class AuthController : ControllerBase
    {
        private readonly AuthService _authService;
        private readonly AppDbContext _context;
        private readonly IRefreshTokenService _refreshTokenService;
        private readonly IRoleBusiness _roleBusiness;
        private readonly IUserBusiness _userBusiness;
        private readonly IPatientBusiness _personBusiness;

        public AuthController(
            AuthService authService,
            AppDbContext context,
            IRefreshTokenService refreshTokenService,
            IRoleBusiness roleBusines,
            IUserBusiness userBusiness,
            IPatientBusiness personBusiness)
        {
            _authService = authService;
            _context = context;
            _refreshTokenService = refreshTokenService;
            _roleBusiness = roleBusines;
            _userBusiness = userBusiness;
            _personBusiness = personBusiness;
        }

        /// <summary>
        /// Autentica un usuario con credenciales estándar (username/password)
        /// implementa HttpOnly cookies para tokens
        /// </summary>
        /// <param name="loginRequest">Credenciales de inicio de sesión</param>
        [HttpPost("Login")]
        public async Task<IActionResult> Login([FromBody] LoginRequestDTO loginRequest)
        {
            var response = await _authService.AuthenticateAsync(loginRequest);
            if (response == null)
                return Unauthorized("Credenciales inválidas.");


            return Ok(response);
        }

        /// <summary>
        /// Registra un nuevo usuario en el sistema con envío de email de bienvenida
        /// </summary>
        /// <param name="dto">Datos del usuario a registrar</param>
        [HttpPost("Register")]
        public async Task<IActionResult> Register([FromBody] RegisterDTO dto)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                // Validar Existencia de Numero de Documento y Telefono
                var personDto = new PatientDTO
                {
                    Name = dto.Name,
                    LastName = dto.LastName,
                    Email = dto.Email,
                    Phone = dto.Phone,
                    Active = true
                };

                var tempUserDto = new UserOptionsDTO
                {
                    Username = dto.Username,
                    Password = dto.Password,
                    PatientId = 0, // temporal, se actualizara despues
                    RoleId = dto.RoleId, // temporal, se actualizara despues
                    Active = true
                };

                // Si las validaciones pasan, guardar Person
                var createdPerson = await _personBusiness.CreateAsync(personDto);

                // Crear User con el PersonId correcto
                var userDto = new UserOptionsDTO
                {
                    Username = dto.Username,
                    Password = dto.Password,
                    PatientId = createdPerson.Id,
                    RoleId = dto.RoleId,
                    Active = true
                };

                var createdUser = await _userBusiness.CreateAsync(userDto);

                // Confirmar la transacción
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return Ok(new { message = "Registro exitoso" });
            }
            catch (ValidationException ex)
            {
                await transaction.RollbackAsync();
                return BadRequest(new
                {
                    error = ex.Message,
                    field = ex.PropertyName
                });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, new
                {
                    error = "Ocurrió un error inesperado.",
                    details = ex.Message
                });
            }
        }

        /// <summary>
        /// Refresca un Access Token utilizando un Refresh Token válido.
        /// Implementa rotación de tokens.
        /// </summary>
        /// <param name="request">El Refresh Token actual.</param>
        [HttpPost("Refresh")]
        public IActionResult Refresh([FromBody] RefreshRequestDTO request)
        {
            if (string.IsNullOrEmpty(request.RefreshToken))
                return BadRequest("Refresh Token es requerido.");

            // Tu RefreshTokenService ya valida y genera los nuevos tokens
            var response = _refreshTokenService.RefreshAccessToken(request.RefreshToken);

            if (response == null)
            {
                // Esto puede pasar si el refresh token es inválido, expiró o ya fue usado
                return Unauthorized("Refresh Token inválido o expirado.");
            }

            // Devuelve los NUEVOS tokens (Access y Refresh)
            return Ok(response);
        }

        /// <summary>
        /// Obtiene lista de todos los roles disponibles
        /// </summary>
        [HttpGet("GetAllRoles")]
        public async Task<IActionResult> GetAllRoles()
        {
            var roles = await _roleBusiness.GetAllAsync();
            return Ok(roles);
        }

    }
}
