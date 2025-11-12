using Entity.Models.SecurityModel;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Entity.Configurations.MySQL.SecurityModel
{
    public class PatientConfig : IEntityTypeConfiguration<Patient>
    {
        public void Configure(EntityTypeBuilder<Patient> builder)
        {
            builder.ToTable("person");

            builder.HasKey(p => p.Id);
            builder.Property(p => p.Id).ValueGeneratedOnAdd().IsRequired();

            builder.Property(p => p.Name).HasMaxLength(30).IsRequired();

            builder.Property(p => p.LastName).HasMaxLength(30).IsRequired();

            builder.Property(p => p.Email).HasMaxLength(100).IsRequired();
            builder.HasIndex(p => p.Email).IsUnique();

            builder.Property(p => p.Phone).HasMaxLength(15).IsRequired(false);

            builder.Property(p => p.Active).HasDefaultValue(true).IsRequired();
        }
    }
}
