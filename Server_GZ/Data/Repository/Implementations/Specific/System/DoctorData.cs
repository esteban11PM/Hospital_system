using Data.Repository.Interfaces.Specific.System;
using Entity.Context;
using Entity.Models.System;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Data.Repository.Implementations.Specific.System
{
    /// <summary>
    /// Repositorio para gestión de doctores en el sistema
    /// </summary>
    public class DoctorData : GenericData<Doctor>, IDoctorData
    {

        private readonly AppDbContext _context;
        private readonly ILogger _logger;

        public DoctorData(AppDbContext context, ILogger<Doctor> logger) : base(context, logger) {
            _context = context;
            _logger = logger;
        }

        // Specific

        /// <summary>
        /// Verifica si un email ya está registrado
        /// </summary>
        /// <param name="email">Email a verificar</param>
        public async Task<bool> EmailExistsAsync(string email)
        {
            return await _context.Doctor.AnyAsync(d => d.Email.ToLower() == email.ToLower() && d.Active);
        }

        /// <summary>
        /// Verifica si un número de licencia ya está registrado
        /// </summary>
        /// <param name="licenseNumber">Número de licencia a verificar</param>
        public async Task<bool> LicenseNumberExistsAsync(string licenseNumber)
        {
            return await _context.Doctor.AnyAsync(d => d.LicenseNumber == licenseNumber && d.Active);
        }
    }
}