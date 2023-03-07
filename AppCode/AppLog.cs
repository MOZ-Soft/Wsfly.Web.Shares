using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.IO;


/// <summary>
/// 日志助手
/// </summary>
public class AppLog
{
    /// <summary>
    /// 根目录
    /// </summary>
    private static string _RootPath = AppDomain.CurrentDomain.BaseDirectory;

    /// <summary>
    /// 写流水日志
    /// </summary>
    public static void WriteJournaliseLog(string des, string fileType = "")
    {
        try
        {
            if (!string.IsNullOrWhiteSpace(fileType)) fileType = "." + fileType.Trim('.');
            string path = _RootPath + "\\AppLog\\Wsfly.journalise[" + DateTime.Now.ToString("yyyyMMdd") + "]" + fileType + ".log";
            if (!Directory.Exists(_RootPath + "\\AppLog\\")) Directory.CreateDirectory(_RootPath + "\\AppLog\\");

            string log = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + "   " + des + "\r\n";

            using (StreamWriter sw = new StreamWriter(path, true, Encoding.UTF8))
            {
                sw.Write(log);
                sw.Flush();
                sw.Close();
            }
        }
        catch (Exception ex) { }
    }
    /// <summary>
    /// 写异常日志
    /// </summary>
    public static void WriteBugLog(Exception ex, string des = "", string fileType = "")
    {
        string log = "[异常]" + des;
        log += "\r\n【Message】" + ex.Message;
        log += "\r\n【Source】\r\n" + ex.Source;
        log += "\r\n【StackTrace】\r\n" + ex.StackTrace;

        //递归子异常
        RecursionInnerException(ex, ref log, 1);

        fileType = string.IsNullOrWhiteSpace(fileType) ? "" : "." + fileType;

        WriteSysLog(log, "error" + fileType);
    }
    /// <summary>
    /// 递归列出子异常
    /// </summary>
    private static void RecursionInnerException(Exception ex, ref string log, int level)
    {
        if (ex.InnerException != null)
        {
            log += "\r\n********************** InnerException " + level + " **********************";
            log += "\r\n【Message】" + ex.InnerException.Message;
            log += "\r\n【Source】\r\n" + ex.InnerException.Source;
            log += "\r\n【StackTrace】\r\n" + ex.InnerException.StackTrace;

            RecursionInnerException(ex.InnerException, ref log, level + 1);
        }
    }
    /// <summary>
    /// 写调试日志
    /// </summary>
    public static void WriteDebugLog(string describe, string fileType = "")
    {
        string log = "[调试]" + describe;
        string fileName = "debug";
        if (!string.IsNullOrWhiteSpace(fileType)) fileName = fileType + "." + fileName;

        WriteSysLog(log, fileName);
    }
    /// <summary>
    /// 写异常日志
    /// </summary>
    public static void WriteErrorLog(string describe, string fileType = "")
    {
        string log = "[异常]" + describe;
        string fileName = "error";
        if (!string.IsNullOrWhiteSpace(fileType)) fileName = fileType + "." + fileName;

        WriteSysLog(log, fileName);
    }
    /// <summary>
    /// 写操作日志
    /// </summary>
    public static void WriteOperateLog(string describe, string fileType = "")
    {
        string log = "[操作]" + describe;
        string fileName = "operate";
        if (!string.IsNullOrWhiteSpace(fileType)) fileName = fileType + "." + fileName;

        WriteSysLog(log, fileName);
    }
    /// <summary>
    /// 写系统日志
    /// </summary>
    public static void WriteSysLog(string type, string title, string describe)
    {
        string log = "[" + type + "]" + title + (string.IsNullOrEmpty(describe) ? "" : "\r\n[描述]" + describe);

        WriteSysLog(log);
    }


    private static string lastLog = "";
    private static int logRepeatCount = 0;
    /// <summary>
    /// 写日志
    /// </summary>
    private static void WriteSysLog(string log, string fileName = "sys")
    {
        if (log.Equals(lastLog))
        {
            logRepeatCount++;

            //重复超过10次，不登记
            if (logRepeatCount > 10) return;

            log += "（日志重复第" + logRepeatCount + "次" + (logRepeatCount == 10 ? ",超过10次将不再记录" : "") + "）";
        }
        else
        {
            lastLog = log;
            logRepeatCount = 0;
        }

        try
        {
            string wsName = "Wsfly";
            string dirName = "AppLog";
            //文件
            string path = _RootPath + "\\" + dirName + "\\" + wsName + "." + fileName + ".log";

            //如果目录不存在则创建目录
            if (!Directory.Exists(_RootPath + "\\" + dirName + "\\")) Directory.CreateDirectory(_RootPath + "\\" + dirName + "\\");

            //处理内容
            log = "\r\n\r\n=======================================================================\r\n" + log;
            log += "\r\n[日期]" + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");

            //文件是否存在
            //如果文件大小超过10MB则备份
            if (File.Exists(path))
            {
                FileInfo file = new FileInfo(path);
                long maxLength = 10 * 1024 * 1024;
                if (file.Length >= maxLength)
                {
                    FileMove(path, path.Replace(wsName + "." + fileName + ".log", wsName + "." + fileName + ".bak[" + DateTime.Now.ToString("yyyyMMdd.HHmmss") + "].log"));
                }
            }

            //如果文件存在则追加
            if (File.Exists(path))
            {
                FileAdd(path, log);
            }
            else
            {
                WriteFile(path, log);
            }
        }
        catch { }
    }


    /// <summary>
    /// 写文件
    /// </summary>
    private static void WriteFile(string path, string content, string charset = null)
    {
        //编码
        Encoding encoding = Encoding.UTF8;

        try
        {
            if (!string.IsNullOrEmpty(charset)) encoding = Encoding.GetEncoding(charset);
        }
        catch { encoding = Encoding.UTF8; }

        //创建目录
        if (!Directory.Exists(Path.GetDirectoryName(path)))
        {
            Directory.CreateDirectory(Path.GetDirectoryName(path));
        }

        //创建文件
        if (!File.Exists(path))
        {
            using (FileStream fs = File.Create(path))
            {
                fs.Close();
                fs.Dispose();
            }
        }

        //写入文件
        using (StreamWriter sw = new StreamWriter(path, false, encoding))
        {
            sw.Write(content);
            sw.Flush();
            sw.Close();
            sw.Dispose();
        }
    }
    /// <summary>
    /// 追加文件
    /// </summary>
    private static void FileAdd(string path, string strings)
    {
        if (!Directory.Exists(Path.GetDirectoryName(path)))
        {
            Directory.CreateDirectory(Path.GetDirectoryName(path));
        }

        using (StreamWriter sw = new StreamWriter(path, true, Encoding.UTF8))
        {
            sw.Write(strings);
            sw.Flush();
            sw.Close();
            sw.Dispose();
        }
    }
    /// <summary>
    /// 移动文件
    /// </summary>
    private static void FileMove(string orignFile, string newFile)
    {
        try
        {
            if (!File.Exists(orignFile)) return;
            File.Move(orignFile, newFile);
        }
        catch { }
    }
    /// <summary>
    /// 删除文件
    /// </summary>
    private static void FileDelete(string orignFile)
    {
        try
        {
            if (!File.Exists(orignFile)) return;
            File.Delete(orignFile);
        }
        catch (Exception ex) { }
    }
    /// <summary>
    /// 递归获取日志文件
    /// </summary>
    /// <returns></returns>
    private static List<string> GetLogFiles(string path)
    {
        //如果文件夹不存在
        if (!Directory.Exists(path)) { return null; }
        DirectoryInfo dirInfo = new DirectoryInfo(path);
        List<string> files = new List<string>();

        //遍历所有文件、目录
        foreach (FileSystemInfo fsInfo in dirInfo.GetFileSystemInfos())
        {
            //是否文件夹
            bool isDirectory = fsInfo.Attributes.ToString().ToLower() == "directory";

            //文件夹
            if (isDirectory || fsInfo is DirectoryInfo)
            {
                //递归目录
                List<string> subFiles = GetLogFiles(fsInfo.FullName);

                //添加列表
                files.AddRange(subFiles);

                continue;
            }

            //文件
            files.Add(fsInfo.FullName);
        }

        return files;
    }

    //保留天数
    static int _logRetentionDays = 7;
    /// <summary>
    /// 日志文件监控
    /// </summary>
    public static void StartLogFileMonitor()
    {
        AppLog.WriteSysLog("启动日志文件监控，将自动删除过期日志（超过" + _logRetentionDays + "天无变动）文件");

        //定时器
        System.Timers.Timer timer = new System.Timers.Timer(24 * 60 * 60 * 1000);
        timer.Elapsed += Timer_Elapsed;
        timer.Start();

        //日志文件回收
        LogFileRecycling();
    }
    /// <summary>
    /// 每天执行一次
    /// </summary>
    /// <param name="sender"></param>
    /// <param name="e"></param>
    private static void Timer_Elapsed(object sender, System.Timers.ElapsedEventArgs e)
    {
        LogFileRecycling();
    }
    /// <summary>
    /// 日志文件回收
    /// </summary>
    private static void LogFileRecycling()
    {
        try
        {
            //保留天数
            DateTime retentionDate = DateTime.Now.AddDays(-_logRetentionDays);

            //获取日志文件
            string dirName = _RootPath + "AppLog";
            List<string> logFiles = GetLogFiles(dirName);
            if (logFiles == null || logFiles.Count < 1) return;

            //遍历日志文件
            foreach (string fileName in logFiles)
            {
                try
                {
                    //文件信息
                    FileInfo fi = new FileInfo(fileName);
                    if (fi.CreationTime < retentionDate && fi.LastWriteTime < retentionDate)
                    {
                        //创建和最后修改日期 大于 保留天数时删除文件
                        fi.Delete();

                        AppLog.WriteSysLog("删除过期日志文件：" + fi.Name);
                    }
                }
                catch (Exception ex) { }
            }
        }
        catch (Exception ex) { }
    }
}
