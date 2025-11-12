namespace Entity.DTOs.System.DoctorSpecialty
{
    public class DoctorSpecialtyDTO
    {
        public int Id { get; set; }
        public bool Active { get; set; }

        public int DoctorId { get; set; }
        public string DoctorName { get; set; } = string.Empty;

        public int SpecialtyId { get; set; }
        public string SpecialtyName { get; set; } = string.Empty;
    }
}