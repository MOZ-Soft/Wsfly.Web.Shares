using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Wsfly.ERP.Web.Shares.Controllers
{
    public class HomeController : Controller
    {
        public static string _rootDir = AppDomain.CurrentDomain.BaseDirectory;

        /// <summary>
        /// 首页
        /// </summary>
        /// <returns></returns>
        public ActionResult Index(string actionName)
        {
            //控制器名称
            string controllerName = "Home";
            if (string.IsNullOrWhiteSpace(actionName)) actionName = "Index";


            //================进入登陆页、登陆提交==================//
            if (actionName.ToLower() == "login") return View("Login");
            if (actionName.ToLower() == "loginsubmit") return LoginSubmit();

            //================验证判断==================//
            bool authRequired = AppConfig.GetBoolean("是否需要登陆");
            if (authRequired)
            {
                if (Session["身份验证通过"] == null)
                {
                    return View("Login");
                }
            }

            //================进入首页==================//
            if (actionName.ToLower() == "index") return View();

            //===============进入独立方法================//
            try
            {
                //是否有独立方法
                Type type = this.GetType();
                var method = type.GetMethods().Where(p => p.Name == actionName);
                if (method != null && method.Count() > 0) return (ActionResult)method.First().Invoke(this, null);
            }
            catch (Exception ex) { }

            //================入口分发==================//

            //是否有真实文件
            string viewPath = AppDomain.CurrentDomain.BaseDirectory + "Views\\" + controllerName + "\\" + actionName + ".cshtml";
            if (System.IO.File.Exists(viewPath)) return View(actionName);

            //如果没有模版则返回首页
            return Redirect("/Home/Index");
        }

        /// <summary>
        /// 登陆
        /// </summary>
        /// <returns></returns>
        public ActionResult LoginSubmit()
        {
            try
            {
                string pwd = AppConfig.GetString("动态验证规则");
                pwd = DateTime.Now.ToString(pwd);

                string input = Request.GetString("pwd");
                if (input != pwd) return new JsonResultExt(false, "密码不正确！");

                //身份验证成功
                Session["身份验证通过"] = true;

                return new JsonResultExt(true);
            }
            catch (Exception ex)
            {
            }

            return new JsonResultExt(false, "登陆失败");
        }
    }
}