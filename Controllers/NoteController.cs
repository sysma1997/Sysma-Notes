using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using WebAPI.Core.Shared;
using WebAPI.Models;

namespace WebAPI.Controllers
{
    [Route("api/note")]
    public class NoteController : ControllerRepository
    {
        public NoteController(IConfiguration configuration, Context context) : base(configuration, context)
        {
        }

        [HttpPost("add")]
        public IActionResult postAdd(JObject json)
        {
            if (json["title"] == null ||
                json["description"] == null)
            {
                string message = "";
                int jumpBreak = 0;

                if (json["title"] == null)
                {
                    message += "Title is required.";
                    jumpBreak++;
                }
                if (json["description"] == null)
                    message += ((jumpBreak++ > 0) ? "\n" : "") +
                        "Description is required.";

                return BadRequest(message);
            }

            Models.Note note = new Note();
            note.idUser = getId();
            note.id = (json["id"] != null) ? Guid.Parse(json["id"].Value<string>()) : Guid.NewGuid();
            note.title = json["title"].Value<string>();
            note.description = json["description"].Value<string>();
            note.date = (json["date"] != null) ? json["date"].Value<DateTime>() : DateTime.UtcNow;

            var add = new Core.Notes.Add(context);

            try
            {
                add.init(note);

                return StatusCode(201);
            } catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("update")]
        public IActionResult putUpdate(JObject json)
        {
            if (json["id"] == null ||
                json["title"] == null ||
                json["description"] == null)
            {
                string message = "";
                int jumpBreak = 0;

                if (json["id"] == null)
                {
                    message += "Id is required.";
                    jumpBreak++;
                }
                if (json["title"] == null)
                    message += ((jumpBreak++ > 0) ? "\n" : "") +
                        "Title is required.";
                if (json["description"] == null)
                    message += ((jumpBreak > 0) ? "\n" : "") +
                        "Description is required.";

                return BadRequest(message);
            }

            Models.Note note = new Note();
            note.idUser = getId();
            note.id = Guid.Parse(json["id"].Value<string>());
            note.title = json["title"].Value<string>();
            note.description = json["description"].Value<string>();
            if (json["date"] != null)
                note.date = json["date"].Value<DateTime>();
            else note.date = DateTime.UtcNow;

            var update = new Core.Notes.Update(context);

            try
            {
                update.init(note);

                return Ok("Note update success");
            } catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("remove/{id:guid}")]
        public IActionResult deleteRemove(Guid id)
        {
            Guid idUser = getId();

            var remove = new Core.Notes.Remove(context);

            try
            {
                remove.init(id, idUser);

                return Ok("Note remove success");
            } catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpDelete("remove")]
        public IActionResult deleteRemoveList(JArray array)
        {
            List<Guid> ids = new List<Guid>();
            for(int i = 0; i < array.Count; i++)
                ids.Add(Guid.Parse(array[i].Value<string>()));

            Guid idUser = getId();

            var remove = new Core.Notes.Remove(context);

            try
            {
                remove.init(ids, idUser);

                return Ok("Notes remove success");
            } catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("get/list")]
        public IActionResult getList()
        {
            Guid idUser = getId();

            var get = new Core.Notes.Get(context);

            try
            {
                return Ok(get.list(idUser));
            } catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpGet("get/item/{id:guid}")]
        public IActionResult getItem(Guid id)
        {
            Guid idUser = getId();

            var get = new Core.Notes.Get(context);

            try
            {
                return Ok(get.item(id, idUser));
            } catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
