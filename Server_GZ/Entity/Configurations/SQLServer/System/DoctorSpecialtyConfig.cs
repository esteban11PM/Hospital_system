using Entity.Models.System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Entity.Configurations.SQLServer.System
{
    public class DoctorSpecialtyConfig : IEntityTypeConfiguration<DoctorSpecialty>
    {
        public void Configure(EntityTypeBuilder<DoctorSpecialty> builder)
        {
            builder.ToTable("doctor_specialty");

            builder.HasKey(ds => ds.Id);
            builder.Property(ds => ds.Id).ValueGeneratedOnAdd().IsRequired();

            builder.Property(ds => ds.DoctorId).IsRequired();
            builder.Property(ds => ds.SpecialtyId).IsRequired();

            builder.HasOne(ds => ds.Doctor).WithMany(d => d.DoctorSpecialties).HasForeignKey(ds => ds.DoctorId).OnDelete(DeleteBehavior.Cascade);
            builder.HasOne(ds => ds.Specialty).WithMany(s => s.DoctorSpecialties).HasForeignKey(ds => ds.SpecialtyId).OnDelete(DeleteBehavior.Cascade);

            builder.HasIndex(ds => new { ds.DoctorId, ds.SpecialtyId }).IsUnique();

            builder.Property(ds => ds.Active).HasDefaultValue(true).IsRequired();
        }
    }
}