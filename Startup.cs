using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(Wsfly.ERP.Web.Shares.Startup))]
namespace Wsfly.ERP.Web.Shares
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {

        }
    }
}
