using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using ProductCrud.DataSecurity;
using ProductCrud.ModelEdit;
using ProductCrud.Models;
using System.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Net.Mail;
using System.Security.Claims;
using System.Text;

namespace ProductCrud.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : Controller
    {
        private readonly ProductCrudContext _context;
        private readonly IDataProtector _protector;
        private readonly ILogger<AccountController> _logger;

        public AccountController(ProductCrudContext context, IDataProtectionProvider provider, DataSecurity.DataSecurityProvider security, ILogger<AccountController> logger)
        {
            _context = context;
            _protector = provider.CreateProtector(security.Datakey);
            _logger = logger;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterEdit edit)
        {
           

            var existingUser = await _context.Users
                .FirstOrDefaultAsync(x => x.EmailAddress == edit.EmailAddress);

            if (existingUser != null)
            {
                return BadRequest("User with that email already exists.");
            }

            int maxId = _context.Users.Any() ?
                _context.Users.Max(x => x.UserId) + 1 : 1;
            edit.UserId = maxId;

            User newUser = new User
            {
                UserId = edit.UserId,
                UserName = edit.UserName,
                EmailAddress = edit.EmailAddress,
                UserAddress = edit.UserAddress,
                UserPassword = _protector.Protect(edit.UserPassword),
                UserRole = "User",
            };

            await _context.Users.AddAsync(newUser);
            await _context.SaveChangesAsync();

            return Ok(newUser);
        }

        private string GenerateJsonWebToken(Claim[] claims)
        {
            var securitykey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("ThisIsA32ByteLongSecretKeyForHS256Encryption!"));

			var credentials = new SigningCredentials(securitykey,SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken("ProductCrud",
                "ProductCrud",
                claims,
                expires: DateTime.Now.AddMinutes(60),
                signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
                
        }



        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginEdit edit)
        {
            if (string.IsNullOrWhiteSpace(edit.EmailAddress) || string.IsNullOrWhiteSpace(edit.UserPassword))
            {
                return BadRequest("Email and password are required.");
            }

            try
            {
                // Retrieve users from the database without decrypting passwords
                var users = await _context.Users
                    .Where(x => x.EmailAddress.ToUpper() == edit.EmailAddress.ToUpper())
                    .ToListAsync();

                // Find the user and check the password in-memory
                var user = users.FirstOrDefault(x => _protector.Unprotect(x.UserPassword!) == edit.UserPassword);

                if (user != null)
                {
                    // Create claims for the user
                    var claims = new[]
            {
                new Claim(ClaimTypes.Name, user.UserId.ToString()),
                new Claim(ClaimTypes.Email, user.EmailAddress),
                new Claim(ClaimTypes.Role, user.UserRole)
            };

                    // Return the claimss
                    var token = GenerateJsonWebToken(claims);
                    return Ok(token);
                }

                // Return unauthorized if user not found
                return Unauthorized("Invalid email or password.");
            }
            catch (Exception ex)
            {
               

                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while processing your request.");
            }
        }


        [HttpPost("ForgetPassword")]
        public async Task<IActionResult> ForgetPassword(ForgetPasswordEdit edit)
        {
            try
            {
                var user = _context.Users
                    .Where(e => e.EmailAddress == edit.EmailAddress)
                    .FirstOrDefault();

                if (user == null)
                {
                    return NotFound("User does not exist with that email address");
                }

                var token = GenerateToken();
                bool emailSent = SendEmail(edit.EmailAddress, token);

                if (!emailSent)
                {
                    return StatusCode(500, "Failed to send email");
                }

                
                user.Otp = token;
                user.ExpieryDate = DateTime.Now.AddMinutes(2); 
                _context.Users.Update(user);
                await _context.SaveChangesAsync();

                string userId = _protector.Protect(user.UserId.ToString());

                return Ok(new { UserId = userId, Token = _protector.Protect(token) });
            }
            catch (Exception ex)
            {
                
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }


        private bool SendEmail(string email, string token)
        {
            try
            {
                using SmtpClient smtpclient = new SmtpClient
                {
                    Host = "smtp.gmail.com",
                    Port = 587,
                    UseDefaultCredentials = false,
                    Credentials = new NetworkCredential("aayushadhikari601@gmail.com", "hzrn ggvy swkq xfax"),
                    EnableSsl = true,
                    DeliveryMethod = SmtpDeliveryMethod.Network
                };

                using MailMessage m = new MailMessage
                {
                    From = new MailAddress("your-email@gmail.com"),
                    Subject = "Forget Password",
                    Body = $"<a href='#'>Hello, use this token to reset your password: {token}</a>",
                    IsBodyHtml = true
                };

                m.To.Add(email);
                smtpclient.Send(m);

                return true;
            }
            catch (Exception ex)
            {
               
                return false;
            }
        }

        private string GenerateToken()
        {
            Random random = new Random();
            return random.Next(1000, 9999).ToString();
        }

        [HttpPost("VerifyToken/{otp}/{id}")]
        public IActionResult VerifyOtp(string otp, string id, Token token)
        {
            try
            {
                
                string unProtectOtp = _protector.Unprotect(otp);
                int userId = Convert.ToInt16(_protector.Unprotect(id));

               
                var user = _context.Users.FirstOrDefault(e => e.UserId == userId);

                if (user != null)
                {
                    
                    if (user.Otp == unProtectOtp && user.ExpieryDate >= DateTime.Now)
                    {
                        if (user.Otp == token.Otp) 
                        {
                            user.Otp = null;
                            user.ExpieryDate = DateTime.Now.AddMinutes(5);
                            _context.Update(user);
                            _context.SaveChanges();
                            return Ok( _protector.Protect(userId.ToString()));

                        }
                        else
                        {
                            return BadRequest("Token is not valid.");
                        }
                    }
                    else
                    {
                        return BadRequest("OTP is not valid or has expired.");
                    }
                }
                else
                {
                    return NotFound("User not found.");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }

        [HttpPost("ResetPassword/{id}")]
        public IActionResult ResetPassword(string id, ChangePassword psw)
        {
            if (psw == null)
            {
                return BadRequest("Password information is required.");
            }

            try
            {
                var userId = Convert.ToInt16(_protector.Unprotect(id));
                var user = _context.Users.FirstOrDefault(e => e.UserId == userId);

                if (user == null)
                {
                    return NotFound("User not found.");
                }

                if (user.ExpieryDate < DateTime.Now)
                {
                    return BadRequest("The reset link has expired.");
                }

                if (psw.NewPassword != psw.OldPassword)
                {
                    return BadRequest("New password and old password do not match.");
                }

                
                user.UserPassword = _protector.Protect(psw.NewPassword);

                _context.Update(user);
                _context.SaveChanges();

                return Ok("Password reset successfully.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }

    }

}
