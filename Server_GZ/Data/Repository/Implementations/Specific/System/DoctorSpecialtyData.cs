using Data.Repository.Interfaces.Specific.System;
using Entity.Context;
using Entity.Models.System;
using Microsoft.Extensions.Logging;

namespace Data.Repository.Implementations.Specific.System
{
    /// <summary>
    /// Repositorio para gestión de especialidades de doctores
    /// </summary>
    public class DoctorSpecialtyData : GenericData<DoctorSpecialty>, IDoctorSpecialtyData
    {
        public DoctorSpecialtyData(AppDbContext context, ILogger<DoctorSpecialty> logger) : base(context, logger) { }
    }
}