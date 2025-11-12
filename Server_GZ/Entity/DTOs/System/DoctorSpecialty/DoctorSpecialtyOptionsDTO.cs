namespace Entity.DTOs.System.DoctorSpecialty
{
    public class DoctorSpecialtyOptionsDTO
    {
        public int Id { get; set; }
        public bool Active { get; set; }

        public int DoctorId { get; set; }
        public int SpecialtyId { get; set; }
    }
}