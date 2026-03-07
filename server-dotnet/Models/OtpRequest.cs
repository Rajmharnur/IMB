using System.Text.Json.Serialization;

namespace ServerDotNet.Models
{
    public class OtpRequest
    {
        [JsonPropertyName("mobile")]
        public required string Mobile { get; set; }

        [JsonPropertyName("otp")]
        public required string Otp { get; set; }
    }
}
