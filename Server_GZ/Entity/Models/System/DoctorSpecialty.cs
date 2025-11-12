using Entity.Models.Base;

namespace Entity.Models.System
{
    public class DoctorSpecialty : BaseEntity
    {
        // Claves Foraneas
        public int DoctorId { get; set; }
        public Doctor Doctor { get; set; } = null!;

        public int SpecialtyId { get; set; }
        public Specialty Specialty { get; set; } = null!;
    }
}