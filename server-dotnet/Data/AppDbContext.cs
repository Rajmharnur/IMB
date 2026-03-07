using Microsoft.EntityFrameworkCore;
using ServerDotNet.Models;

namespace ServerDotNet.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<OtpCode> OtpCodes => Set<OtpCode>();
    public DbSet<Address> Addresses => Set<Address>();
    public DbSet<Identification> Identifications => Set<Identification>();
    public DbSet<WorkPermit> WorkPermits => Set<WorkPermit>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>(e =>
        {
            e.ToTable("users");
            e.HasKey(x => x.Id);
            e.Property(x => x.Id).HasColumnName("id");
            e.Property(x => x.FirstName).HasColumnName("first_name").HasMaxLength(100);
            e.Property(x => x.LastName).HasColumnName("last_name").HasMaxLength(100);
            e.Property(x => x.Dob).HasColumnName("dob");
            e.Property(x => x.MobileNumber).HasColumnName("mobile_number").HasMaxLength(20);
            e.Property(x => x.Email).HasColumnName("email").HasMaxLength(150);
            e.Property(x => x.Employer).HasColumnName("employer").HasMaxLength(150);
            e.Property(x => x.Otp).HasColumnName("otp").HasMaxLength(10);
            e.HasIndex(x => x.MobileNumber).IsUnique();
        });

        modelBuilder.Entity<OtpCode>(e =>
        {
            e.ToTable("otp_codes");
            e.HasKey(x => x.Id);
            e.Property(x => x.Id).HasColumnName("id");
            e.Property(x => x.MobileNumber).HasColumnName("mobile_number").HasMaxLength(20);
            e.Property(x => x.OtpValue).HasColumnName("otp_code").HasMaxLength(10);
            e.Property(x => x.ExpiresAt).HasColumnName("expires_at");
        });

        modelBuilder.Entity<Address>(e =>
        {
            e.ToTable("address");
            e.HasKey(x => x.Id);
            e.Property(x => x.Id).HasColumnName("id");
            e.Property(x => x.UserId).HasColumnName("user_id");
            e.HasOne(x => x.User).WithMany(u => u.Addresses).HasForeignKey(x => x.UserId).OnDelete(DeleteBehavior.Cascade);
            e.Property(x => x.StreetNameNumber).HasColumnName("street_name_number").HasMaxLength(150);
            e.Property(x => x.Suburb).HasColumnName("suburb").HasMaxLength(100);
            e.Property(x => x.City).HasColumnName("city").HasMaxLength(100);
            e.Property(x => x.PostalCode).HasColumnName("postal_code").HasMaxLength(20);
            e.Property(x => x.Province).HasColumnName("province").HasMaxLength(100);
            e.Property(x => x.ProofOfAddressPath).HasColumnName("proof_of_address_path");
        });

        modelBuilder.Entity<Identification>(e =>
        {
            e.ToTable("identification");
            e.HasKey(x => x.Id);
            e.Property(x => x.Id).HasColumnName("id");
            e.Property(x => x.UserId).HasColumnName("user_id");
            e.HasOne(x => x.User).WithMany(u => u.Identifications).HasForeignKey(x => x.UserId).OnDelete(DeleteBehavior.Cascade);
            e.Property(x => x.IdType).HasColumnName("id_type").HasMaxLength(50);
            e.Property(x => x.IdNumber).HasColumnName("id_number").HasMaxLength(50);
            e.Property(x => x.CountryOfIssue).HasColumnName("country_of_issue").HasMaxLength(100);
            e.Property(x => x.IdDocumentPath).HasColumnName("id_document_path");
        });

        modelBuilder.Entity<WorkPermit>(e =>
        {
            e.ToTable("work_permit");
            e.HasKey(x => x.Id);
            e.Property(x => x.Id).HasColumnName("id");
            e.Property(x => x.UserId).HasColumnName("user_id");
            e.HasOne(x => x.User).WithMany(u => u.WorkPermits).HasForeignKey(x => x.UserId).OnDelete(DeleteBehavior.Cascade);
            e.Property(x => x.PermitDocumentPath).HasColumnName("permit_document_path");
            e.Property(x => x.IssueDate).HasColumnName("issue_date");
            e.Property(x => x.ExpiryDate).HasColumnName("expiry_date");
        });
    }
}
