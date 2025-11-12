using Entity.Models.System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Entity.Configurations.MySQL.System
{
    public class ConsultingRoomConfig : IEntityTypeConfiguration<ConsultingRoom>
    {
        public void Configure(EntityTypeBuilder<ConsultingRoom> builder)
        {
            builder.ToTable("consulting_room");

            builder.HasKey(cr => cr.Id);
            builder.Property(cr => cr.Id).ValueGeneratedOnAdd().IsRequired();

            builder.Property(cr => cr.Name).HasMaxLength(100).IsRequired();

            builder.Property(cr => cr.Description).HasMaxLength(250).IsRequired(false);

            builder.Property(cr => cr.Active).HasDefaultValue(true).IsRequired();
        }
    }
}
