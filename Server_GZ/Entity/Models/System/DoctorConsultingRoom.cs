using Entity.Models.Base;

namespace Entity.Models.System
{
    public class DoctorConsultingRoom : BaseEntity
    {
        // Claves Foraneas
        public int DoctorId { get; set; }
        public Doctor Doctor { get; set; } = null!;

        public int ConsultingRoomId { get; set; }
        public ConsultingRoom ConsultingRoom { get; set; } = null!;
    }
}