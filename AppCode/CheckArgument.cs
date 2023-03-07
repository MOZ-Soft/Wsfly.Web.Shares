using System;
using System.Collections.Generic;
using System.Diagnostics;

namespace Wsfly.ERP.Web.Shares
{
    /// <summary>
    /// 较验类
    /// </summary>
    public class Check
    {
        internal Check() { }

        /// <summary>
        /// 参数
        /// </summary>
        public class Argument
        {
            internal Argument() { }

            /// <summary>
            /// GUID不能为空
            /// </summary>
            /// <param name="argument"></param>
            /// <param name="argumentName"></param>
            [DebuggerStepThrough]
            public static void IsNotEmpty(Guid argument, string argumentName)
            {
                if (argument == Guid.Empty)
                {
                    throw new ArgumentException("\"{0}\"不能是一个空的Guid.".FormatWith(argumentName), argumentName);
                }
            }
            /// <summary>
            /// 字符串不能为空
            /// </summary>
            /// <param name="argument"></param>
            /// <param name="argumentName"></param>
            [DebuggerStepThrough]
            public static void IsNotEmpty(string argument, string argumentName)
            {
                if (string.IsNullOrEmpty((argument ?? string.Empty).Trim()))
                {
                    throw new ArgumentException("\"{0}\"不能为空.".FormatWith(argumentName), argumentName);
                }
            }
            /// <summary>
            /// 字符串不能大于X
            /// </summary>
            /// <param name="argument"></param>
            /// <param name="length"></param>
            /// <param name="argumentName"></param>
            [DebuggerStepThrough]
            public static void IsNotOutOfLength(string argument, int length, string argumentName)
            {
                if (argument.Trim().Length > length)
                {
                    throw new ArgumentException("\"{0}\"不能大于{1}个字符.".FormatWith(argumentName, length), argumentName);
                }
            }
            /// <summary>
            /// 不能为NULL值 
            /// </summary>
            /// <param name="argument"></param>
            /// <param name="argumentName"></param>
            [DebuggerStepThrough]
            public static void IsNotNull(object argument, string argumentName)
            {
                if (argument == null)
                {
                    throw new ArgumentNullException(argumentName);
                }
            }
            /// <summary>
            /// 不能是负数
            /// </summary>
            /// <param name="argument"></param>
            /// <param name="argumentName"></param>
            [DebuggerStepThrough]
            public static void IsNotNegative(int argument, string argumentName)
            {
                if (argument < 0)
                {
                    throw new ArgumentOutOfRangeException(argumentName);
                }
            }
            /// <summary>
            /// 不能小于等于零
            /// </summary>
            /// <param name="argument"></param>
            /// <param name="argumentName"></param>
            [DebuggerStepThrough]
            public static void IsNotNegativeOrZero(int argument, string argumentName)
            {
                if (argument <= 0)
                {
                    throw new ArgumentOutOfRangeException(argumentName);
                }
            }
            /// <summary>
            /// 不能小于零
            /// </summary>
            /// <param name="argument"></param>
            /// <param name="argumentName"></param>
            [DebuggerStepThrough]
            public static void IsNotNegative(long argument, string argumentName)
            {
                if (argument < 0)
                {
                    throw new ArgumentOutOfRangeException(argumentName);
                }
            }
            /// <summary>
            /// 不能小于等于零
            /// </summary>
            /// <param name="argument"></param>
            /// <param name="argumentName"></param>
            [DebuggerStepThrough]
            public static void IsNotNegativeOrZero(long argument, string argumentName)
            {
                if (argument <= 0)
                {
                    throw new ArgumentOutOfRangeException(argumentName);
                }
            }
            /// <summary>
            /// 不能小于零
            /// </summary>
            /// <param name="argument"></param>
            /// <param name="argumentName"></param>
            [DebuggerStepThrough]
            public static void IsNotNegative(float argument, string argumentName)
            {
                if (argument < 0)
                {
                    throw new ArgumentOutOfRangeException(argumentName);
                }
            }
            /// <summary>
            /// 不能小于等于零
            /// </summary>
            /// <param name="argument"></param>
            /// <param name="argumentName"></param>
            [DebuggerStepThrough]
            public static void IsNotNegativeOrZero(float argument, string argumentName)
            {
                if (argument <= 0)
                {
                    throw new ArgumentOutOfRangeException(argumentName);
                }
            }
            /// <summary>
            /// 不能小于零
            /// </summary>
            /// <param name="argument"></param>
            /// <param name="argumentName"></param>
            [DebuggerStepThrough]
            public static void IsNotNegative(decimal argument, string argumentName)
            {
                if (argument < 0)
                {
                    throw new ArgumentOutOfRangeException(argumentName);
                }
            }
            /// <summary>
            /// 不能小于等于零
            /// </summary>
            /// <param name="argument"></param>
            /// <param name="argumentName"></param>
            [DebuggerStepThrough]
            public static void IsNotNegativeOrZero(decimal argument, string argumentName)
            {
                if (argument <= 0)
                {
                    throw new ArgumentOutOfRangeException(argumentName);
                }
            }
            /// <summary>
            /// 不是有效的时间
            /// </summary>
            /// <param name="argument"></param>
            /// <param name="argumentName"></param>
            [DebuggerStepThrough]
            public static void IsNotInvalidDate(DateTime argument, string argumentName)
            {
                if (!argument.IsValid())
                {
                    throw new ArgumentOutOfRangeException(argumentName);
                }
            }
            /// <summary>
            /// 小于当前系统时间
            /// </summary>
            /// <param name="argument"></param>
            /// <param name="argumentName"></param>
            [DebuggerStepThrough]
            public static void IsNotInPast(DateTime argument, string argumentName)
            {
                if (argument < SystemTime.Now())
                {
                    throw new ArgumentOutOfRangeException(argumentName);
                }
            }
            /// <summary>
            /// 大于当前系统时间
            /// </summary>
            /// <param name="argument"></param>
            /// <param name="argumentName"></param>
            [DebuggerStepThrough]
            public static void IsNotInFuture(DateTime argument, string argumentName)
            {
                if (argument > SystemTime.Now())
                {
                    throw new ArgumentOutOfRangeException(argumentName);
                }
            }
            /// <summary>
            /// 小于零的时间
            /// </summary>
            /// <param name="argument"></param>
            /// <param name="argumentName"></param>
            [DebuggerStepThrough]
            public static void IsNotNegative(TimeSpan argument, string argumentName)
            {
                if (argument < TimeSpan.Zero)
                {
                    throw new ArgumentOutOfRangeException(argumentName);
                }
            }
            /// <summary>
            /// 小于等于零的时间
            /// </summary>
            /// <param name="argument"></param>
            /// <param name="argumentName"></param>
            [DebuggerStepThrough]
            public static void IsNotNegativeOrZero(TimeSpan argument, string argumentName)
            {
                if (argument <= TimeSpan.Zero)
                {
                    throw new ArgumentOutOfRangeException(argumentName);
                }
            }
            /// <summary>
            /// 集合为空
            /// </summary>
            /// <typeparam name="T"></typeparam>
            /// <param name="argument"></param>
            /// <param name="argumentName"></param>
            [DebuggerStepThrough]
            public static void IsNotEmpty<T>(ICollection<T> argument, string argumentName)
            {
                IsNotNull(argument, argumentName);

                if (argument.Count == 0)
                {
                    throw new ArgumentException("集合不能为空.", argumentName);
                }
            }

            /// <summary>
            /// 集合范围越界
            /// </summary>
            /// <param name="argument"></param>
            /// <param name="min"></param>
            /// <param name="max"></param>
            /// <param name="argumentName"></param>
            [DebuggerStepThrough]
            public static void IsNotOutOfRange(int argument, int min, int max, string argumentName)
            {
                if ((argument < min) || (argument > max))
                {
                    throw new ArgumentOutOfRangeException(argumentName, "{0}必须在\"{1}\"到\"{2}\"之间.".FormatWith(argumentName, min, max));
                }
            }
            /// <summary>
            /// 不是一个有效的邮箱
            /// </summary>
            /// <param name="argument"></param>
            /// <param name="argumentName"></param>
            [DebuggerStepThrough]
            public static void IsNotInvalidEmail(string argument, string argumentName)
            {
                IsNotEmpty(argument, argumentName);

                if (!argument.IsEmail())
                {
                    throw new ArgumentException("\"{0}\"不是一个有效的邮箱地址.".FormatWith(argumentName), argumentName);
                }
            }
            /// <summary>
            /// 不是一个有效的Url
            /// </summary>
            /// <param name="argument"></param>
            /// <param name="argumentName"></param>
            [DebuggerStepThrough]
            public static void IsNotInvalidWebUrl(string argument, string argumentName)
            {
                IsNotEmpty(argument, argumentName);

                if (!argument.IsWebUrl())
                {
                    throw new ArgumentException("\"{0}\"不是一个有效的链接.".FormatWith(argumentName), argumentName);
                }
            }
        }
    }
}