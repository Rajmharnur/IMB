namespace ServerDotNet.Models;

public class User
{
    public int Id { get; set; }

    // authentication fields
    public string UserName { get; set; } = null!;
    public string PasswordHash { get; set; } = null!;

    public string FirstName { get; set; } = null!;
    public string LastName { get; set; } = null!;
    public DateTime Dob { get; set; }
    public string MobileNumber { get; set; } = null!;
    public string? Email { get; set; }
    public string Employer { get; set; } = null!;
    public string? Otp { get; set; }

    public ICollection<Address> Addresses { get; set; } = new List<Address>();
    public ICollection<Identification> Identifications { get; set; } = new List<Identification>();
    public ICollection<WorkPermit> WorkPermits { get; set; } = new List<WorkPermit>();
}
