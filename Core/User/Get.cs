using Newtonsoft.Json.Linq;
using WebAPI.Core.Shared;
using WebAPI.Models;

namespace WebAPI.Core.User
{
    public class Get : ContextRepository
    {
        public Get(Context context) : base(context)
        {
        }

        public JObject init(Guid id)
        {
            Models.User user = context.Users.Where(u => u.id == id).FirstOrDefault();
            if (user == null)
                throw new Exception("User not found");

            JObject json = new JObject()
            {
                ["id"] = id,
                ["name"] = user.name,
                ["phone"] = user.phone,
                ["email"] = user.email
            };

            return json;
        }
    }
}
