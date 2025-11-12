using Entity.Models.System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Entity.Configurations.MySQL.System
{
    public class AppointmentConfig : IEntityTypeConfiguration<Appointment>
    {
        public void Configure(EntityTypeBuilder<Appointment> builder)
        {
            builder.ToTable("appointment");

            builder.HasKey(a => a.Id);
            builder.Property(a => a.Id).ValueGeneratedOnAdd().IsRequired();

            builder.Property(a => a.AppointmentDate).IsRequired();
            builder.Property(a => a.Notes).HasMaxLength(500).IsRequired(false);
            builder.Property(a => a.Status).IsRequired();

            builder.HasOne(a => a.Patient).WithMany(p => p.Appointments).HasForeignKey(a => a.PatientId).OnDelete(DeleteBehavior.Cascade);
            builder.HasOne(a => a.Doctor).WithMany(d => d.Appointments).HasForeignKey(a => a.DoctorId).OnDelete(DeleteBehavior.Cascade);
            builder.HasOne(a => a.ConsultingRoom).WithMany(cr => cr.Appointments).HasForeignKey(a => a.ConsultingRoomId).OnDelete(DeleteBehavior.Cascade);
            builder.HasOne(a => a.Specialty).WithMany(s => s.Appointments).HasForeignKey(a => a.SpecialtyId).OnDelete(DeleteBehavior.Cascade);

            builder.Property(a => a.Active).HasDefaultValue(true).IsRequired();
        }
    }
}
