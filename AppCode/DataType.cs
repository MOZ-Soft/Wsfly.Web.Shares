using System;
using System.Collections.Generic;
using System.Text;


public class DataType
{
    #region 数字数据类型转换
    /// <summary>
    /// 整数 Int16
    /// </summary>
    /// <param name="value"></param>
    /// <param name="defaultValue"></param>
    /// <returns></returns>
    public static short Short(object value, short defaultValue = 0)
    {
        try
        {
            if (value == null) return defaultValue;

            return Convert.ToInt16(value);
        }
        catch { return defaultValue; }
    }
    /// <summary>
    /// 整型 Int32
    /// </summary>
    /// <param name="value"></param>
    /// <param name="defaultValue"></param>
    /// <returns></returns>
    public static int Int(object value, int defaultValue = 0)
    {
        try
        {
            if (value == null) return defaultValue;

            return Convert.ToInt32(value);
        }
        catch { return defaultValue; }
    }
    /// <summary>
    /// 转换为 Int64
    /// </summary>
    /// <param name="value"></param>
    /// <param name="defaultValue"></param>
    /// <returns></returns>
    public static long Long(object value, long defaultValue = 0)
    {
        try
        {
            if (value == null) return defaultValue;

            return Convert.ToInt64(value);
        }
        catch { return defaultValue; }
    }
    /// <summary>
    /// 转换为Double
    /// </summary>
    /// <param name="value"></param>
    /// <param name="defaultValue"></param>
    /// <returns></returns>
    public static double Double(object value, double defaultValue = 0)
    {
        try
        {
            return Convert.ToDouble(value);
        }
        catch { return defaultValue; }
    }
    /// <summary>
    /// 转换为Float
    /// </summary>
    /// <param name="value"></param>
    /// <param name="defaultValue"></param>
    /// <returns></returns>
    public static float Float(object value, float defaultValue = 0)
    {
        try
        {
            return float.Parse(value.ToString());
        }
        catch { return defaultValue; }
    }
    /// <summary>
    /// 转换为十进制
    /// </summary>
    /// <param name="value"></param>
    /// <param name="defaultValue"></param>
    /// <returns></returns>
    public static decimal Decimal(object value, decimal defaultValue = 0)
    {
        try
        {
            return Convert.ToDecimal(value);
        }
        catch { return defaultValue; }
    }
    /// <summary>
    /// 转换为Unit
    /// </summary>
    /// <param name="value"></param>
    /// <param name="defaultValue"></param>
    /// <returns></returns>
    public static uint Uint(object value, uint defaultValue = 0)
    {
        try
        {
            return Convert.ToUInt32(value);
        }
        catch { return defaultValue; }
    }
    #endregion

    /// <summary>
    /// 转换为Boolean
    /// </summary>
    /// <param name="value"></param>
    /// <param name="defaultValue"></param>
    /// <returns></returns>
    public static bool Bool(object value, bool defaultValue = false)
    {
        try
        {
            //没有值
            if (value == null) return defaultValue;

            //是否是Bool值类型
            if (value.GetType() == typeof(bool)) return (bool)value;

            //如果是数字
            if (Int(value) > 0) return true;

            //转换Boolean
            return Convert.ToBoolean(value);
        }
        catch { return defaultValue; }
    }
    /// <summary>
    /// 转换为日期
    /// </summary>
    /// <param name="value"></param>
    /// <param name="defaultValue"></param>
    /// <returns></returns>
    public static DateTime DateTime(object value, DateTime? defaultValue = null)
    {
        if (defaultValue == null || !defaultValue.HasValue) defaultValue = System.DateTime.Now;

        try
        {
            return Convert.ToDateTime(value);
        }
        catch { return defaultValue.Value; }
    }
}

