using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using ServerDotNet.Data;
using ServerDotNet.Models;
using ServerDotNet.Services;

namespace ServerDotNet.Controllers
{
    [ApiController]
    [Route("api/otp")]
    public class OtpController : ControllerBase
    {
        private readonly OtpService _otpService;
        private readonly AppDbContext _db;
        private readonly JwtService _jwtService;

        public OtpController(OtpService otpService, AppDbContext db, JwtService jwtService)
        {
            _otpService = otpService;
            _db = db;
            _jwtService = jwtService;
        }

        // POST: /api/otp/send
        [HttpPost("send")]
        public async Task<IActionResult> SendOtp([FromBody] SendOtpRequest request)
        {
            if (request == null)
                return BadRequest(new { error = "Request body is null" });

            if (string.IsNullOrWhiteSpace(request.Mobile))
                return BadRequest(new { error = "Mobile number is required" });

            // Only check user existence for login requests
            if (request.IsLogin == true)
            {
                var user = await _db.Users.FirstOrDefaultAsync(u => u.MobileNumber == request.Mobile);
                if (user == null)
                    return NotFound(new { error = "USER_NOT_FOUND" });
            }

            try
            {
                await _otpService.SendOtpAsync(request.Mobile);
                return Ok(new { message = "OTP sent successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "An error occurred while sending OTP", details = ex.Message });
            }
        }

        // POST: /api/otp/verify
        [HttpPost("verify")]
public async Task<IActionResult> VerifyOtp([FromBody] VerifyOtpRequest request)
{
    if (request == null)
        return BadRequest(new { error = "Request body is null" });

    if (string.IsNullOrWhiteSpace(request.Mobile))
        return BadRequest(new { error = "Mobile number is required" });

    if (string.IsNullOrWhiteSpace(request.Otp))
        return BadRequest(new { error = "OTP is required" });

    try
    {
        var isValid = _otpService.VerifyOtp(request.Mobile, request.Otp);

        if (!isValid)
            return BadRequest(new { error = "Invalid or expired OTP" });

        // Check if user exists
        var user = await _db.Users.FirstOrDefaultAsync(u => u.MobileNumber == request.Mobile);

        if (user != null)
        {
            // Login flow — return JWT
            var token = _jwtService.GenerateToken(user);
            return Ok(new { message = "OTP verified successfully", token });
        }

        // Signup flow — no user yet, just confirm OTP is valid
        return Ok(new { message = "OTP verified successfully", token = (string?)null });
    }
    catch (Exception ex)
    {
        return StatusCode(500, new { error = "An error occurred during OTP verification", details = ex.Message });
    }
}

        // DEV: GET: /api/otp/debug — REMOVE in production
        [HttpGet("debug")]
        public IActionResult DebugOtps()
        {
            try
            {
                var items = _otpService.GetAllOtps()
                    .Select(kv => new { mobile = kv.Key, otp = kv.Value.Otp, expiry = kv.Value.ExpiryTime });
                return Ok(items);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Failed to get OTPs", details = ex.Message });
            }
        }
    }
}