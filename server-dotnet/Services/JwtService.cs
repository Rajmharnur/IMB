using System;
using System.Collections.Generic;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using Microsoft.Extensions.Configuration;
using ServerDotNet.Models;

namespace ServerDotNet.Services
{
  /// <summary>
  /// Very lightweight JWT creator that avoids external dependencies.  It uses
  /// HMAC-SHA256 to sign a header+payload and emits a base64url token string.
  /// The only requirement is a symmetric key configured via <c>Jwt:Key</c>.
  /// </summary>
  public class JwtService
  {
    private readonly byte[] _secretBytes;
    private readonly double _expiryDays;

    public JwtService(IConfiguration configuration)
    {
      var secret = configuration["Jwt:Key"];
      if (string.IsNullOrWhiteSpace(secret))
        throw new InvalidOperationException("JWT signing key is not configured (Jwt:Key)");

      _secretBytes = Encoding.UTF8.GetBytes(secret);

      var expiry = configuration["Jwt:ExpireDays"];
      if (!double.TryParse(expiry, out _expiryDays))
      {
        _expiryDays = 7; // default to one week
      }
    }

    public string GenerateToken(User user)
    {
      if (user is null) throw new ArgumentNullException(nameof(user));

      var header = new Dictionary<string, object>
      {
        ["alg"] = "HS256",
        ["typ"] = "JWT"
      };

      var payload = new Dictionary<string, object>
      {
        ["sub"] = user.Id,
        ["name"] = $"{user.FirstName} {user.LastName}",
        ["email"] = user.Email ?? string.Empty,
        ["username"] = user.UserName,
        ["exp"] = DateTimeOffset.UtcNow.AddDays(_expiryDays).ToUnixTimeSeconds()

      };

      string headerJson = JsonSerializer.Serialize(header);
      string payloadJson = JsonSerializer.Serialize(payload);

      string headerBase64 = Base64UrlEncode(Encoding.UTF8.GetBytes(headerJson));
      string payloadBase64 = Base64UrlEncode(Encoding.UTF8.GetBytes(payloadJson));

      string unsignedToken = headerBase64 + "." + payloadBase64;
      string signature = ComputeSignature(unsignedToken);

      return unsignedToken + "." + signature;
    }

    private string ComputeSignature(string unsignedToken)
    {
      using var hmac = new HMACSHA256(_secretBytes);
      var sigBytes = hmac.ComputeHash(Encoding.UTF8.GetBytes(unsignedToken));
      return Base64UrlEncode(sigBytes);
    }

    private static string Base64UrlEncode(byte[] bytes)
    {
      return Convert.ToBase64String(bytes)
          .TrimEnd('=')
          .Replace('+', '-')
          .Replace('/', '_');
    }
  }
}