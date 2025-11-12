using Entity.Models.SecurityModel;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Entity.Configurations.SQLServer.SecurityModel
{
    public class UserConfig : IEntityTypeConfiguration<User>
    {
        public void Configure(EntityTypeBuilder<User> builder)
        {
            builder.ToTable("User");

            builder.HasKey(u => u.Id);
            builder.Property(u => u.Id).ValueGeneratedOnAdd().IsRequired();

            builder.Property(u => u.Username).HasMaxLength(50).IsRequired().UseCollation("SQL_Latin1_General_CP1_CS_AS");
            builder.HasIndex(u => u.Username).IsUnique();

            builder.Property(u => u.Password).HasMaxLength(100).IsRequired();

            builder.Property(u => u.PatientId).IsRequired();
            builder.HasOne(u => u.Patient).WithOne(p => p.User).HasForeignKey<User>(u => u.PatientId).OnDelete(DeleteBehavior.Cascade);

            builder.Property(u => u.RoleId).IsRequired();
            builder.HasOne(u => u.Role).WithMany(r => r.Users).HasForeignKey(u => u.RoleId).OnDelete(DeleteBehavior.Restrict);

            builder.Property(u => u.Active).HasColumnType("bit").HasDefaultValue(1).IsRequired();
        }
    }
}