using Entity.Models.Base;

namespace Entity.Models.SecurityModel
{
    public class Role : GenericEntity
    {
        // Propiedad de Navegacion Inversa
        public ICollection<User> Users { get; set; } = [];
    }
}