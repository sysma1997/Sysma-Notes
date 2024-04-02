using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json.Linq;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using WebAPI.Core.Shared;

namespace WebAPI.Core.User
{
    public class Register : ContextRepository
    {
        public Register(IConfiguration configuration, Models.Context context) : base(configuration, context) { }

        public void sendToken(Models.User user)
        {
            Models.User exists = context.Users.Where(u =>
                u.email == user.email).FirstOrDefault();
            if (exists != null)
                throw new Exception("Email already registered");

            string data = new JObject()
            {
                ["id"] = user.id,
                ["name"] = user.name,
                ["phone"] = user.phone,
                ["email"] = user.email,
                ["password"] = user.password
            }.ToString();
            JwtHeader header = new JwtHeader();
            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim("data", data)
            };
            var payload = new JwtPayload(issuer: configuration["Authentication:Shemes:Bearer:ValidIssuer"],
                audience: configuration["Authentication:Shemes:Bearer:ValidAudience"],
                claims: claims,
                notBefore: DateTime.UtcNow,
                expires: DateTime.UtcNow.AddHours(24));
            var token = new JwtSecurityToken(header, payload);
            string tokenRaw = new JwtSecurityTokenHandler().WriteToken(token);

            Shared.Gmail mail = new Gmail(configuration);
            mail.send(user.email, "Welcome to Sysma Notes",
                $"Hi {user.name}.</br>" +
                $"<a href=\"https://localhost:7011/api/user/register/{tokenRaw}\">" + 
                "Click here</a> to validate user.");
        }
        public void save(Models.User user)
        {
            context.Users.Add(user);
            context.SaveChanges();
        }
    }
}
