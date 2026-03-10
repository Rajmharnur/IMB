namespace ServerDotNet.Models
{
    public class VerifyOtpRequest
    {
       public string Mobile { get; set; } = null!;
       public string Otp { get; set; } = null!;
       
    }
}
