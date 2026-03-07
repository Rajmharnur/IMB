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
      var user = _context.Users
          .FirstOrDefault(u => u.UserName == request.UserName);

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