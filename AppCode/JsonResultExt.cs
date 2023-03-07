using System;
using System.Collections.Generic;
using System.Text;
using System.Web;
using System.Web.Mvc;


/// <summary>
/// ���Json
/// </summary>
public class JsonResultExt : ActionResult
{
    /// <summary>
    /// ������
    /// </summary>
    string result = null;

    #region ���캯��
    /// <summary>
    /// ���캯��
    /// </summary>
    /// <param name="success">�Ƿ�ɹ�</param>
    /// <param name="message">������Ϣ</param>
    /// <param name="data">��������</param>
    public JsonResultExt(bool success, string message = "", object data = null, string action = "")
    {
        JsonModel json = new JsonModel(success, message, data, action);
        ResponseJson(json);
    }
    /// <summary>
    /// ���캯��
    /// </summary>
    /// <param name="json">����JSON</param>
    public JsonResultExt(JsonModel json)
    {
        ResponseJson(json);
    }
    #endregion

    #region ��չ����
    /// <summary>
    /// �����Ҫ��½��Json
    /// </summary>
    /// <param name="context"></param>
    public void ResponseLogin()
    {
        JsonModel json = new JsonModel(false, "��δ��½���ߵ�½��ʱ�������µ�½��", "login");
        ResponseJson(json);
    }
    /// <summary>
    /// ��������ɹ���Json
    /// </summary>
    /// <param name="context"></param>
    public void ResponseSuccess()
    {
        JsonModel json = new JsonModel(true, "�����ɹ���", "");
        ResponseJson(json);
    }
    /// <summary>
    /// ��������ɹ���Json
    /// </summary>
    /// <param name="context"></param>
    public void ResponseSuccess(string data)
    {
        JsonModel json = new JsonModel(true, "�����ɹ���", data);
        ResponseJson(json);
    }
    /// <summary>
    /// �������ʧ�ܵ�Json
    /// </summary>
    /// <param name="context"></param>
    /// <param name="msg">��Ϣ</param>
    public void ResponseFailure(string msg)
    {
        JsonModel json = new JsonModel(false, msg, "");
        ResponseJson(json);
    }
    /// <summary>
    /// ���Json
    /// </summary>
    /// <param name="json"></param>
    public void ResponseJson(JsonModel json)
    {
        result = Newtonsoft.Json.JsonConvert.SerializeObject(json);
    }
    #endregion

    /// <summary>
    /// ���
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
/// ����JsonModel
/// </summary>
public class JsonModel
{
    bool _success;
    string _message;
    object _data;
    string _action;

    /// <summary>
    /// �Ƿ�ɹ�
    /// </summary>
    public bool Success
    {
        get { return _success; }
        set { _success = value; }
    }
    /// <summary>
    /// ��Ϣ
    /// </summary>
    public string Message
    {
        get { return _message; }
        set { _message = value; }
    }
    /// <summary>
    /// ����
    /// </summary>
    public object Data
    {
        get { return _data; }
        set { _data = value; }
    }
    /// <summary>
    /// ����
    /// </summary>
    public string Action
    {
        get { return _action; }
        set { _action = value; }
    }
    /// <summary>
    /// ʵ����
    /// </summary>
    public JsonModel()
    {
    }
    /// <summary>
    /// ʵ����
    /// </summary>
    public JsonModel(bool success, string message, object data, string action = "")
    {
        this.Success = success;
        this.Message = message;
        this.Data = data;
        this.Action = action;
    }
}