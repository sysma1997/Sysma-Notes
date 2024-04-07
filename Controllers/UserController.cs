using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using System.IdentityModel.Tokens.Jwt;
using WebAPI.Core.Shared;
using WebAPI.Models;

namespace WebAPI.Controllers
{
    [Route("api/user")]
    public class UserController : ControllerRepository
    {
        public UserController(IConfiguration configuration, Context context) : base(configuration, context)
        {
        }

        [AllowAnonymous]
        [HttpPost("register")]
        public IActionResult postRegister(Models.User user)
        {
            if (user.id == Guid.Empty) user.id = Guid.NewGuid();
            if (user.password.Length != 64)
                return BadRequest("Password not valid");

            var register = new Core.User.Register(configuration, context);

            try
            {
                register.sendToken(user);

                return Ok("Send email to validate user");
            } catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [AllowAnonymous]
        [HttpPost("register/token")]
        public IActionResult getRegister(JObject json)
        {
            if (json["token"] == null)
                return BadRequest("Token is required.");

            string tokenRaw = json["token"].Value<string>();

            try
            {
                var jwtHandler = new JwtSecurityTokenHandler();
                var token = jwtHandler.ReadToken(tokenRaw) as JwtSecurityToken;

                var data = token.Claims.First(claim => claim.Type == "data").Value;
                json = JObject.Parse(data);

                Models.User user = new User();
                user.id = Guid.Parse(json["id"].Value<string>());
                user.name = json["name"].Value<string>();
                user.phone = json["phone"].Value<string>();
                user.email = json["email"].Value<string>();
                user.password = json["password"].Value<string>();

                var register = new Core.User.Register(configuration, context);
                register.save(user);

                return StatusCode(201);
            } catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [AllowAnonymous]
        [HttpGet("recoverPassword/{email}")]
        public IActionResult getRecoverPassword(string email)
        {
            var recoverPassword = new Core.User.RecoverPassword(configuration, context);

            try
            {
                recoverPassword.searchUser(email);

                return Ok("Send email to recover password");
            } catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [AllowAnonymous]
        [HttpPost("recoverPassword")]
        public IActionResult postRecoverPassword(JObject json)
        {
            if (json["token"] == null || 
                json["password"] == null)
            {
                string message = "";
                if (json["token"] == null)
                    message += "Token is required.";
                if (json["password"] == null)
                    message += ((json["token"] == null) ? "\n" : "") +
                        "Password is required.";

                return BadRequest(message);
            }

            string tokenRaw = json["token"].Value<string>();
            string newPassword = json["password"].Value<string>();

            if (newPassword.Length != 64)
                return BadRequest("Password is not valid format.");

            try
            {
                var jwtHandler = new JwtSecurityTokenHandler();
                var token = jwtHandler.ReadToken(tokenRaw) as JwtSecurityToken;

                var data = token.Claims.First(c => c.Type == "data").Value;
                JObject tokenJson = JObject.Parse(data);

                Guid id = Guid.Parse(tokenJson["id"].Value<string>());

                var recoverPassword = new Core.User.RecoverPassword(configuration, context);
                recoverPassword.update(id, newPassword);

                return Ok("Update password success");

            } catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public IActionResult postLogin(JObject json)
        {
            if (json["email"] == null || 
                json["password"] == null)
            {
                string message = "";
                if (json["email"] == null)
                    message += "Email is required.";
                if (json["password"] == null)
                    message += ((json["email"] == null) ? "\n" : "") +
                        "Password is required.";

                return BadRequest(message);
            }

            string email = json["email"].Value<string>();
            string password = json["password"].Value<string>();
            if(password.Length != 64)
                return BadRequest("Password is not valid format.");

            var login = new Core.User.Login(configuration, context);

            try
            {
                string token = login.init(email, password);

                return Ok(token);
            } catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("get")]
        public IActionResult get()
        {
            Guid id = getId();

            var get = new Core.User.Get(context);

            try
            {
                return Ok(get.init(id));
            } catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("update")]
        public IActionResult putUpdate(JObject json)
        {
            if (json["name"] == null || 
                json["phone"] == null)
            {
                string message = "";

                if (json["name"] == null)
                    message += "Name is required.";
                if (json["phone"] == null)
                    message += ((json["name"] == null) ? "\n" : "") +
                        "Phone is required.";

                return BadRequest(message);
            }

            Guid id = getId();
            string name = json["name"].Value<string>();
            string phone = json["phone"].Value<string>();

            var update = new Core.User.Update(configuration, context);
            
            try
            {
                update.basic(id, name, phone);

                return Ok("User update success");
            } catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpPut("update/password")]
        public IActionResult getUpdatePassword(JObject json)
        {
            if (json["oldPassword"] == null || 
                json["newPassword"] == null)
            {
                string message = "";

                if (json["oldPassword"] == null)
                    message += "OldPassword is required.";
                if (json["newPassword"] == null)
                    message += ((json["oldPassword"] == null) ? "\n" : "") +
                        "NewPassword is required.";

                return BadRequest(message);
            }

            string oldPassword = json["oldPassword"].Value<string>();
            string newPassword = json["newPassword"].Value<string>();
            if (oldPassword.Length != 64 ||
                newPassword.Length != 64)
                return BadRequest("OldPassword or NewPassword not valid format.");

            Guid id = getId();

            var update = new Core.User.Update(configuration, context);

            try
            {
                update.password(id, oldPassword, newPassword);

                return Ok("Update password success");
            } catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpGet("update/email/{email}")]
        public IActionResult getUpdateSendEmail(string email) 
        {
            Guid id = getId();

            var update = new Core.User.Update(configuration, context);

            try
            {
                update.sendMail(id, email);

                return Ok("Send mail to confirm update.");
            } catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [AllowAnonymous]
        [HttpPut("update/email")]
        public IActionResult putUpdateEmail(JObject json)
        {
            if (json["token"] == null)
                return BadRequest("Token is required");

            string tokenRaw = json["token"].Value<string>();

            try
            {
                var jwtHandler = new JwtSecurityTokenHandler();
                var token = jwtHandler.ReadToken(tokenRaw) as JwtSecurityToken;

                var data = token.Claims.First(c => c.Type == "data").Value;
                json = JObject.Parse(data);

                Guid id = Guid.Parse(json["id"].Value<string>());
                string email = json["email"].Value<string>();

                var update = new Core.User.Update(configuration, context);
                update.email(id, email);

                return Ok("Update email success");
            } catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
