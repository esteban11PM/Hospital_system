using Data.Repository.Interfaces.Specific.SecurityModel;
using Data.Repository.Interfaces.Specific.System;

namespace Data.Factory
{
    /// <summary>
    /// Fábrica para crear instancias de repositorios de datos con sus dependencias configuradas
    /// </summary>
    public interface IDataFactoryGlobal
    {
        // Los métodos crean instancias de repositorios con logger y contexto inyectados


        // -----------------------
        // SecurityModel
        // -----------------------
        IPatientData CreatePatientData();
        IUserData CreateUserData();
        IRoleData CreateRoleData();

        // -----------------------
        // System
        // -----------------------
        ISpecialtyData CreateSpecialtyData();
        IConsultingRoomData CreateConsultingRoomData();
        IDoctorData CreateDoctorData();
        IAppointmentData CreateAppointmentData();
        IDoctorSpecialtyData CreateDoctorSpecialtyData();
        IDoctorConsultingRoomData CreateDoctorConsultingRoomData();

        // Ejemplo de Generico
        // IGenericData<Comment> CreateCommentData();
    }
}