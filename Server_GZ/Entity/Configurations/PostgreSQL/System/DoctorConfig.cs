using Entity.Models.System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Entity.Configurations.PostgreSQL.System
{
    public class DoctorConfig : IEntityTypeConfiguration<Doctor>
    {
        public void Configure(EntityTypeBuilder<Doctor> builder)
        {
            builder.ToTable("doctor");

            builder.HasKey(d => d.Id);
            builder.Property(d => d.Id).ValueGeneratedOnAdd().IsRequired();

            builder.Property(d => d.Name).HasMaxLength(30).IsRequired();

            builder.Property(d => d.LastName).HasMaxLength(30).IsRequired();

            builder.Property(d => d.Email).HasMaxLength(100).IsRequired();
            builder.HasIndex(d => d.Email).IsUnique();

            builder.Property(d => d.Phone).HasMaxLength(15).IsRequired(false);

            builder.Property(d => d.LicenseNumber).HasMaxLength(50).IsRequired();
            builder.HasIndex(d => d.LicenseNumber).IsUnique();

            builder.Property(d => d.Active).HasDefaultValue(true).IsRequired();
        }
    }
}