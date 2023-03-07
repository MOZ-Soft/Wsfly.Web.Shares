using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;

namespace Wsfly.ERP.Web.Shares
{
    public class MvcApplication : System.Web.HttpApplication
    {
        /// <summary>
        /// 网站应用启动
        /// </summary>
        protected void Application_Start()
        {
            bool inited = AppConfig.GetBoolean("是否初始化");
            if (!inited)
            {
                AppConfig.Set("站点名称", "文件共享中心");//站点名称
                AppConfig.Set("是否需要登陆", true);//是否需要登陆
                AppConfig.Set("动态验证规则", "MMdd-888888");//日期密码规则或直接设置密码
                AppConfig.Set("是否初始化", true, true);
            }

            AreaRegistration.RegisterAllAreas();
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
        }
    }
}
