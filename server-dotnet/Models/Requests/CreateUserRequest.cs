using System.Text.Json.Serialization;

namespace ServerDotNet.Models.Requests;

public class CreateUserRequest
{
    [JsonPropertyName("first_name")]
    public string FirstName { get; set; } = null!;

    [JsonPropertyName("last_name")]
    public string LastName { get; set; } = null!;

    [JsonPropertyName("dob")]
    public DateTime Dob { get; set; }

    [JsonPropertyName("mobile_number")]
    public string MobileNumber { get; set; } = null!;

    [JsonPropertyName("email")]
    public string? Email { get; set; }

    [JsonPropertyName("employer")]
    public string? Employer { get; set; }
}
