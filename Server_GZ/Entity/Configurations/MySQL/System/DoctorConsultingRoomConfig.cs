using Entity.Models.System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Entity.Configurations.MySQL.System
{
    public class DoctorConsultingRoomConfig : IEntityTypeConfiguration<DoctorConsultingRoom>
    {
        public void Configure(EntityTypeBuilder<DoctorConsultingRoom> builder)
        {
            builder.ToTable("doctor_consulting_room");

            builder.HasKey(dcr => dcr.Id);
            builder.Property(dcr => dcr.Id).ValueGeneratedOnAdd().IsRequired();

            builder.Property(dcr => dcr.DoctorId).IsRequired();
            builder.Property(dcr => dcr.ConsultingRoomId).IsRequired();

            builder.HasOne(dcr => dcr.Doctor).WithMany(d => d.DoctorConsultingRooms).HasForeignKey(dcr => dcr.DoctorId).OnDelete(DeleteBehavior.Cascade);
            builder.HasOne(dcr => dcr.ConsultingRoom).WithMany(cr => cr.DoctorConsultingRooms).HasForeignKey(dcr => dcr.ConsultingRoomId).OnDelete(DeleteBehavior.Cascade);

            builder.HasIndex(dcr => new { dcr.DoctorId, dcr.ConsultingRoomId }).IsUnique();

            builder.Property(dcr => dcr.Active).HasDefaultValue(true).IsRequired();
        }
    }
}