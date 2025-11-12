using Entity.Models.Base;

namespace Entity.Models.System
{
    public class Doctor : BaseEntity
    {
        public string Name { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string LicenseNumber { get; set; } = string.Empty; // Número de licencia médica

        // Propiedades de Navegacion Inversa
        public ICollection<DoctorSpecialty> DoctorSpecialties { get; set; } = [];
        public ICollection<DoctorConsultingRoom> DoctorConsultingRooms { get; set; } = [];
        public ICollection<Appointment> Appointments { get; set; } = [];
    }
}