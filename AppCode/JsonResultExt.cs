using System;
using System.Collections.Generic;
using System.Text;
using System.Web;
using System.Web.Mvc;


/// <summary>
/// 输出Json
/// </summary>
public class JsonResultExt : ActionResult
{
    /// <summary>
    /// 输出结果
    /// </summary>
    string result = null;

    #region 构造函数
    /// <summary>
    /// 构造函数
    /// </summary>
    /// <param name="success">是否成功</param>
    /// <param name="message">返回消息</param>
    /// <param name="data">返回数据</param>
    public JsonResultExt(bool success, string message = "", object data = null, string action = "")
    {
        JsonModel json = new JsonModel(success, message, data, action);
        ResponseJson(json);
    }
    /// <summary>
    /// 构造函数
    /// </summary>
    /// <param name="json">返回JSON</param>
    public JsonResultExt(JsonModel json)
    {
        ResponseJson(json);
    }
    #endregion

    #region 扩展函数
    /// <summary>
    /// 输出需要登陆的Json
    /// </summary>
    /// <param name="context"></param>
    public void ResponseLogin()
    {
        JsonModel json = new JsonModel(false, "您未登陆或者登陆超时，请重新登陆！", "login");
        ResponseJson(json);
    }
    /// <summary>
    /// 输出操作成功的Json
    /// </summary>
    /// <param name="context"></param>
    public void ResponseSuccess()
    {
        JsonModel json = new JsonModel(true, "操作成功！", "");
        ResponseJson(json);
    }
    /// <summary>
    /// 输出操作成功的Json
    /// </summary>
    /// <param name="context"></param>
    public void ResponseSuccess(string data)
    {
        JsonModel json = new JsonModel(true, "操作成功！", data);
        ResponseJson(json);
    }
    /// <summary>
    /// 输出操作失败的Json
    /// </summary>
    /// <param name="context"></param>
    /// <param name="msg">消息</param>
    public void ResponseFailure(string msg)
    {
        JsonModel json = new JsonModel(false, msg, "");
        ResponseJson(json);
    }
    /// <summary>
    /// 输出Json
    /// </summary>
    /// <param name="json"></param>
    public void ResponseJson(JsonModel json)
    {
        result = Newtonsoft.Json.JsonConvert.SerializeObject(json);
    }
    #endregion

    /// <summary>
    /// 输出
    /// </summary>
    /// <param name="context"></param>
    public override void ExecuteResult(ControllerContext context)
    {
        if (context == null)
        {
            throw new ArgumentNullException("context");
        }

        if (!string.IsNullOrEmpty(result))
        {
            context.HttpContext.Response.ContentType = "text/plain";
            context.HttpContext.Response.Write(result);
        }
    }
}

/// <summary>
/// 返回JsonModel
/// </summary>
public class JsonModel
{
    bool _success;
    string _message;
    object _data;
    string _action;

    /// <summary>
    /// 是否成功
    /// </summary>
    public bool Success
    {
        get { return _success; }
        set { _success = value; }
    }
    /// <summary>
    /// 消息
    /// </summary>
    public string Message
    {
        get { return _message; }
        set { _message = value; }
    }
    /// <summary>
    /// 数据
    /// </summary>
    public object Data
    {
        get { return _data; }
        set { _data = value; }
    }
    /// <summary>
    /// 操作
    /// </summary>
    public string Action
    {
        get { return _action; }
        set { _action = value; }
    }
    /// <summary>
    /// 实例化
    /// </summary>
    public JsonModel()
    {
    }
    /// <summary>
    /// 实例化
    /// </summary>
    public JsonModel(bool success, string message, object data, string action = "")
    {
        this.Success = success;
        this.Message = message;
        this.Data = data;
        this.Action = action;
    }
}