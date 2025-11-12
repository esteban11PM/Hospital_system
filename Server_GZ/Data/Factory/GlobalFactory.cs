using Data.Repository.Implementations.Specific.SecurityModel;
using Data.Repository.Implementations.Specific.System;
using Data.Repository.Interfaces.Specific.SecurityModel;
using Data.Repository.Interfaces.Specific.System;
using Entity.Context;
using Entity.Models.SecurityModel;
using Entity.Models.System;
using Microsoft.Extensions.Logging;

namespace Data.Factory
{
    /// <summary>
    /// Implementación de la fábrica global que centraliza la creación de repositorios de datos.
    /// Configura cada repositorio con su contexto, logger y servicios necesarios.
    /// </summary>
    public class GlobalFactory : IDataFactoryGlobal
    {
        private readonly AppDbContext _context;
        private readonly ILoggerFactory _loggerFactory;

        public GlobalFactory(AppDbContext context, ILoggerFactory loggerFactory)
        {
            _context = context;
            _loggerFactory = loggerFactory;
        }

        // Cada método Create instancia un repositorio específico con sus dependencias configuradas

        // -----------------------
        // SecurityModel
        // -----------------------
        public IPatientData CreatePatientData()
        {
            var logger = _loggerFactory.CreateLogger<Patient>();
            return new PatientData(_context, logger);
        }

        public IUserData CreateUserData()
        {
            var logger = _loggerFactory.CreateLogger<User>();
            return new UserData(_context, logger);
        }

        public IRoleData CreateRoleData()
        {
            var logger = _loggerFactory.CreateLogger<Role>();
            return new RoleData(_context, logger);
        }

        // -----------------------
        // System
        // -----------------------
        public ISpecialtyData CreateSpecialtyData()
        {
            var logger = _loggerFactory.CreateLogger<Specialty>();
            return new SpecialtyData(_context, logger);
        }

        public IConsultingRoomData CreateConsultingRoomData()
        {
            var logger = _loggerFactory.CreateLogger<ConsultingRoom>();
            return new ConsultingRoomData(_context, logger);
        }

        public IDoctorData CreateDoctorData()
        {
            var logger = _loggerFactory.CreateLogger<Doctor>();
            return new DoctorData(_context, logger);
        }

        public IAppointmentData CreateAppointmentData()
        {
            var logger = _loggerFactory.CreateLogger<Appointment>();
            return new AppointmentData(_context, logger);
        }

        public IDoctorSpecialtyData CreateDoctorSpecialtyData()
        {
            var logger = _loggerFactory.CreateLogger<DoctorSpecialty>();
            return new DoctorSpecialtyData(_context, logger);
        }

        public IDoctorConsultingRoomData CreateDoctorConsultingRoomData()
        {
            var logger = _loggerFactory.CreateLogger<DoctorConsultingRoom>();
            return new DoctorConsultingRoomData(_context, logger);
        }

        // Ejemplo de Generico
        //public IGenericData<RoleFormPermission> CreateRoleFormPermissionData()
        //{
        //    var logger = _loggerFactory.CreateLogger<RoleFormPermission>();
        //    return new RoleFormPermissionData(_context, logger);
        //}
    }
}