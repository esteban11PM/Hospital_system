using Business.Services.Jwt.Interfaces;
using Entity.Context;
using Entity.DTOs.Auth;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Utilities.Helpers;

namespace Business.Services.Jwt
{
    /// <summary>
    /// Proporciona los servicios de autenticación de usuarios contra la base de datos y
    /// la emisión de los tokens de seguridad (Access y Refresh Tokens).
    /// </summary>
    public class AuthService
    {
        private readonly AppDbContext _context;
        private readonly IJwtService _jwtService;
        private readonly IConfiguration _configuration;

        public AuthService(AppDbContext context, IJwtService jwtService, IConfiguration configuration)
        {
            _context = context;
            _jwtService = jwtService;
            _configuration = configuration;
        }

        /// <summary>
        /// Autentica a un usuario mediante nombre de usuario y contraseña.
        /// Si la autenticación es exitosa, genera y devuelve un Access Token y un Refresh Token.
        /// </summary>
        /// <param name="loginRequest">Los datos de inicio de sesión (usuario y contraseña).</param>
        /// <returns>Un <see cref="LoginResponseDTO"/> con los tokens, o null si la autenticación falla.</returns>
        public async Task<LoginResponseDTO?> AuthenticateAsync(LoginRequestDTO loginRequest)
        {
            var user = await _context.User
                .Include(u => u.Role)
                .Where(u => u.Active == true)
                .FirstOrDefaultAsync(u => u.Username == loginRequest.Username);

            if (user == null || !PasswordHelper.Verify(user.Password, loginRequest.Password))
                return null;

            var role = user.Role?.Name ?? "Usuario";

            int accessTokenMinutes = _configuration.GetValue<int>("Jwt:AccessTokenExpiresInMinutes");
            int refreshTokenMinutes = _configuration.GetValue<int>("Jwt:RefreshTokenExpiresInMinutes");

            // Generar tokens
            var accessToken = _jwtService.GenerateToken(user.Id, user.PatientId, user.Username, role, accessTokenMinutes);
            var refreshToken = _jwtService.GenerateToken(user.Id, user.PatientId, user.Username, role, refreshTokenMinutes);

            return new LoginResponseDTO
            {
                Token = accessToken,
                RefreshToken = refreshToken,
            };
        }
    }
}
