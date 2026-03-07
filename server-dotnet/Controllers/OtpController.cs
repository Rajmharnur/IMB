using Microsoft.AspNetCore.Mvc;
using System.Linq;
using ServerDotNet.Models;
using ServerDotNet.Services;

namespace ServerDotNet.Controllers
{
    [ApiController]
    [Route("api/otp")]
    public class OtpController : ControllerBase
    {
        private readonly OtpService _otpService;

        public OtpController(OtpService otpService)
        {
            _otpService = otpService;
        }

        // POST: /api/otp/send
        [HttpPost("send")]
        public async System.Threading.Tasks.Task<IActionResult> SendOtp([FromBody] ServerDotNet.Models.SendOtpRequest request)
        {
            if (request == null)
                return BadRequest(new { error = "Request body is null" });

            if (string.IsNullOrWhiteSpace(request.Mobile))
                return BadRequest(new { error = "Mobile number is required" });

            try
            {
                // send OTP using the service
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
        public IActionResult VerifyOtp([FromBody] VerifyOtpRequest request)
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

                return Ok(new { message = "OTP verified successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "An error occurred during OTP verification", details = ex.Message });
            }
        }

        // DEV: GET: /api/otp/debug
        // Temporary endpoint to inspect stored OTPs. REMOVE in production.
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

    // NOTE: request models moved to Models folder
}

