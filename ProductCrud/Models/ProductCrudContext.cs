using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace ProductCrud.Models;

public partial class ProductCrudContext : DbContext
{
    public ProductCrudContext()
    {
    }

    public ProductCrudContext(DbContextOptions<ProductCrudContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Attachment> Attachments { get; set; }

    public virtual DbSet<Category> Categories { get; set; }

    public virtual DbSet<Conversation> Conversations { get; set; }

    public virtual DbSet<Message> Messages { get; set; }

    public virtual DbSet<MessageStatus> MessageStatuses { get; set; }

    public virtual DbSet<Product> Products { get; set; }

    public virtual DbSet<User> Users { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        => optionsBuilder.UseSqlServer("Name=Conn");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Attachment>(entity =>
        {
            entity.HasKey(e => e.AttachmentId).HasName("PK__Attachme__442C64DEFBA9D353");

            entity.Property(e => e.AttachmentId).HasColumnName("AttachmentID");
            entity.Property(e => e.FileType).HasMaxLength(50);
            entity.Property(e => e.MessageId).HasColumnName("MessageID");
            entity.Property(e => e.UploadedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");

            entity.HasOne(d => d.Message).WithMany(p => p.Attachments)
                .HasForeignKey(d => d.MessageId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK__Attachmen__Messa__5165187F");
        });

        modelBuilder.Entity<Category>(entity =>
        {
            entity.HasKey(e => e.Cid).HasName("PK__Category__C1F8DC39826EF26F");

            entity.ToTable("Category");

            entity.Property(e => e.Cid)
                .ValueGeneratedNever()
                .HasColumnName("CId");
            entity.Property(e => e.Cname)
                .HasMaxLength(40)
                .HasColumnName("CName");
        });

        modelBuilder.Entity<Conversation>(entity =>
        {
            entity.HasKey(e => e.ConversationId).HasName("PK__Conversa__C050D877B8B244AE");

            entity.ToTable("Conversation");

            entity.Property(e => e.ConversationId).ValueGeneratedNever();
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
        });

        modelBuilder.Entity<Message>(entity =>
        {
            entity.HasKey(e => e.MessageId).HasName("PK__Message__C87C0C9C335404D5");

            entity.ToTable("Message");

            entity.Property(e => e.MessageId).ValueGeneratedNever();
            entity.Property(e => e.SentAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");

            entity.HasOne(d => d.Conversation).WithMany(p => p.Messages)
                .HasForeignKey(d => d.ConversationId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK__Message__Convers__4CA06362");

            entity.HasOne(d => d.Sender).WithMany(p => p.Messages)
                .HasForeignKey(d => d.SenderId)
                .HasConstraintName("FK__Message__SenderI__4D94879B");
        });

        modelBuilder.Entity<MessageStatus>(entity =>
        {
            entity.HasKey(e => e.StatusId).HasName("PK__MessageS__C8EE204365D8B171");

            entity.ToTable("MessageStatus");

            entity.Property(e => e.StatusId).HasColumnName("StatusID");
            entity.Property(e => e.MessageId).HasColumnName("MessageID");
            entity.Property(e => e.Status).HasMaxLength(50);
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.UserId).HasColumnName("UserID");

            entity.HasOne(d => d.Message).WithMany(p => p.MessageStatuses)
                .HasForeignKey(d => d.MessageId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK__MessageSt__Messa__5535A963");

            entity.HasOne(d => d.User).WithMany(p => p.MessageStatuses)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK__MessageSt__UserI__5629CD9C");
        });

        modelBuilder.Entity<Product>(entity =>
        {
            entity.HasKey(e => e.Pid).HasName("PK__Products__C57755203992226C");

            entity.Property(e => e.Pid)
                .ValueGeneratedNever()
                .HasColumnName("PID");
            entity.Property(e => e.Cid).HasColumnName("CId");
            entity.Property(e => e.Pdescription).HasColumnName("PDescription");
            entity.Property(e => e.Pimage).HasColumnName("PImage");
            entity.Property(e => e.Pname)
                .HasMaxLength(50)
                .HasColumnName("PName");
            entity.Property(e => e.Price).HasColumnType("decimal(8, 2)");

            entity.HasOne(d => d.CidNavigation).WithMany(p => p.Products)
                .HasForeignKey(d => d.Cid)
                .HasConstraintName("FK__Products__CId__3C69FB99");

            entity.HasOne(d => d.User).WithMany(p => p.Products)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK__Products__UserId__3B75D760");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.UserId).HasName("PK__Users__1788CC4CA662BDBF");

            entity.Property(e => e.UserId).ValueGeneratedNever();
            entity.Property(e => e.EmailAddress).HasMaxLength(50);
            entity.Property(e => e.ExpieryDate).HasColumnType("datetime");
            entity.Property(e => e.Otp)
                .HasMaxLength(6)
                .IsUnicode(false)
                .HasColumnName("OTP");
            entity.Property(e => e.UserAddress).HasMaxLength(50);
            entity.Property(e => e.UserName).HasMaxLength(50);
            entity.Property(e => e.UserRole).HasMaxLength(20);
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
