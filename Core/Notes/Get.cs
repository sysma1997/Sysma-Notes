using Newtonsoft.Json.Linq;
using WebAPI.Core.Shared;
using WebAPI.Models;

namespace WebAPI.Core.Notes
{
    public class Get : ContextRepository
    {
        public Get(Context context) : base(context)
        {
        }

        public JArray list(Guid idUser)
        {
            JArray array = new JArray();

            List<Models.Note> notes = context.Notes.Where(n => n.idUser == idUser).ToList();
            notes.ForEach(note => array.Add(new JObject()
            {
                ["id"] = note.id,
                ["title"] = note.title,
                ["date"] = note.date
            }));

            return array;
        }
        public JObject item(Guid id, Guid idUser)
        {
            Models.Note note = context.Notes.Where(n =>
                n.id == id &&
                n.idUser == idUser).FirstOrDefault();
            if (note == null)
                throw new Exception("Note not found");

            return new JObject()
            {
                ["id"] = note.id,
                ["title"] = note.title,
                ["description"] = note.description,
                ["date"] = note.date
            };
        }
    }
}
