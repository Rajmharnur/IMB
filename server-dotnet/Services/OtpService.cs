using Microsoft.EntityFrameworkCore;
using ServerDotNet.Data;
using ServerDotNet.Models;

namespace ServerDotNet.Services;

public class OtpService
{
    private readonly AppDbContext _db;
    private const int OTP_EXPIRY_MINUTES = 5;
    private static readonly Random _random = new();

    public OtpService(AppDbContext db)
    {
        _db = db;
    }

    private static string NormalizeMobile(string mobile)
    {
        if (string.IsNullOrWhiteSpace(mobile)) return string.Empty;
        var digits = new string(mobile.Where(char.IsDigit).ToArray());
        return digits;
    }

    public async System.Threading.Tasks.Task SendOtpAsync(string mobile)
    {
        if (string.IsNullOrWhiteSpace(mobile))
            throw new ArgumentException("Mobile cannot be null");

        string otp;
        lock (_random)
        {
            otp = _random.Next(100000, 999999).ToString();
        }

        var normalizedMobile = NormalizeMobile(mobile);
        var expiresAt = DateTime.UtcNow.AddMinutes(OTP_EXPIRY_MINUTES);

        // Remove any existing OTP for this mobile
        await _db.OtpCodes.Where(x => x.MobileNumber == normalizedMobile).ExecuteDeleteAsync();

        _db.OtpCodes.Add(new OtpCode
        {
            MobileNumber = normalizedMobile,
            OtpValue = otp,
            ExpiresAt = expiresAt
        });
        await _db.SaveChangesAsync();

        // Optional: send via Twilio if env vars are set (keep existing SMS logic if you want)
        var accountSid = Environment.GetEnvironmentVariable("TWILIO_ACCOUNT_SID");
        var authToken = Environment.GetEnvironmentVariable("TWILIO_AUTH_TOKEN");
        var fromNumber = Environment.GetEnvironmentVariable("TWILIO_FROM");

        if (!string.IsNullOrWhiteSpace(accountSid) && !string.IsNullOrWhiteSpace(authToken) && !string.IsNullOrWhiteSpace(fromNumber))
        {
            try
            {
                using var httpClient = new HttpClient();
                var url = $"https://api.twilio.com/2010-04-01/Accounts/{accountSid}/Messages.json";
                var content = new FormUrlEncodedContent(new[]
                {
                    new KeyValuePair<string, string>("To", mobile),
                    new KeyValuePair<string, string>("From", fromNumber),
                    new KeyValuePair<string, string>("Body", $"Your verification code is {otp}")
                });
                var auth = Convert.ToBase64String(System.Text.Encoding.ASCII.GetBytes($"{accountSid}:{authToken}"));
                var request = new HttpRequestMessage(HttpMethod.Post, url) { Content = content };
                request.Headers.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Basic", auth);
                var resp = await httpClient.SendAsync(request);
                if (!resp.IsSuccessStatusCode)
                    Console.WriteLine($"Twilio SMS failed: {await resp.Content.ReadAsStringAsync()}");
                else
                    Console.WriteLine($"OTP sent to {mobile} via Twilio");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Twilio error: {ex.Message}");
            }
        }
        else
        {
            Console.WriteLine($"OTP for {mobile}: {otp} (expires in {OTP_EXPIRY_MINUTES} min)");
        }
    }

    public bool VerifyOtp(string mobile, string otp)
    {
        var normalizedMobile = NormalizeMobile(mobile);
        if (string.IsNullOrEmpty(normalizedMobile)) return false;

        var record = _db.OtpCodes
            .FirstOrDefault(x => x.MobileNumber == normalizedMobile && x.OtpValue == otp);

        if (record == null) return false;
        if (DateTime.UtcNow > record.ExpiresAt)
        {
            _db.OtpCodes.Remove(record);
            _db.SaveChanges();
            return false;
        }

        _db.OtpCodes.Remove(record);
        _db.SaveChanges();
        return true;
    }

    public async System.Threading.Tasks.Task<bool> VerifyOtpAsync(string mobile, string otp)
    {
        var normalizedMobile = NormalizeMobile(mobile);
        if (string.IsNullOrEmpty(normalizedMobile)) return false;

        var record = await _db.OtpCodes
            .FirstOrDefaultAsync(x => x.MobileNumber == normalizedMobile && x.OtpValue == otp);

        if (record == null) return false;
        if (DateTime.UtcNow > record.ExpiresAt)
        {
            _db.OtpCodes.Remove(record);
            await _db.SaveChangesAsync();
            return false;
        }

        _db.OtpCodes.Remove(record);
        await _db.SaveChangesAsync();
        return true;
    }

    public IReadOnlyDictionary<string, (string Otp, DateTime ExpiryTime)> GetAllOtps()
    {
        return _db.OtpCodes
            .AsNoTracking()
            .ToDictionary(x => x.MobileNumber, x => (x.OtpValue, x.ExpiresAt));
    }
}
