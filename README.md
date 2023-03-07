# Wsfly.Web.Shares

Visual Studio 2019

共享文件站点源码

将要共享的文件放入文件夹：/_Shares/

打开站点即访问共享的目录；

可设置密码进入，在配置文件中（是否需要登陆、动态验证规则）设置：/Cnf/Wsfly.App.config

配置文件：
{
  "版权归属": "wsfly.com",
  "站点名称": "文件共享中心",
  "是否需要登陆": false,
  "动态验证规则": "MMdd-888888",
  "是否初始化": true
}

动态验证规则方法主要根据日期生成动态规则：

string pwd = AppConfig.GetString("动态验证规则");

pwd = DateTime.Now.ToString(pwd);

string input = Request.GetString("pwd");

if (input != pwd) return new JsonResultExt(false, "密码不正确！");