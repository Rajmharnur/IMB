namespace ServerDotNet.Models;

/// <summary>
/// Temporary OTP storage for verification flow. Not the users.otp column.
/// </summary>
public class OtpCode
{
    public int Id { get; set; }
    public string MobileNumber { get; set; } = null!;
    public string OtpValue { get; set; } = null!;
    public DateTime ExpiresAt { get; set; }
}
