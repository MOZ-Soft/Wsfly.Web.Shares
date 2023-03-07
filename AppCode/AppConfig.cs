using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;


/// <summary>
/// App配置
/// </summary>
public class AppConfig
{
    /// <summary>
    /// 保存锁
    /// </summary>
    private static readonly object _lockSaveConfig = new object();
    /// <summary>
    /// 操作锁
    /// </summary>
    private static readonly object _lockOperateConfig = new object();
    /// <summary>
    /// 配置文件名称
    /// </summary>
    private static readonly string _configFileName = "Cnf/Wsfly.App.config";
    /// <summary>
    /// 配置文件路径
    /// </summary>
    private static readonly string _configPath = AppDomain.CurrentDomain.BaseDirectory + _configFileName;
    /// <summary>
    /// Parameters
    /// </summary>
    private static Dictionary<string, object> Parameters { get; set; }
    

    /// <summary>
    /// 构造
    /// </summary>
    private AppConfig()
    {
    }

    /// <summary>
    /// 初始
    /// </summary>
    public static void Init(Dictionary<string, object> dicDefaultConfigs)
    {
        try
        {
            if (!File.Exists(_configPath))
            {
                if (dicDefaultConfigs != null)
                {
                    Parameters = dicDefaultConfigs;
                }
                else
                {
                    Parameters = new Dictionary<string, object>();
                    Parameters.Add("版权归属", "wsfly.com");
                }

                //保存新文件
                Save();
            }

            //加载
            Load();
        }
        catch (Exception ex) { }
    }

    /// <summary>
    /// 获取配置值
    /// </summary>
    /// <param name="key"></param>
    /// <returns></returns>
    public static object Get(string key)
    {
        if (string.IsNullOrWhiteSpace(key)) return null;

        if (Parameters == null)
        {
            //加载本地配置
            Load();
        }

        //是否存在参数配置
        if (Parameters == null) return null;

        //是否存在配置值
        if (Parameters.ContainsKey(key)) return Parameters[key];

        return null;
    }
    /// <summary>
    /// 获取配置值-字符串
    /// </summary>
    /// <param name="key"></param>
    /// <returns></returns>
    public static string GetString(string key)
    {
        object result = Get(key);
        if (result == null) return null;

        return result.ToString();
    }
    /// <summary>
    /// 获取配置值-整数
    /// </summary>
    /// <param name="key"></param>
    /// <returns></returns>
    public static int GetInt(string key)
    {
        object result = Get(key);
        if (result == null) return 0;

        return DataType.Int(result, 0);
    }
    /// <summary>
    /// 获取配置值-长整数
    /// </summary>
    /// <param name="key"></param>
    /// <returns></returns>
    public static long GetLong(string key)
    {
        object result = Get(key);
        if (result == null) return 0;

        return DataType.Long(result, 0);
    }
    /// <summary>
    /// 获取配置值-Boolean
    /// </summary>
    /// <param name="key"></param>
    /// <returns></returns>
    public static bool GetBoolean(string key)
    {
        object result = Get(key);
        if (result == null) return false;

        return DataType.Bool(result, false);
    }
    /// <summary>
    /// 获取配置值-DateTime
    /// </summary>
    /// <param name="key"></param>
    /// <returns></returns>
    public static DateTime? GetDateTime(string key, DateTime? defaultValue = null)
    {
        object result = Get(key);
        if (result == null) return null;

        DateTime date;
        if (DateTime.TryParse(result.ToString(), out date)) return date;
        return defaultValue;
    }
    /// <summary>
    /// 获取列表
    /// </summary>
    /// <typeparam name="T"></typeparam>
    /// <param name="key"></param>
    /// <returns></returns>
    public static List<T> GetList<T>(string key)
    {
        object result = Get(key);
        if (result == null) return null;

        List<T> list = new List<T>();
        if (string.IsNullOrWhiteSpace(result.ToString())) return list;

        foreach (string val in result.ToString().Split(','))
        {
            try
            {
                list.Add((T)Convert.ChangeType(val, typeof(T)));
            }
            catch (Exception ex) { }
        }

        return list;
    }

    /// <summary>
    /// 设置配置值
    /// </summary>
    /// <param name="key"></param>
    /// <param name="value"></param>
    public static void Set(string key, object value, bool autoSave = false)
    {
        if (string.IsNullOrWhiteSpace(key)) return;

        lock (_lockOperateConfig)
        {
            if (Parameters == null)
            {
                //加载本地配置
                Load();
            }

            //是否存在参数配置
            if (Parameters == null) Parameters = new Dictionary<string, object>();

            //是否已经有配置键
            if (Parameters.ContainsKey(key)) Parameters[key] = value;
            //添加新配置键值
            else Parameters.Add(key, value);

            //是否自动保存配置
            if (autoSave) Save();
        }
    }
    /// <summary>
    /// 删除键值
    /// </summary>
    /// <param name="key"></param>
    public static void Delete(string key)
    {
        if (string.IsNullOrWhiteSpace(key)) return;

        lock (_lockOperateConfig)
        {
            //是否存在参数配置
            if (Parameters == null) return;

            //是否已经有配置键
            if (Parameters.ContainsKey(key)) Parameters.Remove(key);
        }
    }


    /// <summary>
    /// 加载配置
    /// </summary>
    /// <returns></returns>
    private static void Load()
    {
        bool isLoaded = false;

        try
        {
            //文件是否存在
            if (File.Exists(_configPath))
            {
                //读取配置文件
                string jsonData = File.ReadAllText(_configPath, Encoding.UTF8);
                if (!string.IsNullOrWhiteSpace(jsonData))
                {
                    //转换为键值集合
                    Parameters = Newtonsoft.Json.JsonConvert.DeserializeObject<Dictionary<string, object>>(jsonData);
                    if (Parameters != null && Parameters.Count > 0)
                    {
                        //加载成功
                        isLoaded = true;
                        //写入备份文件
                        File.WriteAllText(_configPath + ".bak", jsonData, Encoding.UTF8);
                    }
                }
            }
        }
        catch (Exception ex)
        {
            AppLog.WriteBugLog(ex, "加载配置文件失败：" + _configFileName);
        }

        try
        {
            //未加载成功且备份文件存在 尝试从备份文件读取配置
            if (!isLoaded && File.Exists(_configPath + ".bak"))
            {
                string jsonData = File.ReadAllText(_configPath + ".bak", Encoding.UTF8);
                if (!string.IsNullOrWhiteSpace(jsonData))
                {
                    //转换为键值集合
                    Parameters = Newtonsoft.Json.JsonConvert.DeserializeObject<Dictionary<string, object>>(jsonData);
                    if (Parameters != null && Parameters.Count > 0) return;
                }
            }
        }
        catch (Exception ex)
        {
            AppLog.WriteBugLog(ex, "加载配置备份文件失败：" + _configFileName);
        }

        try
        {
            //是否有参数
            if (Parameters == null || Parameters.Count <= 0)
            {
                //添加一个参数示例
                Parameters = new Dictionary<string, object>();
                Parameters.Add("版权归属", "wsfly.com");

                //保存新文件
                Save();

                AppLog.WriteDebugLog("缺少配置文件：" + _configFileName);
            }
        }
        catch (Exception ex)
        {
            AppLog.WriteBugLog(ex, "没有配置文件或内容，初始默认配置失败：" + _configFileName);
        }
    }
    /// <summary>
    /// 保存配置
    /// </summary>
    public static bool Save()
    {
        lock (_lockSaveConfig)
        {
            try
            {
                //保存配置
                string jsonData = Newtonsoft.Json.JsonConvert.SerializeObject(Parameters, Newtonsoft.Json.Formatting.Indented);

                //目录是否存在
                string dirName = System.IO.Path.GetDirectoryName(_configPath);
                if (!System.IO.Directory.Exists(dirName)) System.IO.Directory.CreateDirectory(dirName);

                //写入配置文件
                System.IO.File.WriteAllText(_configPath, jsonData, Encoding.UTF8);

                return true;
            }
            catch (Exception ex)
            {
                AppLog.WriteBugLog(ex, "保存配置文件失败：" + _configFileName);
            }

            return false;
        }
    }
}
