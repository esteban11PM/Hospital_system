using Entity.Models.Base;
using Utilities.Helpers;
using Utilities.Helpers.Interface;

namespace Entity.Models.SecurityModel
{
    public class User : BaseEntity, IRequiresPasswordHashing
    {
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;

        // Claves Foraneas
        public int PatientId { get; set; }
        public Patient Patient { get; set; } = null!;

        // Propiedad de Navegacion Inversa
        public int RoleId { get; set; }
        public Role Role { get; set; } = null!;

        // Funcionalides
        public void HashPassword()
        {
            if (!string.IsNullOrWhiteSpace(Password))
            {
                Password = PasswordHelper.Hash(Password);
            }
        }
    }
}