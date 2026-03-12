using System.Text.Json.Serialization;

namespace ServerDotNet.Models.Requests;

public class UpdateUserRequest
{
    [JsonPropertyName("first_name")]
    public string? FirstName { get; set; }

    [JsonPropertyName("last_name")]
    public string? LastName { get; set; }

    [JsonPropertyName("dob")]
    public DateTime? Dob { get; set; }

    [JsonPropertyName("email")]
    public string? Email { get; set; }

    [JsonPropertyName("employer")]
    public string? Employer { get; set; }

    [JsonPropertyName("street_name_number")]
    public string? StreetNameNumber { get; set; }

    [JsonPropertyName("suburb")]
    public string? Suburb { get; set; }

    [JsonPropertyName("city")]
    public string? City { get; set; }

    [JsonPropertyName("postal_code")]
    public string? PostalCode { get; set; }

    [JsonPropertyName("province")]
    public string? Province { get; set; }

    [JsonPropertyName("id_type")]
    public string? IdType { get; set; }

    [JsonPropertyName("id_number")]
    public string? IdNumber { get; set; }

    [JsonPropertyName("country_of_issue")]
    public string? CountryOfIssue { get; set; }

    [JsonPropertyName("permit_issue_date")]
    public DateTime? PermitIssueDate { get; set; }

    [JsonPropertyName("permit_expiry_date")]
    public DateTime? PermitExpiryDate { get; set; }
}