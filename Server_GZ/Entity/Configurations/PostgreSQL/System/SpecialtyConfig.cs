using Entity.Models.System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Entity.Configurations.PostgreSQL.System
{
    public class SpecialtyConfig : IEntityTypeConfiguration<Specialty>
    {
        public void Configure(EntityTypeBuilder<Specialty> builder)
        {
            builder.ToTable("specialty");

            builder.HasKey(s => s.Id);
            builder.Property(s => s.Id).ValueGeneratedOnAdd().IsRequired();

            builder.Property(s => s.Name).HasMaxLength(100).IsRequired();

            builder.Property(s => s.Description).HasMaxLength(250).IsRequired(false);

            builder.Property(s => s.Active).HasDefaultValue(true).IsRequired();
        }
    }
}
