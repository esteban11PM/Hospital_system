using Entity.Models.Base;

namespace Entity.Models.System
{
    public class ConsultingRoom : GenericEntity
    {
        // Propiedad de Navegacion Inversa
        public ICollection<DoctorConsultingRoom> DoctorConsultingRooms { get; set; } = [];
        public ICollection<Appointment> Appointments { get; set; } = [];
    }
}
