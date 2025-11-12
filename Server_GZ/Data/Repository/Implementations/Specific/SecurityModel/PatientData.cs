using Data.Repository.Interfaces.Specific.SecurityModel;
using Entity.Context;
using Entity.Models.SecurityModel;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Data.Repository.Implementations.Specific.SecurityModel
{
    /// <summary>
    /// Repositorio para gestión de personas en el sistema
    /// </summary>
    public class PatientData : GenericData<Patient>, IPatientData
    {

        private readonly AppDbContext _context;
        private readonly ILogger _logger;

        public PatientData(AppDbContext context, ILogger<Patient> logger) : base(context, logger) {
            _context = context;
            _logger = logger;
        }

        // Specific

        /// <summary>
        /// Obtiene personas que no tienen usuario asignado
        /// </summary>
        public async Task<IEnumerable<Patient?>> GetAvailablePatients()
        {
            try
            {
                return await _context.Patient
                    .Where(p => p.Active && p.User == null)
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al obtener personas disponibles");
                throw;
            }
        }

        /// <summary>
        /// Verifica si un email ya está registrado
        /// </summary>
        /// <param name="email">Email a verificar</param>
        public async Task<bool> EmailExistsAsync(string email)
        {
            return await _context.Patient.AnyAsync(p => p.Email.ToLower() == email.ToLower() && p.Active);
        }

        /// <summary>
        /// Verifica si un teléfono ya está registrado
        /// </summary>
        /// <param name="phone">Teléfono a verificar</param>
        public async Task<bool> PhoneExistsAsync(string phone)
        {
            return await _context.Patient.AnyAsync(p => p.Phone == phone && p.Active);
        }
    }
}