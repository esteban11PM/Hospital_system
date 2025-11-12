using Entity.Models.Base;
using Entity.Models.SecurityModel;
using Utilities.Enums;

namespace Entity.Models.System
{
    public class Appointment : BaseEntity
    {
        // Aquí definimos la fecha y hora exacta de la cita médica
        public DateTime AppointmentDate { get; set; }
        // Notas adicionales del médico o paciente sobre la consulta
        public string Notes { get; set; } = string.Empty;
        // Estado actual de la cita: pendiente, confirmada, cancelada o completada
        public AppointmentStatus Status { get; set; } = AppointmentStatus.Pending;

        // Claves Foraneas
        public int PatientId { get; set; }
        public Patient Patient { get; set; } = null!;

        public int DoctorId { get; set; }
        public Doctor Doctor { get; set; } = null!;

        public int ConsultingRoomId { get; set; }
        public ConsultingRoom ConsultingRoom { get; set; } = null!;

        public int SpecialtyId { get; set; }
        public Specialty Specialty { get; set; } = null!;
    }
}
