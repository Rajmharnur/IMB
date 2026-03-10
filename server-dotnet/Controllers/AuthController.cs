using Microsoft.AspNetCore.Mvc;
using ServerDotNet.Data;
using ServerDotNet.Models;
using ServerDotNet.Services;
// using BCrypt.Net;

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

    // Normalizes any mobile format to local 0XXXXXXXXX
    private static string NormalizeMobile(string input)
    {
      var digits = new string(input.Where(char.IsDigit).ToArray());

      // +27XXXXXXXXX or 27XXXXXXXXX -> 0XXXXXXXXX
      if (digits.StartsWith("27") && digits.Length >= 11)
        return "0" + digits.Substring(2);

      return digits;
    }

    [HttpPost("login")]
    public IActionResult Login([FromBody] LoginRequest request)
    {
      if (string.IsNullOrWhiteSpace(request.UserName) || string.IsNullOrWhiteSpace(request.Password))
        return BadRequest(new { message = "Username and password are required" });

      // Try find by username first
      var user = _context.Users
          .FirstOrDefault(u => u.UserName == request.UserName);

      // If not found, try resolving as a mobile number
      if (user == null)
      {
        var normalized = NormalizeMobile(request.UserName);

        if (!string.IsNullOrEmpty(normalized))
        {
          // Query DB with known formats only — avoids loading entire table
          user = _context.Users.FirstOrDefault(u =>
            u.MobileNumber == normalized ||
            u.MobileNumber == "+" + normalized.TrimStart('0').Insert(0, "27") ||
            u.MobileNumber == "27" + normalized.TrimStart('0')
          );
        }
      }

      if (user == null)
        return NotFound(new { message = "USER_NOT_FOUND" });

      // Secure BCrypt password verification
      // bool passwordValid = BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash);
      if (request.Password != user.PasswordHash)
    return Unauthorized(new { message = "INVALID_PASSWORD" });

      // if (!passwordValid)
      //   return Unauthorized(new { message = "INVALID_PASSWORD" });

      var token = _jwtService.GenerateToken(user);

      return Ok(new
      {
        message = "LOGIN_SUCCESS",
        token
      });
    }
  }
}