using System.Security.Claims;
using Business.Repository.Implementations.Specific.System;
using Business.Repository.Interfaces.Specific.System;
using Entity.DTOs.System.DoctorSpecialty;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Utilities.Enums;
using Utilities.Exceptions;
using Web.Controllers.Base;

namespace Web.Controllers.System
{
    /// <summary>
    /// Controller para gestión de especialidades de doctores
    /// </summary>
    [Route("api/[controller]/")]
    [Authorize]
    public class DoctorSpecialtyController : BaseController<IDoctorSpecialtyBusiness>
    {

        public DoctorSpecialtyController(IDoctorSpecialtyBusiness formBusiness, ILogger<DoctorSpecialtyController> logger)
            : base(formBusiness, logger) { }

        /// <summary>
        /// Obtiene todos los registros activos
        /// </summary>
        [HttpGet("GetAll/")]
        [ProducesResponseType(typeof(IEnumerable<DoctorSpecialtyDTO>), 200)]
        public async Task<IActionResult> GetAll() =>
            await TryExecuteAsync(() => _service.GetAllAsync(), "GetAllDoctorSpecialties");

        /// <summary>
        /// Obtiene un registro por su identificador
        /// </summary>
        [HttpGet("GetById/{id:int}")]
        [ProducesResponseType(typeof(DoctorSpecialtyDTO), 200)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> GetById(int id) =>
            await TryExecuteAsync(() => _service.GetByIdAsync(id), "GetById");

        /// <summary>
        /// Crea un nuevo registro
        /// </summary>
        [HttpPost("Create/")]
        [ProducesResponseType(typeof(DoctorSpecialtyDTO), 201)]
        [ProducesResponseType(400)]
        public async Task<IActionResult> Create([FromBody] DoctorSpecialtyDTO dto)
        {
            return await TryExecuteAsync(async () =>
            {
                var created = await _service.CreateAsync(dto);
                return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
            }, "CreateDoctorSpecialty");
        }

        /// <summary>
        /// Actualiza un registro existente
        /// </summary>
        [HttpPut("Update/")]
        [ProducesResponseType(typeof(DoctorSpecialtyDTO), 200)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> Update([FromBody] DoctorSpecialtyDTO dto) =>
            await TryExecuteAsync(() => _service.UpdateAsync(dto), "UpdateDoctorSpecialty");

        /// <summary>
        /// Elimina un registro usando la estrategia especificada
        /// </summary>
        [HttpDelete("Delete/{id:int}")]
        [ProducesResponseType(200)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> Delete(int id, [FromQuery] DeleteType strategy = DeleteType.Logical)
        {
            return await TryExecuteAsync(() => _service.DeleteAsync(id, strategy), "DeleteDoctorSpecialty");
        }
    }
}