using System.Security.Claims;
using Business.Repository.Implementations.Specific.SecurityModel;
using Business.Repository.Interfaces.Specific.SecurityModel;
using Entity.DTOs.SecurityModel.Person;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Utilities.Enums;
using Utilities.Exceptions;
using Web.Controllers.Base;

namespace Web.Controllers.SecurityModel
{
    /// <summary>
    /// Controller para gestión de Personas
    /// </summary>
    [Route("api/[controller]/")]
    [Authorize]
    public class PatientController : BaseController<IPatientBusiness>
    {

        public PatientController(IPatientBusiness patientBusiness, ILogger<PatientController> logger)
            : base(patientBusiness, logger) { }

        /// <summary>
        /// Obtiene todos los registros activos
        /// </summary>
        [HttpGet("GetAll/")]
        [ProducesResponseType(typeof(IEnumerable<PatientDTO>), 200)]
        public async Task<IActionResult> GetAll() =>
            await TryExecuteAsync(() => _service.GetAllAsync(), "GetAllPersons");

        /// <summary>
        /// Obtiene todos los registros 
        /// </summary>
        [HttpGet("GetAllJWT/")]
        [ProducesResponseType(typeof(IEnumerable<PatientDTO>), 200)]
        public async Task<IActionResult> GetAllJWT()
        {
            var personClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Role);
            var person = personClaim?.Value;

            if (string.Equals(person, "ADMINISTRADOR", StringComparison.OrdinalIgnoreCase))
            {
                return await TryExecuteAsync(async () =>
                {
                    if (_service is PatientBusiness fbGeneral)
                    {
                        return await fbGeneral.GetAllTotalPatientsAsync();
                    }
                    throw new ValidationException("Funcionalidad no disponible para este tipo de negocio.");
                }, "GetAllTotalPersons");
            }

            return await TryExecuteAsync(() => _service.GetAllAsync(), "GetAllUsers");
        }

        /// <summary>
        /// Obtiene la lista de personas disponibles para ser asignadas como usuarios o encargados.
        /// </summary>
        /// <returns>Colección de objetos <see cref="PersonAvailableDTO"/> que representan las personas disponibles.</returns>
        [HttpGet("GetAvailable/")]
        [ProducesResponseType(typeof(IEnumerable<PatientDTO>), 200)]
        public async Task<IActionResult> GetAvailable() =>
            await TryExecuteAsync(() => _service.GetPatientAvailableAsync(), "GetAvailablePersons");

        /// <summary>
        /// Obtiene un registro por su identificador
        /// </summary>
        [HttpGet("GetById/{id:int}")]
        [ProducesResponseType(typeof(PatientDTO), 200)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> GetById(int id) =>
            await TryExecuteAsync(() => _service.GetByIdAsync(id), "GetById");

        /// <summary>
        /// Crea un nuevo registro
        /// </summary>
        [HttpPost("Create/")]
        [ProducesResponseType(typeof(PatientDTO), 201)]
        [ProducesResponseType(400)]
        public async Task<IActionResult> Create([FromBody] PatientDTO dto)
        {
            return await TryExecuteAsync(async () =>
            {
                var created = await _service.CreateAsync(dto);
                return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
            }, "CreatePerson");
        }

        /// <summary>
        /// Actualiza un registro existente
        /// </summary>
        [HttpPut("Update/")]
        [ProducesResponseType(typeof(PatientDTO), 200)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> Update([FromBody] PatientDTO dto) =>
            await TryExecuteAsync(() => _service.UpdateAsync(dto), "UpdatePerson");

        /// <summary>
        /// Elimina un registro usando la estrategia especificada
        /// </summary>
        [HttpDelete("Delete/{id:int}")]
        [ProducesResponseType(200)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> Delete(int id, [FromQuery] DeleteType strategy = DeleteType.Logical)
        {
            return await TryExecuteAsync(() => _service.DeleteAsync(id, strategy), "DeleteRole");
        }
    }
}