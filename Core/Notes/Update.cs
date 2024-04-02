using WebAPI.Core.Shared;
using WebAPI.Models;

namespace WebAPI.Core.Notes
{
    public class Update : ContextRepository
    {
        public Update(Context context) : base(context)
        {
        }

        public void init(Models.Note noteUpdate)
        {
            Models.Note note = context.Notes.Where(n => 
                n.id == noteUpdate.id && 
                n.idUser == noteUpdate.idUser).FirstOrDefault();
            if (note == null)
                throw new Exception("Note not found");

            note.title = noteUpdate.title;
            note.description = noteUpdate.description;
            note.date = noteUpdate.date;

            context.SaveChanges();
        }
    }
}
