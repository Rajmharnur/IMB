using System.Text.Json.Serialization;

namespace ServerDotNet.Models.Requests;

public class CreateIdentificationRequest
{
    [JsonPropertyName("id_type")]
    public string IdType { get; set; } = null!;

    [JsonPropertyName("id_number")]
    public string IdNumber { get; set; } = null!;

    [JsonPropertyName("country_of_issue")]
    public string CountryOfIssue { get; set; } = null!;

    [JsonPropertyName("id_document_path")]
    public string IdDocumentPath { get; set; } = null!;
}
