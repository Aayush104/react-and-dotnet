using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using ProductCrud.DataSecurity;
using ProductCrud.Hubsss;
using ProductCrud.Models;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Configure CORS policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin",
        corsBuilder => corsBuilder
        .WithOrigins("http://localhost:5173") // Add your frontend URL here
        .AllowAnyMethod()
        .AllowAnyHeader()
        .AllowCredentials()); // This is important for SignalR
});

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddSignalR();  // Add SignalR services

// Configure Data Protection
builder.Services.AddDataProtection();

// Swagger/OpenAPI configuration
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Database context configuration
builder.Services.AddDbContext<ProductCrudContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Authentication configuration
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
})
   
.AddJwtBearer(options =>
{
    options.SaveToken = true;
    options.RequireHttpsMetadata = false;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidIssuer = "ProductCrud",
        ValidAudience = "ProductCrud",
        ClockSkew = TimeSpan.Zero,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("ThisIsA32ByteLongSecretKeyForHS256Encryption!"))
    };
});

// Register custom services
builder.Services.AddSingleton<DataSecurityProvider>();
 builder.Services.AddSignalR(options =>
    {
        options.EnableDetailedErrors = true;
    });


var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("AllowSpecificOrigin");
app.UseAuthentication();
app.UseAuthorization();
app.UseDefaultFiles();
app.UseStaticFiles();

// Map SignalR hubs
app.MapControllers();
app.MapHub<ChatHub>("/hub");  // Ensure that this path matches the client configuration

app.Run();
