using System.Text.Json.Serialization;

namespace ServerDotNet.Models.Requests;

public class CreateWorkPermitRequest
{
    [JsonPropertyName("permit_document_path")]
    public string? PermitDocumentPath { get; set; }

    [JsonPropertyName("issue_date")]
    public DateTime IssueDate { get; set; }

    [JsonPropertyName("expiry_date")]
    public DateTime ExpiryDate { get; set; }
}
