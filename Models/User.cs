namespace WebAPI.Models
{
    public class User
    {
        public Guid id { get; set; }
        public string name { get; set; }
        public string phone { get; set; }
        public string email { get; set; }
        public string password { get; set; }

        public List<Note> Notes { get; } = new();
    }
}
