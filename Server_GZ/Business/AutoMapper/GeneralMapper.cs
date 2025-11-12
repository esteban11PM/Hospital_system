using AutoMapper;
using Entity.DTOs.SecurityModel;
using Entity.DTOs.SecurityModel.Person;
using Entity.DTOs.SecurityModel.User;
using Entity.DTOs.System;
using Entity.DTOs.System.Appointment;
using Entity.DTOs.System.DoctorSpecialty;
using Entity.DTOs.System.DoctorConsultingRoom;
using Entity.Models.SecurityModel;
using Entity.Models.System;
using Utilities.Helpers;

namespace Business.AutoMapper
{
    public class GeneralMapper : Profile
    {
        public GeneralMapper()
        {

            // --------- Converters globales ---------
            // Entity (DateTime UTC) -> DTO (DateTimeOffset Bogotá)
            CreateMap<DateTime, DateTimeOffset>()
                .ConvertUsing(src => TimeHelper.ToBogotaOffset(src));

            CreateMap<DateTime?, DateTimeOffset?>()
                .ConvertUsing(src => src.HasValue ? TimeHelper.ToBogotaOffset(src.Value) : (DateTimeOffset?)null);

            // DTO (DateTimeOffset cualquiera) -> Entity (DateTime UTC)
            CreateMap<DateTimeOffset, DateTime>()
                .ConvertUsing(src => TimeHelper.ToUtcDateTime(src));

            CreateMap<DateTimeOffset?, DateTime?>()
                .ConvertUsing(src => src.HasValue ? TimeHelper.ToUtcDateTime(src.Value) : (DateTime?)null);

            // -----------------------
            // SecurityModel
            // -----------------------
            CreateMap<Patient, PatientDTO>().ReverseMap();
            CreateMap<Patient, PatientAvailableDTO>().ReverseMap();

            CreateMap<Role, RoleDTO>().ReverseMap();

            CreateMap<User, UserDTO>().ReverseMap();
            CreateMap<User, UserOptionsDTO>().ReverseMap();

            // -----------------------
            // System
            // -----------------------
            CreateMap<Specialty, SpecialtyDTO>().ReverseMap();
            CreateMap<ConsultingRoom, ConsultingRoomDTO>().ReverseMap();
            CreateMap<Doctor, DoctorDTO>().ReverseMap();

            CreateMap<Appointment, AppointmentDTO>().ReverseMap();
            CreateMap<Appointment, AppointmentOptionsDTO>().ReverseMap();

            CreateMap<DoctorSpecialty, DoctorSpecialtyDTO>().ReverseMap();
            CreateMap<DoctorSpecialty, DoctorSpecialtyOptionsDTO>().ReverseMap();

            CreateMap<DoctorConsultingRoom, DoctorConsultingRoomDTO>().ReverseMap();
            CreateMap<DoctorConsultingRoom, DoctorConsultingRoomOptionsDTO>().ReverseMap();
        }
    }
}