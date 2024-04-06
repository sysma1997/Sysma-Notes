using Newtonsoft.Json.Linq;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using WebAPI.Core.Shared;
using WebAPI.Models;

namespace WebAPI.Core.User
{
    public class RecoverPassword : ContextRepository
    {
        public RecoverPassword(IConfiguration configuration, Context context) : base(configuration, context)
        {
        }

        public void searchUser(string email)
        {
            Models.User user = context.Users.Where(u => u.email == email).FirstOrDefault();
            if (user == null)
                throw new Exception("User with email not found");

            string data = new JObject()
            {
                ["id"] = user.id,
                ["email"] = user.email
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
            mail.send(user.email,
                "Sysma Notes: Recover password",
                $"Hi {user.name}.</br>" +
                $"<a href=\"https://localhost:44334/recoverPassword/index.html?token={tokenRaw}\">" + 
                "Click here</a> to recover your password");
        }
        public void update(Guid id, string newPassword)
        {
            Models.User user = context.Users.Where(u => u.id == id).FirstOrDefault();
            if (user == null)
                throw new Exception("User not found");

            user.password = newPassword;
            context.SaveChanges();
        }
    }
}
