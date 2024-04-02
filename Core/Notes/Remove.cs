using WebAPI.Core.Shared;
using WebAPI.Models;

namespace WebAPI.Core.Notes
{
    public class Remove : ContextRepository
    {
        public Remove(Context context) : base(context)
        {
        }

        public void init(Guid id, Guid idUser)
        {
            Models.Note note = context.Notes.Where(n => 
                n.id == id && 
                n.idUser == idUser).FirstOrDefault();
            if (note == null)
                throw new Exception("Note not found");

            context.Notes.Remove(note);
            context.SaveChanges();
        }
        public void init(List<Guid> ids, Guid idUser)
        {
            List<Models.Note> notes = new List<Models.Note>();
            for(int i = 0; i < ids.Count; i++)
            {
                Models.Note note = context.Notes.Where(n => 
                    n.id == ids[i] && 
                    n.idUser == idUser).FirstOrDefault();
                if (note == null)
                    continue;

                notes.Add(note);
            }

            context.Notes.RemoveRange(notes);
            context.SaveChanges();
        }
    }
}
