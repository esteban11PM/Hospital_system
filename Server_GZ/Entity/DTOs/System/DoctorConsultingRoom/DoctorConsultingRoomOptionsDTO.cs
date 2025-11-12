namespace Entity.DTOs.System.DoctorConsultingRoom
{
    public class DoctorConsultingRoomOptionsDTO
    {
        public int Id { get; set; }
        public bool Active { get; set; }

        public int DoctorId { get; set; }
        public int ConsultingRoomId { get; set; }
    }
}