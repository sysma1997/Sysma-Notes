using WebAPI.Core.Shared;
using WebAPI.Models;

namespace WebAPI.Core.Notes
{
    public class Add : ContextRepository
    {
        public Add(Context context) : base(context)
        {
        }

        public void init(Models.Note note)
        {
            context.Notes.Add(note);
            context.SaveChanges();
        }
    }
}
