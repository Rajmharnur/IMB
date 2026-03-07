namespace ServerDotNet.Models;

public class Identification
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public User User { get; set; } = null!;

    public string IdType { get; set; } = null!;
    public string IdNumber { get; set; } = null!;
    public string CountryOfIssue { get; set; } = null!;
    public string IdDocumentPath { get; set; } = null!;
}
