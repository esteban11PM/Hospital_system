using Entity.Models.SecurityModel;
using Entity.Models.System;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System.Reflection;

namespace Entity.Context
{
    /// <summary>
    /// Contexto de base de datos principal de la aplicación
    /// </summary>
    public class AppDbContext : DbContext
    {
        // -----------------------
        // SecurityModel
        // -----------------------
        public DbSet<Patient> Patient { get; set; }
        public DbSet<User> User { get; set; }
        public DbSet<Role> Role { get; set; }

        // -----------------------
        // System
        // -----------------------
        public DbSet<Specialty> Specialty { get; set; }
        public DbSet<ConsultingRoom> ConsultingRoom { get; set; }
        public DbSet<Doctor> Doctor { get; set; }
        public DbSet<Appointment> Appointment { get; set; }
        public DbSet<DoctorSpecialty> DoctorSpecialty { get; set; }
        public DbSet<DoctorConsultingRoom> DoctorConsultingRoom { get; set; }

        private readonly IConfiguration _configuration;

        public AppDbContext(DbContextOptions<AppDbContext> options, IConfiguration configuration)
            : base(options)
        {
            _configuration = configuration;
        }

        /// <summary>
        /// Configura el modelo de datos y aplica las configuraciones de entidades
        /// </summary>
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            Assembly configAssembly = typeof(AppDbContext).Assembly;

            if (Database.IsSqlServer())
            {
                modelBuilder.ApplyConfigurationsFromAssembly(configAssembly,
                    t => t.Namespace?.StartsWith("Entity.Configurations.SQLServer") ?? false);
            }
            else if (Database.IsNpgsql())
            {
                modelBuilder.ApplyConfigurationsFromAssembly(configAssembly,
                    t => t.Namespace?.StartsWith("Entity.Configurations.PostgreSQL") ?? false);
            }
            else if (Database.IsMySql())
            {
                modelBuilder.ApplyConfigurationsFromAssembly(configAssembly,
                    t => t.Namespace?.StartsWith("Entity.Configurations.MySQL") ?? false);
            }
            else
            {
                throw new InvalidOperationException($"Proveedor de BD no soportado: {Database.ProviderName}");
            }
        }
    }
}