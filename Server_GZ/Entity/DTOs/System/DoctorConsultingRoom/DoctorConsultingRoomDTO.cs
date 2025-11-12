namespace Entity.DTOs.System.DoctorConsultingRoom
{
    public class DoctorConsultingRoomDTO
    {
        public int Id { get; set; }
        public bool Active { get; set; }

        public int DoctorId { get; set; }
        public string DoctorName { get; set; } = string.Empty;

        public int ConsultingRoomId { get; set; }
        public string ConsultingRoomName { get; set; } = string.Empty;
    }
}