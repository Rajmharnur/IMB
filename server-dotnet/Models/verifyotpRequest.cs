namespace ServerDotNet.Models
{
    public class VerifyOtpRequest
    {
        public required string Mobile { get; set; }
        public required string Otp { get; set; }
    }
}
