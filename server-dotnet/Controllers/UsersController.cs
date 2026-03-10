using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ServerDotNet.Data;
using ServerDotNet.Models;
using ServerDotNet.Models.Requests;

namespace ServerDotNet.Controllers;

[ApiController]
[Route("api/users")]
public class UsersController : ControllerBase
{
    private readonly AppDbContext _db;

    public UsersController(AppDbContext db)
    {
        _db = db;
    }

    /// <summary>Create a new user (e.g. after OTP verification).</summary>
    [HttpPost]
    public async Task<IActionResult> CreateUser([FromBody] CreateUserRequest request)
    {
        if (request == null)
            return BadRequest(new { error = "Request body is required" });

        if (string.IsNullOrWhiteSpace(request.FirstName)) return BadRequest(new { error = "first_name is required" });
        if (string.IsNullOrWhiteSpace(request.LastName)) return BadRequest(new { error = "last_name is required" });
        if (string.IsNullOrWhiteSpace(request.MobileNumber)) return BadRequest(new { error = "mobile_number is required" });
        if (string.IsNullOrWhiteSpace(request.UserName)) return BadRequest(new { error = "username is required" });
        if (string.IsNullOrWhiteSpace(request.Password)) return BadRequest(new { error = "password is required" });

        var exists = await _db.Users.AnyAsync(u => u.MobileNumber == request.MobileNumber);
        if (exists)
            return Conflict(new { error = "A user with this mobile number already exists" });

        var result = await _db.Database.ExecuteSqlRawAsync(
            @"INSERT INTO users (first_name, last_name, dob, mobile_number, email, employer, username, password_hash)
          VALUES ({0}, {1}, {2}, {3}, {4}, {5}, {6}, {7})",
            request.FirstName,
            request.LastName,
            request.Dob,
            request.MobileNumber,
            request.Email ?? "",
            request.Employer ?? "Pending",
            request.UserName,
            request.Password
        );

        // Get the newly created user id
        var user = await _db.Users.FirstOrDefaultAsync(u => u.MobileNumber == request.MobileNumber);

        return CreatedAtAction(nameof(GetUser), new { id = user!.Id }, new { id = user.Id, message = "User created" });
    }

    /// <summary>Update user (e.g. email, employer from Contact step).</summary>
    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateUser(int id, [FromBody] UpdateUserRequest request)
    {
        if (request == null)
            return BadRequest(new { error = "Request body is required" });

        var user = await _db.Users.FindAsync(id);
        if (user == null)
            return NotFound(new { error = "User not found" });

        if (request.Email != null)
            user.Email = request.Email;
        if (request.Employer != null)
            user.Employer = request.Employer;

        await _db.SaveChangesAsync();
        return Ok(new { id = user.Id, message = "User updated" });
    }

    /// <summary>Get user by id.</summary>
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetUser(int id)
    {
        var user = await _db.Users
            .AsNoTracking()
            .Include(u => u.Addresses)
            .Include(u => u.Identifications)
            .Include(u => u.WorkPermits)
            .FirstOrDefaultAsync(u => u.Id == id);

        if (user == null)
            return NotFound();

        return Ok(user);
    }

    /// <summary>Add address for a user.</summary>
    [HttpPost("{userId:int}/address")]
    public async Task<IActionResult> AddAddress(int userId, [FromBody] CreateAddressRequest request)
    {
        if (request == null)
            return BadRequest(new { error = "Request body is required" });

        if (string.IsNullOrWhiteSpace(request.StreetNameNumber)) return BadRequest(new { error = "street_name_number is required" });
        if (string.IsNullOrWhiteSpace(request.City)) return BadRequest(new { error = "city is required" });
        if (string.IsNullOrWhiteSpace(request.PostalCode)) return BadRequest(new { error = "postal_code is required" });
        if (string.IsNullOrWhiteSpace(request.Province)) return BadRequest(new { error = "province is required" });
        if (string.IsNullOrWhiteSpace(request.ProofOfAddressPath)) return BadRequest(new { error = "proof_of_address_path is required" });

        var userExists = await _db.Users.AnyAsync(u => u.Id == userId);
        if (!userExists)
            return NotFound(new { error = "User not found" });

        var address = new Address
        {
            UserId = userId,
            StreetNameNumber = request.StreetNameNumber,
            Suburb = request.Suburb,
            City = request.City,
            PostalCode = request.PostalCode,
            Province = request.Province,
            ProofOfAddressPath = request.ProofOfAddressPath
        };
        _db.Addresses.Add(address);
        await _db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetUser), new { id = userId }, new { id = address.Id, message = "Address added" });
    }

    /// <summary>Add identification for a user.</summary>
    [HttpPost("{userId:int}/identification")]
    public async Task<IActionResult> AddIdentification(int userId, [FromBody] CreateIdentificationRequest request)
    {
        if (request == null)
            return BadRequest(new { error = "Request body is required" });

        if (string.IsNullOrWhiteSpace(request.IdType)) return BadRequest(new { error = "id_type is required" });
        if (string.IsNullOrWhiteSpace(request.IdNumber)) return BadRequest(new { error = "id_number is required" });
        if (string.IsNullOrWhiteSpace(request.CountryOfIssue)) return BadRequest(new { error = "country_of_issue is required" });
        if (string.IsNullOrWhiteSpace(request.IdDocumentPath)) return BadRequest(new { error = "id_document_path is required" });

        var userExists = await _db.Users.AnyAsync(u => u.Id == userId);
        if (!userExists)
            return NotFound(new { error = "User not found" });

        var identification = new Identification
        {
            UserId = userId,
            IdType = request.IdType,
            IdNumber = request.IdNumber,
            CountryOfIssue = request.CountryOfIssue,
            IdDocumentPath = request.IdDocumentPath
        };
        _db.Identifications.Add(identification);
        await _db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetUser), new { id = userId }, new { id = identification.Id, message = "Identification added" });
    }

    /// <summary>Add work permit for a user.</summary>
    [HttpPost("{userId:int}/work-permit")]
    public async Task<IActionResult> AddWorkPermit(int userId, [FromBody] CreateWorkPermitRequest request)
    {
        if (request == null)
            return BadRequest(new { error = "Request body is required" });

        var userExists = await _db.Users.AnyAsync(u => u.Id == userId);
        if (!userExists)
            return NotFound(new { error = "User not found" });

        var workPermit = new WorkPermit
        {
            UserId = userId,
            PermitDocumentPath = request.PermitDocumentPath,
            IssueDate = request.IssueDate,
            ExpiryDate = request.ExpiryDate
        };
        _db.WorkPermits.Add(workPermit);
        await _db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetUser), new { id = userId }, new { id = workPermit.Id, message = "Work permit added" });
    }
}
