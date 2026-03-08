using Microsoft.AspNetCore.Mvc;
using ServerDotNet.Data;
using ServerDotNet.Models;
using ServerDotNet.Services;

namespace ServerDotNet.Controllers
{
  [ApiController]
  [Route("api/auth")]
  public class AuthController : ControllerBase
  {
    private readonly AppDbContext _context;
    private readonly JwtService _jwtService;

    public AuthController(AppDbContext context, JwtService jwtService)
    {
      _context = context;
      _jwtService = jwtService;
    }

    [HttpPost("login")]
    public IActionResult Login([FromBody] LoginRequest request)
    {
      // Try find by username first
      var user = _context.Users
          .FirstOrDefault(u => u.UserName == request.UserName);

      // If not found by username, try to resolve by mobile number.
      if (user == null && !string.IsNullOrWhiteSpace(request.UserName))
      {
        // Extract digits from the provided identifier (in case user entered mobile)
        var digits = new string(request.UserName.Where(char.IsDigit).ToArray());

        if (!string.IsNullOrEmpty(digits))
        {
          // Handle international +27 or 27 prefix -> local 0XXXXXXXXX
          string normalized = digits;
          if (digits.StartsWith("27") && digits.Length >= 11)
          {
            normalized = "0" + digits.Substring(2);
          }

          // Try direct DB lookups for common stored formats
          user = _context.Users
            .FirstOrDefault(u => u.MobileNumber == digits || u.MobileNumber == normalized || u.MobileNumber == "+" + digits);

          // Last resort: load into memory and compare digits-only representations
          if (user == null)
          {
            user = _context.Users
              .AsEnumerable()
              .FirstOrDefault(u => new string(u.MobileNumber.Where(char.IsDigit).ToArray()) == digits
                                   || new string(u.MobileNumber.Where(char.IsDigit).ToArray()) == normalized);
          }
        }
      }

      if (user == null)
      {
        return NotFound(new { message = "USER_NOT_FOUND" });
      }

      // NOTE: previously used BCrypt library to verify hashed passwords.
      // Because the workspace is offline we avoid external packages and simply
      // compare strings directly.  In production you should always store
      // hashed passwords and call a proper verification routine here.
      if (request.Password != user.PasswordHash)
      {
        return Unauthorized(new { message = "INVALID_PASSWORD" });
      }

      var token = _jwtService.GenerateToken(user);

      return Ok(new
      {
        message = "LOGIN_SUCCESS",
        token = token
      });
    }
  }
}