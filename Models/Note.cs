namespace WebAPI.Models
{
    public class Note
    {
        public Guid id { get; set; }
        public Guid idUser { get; set; }
        public string title { get; set; }
        public string description { get; set; }
        public DateTime date { get; set; }

        public User User { get; set; }
    }
}
