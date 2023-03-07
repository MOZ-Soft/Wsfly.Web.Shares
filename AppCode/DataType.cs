using System;
using System.Collections.Generic;
using System.Text;


public class DataType
{
    #region ������������ת��
    /// <summary>
    /// ���� Int16
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
    /// ���� Int32
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
    /// ת��Ϊ Int64
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
    /// ת��ΪDouble
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
    /// ת��ΪFloat
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
    /// ת��Ϊʮ����
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
    /// ת��ΪUnit
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
    /// ת��ΪBoolean
    /// </summary>
    /// <param name="value"></param>
    /// <param name="defaultValue"></param>
    /// <returns></returns>
    public static bool Bool(object value, bool defaultValue = false)
    {
        try
        {
            //û��ֵ
            if (value == null) return defaultValue;

            //�Ƿ���Boolֵ����
            if (value.GetType() == typeof(bool)) return (bool)value;

            //���������
            if (Int(value) > 0) return true;

            //ת��Boolean
            return Convert.ToBoolean(value);
        }
        catch { return defaultValue; }
    }
    /// <summary>
    /// ת��Ϊ����
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

