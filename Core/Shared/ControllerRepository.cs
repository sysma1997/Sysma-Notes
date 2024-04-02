using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using WebAPI.Models;

namespace WebAPI.Core.Shared
{
    [ApiController]
    [Authorize]
    public class ControllerRepository : ControllerBase
    {
        protected readonly IConfiguration configuration;
        protected Context context;

        public ControllerRepository(IConfiguration configuration,
            Context context)
        {
            this.configuration = configuration;
            this.context = context;
        }

        protected Guid getId()
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            if (identity == null)
                return Guid.Empty;

            return Guid.Parse(identity.FindFirst("id").Value);
        }
        protected string getName()
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            if (identity == null)
                return null;

            return identity.FindFirst("name").Value;
        }
        protected string getEmail()
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            if (identity == null)
                return null;

            return identity.FindFirst("email").Value;
        }
    }
}
