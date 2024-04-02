using Newtonsoft.Json.Linq;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using WebAPI.Core.Shared;
using WebAPI.Models;

namespace WebAPI.Core.User
{
    public class Update : ContextRepository
    {
        public Update(IConfiguration configuration, Context context) : base(configuration, context)
        {
        }

        public void basic(Models.User userUpdate)
        {
            Models.User user = context.Users.Where(u => u.id == userUpdate.id).FirstOrDefault();
            if (user == null)
                throw new Exception("User not found");

            user.name = userUpdate.name;
            user.phone = userUpdate.phone;

            context.SaveChanges();
        }
        public void password(Guid id, string oldPassword, string newPassword)
        {
            Models.User user = context.Users.Where(u => u.id == id).FirstOrDefault();
            if (user == null)
                throw new Exception("User not found");
            if (user.password != oldPassword)
                throw new Exception("The old password is not same as the current password");

            user.password = newPassword;

            context.SaveChanges();
        }
        public void sendMail(Guid id, string email)
        {
            Models.User user = context.Users.Where(u => u.email == email).FirstOrDefault();
            if (user != null)
                throw new Exception("Another user already uses this email");
            user = context.Users.Where(u => u.id == id).FirstOrDefault();
            if (user == null)
                throw new Exception("User not found");

            string data = new JObject()
            {
                ["id"] = id,
                ["email"] = email
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
            mail.send(email, "Sysma Notes: Confirm update email",
                $"Hi {user.name}.</br>" + 
                $"<a href=\"https://localhost:7011/api/user/update/email/{tokenRaw}\">" + 
                "Click here</a> to confirm update email.");
        }
        public void email(Guid id, string email)
        {
            Models.User user = context.Users.Where(u => u.id == id).FirstOrDefault();
            if (user == null)
                throw new Exception("User not found");

            user.email = email;

            context.SaveChanges();
        }
    }
}
