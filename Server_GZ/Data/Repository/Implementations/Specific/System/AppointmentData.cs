using Data.Repository.Interfaces.Specific.System;
using Entity.Context;
using Entity.Models.System;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Data.Repository.Implementations.Specific.System
{
    /// <summary>
    /// Repositorio para gestión de relaciones entre juegos y estaciones
    /// </summary>
    public class AppointmentData : GenericData<Appointment>, IAppointmentData
    {
        private readonly AppDbContext _context;
        private readonly ILogger _logger;

        public AppointmentData(AppDbContext context, ILogger<Appointment> logger) : base(context, logger)
        {
            _context = context;
            _logger = logger;
        }

        /// <summary>
        /// Obtiene todas las relaciones juego-estacion activas con sus datos relacionados
        /// </summary>
        public override async Task<IEnumerable<Appointment>> GetAllAsync()
        {
            try
            {
                return await _context.Appointment
                    .Include(fm => fm.Specialty)
                    .Include(fm => fm.ConsultingRoom)
                    .Where(fm => fm.Active)
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                _logger.LogInformation(ex, "No se puedieron obtener los datos");
                throw;
            }
        }

        /// <summary>
        /// Obtiene una relación juego-estacion por ID con sus datos relacionados
        /// </summary>
        /// <param name="id">ID de la relación</param>
        public override async Task<Appointment?> GetByIdAsync(int id)
        {
            try
            {
                return await _context.Appointment
                    .Include(fm => fm.Specialty)
                    .Include(fm => fm.ConsultingRoom)
                    .FirstOrDefaultAsync(fm => fm.Id == id);
            }
            catch (Exception ex)
            {
                _logger.LogInformation(ex, "No se puedieron obtener los datos por id");
                throw;
            }
        }

        // General
        /// <summary>
        /// Obtiene todas las relaciones juego-estacion sin filtrar por estado
        /// </summary>
        public override async Task<IEnumerable<Appointment>> GetAllTotalAsync()
        {
            try
            {
                return await _context.Appointment
                    .Include(fm => fm.Specialty)
                    .Include(fm => fm.ConsultingRoom)
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                _logger.LogInformation(ex, $"No se puedieron obtener todos los datos");
                throw;
            }
        }
    }
}