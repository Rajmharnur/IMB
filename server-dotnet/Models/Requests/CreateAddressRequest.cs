using System.Text.Json.Serialization;

namespace ServerDotNet.Models.Requests;

public class CreateAddressRequest
{
    [JsonPropertyName("street_name_number")]
    public string StreetNameNumber { get; set; } = null!;

    [JsonPropertyName("suburb")]
    public string? Suburb { get; set; }

    [JsonPropertyName("city")]
    public string City { get; set; } = null!;

    [JsonPropertyName("postal_code")]
    public string PostalCode { get; set; } = null!;

    [JsonPropertyName("province")]
    public string Province { get; set; } = null!;

    [JsonPropertyName("proof_of_address_path")]
    public string ProofOfAddressPath { get; set; } = null!;
}
