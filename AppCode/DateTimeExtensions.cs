using System;
using System.Diagnostics;

namespace Wsfly.ERP.Web.Shares
{
    
    /// <summary>
    /// ��չ��ʱ����ķ���
    /// </summary>
    public static class DateTimeExtension
    {
        private static readonly DateTime MinDate = new DateTime(1900, 1, 1);
        private static readonly DateTime MaxDate = new DateTime(9999, 12, 31, 23, 59, 59, 999);

        /// <summary>
        /// ��֤�Ƿ�Ϸ�ʱ��
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