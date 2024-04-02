using System.Net;
using System.Net.Mail;

namespace WebAPI.Core.Shared
{
    public class Gmail
    {
        private string user;
        private SmtpClient smtp;

        public Gmail(IConfiguration configuration)
        {
            user = configuration["Gmail:User"];

            smtp = new SmtpClient()
            {
                Port = 587, 
                Host = "smtp.gmail.com",
                Credentials = new NetworkCredential(user,
                    configuration["Gmail:Password"]),
                EnableSsl = true
            };
        }

        public void send(string email, 
            string subject, 
            string body)
        {
            var mailMessage = new MailMessage()
            {
                From = new MailAddress(user),
                Subject = subject,
                Body = body,
                IsBodyHtml = true
            };
            mailMessage.To.Add(email);

            smtp.Send(mailMessage);
        }
    }
}
