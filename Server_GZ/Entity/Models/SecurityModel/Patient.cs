using Entity.Models.Base;
using Entity.Models.System;

namespace Entity.Models.SecurityModel
{
    public class Patient : BaseEntity
    {
        public string Name { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;

        // Propiedad de Navegacion Inversa
        public User User { get; set; } = null!;
        public ICollection<Appointment> Appointments { get; set; } = [];
    }
}