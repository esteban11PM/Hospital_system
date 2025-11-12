using Data.Repository.Interfaces.Specific.System;
using Entity.Context;
using Entity.Models.System;
using Microsoft.Extensions.Logging;

namespace Data.Repository.Implementations.Specific.System
{
    /// <summary>
    /// Repositorio para gestión de juegos del sistema
    /// </summary>
    public class SpecialtyData : GenericData<Specialty>, ISpecialtyData
    {
        public SpecialtyData(AppDbContext context, ILogger<Specialty> logger) : base(context, logger) {}
    }
}