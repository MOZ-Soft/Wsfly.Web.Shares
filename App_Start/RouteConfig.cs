using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace Wsfly.ERP.Web.Shares
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            routes.MapRoute(
                name: "Wsfly.Home.Action",
                url: "{actionName}",
                defaults: new { controller = "Home", action = "Index", actionName = UrlParameter.Optional }
            );
            routes.MapRoute(
                name: "Wsfly.Home.Full",
                url: "Home/{actionName}",
                defaults: new { controller = "Home", action = "Index", actionName = UrlParameter.Optional }
            );
            routes.MapRoute(
               name: "Default.Action",
               url: "{action}/{id}",
               defaults: new { controller = "Home", action = "Index", id = UrlParameter.Optional }
           );
            routes.MapRoute(
                name: "Default.Full",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "Home", action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}
