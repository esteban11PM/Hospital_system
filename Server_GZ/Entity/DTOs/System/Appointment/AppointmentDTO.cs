using Utilities.Enums;

namespace Entity.DTOs.System.Appointment
{
    public class AppointmentDTO
    {
        public int Id { get; set; }
        public bool Active { get; set; }

        public DateTime AppointmentDate { get; set; }
        public string Notes { get; set; } = string.Empty;
        public AppointmentStatus Status { get; set; }

        public int PatientId { get; set; }
        public string PatientName { get; set; } = string.Empty;

        public int DoctorId { get; set; }
        public string DoctorName { get; set; } = string.Empty;

        public int ConsultingRoomId { get; set; }
        public string ConsultingRoomName { get; set; } = string.Empty;

        public int SpecialtyId { get; set; }
        public string SpecialtyName { get; set; } = string.Empty;
    }
}