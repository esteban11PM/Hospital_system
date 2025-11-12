namespace Entity.DTOs.System.Appointment
{
    public class AppointmentOptionsDTO
    {
        public int Id { get; set; }
        public bool Active { get; set; }

        public int PatientId { get; set; }
        public int DoctorId { get; set; }
        public int ConsultingRoomId { get; set; }
        public int SpecialtyId { get; set; }
    }
}