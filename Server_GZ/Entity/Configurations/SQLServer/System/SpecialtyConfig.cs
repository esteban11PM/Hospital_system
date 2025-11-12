using Entity.Models.System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Entity.Configurations.SQLServer.System
{
    public class SpecialtyConfig : IEntityTypeConfiguration<Specialty>
    {
        public void Configure(EntityTypeBuilder<Specialty> builder)
        {
            builder.ToTable("Specialty");

            builder.HasKey(s => s.Id);
            builder.Property(s => s.Id).ValueGeneratedOnAdd().IsRequired();

            builder.Property(s => s.Name).HasMaxLength(100).IsRequired();

            builder.Property(s => s.Description).HasMaxLength(250).IsRequired(false);

            builder.Property(s => s.Active).HasColumnType("bit").HasDefaultValue(1).IsRequired();
        }
    }
}
