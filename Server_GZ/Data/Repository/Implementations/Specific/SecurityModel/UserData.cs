using Data.Repository.Interfaces.Specific.SecurityModel;
using Entity.Context;
using Entity.Models.SecurityModel;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Data.Repository.Implementations.Specific.SecurityModel
{
    /// <summary>
    /// Repositorio para gestión de usuarios del sistema
    /// </summary>
    public class UserData : GenericData<User>, IUserData
    {
        private readonly AppDbContext _context;
        private readonly ILogger _logger;

        public UserData(AppDbContext context, ILogger<User> logger) : base(context, logger)
        {
            _context = context;
            _logger = logger;
        }

        /// <summary>
        /// Obtiene todos los usuarios activos con sus datos de persona
        /// </summary>
        public override async Task<IEnumerable<User>> GetAllAsync()
        {
            try
            {
                return await _context.User
                    .Include(u => u.Patient)
                    .Include(u => u.Role)
                    .Where(u => u.Active)
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                _logger.LogInformation(ex, "No se puedieron obtener los datos");
                throw;
            }
        }

        /// <summary>
        /// Obtiene un usuario por ID con sus datos de persona
        /// </summary>
        /// <param name="id">ID del usuario</param>
        public override async Task<User?> GetByIdAsync(int id)
        {
            try
            {
                return await _context.User
                    .Include(u => u.Patient)
                    .Include(u => u.Role)
                    .FirstOrDefaultAsync(u => u.Id == id);
            }
            catch (Exception ex)
            {
                _logger.LogInformation(ex, $"No se puedieron obtener los datos por id: {id}");
                throw;
            }
        }


        // General

        /// <summary>
        /// Obtiene todos los usuarios sin filtrar por estado
        /// </summary>
        public override async Task<IEnumerable<User>> GetAllTotalAsync()
        {
            try
            {
                return await _context.User
                    .Include(u => u.Patient)
                    .Include(u => u.Role)
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                _logger.LogInformation(ex, $"No se puedo obtener todos los datos");
                throw;
            }

        }


        // Specific

        /// <summary>
        /// Busca un usuario por nombre de usuario
        /// </summary>
        /// <param name="username">Nombre de usuario</param>
        public async Task<User?> GetByUsernameAsync(string username)
        {
            try
            {
                return await _context.User
                    .Include(u => u.Patient)
                    .Include(u => u.Role)
                    .FirstOrDefaultAsync(u => u.Username == username && u.Active);
            }
            catch (Exception ex)
            {
                _logger.LogInformation(ex, $"No se puedo obtener el User con Username: {username}");
                throw;
            }
        }

        /// <summary>
        /// Verifica si un nombre de usuario ya existe
        /// </summary>
        /// <param name="username">Nombre de usuario a verificar</param>
        public async Task<bool> UsernameExistsAsync(string username)
        {
            return await _context.User.AnyAsync(p => p.Username == username && p.Active);
        }
    }
}