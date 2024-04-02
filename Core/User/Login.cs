using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using WebAPI.Core.Shared;
using WebAPI.Models;

namespace WebAPI.Core.User
{
    public class Login : ContextRepository
    {
        public Login(IConfiguration configuration, Context context) : base(configuration, context)
        {
        }

        public string init(string email, string password)
        {
            Models.User user = context.Users.Where(u =>
                u.email == email &&
                u.password == password).FirstOrDefault();
            if (user == null)
                throw new Exception("User not found.");

            SymmetricSecurityKey securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
                configuration["Authentication:Shemes:Bearer:Secret"]));
            SigningCredentials credentials = new SigningCredentials(
                securityKey, SecurityAlgorithms.HmacSha256);
            JwtHeader header = new JwtHeader(credentials);
            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim("id", user.id.ToString()),
                new Claim("name", user.name),
                new Claim("email", user.email)
            };
            var payload = new JwtPayload(
                issuer: configuration["Authentication:Shemes:Bearer:ValidIssuer"],
                audience: configuration["Authentication:Shemes:Bearer:ValidAudience"],
                claims: claims,
                notBefore: DateTime.UtcNow,
                expires: DateTime.UtcNow.AddMonths(1));
            var token = new JwtSecurityToken(header, payload);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
