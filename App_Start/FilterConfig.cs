using System.Web;
using System.Web.Mvc;

namespace Wsfly.ERP.Web.Shares
{
    public class FilterConfig
    {
        public static void RegisterGlobalFilters(GlobalFilterCollection filters)
        {
            filters.Add(new HandleErrorAttribute());
        }
    }
}
