using Microsoft.EntityFrameworkCore;
using ServerDotNet.Data;
using ServerDotNet.Services;

// Ensure Npgsql accepts DateTime without explicit Kind by treating them as UTC
AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);

var builder = WebApplication.CreateBuilder(args);

// Database
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString));

// Add services
builder.Services.AddControllers();
builder.Services.AddScoped<OtpService>();
builder.Services.AddScoped<JwtService>();
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact",
        policy =>
        {
            policy
                .WithOrigins("http://localhost:3000", "http://localhost:3001")
                .AllowAnyHeader()
                .AllowAnyMethod();
        });
});

var app = builder.Build();

// Middleware order
app.UseRouting();

app.UseCors("AllowReact");   // 👈 MUST be before MapControllers

app.UseAuthorization();

// ✅ ADD THIS
app.MapGet("/", () => "ServerDotNet API is running 🚀");

app.MapControllers();

// Ensure database and tables exist
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    await db.Database.EnsureCreatedAsync();
    // If you already created users/address/identification/work_permit manually, ensure otp_codes exists
    await db.Database.ExecuteSqlRawAsync(
        """
        CREATE TABLE IF NOT EXISTS otp_codes (
            id serial PRIMARY KEY,
            mobile_number VARCHAR(20) NOT NULL,
            otp_code VARCHAR(10) NOT NULL,
            expires_at TIMESTAMP NOT NULL
        )
        """);
}

app.Run();