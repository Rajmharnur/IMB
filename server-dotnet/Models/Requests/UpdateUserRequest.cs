using System.Text.Json.Serialization;

namespace ServerDotNet.Models.Requests;

public class UpdateUserRequest
{
    [JsonPropertyName("email")]
    public string? Email { get; set; }

    [JsonPropertyName("employer")]
    public string? Employer { get; set; }
}
