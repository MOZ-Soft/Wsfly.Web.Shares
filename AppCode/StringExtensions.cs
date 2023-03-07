using System;
using System.Diagnostics;
using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;
using System.Web;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Security;
using System.Security.Permissions;
using System.Linq;

namespace Wsfly.ERP.Web.Shares
{
    /// <summary>
    /// 扩展字符串方法
    /// </summary>
    public static class StringExtensions
    {
        private static readonly Regex WebUrlExpression = new Regex(@"(http|https)://([\w-]+\.)+[\w-]+(/[\w- ./?%&=]*)?",  RegexOptions.Singleline | RegexOptions.Compiled);
        private static readonly Regex EmailExpression = new Regex(@"^([0-9a-zA-Z]+[-._+&])*[0-9a-zA-Z]+@([-0-9a-zA-Z]+[.])+[a-zA-Z]{2,6}$", RegexOptions.Singleline | RegexOptions.Compiled);
        private static readonly Regex StripHTMLExpression = new Regex("<\\S[^><]*>|(&nbsp;)+|　+", RegexOptions.IgnoreCase | RegexOptions.Singleline | RegexOptions.Multiline | RegexOptions.CultureInvariant | RegexOptions.Compiled);
        private static readonly Regex tagRegex = new Regex("<[^<>]*>", RegexOptions.Compiled | RegexOptions.Singleline);
        private static readonly Regex spaceRegex = new Regex(@"\s+", RegexOptions.Compiled | RegexOptions.Singleline);

        private static readonly char[] IllegalUrlCharacters = new[] { ';', '/', '\\', '?', ':', '@', '&', '=', '+', '$', ',', '<', '>', '#', '%', '.', '!', '*', '\'', '"', '(', ')', '[', ']', '{', '}', '|', '^', '`', '~', '–', '‘', '’', '“', '”', '»', '«' };


        #region 字符串处理
        /// <summary>
        /// 等同String.Format.
        /// 比如："你的姓名{0}".FromatWith(Name)
        /// </summary>
        /// <param name="target"></param>
        /// <param name="args"></param>
        /// <returns></returns>
        [DebuggerStepThrough]
        public static string FormatWith(this string target, params object[] args)
        {
            Check.Argument.IsNotEmpty(target, "target");

            return string.Format(CultureInfo.CurrentCulture, target, args);
        }
        /// <summary>
        /// 截取长度
        /// </summary>
        /// <param name="target"></param>
        /// <param name="index"></param>
        /// <returns></returns>
        [DebuggerStepThrough]
        public static string WrapAt(this string target, int index)
        {
            const int DotCount = 3;

            Check.Argument.IsNotEmpty(target, "target");
            Check.Argument.IsNotNegativeOrZero(index, "index");

            return (target.Length <= index) ? target : string.Concat(target.Substring(0, index - DotCount), new string('.', DotCount));
        }
        /// <summary>
        /// 对字符串进行Url编码
        /// </summary>
        /// <param name="target"></param>
        /// <returns></returns>
        [DebuggerStepThrough]
        public static string UrlEncode(this string target)
        {
            return HttpUtility.UrlEncode(target);
        }
        /// <summary>
        /// 对字符串进行Url解码
        /// </summary>
        /// <param name="target"></param>
        /// <returns></returns>
        [DebuggerStepThrough]
        public static string UrlDecode(this string target)
        {
            return HttpUtility.UrlDecode(target);
        }
        /// <summary>
        /// 去除HTML片段
        /// </summary>
        /// <param name="target"></param>
        /// <returns></returns>
        [DebuggerStepThrough]
        public static string StripHtml(this string target)
        {
            return StripHtml(target, string.Empty);
        }
        /// <summary>
        /// 去除HTML片段
        /// </summary>
        /// <param name="target"></param>
        /// <param name="defaultString">如果结果为空字符串可设置默认字符串</param>
        /// <returns></returns>
        [DebuggerStepThrough]
        public static string StripHtml(this string target, string defaultString)
        {
            var result = StripHTMLExpression.Replace(target, string.Empty);
            return String.IsNullOrEmpty(result) ? defaultString : result.Trim();
        }
        /// <summary>
        /// 清除html标记
        /// </summary>
        /// <param name="s"></param>
        /// <returns></returns>
        public static string CleanHtmlTags(this string s)
        {
            return s.CleanHtmlTags(null);
        }
        /// <summary>
        /// 清空HTML标记
        /// </summary>
        /// <param name="s"></param>
        /// <param name="exceptionPattern"></param>
        /// <returns></returns>
        public static string CleanHtmlTags(this string s, string exceptionPattern)
        {
            if (!string.IsNullOrEmpty(exceptionPattern))
                return
                    new Regex(string.Format("<(?!{0})[^<>]*>", exceptionPattern),
                              RegexOptions.Compiled | RegexOptions.Singleline).Replace(s, "");

            return tagRegex.Replace(s, "");
        }
        /// <summary>
        /// 清除空白
        /// </summary>
        /// <param name="s"></param>
        /// <returns></returns>
        public static string CleanWhitespace(this string s)
        {
            return spaceRegex.Replace(s, " ");
        }
        /// <summary>
        /// 清除所有空格(包括全角)
        /// </summary>
        /// <param name="s"></param>
        /// <returns></returns>
        public static string TrimExt(this string s)
        {
            return s == null ? string.Empty : s.Trim().Replace(" ", string.Empty).Replace("　", string.Empty);
        }
        /// <summary>
        /// 分割字符串
        /// </summary>
        public static string[] SplitString(this string strContent, string strSplit)
        {
            if (!strContent.IsNullOrEmpty())
            {
                if (strContent.IndexOf(strSplit) < 0)
                    return new string[] { strContent };

                return Regex.Split(strContent, Regex.Escape(strSplit), RegexOptions.IgnoreCase);
            }
            else
                return new string[0] { };
        }
        #endregion

        #region 类型转换
        /// <summary>
        /// 转换为Int64类型
        /// </summary>
        /// <param name="target">要转换的字符串</param>
        /// <param name="defValue">缺省值</param>
        /// <returns>转换后的int类型结果</returns>
        public static long ToInt64(this string target, long defValue)
        {
            if (string.IsNullOrEmpty(target) || target.Trim().Length >= 11 || !Regex.IsMatch(target.Trim(), @"^([-]|[0-9])[0-9]*(\.\w*)?$"))
            {
                return defValue;
            }

            long rv;

            if (Int64.TryParse(target, out rv))
            {
                return rv;
            }

            return Convert.ToInt64(ToFloat(target, defValue));
        }
        /// <summary>
        /// 转换为Int32类型。转换失败返回0.
        /// </summary>
        /// <returns>转换后的int类型结果</returns>
        public static int ToInt(this string target)
        {
            return ToInt(target,0);
        }
        /// <summary>
        /// 转换为Int32类型
        /// </summary>
        /// <param name="expression">要转换的字符串</param>
        /// <param name="defValue">缺省值</param>
        /// <returns>转换后的int类型结果</returns>
        public static int ToInt(this string target, int defValue)
        {
            if (string.IsNullOrEmpty(target) || target.Trim().Length >= 11 || !Regex.IsMatch(target.Trim(), @"^([-]|[0-9])[0-9]*(\.\w*)?$"))
            {
                return defValue;
            }

            int rv;

            if (Int32.TryParse(target, out rv))
            {
                return rv;
            }

            return Convert.ToInt32(ToFloat(target, defValue));
        }
        /// <summary>
        /// 转换为Float类型。转换失败返回0.
        /// </summary>
        /// <returns>转换后的float类型结果</returns>
        public static float ToFloat(this string target)
        {
            return ToFloat(target,0);
        }
        /// <summary>
        /// 转换为Float类型。转换失败返回默认值.
        /// </summary>
        /// <returns>转换后的float类型结果</returns>
        public static float ToFloat(this string target, float defValue)
        {
            if ((target == null) || (target.Length > 10))
            {
                return defValue;
            }

            float intValue = defValue;

            if (target != null)
            {
                bool IsFloat = Regex.IsMatch(target, @"^([-]|[0-9])[0-9]*(\.\w*)?$");
                if (IsFloat)
                {
                    float.TryParse(target, out intValue);
                }
            }

            return intValue;
        }
        /// <summary>
        /// 转换为decimal类型。转换失败返回默认值.
        /// </summary>
        /// <returns>转换后的decimal类型结果</returns>
        public static decimal ToDecimal(this string target, decimal defValue)
        {
            var intValue = defValue;

            if (!string.IsNullOrEmpty(target))
            {
                var isFloat = Regex.IsMatch(target, @"^([-]|[0-9])[0-9]*(\.\w*)?$");
                if (isFloat)
                {
                    decimal.TryParse(target, out intValue);
                }
            }

            return intValue;
        }
        /// <summary>
        /// 转成整型数组,转换失败用默认值填充。
        /// </summary>
        /// <param name="defValue">缺省值</param>
        /// <returns>转换后的int类型结果</returns>
        public static int[] ToIntArray(this string idList, int defValue)
        {
            if (string.IsNullOrEmpty(idList))
            {
                return null;
            }

            string[] strArr = idList.SplitString(",");
            int[] intArr = new int[strArr.Length];

            for (int i = 0; i < strArr.Length; i++)
            {
                intArr[i] = strArr[i].ToInt(defValue);
            }

            return intArr;
        }
        /// <summary>
        /// 转成整型数组,转换失败用-1填充。
        /// </summary>
        /// <param name="defValue">缺省值</param>
        /// <returns>转换后的int类型结果</returns>
        public static int[] ToIntArray(this string idList)
        {
            return ToIntArray(idList, -1);
        }        
        /// <summary>
        /// 转换成日期，转换失败，返回最小日期。
        /// </summary>
        /// <param name="target"></param>
        /// <returns></returns>
        [DebuggerStepThrough]
        public static DateTime ToDateTime(this string target)
        {
            var result = DateTime.MinValue;

            DateTime.TryParse(target, out result);

            return result;
        }
        /// <summary>
        /// 转换为日期时间类型.转换失败返回默认值。
        /// </summary>
        /// <param name="str">要转换的字符串</param>
        /// <param name="defValue">缺省值</param>
        /// <returns>转换后的DataTime类型结果</returns>
        public static DateTime ToDateTime(this string str, DateTime defValue)
        {
            if (!string.IsNullOrEmpty(str))
            {
                DateTime dateTime;
                if (DateTime.TryParse(str, out dateTime)) return dateTime;
            }
            return defValue;
        }
        /// <summary>
        /// 转换为Boolean类型
        /// </summary>
        /// <param name="target"></param>
        /// <returns></returns>
        [DebuggerStepThrough]
        public static bool ToBool(this string target)
        {
            bool result = false;

            if (!string.IsNullOrEmpty(target))
            {
                if (target.ToLower().Equals("true"))
                {
                    result = true;
                }
                else
                {
                    int r;
                    if (int.TryParse(target, out r))
                    {
                        if (r > 0)
                        {
                            result = true;
                        }
                    }
                }
            }

            return result;
        }
        /// <summary>
        /// 转换为Boolean类型
        /// </summary>
        /// <param name="target"></param>
        /// <returns></returns>
        [DebuggerStepThrough]
        public static bool ToBool(this string target, bool defValue)
        {
            bool result = defValue;

            if (!string.IsNullOrEmpty(target))
            {
                if (target.ToLower().Equals("true"))
                {
                    result = true;
                }
                else if(target.ToLower().Equals("false"))
                {
                    result = false;
                }
                else
                {
                    int r;

                    if (int.TryParse(target, out r))
                    {
                        if (r > 0) result = true;
                        else result = false;
                    }
                }
            }

            return result;
        }
        /// <summary>
        /// 转换为GUID类型
        /// </summary>
        /// <param name="target"></param>
        /// <returns></returns>
        [DebuggerStepThrough]
        public static Guid ToGuid(this string target)
        {
            Guid result = Guid.Empty;

            if ((!string.IsNullOrEmpty(target)))
            {

                try
                {
                    result = new Guid(target);
                }
                catch
                {
                    return Guid.Empty;
                }
            }

            return result;
        }
        #endregion

        #region 类型判断
        /// <summary>
        /// 是否为ip
        /// </summary>
        /// <param name="ip"></param>
        /// <returns></returns>
        public static bool IsIP(this string target)
        {
            return Regex.IsMatch(target, @"^((2[0-4]\d|25[0-5]|[01]?\d\d?)\.){3}(2[0-4]\d|25[0-5]|[01]?\d\d?)$");
        }
        /// <summary>
        /// 字符串是否为空
        /// </summary>
        /// <param name="target"></param>
        /// <returns></returns>
        public static bool IsNullOrEmpty(this string target)
        {
            if (target != null)
            {
                return string.IsNullOrEmpty(target.Trim());
            }

            return true;
        }
        /// <summary>
        /// 是否是合法的Url
        /// </summary>
        /// <param name="target"></param>
        /// <returns></returns>
        [DebuggerStepThrough]
        public static bool IsWebUrl(this string target)
        {
            return !string.IsNullOrEmpty(target) && WebUrlExpression.IsMatch(target);
        }
        /// <summary>
        /// 是否是合法的Email
        /// </summary>
        /// <param name="target"></param>
        /// <returns></returns>
        [DebuggerStepThrough]
        public static bool IsEmail(this string target)
        {
            return !string.IsNullOrEmpty(target) && EmailExpression.IsMatch(target);
        }
        /// <summary>
        /// 是否安全的字符(检测是否有Sql危险字符)
        /// </summary>
        /// <param name="str">要判断字符串</param>
        /// <returns>判断结果</returns>
        public static bool IsSafeSqlString(this string target)
        {
            return !Regex.IsMatch(target, @"[;|\/|\(|\)|\[|\]|\}|\{|%|@|\*|!|\']");
        }
        #endregion
    }
}