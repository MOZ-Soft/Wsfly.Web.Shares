using System;
using System.Web;
using System.IO;
using System.Collections;

namespace Wsfly.ERP.Web.Shares
{
    /// <summary>
    /// Request�ķ�����չ
    /// </summary>
    public static class RequestBaseExtensions
    {
        /// <summary>
        /// �жϵ�ǰҳ���Ƿ���յ���Post����
        /// </summary>
        /// <returns>�Ƿ���յ���Post����</returns>
        public static bool IsPost(this HttpRequestBase request)
        {
            return request.HttpMethod.Equals("POST");
        }
        /// <summary>
        /// �жϵ�ǰҳ���Ƿ���յ���Get����
        /// </summary>
        /// <returns>�Ƿ���յ���Get����</returns>
        public static bool IsGet(this HttpRequestBase request)
        {
            return request.HttpMethod.Equals("GET");
        }
        /// <summary>
        /// ����ָ���ķ�����������Ϣ
        /// </summary>
        /// <param name="strName">������������</param>
        /// <returns>������������Ϣ</returns>
        public static string GetServerString(this HttpRequestBase request, string strName)
        {
            if (request.ServerVariables[strName] == null) return string.Empty;

            return request.ServerVariables[strName].ToString();
        }
        /// <summary>
        /// ������һ��ҳ��ĵ�ַ
        /// </summary>
        /// <returns>��һ��ҳ��ĵ�ַ</returns>
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
        /// �õ���ǰ��������ͷ
        /// </summary>
        /// <returns></returns>
        public static string GetCurrentFullHost(this HttpRequestBase request)
        {
            if (!request.Url.IsDefaultPort)
                return string.Format("{0}:{1}", request.Url.Host, request.Url.Port.ToString());

            return request.Url.Host;
        }
        /// <summary>
        /// �õ�����ͷ
        /// </summary>
        /// <returns></returns>
        public static string GetHost(this HttpRequestBase request)
        {
            return request.Url.Host;
        }
        /// <summary>
        /// ��ȡ��ǰ�����ԭʼ URL(URL ������Ϣ֮��Ĳ���,������ѯ�ַ���(�������))
        /// </summary>
        /// <returns>ԭʼ URL</returns>
        public static string GetRawUrl(this HttpRequestBase request)
        {
            return request.RawUrl;
        }
        /// <summary>
        /// �жϵ�ǰ�����Ƿ�������������
        /// </summary>
        /// <returns>��ǰ�����Ƿ�������������</returns>
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
        /// �ж��Ƿ�����������������
        /// </summary>
        /// <returns>�Ƿ�����������������</returns>
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
        /// ��õ�ǰ����Url��ַ
        /// </summary>
        /// <returns>��ǰ����Url��ַ</returns>
        public static string GetUrl(this HttpRequestBase request)
        {
            return request.Url.ToString();
        }
        /// <summary>
        /// ���ָ��Url������ֵ
        /// </summary>
        /// <param name="strName">Url����</param>
        /// <returns>Url������ֵ</returns>
        public static string GetQueryString(this HttpRequestBase request, string strName)
        {
            return GetQueryString(request, strName, false);
        }
        /// <summary>
        /// ���ָ��Url������ֵ
        /// </summary> 
        /// <param name="strName">Url����</param>
        /// <param name="sqlSafeCheck">�Ƿ����SQL��ȫ���</param>
        /// <returns>Url������ֵ</returns>
        public static string GetQueryString(this HttpRequestBase request, string strName, bool sqlSafeCheck, string defaultUnSafeString = "unsafe string")
        {
            if (request.QueryString[strName] == null)
                return string.Empty;

            if (sqlSafeCheck && !request.QueryString[strName].IsSafeSqlString())
                return defaultUnSafeString;

            return request.QueryString[strName];
        }
        /// <summary>
        /// ��õ�ǰҳ�������
        /// </summary>
        /// <returns>��ǰҳ�������</returns>
        public static string GetPageName(this HttpRequestBase request)
        {
            string[] urlArr = request.Url.AbsolutePath.Split('/');
            return urlArr[urlArr.Length - 1].ToLower();
        }
        /// <summary>
        /// ���ر���Url�������ܸ���
        /// </summary>
        /// <returns></returns>
        public static int GetParamCount(this HttpRequestBase request)
        {
            return request.Form.Count + request.QueryString.Count;
        }


        /// <summary>
        /// ���ָ����������ֵ
        /// </summary>
        /// <param name="strName">������</param>
        /// <returns>��������ֵ</returns>
        public static DateTime GetDateTime(this HttpRequestBase request, string strName, DateTime? dtDefault = null)
        {
            string value = string.Empty;

            if (string.IsNullOrEmpty(GetQueryString(request, strName)))
                value = GetFormString(request, strName);
            else
                value = GetQueryString(request, strName);

            return DataType.DateTime(value, dtDefault);
        }


        //****************************  Request String ���͵�ֵ  ********************************
        /// <summary>
        /// ���ָ����������ֵ
        /// </summary>
        /// <param name="strName">������</param>
        /// <returns>��������ֵ</returns>
        public static string GetFormString(this HttpRequestBase request, string strName, int length = 0)
        {
            ///�õ�����
            string content = GetFormString(request, strName, false);
            //�Ƿ�ض�
            if (length > 0 && !string.IsNullOrEmpty(content))
            {
                content = StringHandler.SubStringsByBytes(content, length);
            }
            //��������
            return content;
        }
        /// <summary>
        /// ���ָ����������ֵ
        /// </summary>
        /// <param name="strName">������</param>
        /// <param name="sqlSafeCheck">�Ƿ����SQL��ȫ���</param>
        /// <param name="unsafeReturnString">���SQL��ȫ���������ʱ���ص�Ĭ��ֵ</param>
        /// <returns>��������ֵ</returns>
        public static string GetFormString(this HttpRequestBase request, string strName, bool sqlSafeCheck, string unsafeReturnString = "unsafe string")
        {
            if (request.Form[strName] == null)
                return string.Empty;

            if (sqlSafeCheck && !request.Form[strName].IsSafeSqlString())
                return unsafeReturnString;

            return HttpContext.Current.Request.Form[strName];
        }
        /// <summary>
        /// ���Url���������ֵ, ���ж�Url�����Ƿ�Ϊ���ַ���, ��ΪTrue�򷵻ر�������ֵ
        /// </summary>
        /// <param name="strName">����</param>
        /// <returns>Url���������ֵ</returns>
        public static string GetString(this HttpRequestBase request, string strName, int length = 0)
        {
            return GetString(request, strName, false, length);
        }
        /// <summary>
        /// ���Url���������ֵ, ���ж�Url�����Ƿ�Ϊ���ַ���, ��ΪTrue�򷵻ر�������ֵ
        /// </summary>
        /// <param name="strName">����</param>
        /// <param name="sqlSafeCheck">�Ƿ����SQL��ȫ���</param>
        /// <returns>Url���������ֵ</returns>
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
        //****************************  Request String ���͵�ֵ  ********************************



        //****************************  Request Bool ���͵�ֵ  ********************************
        /// <summary>
        /// ���ָ��Url������Bool����ֵ
        /// </summary>
        /// <param name="strName">Url����</param>
        /// <returns>Url������Bool����ֵ</returns>
        public static bool GetQueryBool(this HttpRequestBase request, string strName)
        {
            return request.QueryString[strName].ToBool();
        }
        /// <summary>
        /// ���ָ��Url������int����ֵ
        /// </summary>
        /// <param name="strName">Url����</param>
        /// <param name="defValue">ȱʡֵ</param>
        /// <returns>Url������int����ֵ</returns>
        public static bool GetQueryBool(this HttpRequestBase request, string strName, bool defValue)
        {
            return request.QueryString[strName].ToBool(defValue);
        }
        /// <summary>
        /// ���ָ����������int����ֵ
        /// </summary>
        /// <param name="strName">������</param>
        /// <param name="defValue">ȱʡֵ</param>
        /// <returns>��������int����ֵ</returns>
        public static bool GetFormBool(this HttpRequestBase request, string strName, bool defValue)
        {
            return request.Form[strName].ToBool(defValue);
        }
        /// <summary>
        /// ���ָ��Url���������int����ֵ, ���ж�Url�����Ƿ�Ϊȱʡֵ, ��ΪTrue�򷵻ر�������ֵ
        /// </summary>
        /// <param name="strName">Url�������</param>
        /// <param name="defValue">ȱʡֵ</param>
        /// <returns>Url���������int����ֵ</returns>
        public static bool GetBool(this HttpRequestBase request, string strName, bool defValue = false)
        {
            if (GetQueryBool(request, strName, defValue) == defValue)
                return GetFormBool(request, strName, defValue);
            else
                return GetQueryBool(request, strName, defValue);
        }
        /// <summary>
        /// ��ȡ��ѡ��
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
        //****************************  Request Bool ���͵�ֵ  ********************************


        //****************************  Request Int ���͵�ֵ  ********************************
        /// <summary>
        /// ���ָ��Url������int����ֵ
        /// </summary>
        /// <param name="strName">Url����</param>
        /// <returns>Url������int����ֵ</returns>
        public static int GetQueryInt(this HttpRequestBase request, string strName)
        {
            return request.QueryString[strName].ToInt();
        }
        /// <summary>
        /// ���ָ��Url������int����ֵ
        /// </summary>
        /// <param name="strName">Url����</param>
        /// <param name="defValue">ȱʡֵ</param>
        /// <returns>Url������int����ֵ</returns>
        public static int GetQueryInt(this HttpRequestBase request, string strName, int defValue)
        {
            return request.QueryString[strName].ToInt(defValue);
        }
        /// <summary>
        /// ���ָ����������int����ֵ
        /// </summary>
        /// <param name="strName">������</param>
        /// <param name="defValue">ȱʡֵ</param>
        /// <returns>��������int����ֵ</returns>
        public static int GetFormInt(this HttpRequestBase request, string strName, int defValue)
        {
            return request.Form[strName].ToInt(defValue);
        }
        /// <summary>
        /// ���ָ��Url���������int����ֵ, ���ж�Url�����Ƿ�Ϊȱʡֵ, ��ΪTrue�򷵻ر�������ֵ
        /// </summary>
        /// <param name="strName">Url�������</param>
        /// <param name="defValue">ȱʡֵ</param>
        /// <returns>Url���������int����ֵ</returns>
        public static int GetInt(this HttpRequestBase request, string strName, int defValue = 0)
        {
            if (GetQueryInt(request, strName, defValue) == defValue)
                return GetFormInt(request, strName, defValue);
            else
                return GetQueryInt(request, strName, defValue);
        }
        //****************************  Request Int ���͵�ֵ  ********************************




        //****************************  Request Long ���͵�ֵ  ********************************
        /// <summary>
        /// ���ָ��Url������Long����ֵ
        /// </summary>
        /// <param name="strName">Url����</param>
        /// <returns>Url������Long����ֵ</returns>
        public static long GetQueryLong(this HttpRequestBase request, string strName)
        {

            return request.QueryString[strName].ToInt64(0);
        }
        /// <summary>
        /// ���ָ��Url������Long����ֵ
        /// </summary>
        /// <param name="strName">Url����</param>
        /// <param name="defValue">ȱʡֵ</param>
        /// <returns>Url������int����ֵ</returns>
        public static long GetQueryLong(this HttpRequestBase request, string strName, long defValue)
        {
            return request.QueryString[strName].ToInt64(defValue);
        }
        /// <summary>
        /// ���ָ����������Long����ֵ
        /// </summary>
        /// <param name="strName">������</param>
        /// <param name="defValue">ȱʡֵ</param>
        /// <returns>��������Long����ֵ</returns>
        public static long GetFormLong(this HttpRequestBase request, string strName, long defValue)
        {
            return request.Form[strName].ToInt64(defValue);
        }
        /// <summary>
        /// ���ָ��Url���������Long����ֵ, ���ж�Url�����Ƿ�Ϊȱʡֵ, ��ΪTrue�򷵻ر�������ֵ
        /// </summary>
        /// <param name="strName">Url�������</param>
        /// <param name="defValue">ȱʡֵ</param>
        /// <returns>Url���������Long����ֵ</returns>
        public static long GetLong(this HttpRequestBase request, string strName, long defValue = 0)
        {
            if (GetQueryLong(request, strName, defValue) == defValue)
                return GetFormLong(request, strName, defValue);
            else
                return GetQueryLong(request, strName, defValue);
        }
        //****************************  Request Long ���͵�ֵ  ********************************







        //****************************  Request Float ���͵�ֵ  ********************************

        /// <summary>
        /// ���ָ��Url������float����ֵ
        /// </summary>
        /// <param name="strName">Url����</param>
        /// <param name="defValue">ȱʡֵ</param>
        /// <returns>Url������int����ֵ</returns>
        public static float GetQueryFloat(this HttpRequestBase request, string strName)
        {
            return request.QueryString[strName].ToFloat(0);
        }
        /// <summary>
        /// ���ָ��Url������float����ֵ
        /// </summary>
        /// <param name="strName">Url����</param>
        /// <param name="defValue">ȱʡֵ</param>
        /// <returns>Url������int����ֵ</returns>
        public static float GetQueryFloat(this HttpRequestBase request, string strName, float defValue)
        {
            return request.QueryString[strName].ToFloat(defValue);
        }
        /// <summary>
        /// ���ָ����������float����ֵ
        /// </summary>
        /// <param name="strName">������</param>
        /// <param name="defValue">ȱʡֵ</param>
        /// <returns>��������float����ֵ</returns>
        public static float GetFormFloat(this HttpRequestBase request, string strName, float defValue)
        {
            return request.Form[strName].ToFloat(defValue);
        }
        /// <summary>
        /// ���ָ��Url���������float����ֵ, ���ж�Url�����Ƿ�Ϊȱʡֵ, ��ΪTrue�򷵻ر�������ֵ
        /// </summary>
        /// <param name="strName">Url�������</param>
        /// <param name="defValue">ȱʡֵ</param>
        /// <returns>Url���������int����ֵ</returns>
        public static float GetFloat(this HttpRequestBase request, string strName, float defValue = 0)
        {
            if (GetQueryFloat(request, strName, defValue) == defValue)
                return GetFormFloat(request, strName, defValue);
            else
                return GetQueryFloat(request, strName, defValue);
        }
        //****************************  Request Float ���͵�ֵ  ********************************



        //****************************  Request Decimal ���͵�ֵ  ********************************

        /// <summary>
        /// ���ָ��Url������float����ֵ
        /// </summary>
        /// <param name="strName">Url����</param>
        /// <param name="defValue">ȱʡֵ</param>
        /// <returns>Url������int����ֵ</returns>
        public static decimal GetQueryDecimal(this HttpRequestBase request, string strName)
        {
            return request.QueryString[strName].ToDecimal(0);
        }
        /// <summary>
        /// ���ָ��Url������float����ֵ
        /// </summary>
        /// <param name="strName">Url����</param>
        /// <param name="defValue">ȱʡֵ</param>
        /// <returns>Url������int����ֵ</returns>
        public static decimal GetQueryDecimal(this HttpRequestBase request, string strName, decimal defValue)
        {
            return request.QueryString[strName].ToDecimal(defValue);
        }
        /// <summary>
        /// ���ָ����������float����ֵ
        /// </summary>
        /// <param name="strName">������</param>
        /// <param name="defValue">ȱʡֵ</param>
        /// <returns>��������float����ֵ</returns>
        public static decimal GetFormDecimal(this HttpRequestBase request, string strName, decimal defValue)
        {
            return request.Form[strName].ToDecimal(defValue);
        }
        /// <summary>
        /// ���ָ��Url���������float����ֵ, ���ж�Url�����Ƿ�Ϊȱʡֵ, ��ΪTrue�򷵻ر�������ֵ
        /// </summary>
        /// <param name="strName">Url�������</param>
        /// <param name="defValue">ȱʡֵ</param>
        /// <returns>Url���������int����ֵ</returns>
        public static decimal GetDecimal(this HttpRequestBase request, string strName, decimal defValue = 0)
        {
            if (GetQueryDecimal(request, strName, defValue) == defValue)
                return GetFormDecimal(request, strName, defValue);
            else
                return GetQueryDecimal(request, strName, defValue);
        }
        //****************************  Request Decimal ���͵�ֵ  ********************************



        //****************************  Request �ؼ� ��ֵ  ********************************
        /// <summary>
        /// ��ѡ���״̬ �Ƿ�ѡ��
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
        //****************************  Request �ؼ� ��ֵ  ********************************


        /// <summary>
        /// ��õ�ǰҳ��ͻ��˵�IP
        /// </summary>
        /// <returns>��ǰҳ��ͻ��˵�IP</returns>
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
