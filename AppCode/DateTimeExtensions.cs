using System;
using System.Diagnostics;

namespace Wsfly.ERP.Web.Shares
{
    
    /// <summary>
    /// 扩展了时间类的方法
    /// </summary>
    public static class DateTimeExtension
    {
        private static readonly DateTime MinDate = new DateTime(1900, 1, 1);
        private static readonly DateTime MaxDate = new DateTime(9999, 12, 31, 23, 59, 59, 999);

        /// <summary>
        /// 验证是否合法时间
        /// </summary>
        /// <param name="target"></param>
        /// <returns></returns>
        [DebuggerStepThrough]
        public static bool IsValid(this DateTime target)
        {
            return (target >= MinDate) && (target <= MaxDate);
        }
    }
}