using System;
using System.Web;
using System.IO;
using System.Collections;

namespace Wsfly.ERP.Web.Shares
{
    /// <summary>
    /// Request的方法扩展
    /// </summary>
    public static class RequestBaseExtensions
    {
        /// <summary>
        /// 判断当前页面是否接收到了Post请求
        /// </summary>
        /// <returns>是否接收到了Post请求</returns>
        public static bool IsPost(this HttpRequestBase request)
        {
            return request.HttpMethod.Equals("POST");
        }
        /// <summary>
        /// 判断当前页面是否接收到了Get请求
        /// </summary>
        /// <returns>是否接收到了Get请求</returns>
        public static bool IsGet(this HttpRequestBase request)
        {
            return request.HttpMethod.Equals("GET");
        }
        /// <summary>
        /// 返回指定的服务器变量信息
        /// </summary>
        /// <param name="strName">服务器变量名</param>
        /// <returns>服务器变量信息</returns>
        public static string GetServerString(this HttpRequestBase request, string strName)
        {
            if (request.ServerVariables[strName] == null) return string.Empty;

            return request.ServerVariables[strName].ToString();
        }
        /// <summary>
        /// 返回上一个页面的地址
        /// </summary>
        /// <returns>上一个页面的地址</returns>
        public static string GetUrlReferrer(this HttpRequestBase request)
        {
            string retVal = null;

            try
            {
                retVal = request.UrlReferrer.ToString();
            }
            catch { }

            if (retVal == null) return string.Empty;

            return retVal;
        }
        /// <summary>
        /// 得到当前完整主机头
        /// </summary>
        /// <returns></returns>
        public static string GetCurrentFullHost(this HttpRequestBase request)
        {
            if (!request.Url.IsDefaultPort)
                return string.Format("{0}:{1}", request.Url.Host, request.Url.Port.ToString());

            return request.Url.Host;
        }
        /// <summary>
        /// 得到主机头
        /// </summary>
        /// <returns></returns>
        public static string GetHost(this HttpRequestBase request)
        {
            return request.Url.Host;
        }
        /// <summary>
        /// 获取当前请求的原始 URL(URL 中域信息之后的部分,包括查询字符串(如果存在))
        /// </summary>
        /// <returns>原始 URL</returns>
        public static string GetRawUrl(this HttpRequestBase request)
        {
            return request.RawUrl;
        }
        /// <summary>
        /// 判断当前访问是否来自浏览器软件
        /// </summary>
        /// <returns>当前访问是否来自浏览器软件</returns>
        public static bool IsBrowserGet(this HttpRequestBase request)
        {
            string[] BrowserName = { "ie", "opera", "netscape", "mozilla", "konqueror", "firefox" };
            string curBrowser = request.Browser.Type.ToLower();
            for (int i = 0; i < BrowserName.Length; i++)
            {
                if (curBrowser.IndexOf(BrowserName[i]) >= 0)
                    return true;
            }
            return false;
        }
        /// <summary>
        /// 判断是否来自搜索引擎链接
        /// </summary>
        /// <returns>是否来自搜索引擎链接</returns>
        public static bool IsSearchEnginesGet(this HttpRequestBase request)
        {
            if (request.UrlReferrer == null)
                return false;

            string[] SearchEngine = { "google", "yahoo", "msn", "baidu", "sogou", "sohu", "sina", "163", "lycos", "tom", "yisou", "iask", "soso", "gougou", "zhongsou" };
            string tmpReferrer = request.UrlReferrer.ToString().ToLower();
            for (int i = 0; i < SearchEngine.Length; i++)
            {
                if (tmpReferrer.IndexOf(SearchEngine[i]) >= 0)
                    return true;
            }
            return false;
        }
        /// <summary>
        /// 获得当前完整Url地址
        /// </summary>
        /// <returns>当前完整Url地址</returns>
        public static string GetUrl(this HttpRequestBase request)
        {
            return request.Url.ToString();
        }
        /// <summary>
        /// 获得指定Url参数的值
        /// </summary>
        /// <param name="strName">Url参数</param>
        /// <returns>Url参数的值</returns>
        public static string GetQueryString(this HttpRequestBase request, string strName)
        {
            return GetQueryString(request, strName, false);
        }
        /// <summary>
        /// 获得指定Url参数的值
        /// </summary> 
        /// <param name="strName">Url参数</param>
        /// <param name="sqlSafeCheck">是否进行SQL安全检查</param>
        /// <returns>Url参数的值</returns>
        public static string GetQueryString(this HttpRequestBase request, string strName, bool sqlSafeCheck, string defaultUnSafeString = "unsafe string")
        {
            if (request.QueryString[strName] == null)
                return string.Empty;

            if (sqlSafeCheck && !request.QueryString[strName].IsSafeSqlString())
                return defaultUnSafeString;

            return request.QueryString[strName];
        }
        /// <summary>
        /// 获得当前页面的名称
        /// </summary>
        /// <returns>当前页面的名称</returns>
        public static string GetPageName(this HttpRequestBase request)
        {
            string[] urlArr = request.Url.AbsolutePath.Split('/');
            return urlArr[urlArr.Length - 1].ToLower();
        }
        /// <summary>
        /// 返回表单或Url参数的总个数
        /// </summary>
        /// <returns></returns>
        public static int GetParamCount(this HttpRequestBase request)
        {
            return request.Form.Count + request.QueryString.Count;
        }


        /// <summary>
        /// 获得指定表单参数的值
        /// </summary>
        /// <param name="strName">表单参数</param>
        /// <returns>表单参数的值</returns>
        public static DateTime GetDateTime(this HttpRequestBase request, string strName, DateTime? dtDefault = null)
        {
            string value = string.Empty;

            if (string.IsNullOrEmpty(GetQueryString(request, strName)))
                value = GetFormString(request, strName);
            else
                value = GetQueryString(request, strName);

            return DataType.DateTime(value, dtDefault);
        }


        //****************************  Request String 类型的值  ********************************
        /// <summary>
        /// 获得指定表单参数的值
        /// </summary>
        /// <param name="strName">表单参数</param>
        /// <returns>表单参数的值</returns>
        public static string GetFormString(this HttpRequestBase request, string strName, int length = 0)
        {
            ///得到内容
            string content = GetFormString(request, strName, false);
            //是否截断
            if (length > 0 && !string.IsNullOrEmpty(content))
            {
                content = StringHandler.SubStringsByBytes(content, length);
            }
            //返回内容
            return content;
        }
        /// <summary>
        /// 获得指定表单参数的值
        /// </summary>
        /// <param name="strName">表单参数</param>
        /// <param name="sqlSafeCheck">是否进行SQL安全检查</param>
        /// <param name="unsafeReturnString">如果SQL安全检查有问题时返回的默认值</param>
        /// <returns>表单参数的值</returns>
        public static string GetFormString(this HttpRequestBase request, string strName, bool sqlSafeCheck, string unsafeReturnString = "unsafe string")
        {
            if (request.Form[strName] == null)
                return string.Empty;

            if (sqlSafeCheck && !request.Form[strName].IsSafeSqlString())
                return unsafeReturnString;

            return HttpContext.Current.Request.Form[strName];
        }
        /// <summary>
        /// 获得Url或表单参数的值, 先判断Url参数是否为空字符串, 如为True则返回表单参数的值
        /// </summary>
        /// <param name="strName">参数</param>
        /// <returns>Url或表单参数的值</returns>
        public static string GetString(this HttpRequestBase request, string strName, int length = 0)
        {
            return GetString(request, strName, false, length);
        }
        /// <summary>
        /// 获得Url或表单参数的值, 先判断Url参数是否为空字符串, 如为True则返回表单参数的值
        /// </summary>
        /// <param name="strName">参数</param>
        /// <param name="sqlSafeCheck">是否进行SQL安全检查</param>
        /// <returns>Url或表单参数的值</returns>
        public static string GetString(this HttpRequestBase request, string strName, bool sqlSafeCheck, int length = 0)
        {
            string value = string.Empty;

            if (string.IsNullOrEmpty(GetQueryString(request, strName)))
                value = GetFormString(request, strName, sqlSafeCheck);
            else
                value = GetQueryString(request, strName, sqlSafeCheck);

            if (length > 0 && !string.IsNullOrEmpty(value))
            {
                value = StringHandler.SubStringsByBytes(value, length);
            }

            return value;
        }
        //****************************  Request String 类型的值  ********************************



        //****************************  Request Bool 类型的值  ********************************
        /// <summary>
        /// 获得指定Url参数的Bool类型值
        /// </summary>
        /// <param name="strName">Url参数</param>
        /// <returns>Url参数的Bool类型值</returns>
        public static bool GetQueryBool(this HttpRequestBase request, string strName)
        {
            return request.QueryString[strName].ToBool();
        }
        /// <summary>
        /// 获得指定Url参数的int类型值
        /// </summary>
        /// <param name="strName">Url参数</param>
        /// <param name="defValue">缺省值</param>
        /// <returns>Url参数的int类型值</returns>
        public static bool GetQueryBool(this HttpRequestBase request, string strName, bool defValue)
        {
            return request.QueryString[strName].ToBool(defValue);
        }
        /// <summary>
        /// 获得指定表单参数的int类型值
        /// </summary>
        /// <param name="strName">表单参数</param>
        /// <param name="defValue">缺省值</param>
        /// <returns>表单参数的int类型值</returns>
        public static bool GetFormBool(this HttpRequestBase request, string strName, bool defValue)
        {
            return request.Form[strName].ToBool(defValue);
        }
        /// <summary>
        /// 获得指定Url或表单参数的int类型值, 先判断Url参数是否为缺省值, 如为True则返回表单参数的值
        /// </summary>
        /// <param name="strName">Url或表单参数</param>
        /// <param name="defValue">缺省值</param>
        /// <returns>Url或表单参数的int类型值</returns>
        public static bool GetBool(this HttpRequestBase request, string strName, bool defValue = false)
        {
            if (GetQueryBool(request, strName, defValue) == defValue)
                return GetFormBool(request, strName, defValue);
            else
                return GetQueryBool(request, strName, defValue);
        }
        /// <summary>
        /// 获取复选框
        /// </summary>
        /// <param name="request"></param>
        /// <param name="strName"></param>
        /// <param name="defValue"></param>
        /// <returns></returns>
        public static bool GetCheckBox(this HttpRequestBase request, string strName, bool defValue = false)
        {
            string text = GetString(request, strName, false);

            if (text.ToLower().Equals("on"))
            {
                return true;
            }

            return false;
        }
        //****************************  Request Bool 类型的值  ********************************


        //****************************  Request Int 类型的值  ********************************
        /// <summary>
        /// 获得指定Url参数的int类型值
        /// </summary>
        /// <param name="strName">Url参数</param>
        /// <returns>Url参数的int类型值</returns>
        public static int GetQueryInt(this HttpRequestBase request, string strName)
        {
            return request.QueryString[strName].ToInt();
        }
        /// <summary>
        /// 获得指定Url参数的int类型值
        /// </summary>
        /// <param name="strName">Url参数</param>
        /// <param name="defValue">缺省值</param>
        /// <returns>Url参数的int类型值</returns>
        public static int GetQueryInt(this HttpRequestBase request, string strName, int defValue)
        {
            return request.QueryString[strName].ToInt(defValue);
        }
        /// <summary>
        /// 获得指定表单参数的int类型值
        /// </summary>
        /// <param name="strName">表单参数</param>
        /// <param name="defValue">缺省值</param>
        /// <returns>表单参数的int类型值</returns>
        public static int GetFormInt(this HttpRequestBase request, string strName, int defValue)
        {
            return request.Form[strName].ToInt(defValue);
        }
        /// <summary>
        /// 获得指定Url或表单参数的int类型值, 先判断Url参数是否为缺省值, 如为True则返回表单参数的值
        /// </summary>
        /// <param name="strName">Url或表单参数</param>
        /// <param name="defValue">缺省值</param>
        /// <returns>Url或表单参数的int类型值</returns>
        public static int GetInt(this HttpRequestBase request, string strName, int defValue = 0)
        {
            if (GetQueryInt(request, strName, defValue) == defValue)
                return GetFormInt(request, strName, defValue);
            else
                return GetQueryInt(request, strName, defValue);
        }
        //****************************  Request Int 类型的值  ********************************




        //****************************  Request Long 类型的值  ********************************
        /// <summary>
        /// 获得指定Url参数的Long类型值
        /// </summary>
        /// <param name="strName">Url参数</param>
        /// <returns>Url参数的Long类型值</returns>
        public static long GetQueryLong(this HttpRequestBase request, string strName)
        {

            return request.QueryString[strName].ToInt64(0);
        }
        /// <summary>
        /// 获得指定Url参数的Long类型值
        /// </summary>
        /// <param name="strName">Url参数</param>
        /// <param name="defValue">缺省值</param>
        /// <returns>Url参数的int类型值</returns>
        public static long GetQueryLong(this HttpRequestBase request, string strName, long defValue)
        {
            return request.QueryString[strName].ToInt64(defValue);
        }
        /// <summary>
        /// 获得指定表单参数的Long类型值
        /// </summary>
        /// <param name="strName">表单参数</param>
        /// <param name="defValue">缺省值</param>
        /// <returns>表单参数的Long类型值</returns>
        public static long GetFormLong(this HttpRequestBase request, string strName, long defValue)
        {
            return request.Form[strName].ToInt64(defValue);
        }
        /// <summary>
        /// 获得指定Url或表单参数的Long类型值, 先判断Url参数是否为缺省值, 如为True则返回表单参数的值
        /// </summary>
        /// <param name="strName">Url或表单参数</param>
        /// <param name="defValue">缺省值</param>
        /// <returns>Url或表单参数的Long类型值</returns>
        public static long GetLong(this HttpRequestBase request, string strName, long defValue = 0)
        {
            if (GetQueryLong(request, strName, defValue) == defValue)
                return GetFormLong(request, strName, defValue);
            else
                return GetQueryLong(request, strName, defValue);
        }
        //****************************  Request Long 类型的值  ********************************







        //****************************  Request Float 类型的值  ********************************

        /// <summary>
        /// 获得指定Url参数的float类型值
        /// </summary>
        /// <param name="strName">Url参数</param>
        /// <param name="defValue">缺省值</param>
        /// <returns>Url参数的int类型值</returns>
        public static float GetQueryFloat(this HttpRequestBase request, string strName)
        {
            return request.QueryString[strName].ToFloat(0);
        }
        /// <summary>
        /// 获得指定Url参数的float类型值
        /// </summary>
        /// <param name="strName">Url参数</param>
        /// <param name="defValue">缺省值</param>
        /// <returns>Url参数的int类型值</returns>
        public static float GetQueryFloat(this HttpRequestBase request, string strName, float defValue)
        {
            return request.QueryString[strName].ToFloat(defValue);
        }
        /// <summary>
        /// 获得指定表单参数的float类型值
        /// </summary>
        /// <param name="strName">表单参数</param>
        /// <param name="defValue">缺省值</param>
        /// <returns>表单参数的float类型值</returns>
        public static float GetFormFloat(this HttpRequestBase request, string strName, float defValue)
        {
            return request.Form[strName].ToFloat(defValue);
        }
        /// <summary>
        /// 获得指定Url或表单参数的float类型值, 先判断Url参数是否为缺省值, 如为True则返回表单参数的值
        /// </summary>
        /// <param name="strName">Url或表单参数</param>
        /// <param name="defValue">缺省值</param>
        /// <returns>Url或表单参数的int类型值</returns>
        public static float GetFloat(this HttpRequestBase request, string strName, float defValue = 0)
        {
            if (GetQueryFloat(request, strName, defValue) == defValue)
                return GetFormFloat(request, strName, defValue);
            else
                return GetQueryFloat(request, strName, defValue);
        }
        //****************************  Request Float 类型的值  ********************************



        //****************************  Request Decimal 类型的值  ********************************

        /// <summary>
        /// 获得指定Url参数的float类型值
        /// </summary>
        /// <param name="strName">Url参数</param>
        /// <param name="defValue">缺省值</param>
        /// <returns>Url参数的int类型值</returns>
        public static decimal GetQueryDecimal(this HttpRequestBase request, string strName)
        {
            return request.QueryString[strName].ToDecimal(0);
        }
        /// <summary>
        /// 获得指定Url参数的float类型值
        /// </summary>
        /// <param name="strName">Url参数</param>
        /// <param name="defValue">缺省值</param>
        /// <returns>Url参数的int类型值</returns>
        public static decimal GetQueryDecimal(this HttpRequestBase request, string strName, decimal defValue)
        {
            return request.QueryString[strName].ToDecimal(defValue);
        }
        /// <summary>
        /// 获得指定表单参数的float类型值
        /// </summary>
        /// <param name="strName">表单参数</param>
        /// <param name="defValue">缺省值</param>
        /// <returns>表单参数的float类型值</returns>
        public static decimal GetFormDecimal(this HttpRequestBase request, string strName, decimal defValue)
        {
            return request.Form[strName].ToDecimal(defValue);
        }
        /// <summary>
        /// 获得指定Url或表单参数的float类型值, 先判断Url参数是否为缺省值, 如为True则返回表单参数的值
        /// </summary>
        /// <param name="strName">Url或表单参数</param>
        /// <param name="defValue">缺省值</param>
        /// <returns>Url或表单参数的int类型值</returns>
        public static decimal GetDecimal(this HttpRequestBase request, string strName, decimal defValue = 0)
        {
            if (GetQueryDecimal(request, strName, defValue) == defValue)
                return GetFormDecimal(request, strName, defValue);
            else
                return GetQueryDecimal(request, strName, defValue);
        }
        //****************************  Request Decimal 类型的值  ********************************



        //****************************  Request 控件 的值  ********************************
        /// <summary>
        /// 复选框的状态 是否选中
        /// </summary>
        /// <param name="request"></param>
        /// <param name="strName"></param>
        /// <param name="defValue"></param>
        /// <returns></returns>
        public static bool CheckBoxState(this HttpRequestBase request, string strName, bool defValue = false)
        {
            string value = request.Form[strName];

            if (string.IsNullOrEmpty(value)) return defValue;

            if (value.ToString().Equals("on"))
            {
                return true;
            }

            return false;
        }
        //****************************  Request 控件 的值  ********************************


        /// <summary>
        /// 获得当前页面客户端的IP
        /// </summary>
        /// <returns>当前页面客户端的IP</returns>
        public static string GetIP(this HttpRequestBase request)
        {
            string result = request.ServerVariables["REMOTE_ADDR"];
            if (string.IsNullOrEmpty(result))
                result = request.ServerVariables["HTTP_X_FORWARDED_FOR"];

            if (string.IsNullOrEmpty(result))
                result = request.UserHostAddress;

            if (string.IsNullOrEmpty(result) || !result.IsIP())
                return "127.0.0.1";

            return result;
        }
    }
}
