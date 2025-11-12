using Data.SeedData;
using Data.SeedData.Interface;
using Data.SeedData.Specific;
using Entity.Models.SecurityModel;
using Entity.Models.System;

namespace Web.Extensions
{
    /// <summary>
    /// Extensiones para configuraci�n de persistencia y sembrado de datos
    /// </summary>
    public static class ServiceCollectionExtensions
    {
        /// <summary>
        /// Registra todos los sembradores de datos iniciales para las entidades
        /// </summary>
        /// <param name="services">Colecci�n de servicios</param>
        public static IServiceCollection AddDataSeeders(this IServiceCollection services)
        {
            // -----------------------
            // SecurityModel
            // -----------------------
            services.AddScoped<IDataSeeder>(provider =>
                new GenericSeeder<Patient>("SecurityModel", "patients.json", provider.GetRequiredService<IConfiguration>()));

            services.AddScoped<IDataSeeder>(provider =>
                new GenericSeeder<Role>("SecurityModel", "roles.json", provider.GetRequiredService<IConfiguration>()));

            services.AddScoped<IDataSeeder>(provider =>
                new GenericSeeder<User>("SecurityModel", "users.json", provider.GetRequiredService<IConfiguration>()));

            // -----------------------
            // System
            // -----------------------
            services.AddScoped<IDataSeeder>(provider =>
                new GenericSeeder<Specialty>("System", "specialties.json", provider.GetRequiredService<IConfiguration>()));

            services.AddScoped<IDataSeeder>(provider =>
                new GenericSeeder<ConsultingRoom>("System", "consultingrooms.json", provider.GetRequiredService<IConfiguration>()));

            services.AddScoped<IDataSeeder>(provider =>
                new GenericSeeder<Doctor>("System", "doctors.json", provider.GetRequiredService<IConfiguration>()));

            services.AddScoped<IDataSeeder>(provider =>
                new GenericSeeder<Appointment>("System", "appointments.json", provider.GetRequiredService<IConfiguration>()));

            services.AddScoped<GeneralSeeder>();

            return services;
        }
    }
}