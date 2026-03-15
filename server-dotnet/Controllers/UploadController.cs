using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ServerDotNet.Data;
using ServerDotNet.Models;

namespace ServerDotNet.Controllers;

[ApiController]
[Route("api/upload")]
public class UploadController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly IWebHostEnvironment _env;

    public UploadController(AppDbContext db, IWebHostEnvironment env)
    {
        _db = db;
        _env = env;
    }

    [HttpPost("id-document/{userId:int}")]
    public async Task<IActionResult> UploadIdDocument(int userId, IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest(new { error = "No file provided" });

        var path = await SaveFile(file, "id-documents");
        var identification = await _db.Identifications.FirstOrDefaultAsync(i => i.UserId == userId);

        if (identification == null)
            return NotFound(new { error = "Identification record not found" });

        identification.IdDocumentPath = path;
        await _db.SaveChangesAsync();
        return Ok(new { path, message = "ID document uploaded" });
    }

    [HttpPost("proof-of-address/{userId:int}")]
    public async Task<IActionResult> UploadProofOfAddress(int userId, IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest(new { error = "No file provided" });

        var path = await SaveFile(file, "proof-of-address");
        var address = await _db.Addresses.FirstOrDefaultAsync(a => a.UserId == userId);

        if (address == null)
            return NotFound(new { error = "Address record not found" });

        address.ProofOfAddressPath = path;
        await _db.SaveChangesAsync();
        return Ok(new { path, message = "Proof of address uploaded" });
    }

    [HttpPost("work-permit/{userId:int}")]
    public async Task<IActionResult> UploadWorkPermit(int userId, IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest(new { error = "No file provided" });

        var path = await SaveFile(file, "work-permits");
        var workPermit = await _db.WorkPermits.FirstOrDefaultAsync(w => w.UserId == userId);

        if (workPermit == null)
        {
            // Create placeholder record if it doesn't exist yet
            workPermit = new WorkPermit
            {
                UserId = userId,
                PermitDocumentPath = path,
                IssueDate = DateTime.UtcNow,
                ExpiryDate = DateTime.UtcNow.AddYears(1)
            };
            _db.WorkPermits.Add(workPermit);
        }
        else
        {
            workPermit.PermitDocumentPath = path;
        }

        await _db.SaveChangesAsync();
        return Ok(new { path, message = "Work permit uploaded" });
    }

    [HttpGet("file")]
    public IActionResult GetFile([FromQuery] string path)
    {
        if (string.IsNullOrWhiteSpace(path))
            return BadRequest(new { error = "Path is required" });

        var fullPath = System.IO.Path.Combine(_env.ContentRootPath, "Uploads", path);

        if (!System.IO.File.Exists(fullPath))
            return NotFound(new { error = "File not found" });

        var ext = System.IO.Path.GetExtension(fullPath).ToLowerInvariant();
        var contentType = ext switch
        {
            ".jpg" or ".jpeg" => "image/jpeg",
            ".png" => "image/png",
            ".pdf" => "application/pdf",
            _ => "application/octet-stream"
        };

        var bytes = System.IO.File.ReadAllBytes(fullPath);
        return File(bytes, contentType);
    }

    private async Task<string> SaveFile(IFormFile file, string folder)
    {
        var uploadsDir = System.IO.Path.Combine(_env.ContentRootPath, "Uploads", folder);
        Directory.CreateDirectory(uploadsDir);

        var ext = System.IO.Path.GetExtension(file.FileName);
        var fileName = $"{Guid.NewGuid()}{ext}";
        var fullPath = System.IO.Path.Combine(uploadsDir, fileName);

        using var stream = new FileStream(fullPath, FileMode.Create);
        await file.CopyToAsync(stream);

        return $"{folder}/{fileName}";
    }
}