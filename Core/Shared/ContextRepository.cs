namespace WebAPI.Core.Shared
{
    public class ContextRepository
    {
        protected IConfiguration configuration;
        protected Models.Context context;

        public ContextRepository(Models.Context context)
        {
            this.context = context;
        }
        public ContextRepository(IConfiguration configuration, Models.Context context)
        {
            this.configuration = configuration;
            this.context = context;
        }
    }
}
