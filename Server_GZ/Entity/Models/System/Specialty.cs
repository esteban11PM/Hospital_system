using Entity.Models.Base;

namespace Entity.Models.System
{
    public class Specialty: GenericEntity
    {
        // Propiedad de Navegacion Inversa
        public ICollection<DoctorSpecialty> DoctorSpecialties { get; set; } = [];
        public ICollection<Appointment> Appointments { get; set; } = [];
    }
}
