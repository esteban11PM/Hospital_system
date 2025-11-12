using Business.Repository.Implementations.Specific.SecurityModel;
using Business.Repository.Implementations.Specific.System;
using Business.Repository.Interfaces.Specific.SecurityModel;
using Business.Repository.Interfaces.Specific.System;
using Data.Repository.Implementations.Specific.SecurityModel;
using Data.Repository.Implementations.Specific.System;
using Data.Repository.Interfaces.General;
using Data.Repository.Interfaces.Specific.SecurityModel;
using Entity.Models.SecurityModel;
using Entity.Models.System;

namespace Web.Extensions
{
    /// <summary>
    /// Extensiones para registro de servicios de entidades del sistema
    /// </summary>
    public static class EntitiesServiceExtensions
    {
        /// <summary>
        /// Registra servicios Business y Data de todas las entidades (Security, Parameters, System)
        /// </summary>
        /// <param name="services">Colección de servicios</param>
        public static IServiceCollection AddEntitiesServices(this IServiceCollection services)
        {
            // -----------------------
            // SecurityModel
            // -----------------------
            services.AddScoped<IPatientBusiness, PatientBusiness>();
            services.AddScoped<IGeneral<Patient>, PatientData>();
            services.AddScoped<IPatientData, PatientData>();

            services.AddScoped<IUserBusiness, UserBusiness>();
            services.AddScoped<IGeneral<User>, UserData>();
            services.AddScoped<IUserData, UserData>();

            services.AddScoped<IRoleBusiness, RoleBusiness>();
            services.AddScoped<IGeneral<Role>, RoleData>();
            services.AddScoped<IRoleData, RoleData>();

            // -----------------------
            // System
            // -----------------------
            services.AddScoped<ISpecialtyBusiness, SpecialtyBusiness>();
            services.AddScoped<IGeneral<Specialty>, SpecialtyData>();

            services.AddScoped<IConsultingRoomBusiness, ConsultingRoomBusiness>();
            services.AddScoped<IGeneral<ConsultingRoom>, ConsultingRoomData>();

            services.AddScoped<IDoctorBusiness, DoctorBusiness>();
            services.AddScoped<IGeneral<Doctor>, DoctorData>();

            services.AddScoped<IAppointmentBusiness, AppointmentBusiness>();
            services.AddScoped<IGeneral<Appointment>, AppointmentData>();

            services.AddScoped<IDoctorSpecialtyBusiness, DoctorSpecialtyBusiness>();
            services.AddScoped<IGeneral<DoctorSpecialty>, DoctorSpecialtyData>();

            services.AddScoped<IDoctorConsultingRoomBusiness, DoctorConsultingRoomBusiness>();
            services.AddScoped<IGeneral<DoctorConsultingRoom>, DoctorConsultingRoomData>();

            return services;
        }
    }
}
