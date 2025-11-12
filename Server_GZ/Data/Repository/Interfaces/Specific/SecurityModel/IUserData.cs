using Entity.Models.SecurityModel;

namespace Data.Repository.Interfaces.Specific.SecurityModel
{
    /// <summary>
    /// Repositorio para usuarios del sistema
    /// </summary>
    public interface IUserData : IGenericData<User>
    {
        /// <summary>
        /// Busca un usuario por su nombre de usuario
        /// </summary>
        Task<User?> GetByUsernameAsync(string username);

        /// <summary>
        /// Verifica si un nombre de usuario ya existe
        /// </summary>
        Task<bool> UsernameExistsAsync(string username);
    }
}