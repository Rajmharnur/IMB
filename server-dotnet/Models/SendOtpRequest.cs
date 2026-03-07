using System.Text.Json.Serialization;

namespace ServerDotNet.Models
{
  public class SendOtpRequest
  {
    [JsonPropertyName("mobile")]
    public string? Mobile { get; set; }
  }
}
