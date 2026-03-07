namespace ServerDotNet.Models;

public class Address
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public User User { get; set; } = null!;

    public string StreetNameNumber { get; set; } = null!;
    public string? Suburb { get; set; }
    public string City { get; set; } = null!;
    public string PostalCode { get; set; } = null!;
    public string Province { get; set; } = null!;
    public string ProofOfAddressPath { get; set; } = null!;
}
