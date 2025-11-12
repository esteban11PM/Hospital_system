using Entity.DTOs.SecurityModel.User;

namespace Business.Repository.Interfaces.Specific.SecurityModel
{
    /// <summary>
    /// Define la lógica de negocio para la gestión de las cuentas de usuario (login, actualización parcial, cambio de contraseña).
    /// </summary>
    public interface IUserBusiness : IGenericBusiness<UserDTO, UserOptionsDTO>
    {
        // General

        /// <summary>
        /// Obtiene todas las cuentas de usuario, incluyendo las inactivos.
        /// </summary>
        Task<IEnumerable<UserDTO>> GetAllTotalUsersAsync();


        // Specific

        /// <summary>
        /// Obtiene un usuario específico utilizando su nombre de usuario (Username).
        /// </summary>
        /// <param name="username">Nombre de usuario para la búsqueda.</param>
        Task<UserDTO?> GetByUsernameAsync(string username);
    }
}