/**************************************************
*
*      Wsfly.com 基础Js文件
*      Author:IROR
*      Version:v1.0.2
*      Release Date:2017-02-26
*      Release Url:http://www.wsfly.com/
*
**************************************************/

//全局
var Webconfig = new Object();
Webconfig.AppSettings = {
    Domain: "http://localhost:9990",
    StaticSources: "/Resources",
    FileSources: "/Uploads"
};

var _loadJsIndex = 1;
function LoadJs(url) {
    //同步加载JS
    var xmlHttp = null;
    if (window.ActiveXObject) {
        //IE  
        try {
            //IE6以及以后版本中可以使用  
            xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
        }
        catch (e) {
            //IE5.5以及以后版本可以使用  
            xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
    }
    else if (window.XMLHttpRequest) {
        //Firefox，Opera 8.0+，Safari，Chrome  
        xmlHttp = new XMLHttpRequest();
    }
    //采用同步加载  
    xmlHttp.open("GET", url, false);
    //发送同步请求，如果浏览器为Chrome或Opera，必须发布后才能运行，不然会报错  
    xmlHttp.send(null);
    //4代表数据发送完毕  
    if (xmlHttp.readyState == 4) {
        //0为访问的本地，200到300代表访问服务器成功，304代表没做修改访问的是缓存  
        if ((xmlHttp.status >= 200 && xmlHttp.status < 300) || xmlHttp.status == 0 || xmlHttp.status == 304) {
            var htmlHead = document.getElementsByTagName("head")[0];
            var dyncScript = document.createElement("script");
            dyncScript.language = "javascript";
            dyncScript.type = "text/javascript";
            dyncScript.id = "dyncLoadJS_" + _loadJsIndex++;
            try {
                //IE8以及以下不支持这种方式，需要通过text属性来设置  
                dyncScript.appendChild(document.createTextNode(xmlHttp.responseText));
            }
            catch (ex) {
                dyncScript.text = xmlHttp.responseText;
            }
            htmlHead.appendChild(dyncScript);
            return true;
        }
        else {
            return false;
        }
    }
    else {
        return false;
    }
};

var _emptyPic = Webconfig.AppSettings.StaticSources + "/Images/pic.Empty.gif";
var _loadingPic = Webconfig.AppSettings.StaticSources + "/Images/pic.loading.gif";
var _pageLoadingPic = Webconfig.AppSettings.StaticSources + "/Images/pic.pageloding.gif";

/*=============================================================================
*  Js扩展 BEGIN
*=============================================================================*/
//格式化
String.prototype.Format = function () {
    var args = arguments;
    return this.replace(/\{(\d+)\}/g, function (m, i) {
        return args[i];
    });
};
//字符编码
String.prototype.Encode = function () {
    if (IsNullOrEmpty(this)) return "";
    return encodeURI(this);
};
//字符解码
String.prototype.Decode = function () {
    if (IsNullOrEmpty(this)) return "";
    return decodeURI(this);
};
//去掉所有的html标记
String.prototype.RemoveHtmlTags = function () {
    return this.replace(/<[^>]+>/g, "");
}

//统计字符串长度 一个中文当两个字符
String.prototype.Count = function () {
    var len = 0;
    for (var i = 0; i < this.length; i++) {
        if (this.charCodeAt(i) > 255) {
            len += 2;
        } else {
            len++;
        }
    }
    return len;
};
//是否“xxx”以字符开始
String.prototype.StartWith = function (str) {
    if (IsNullOrEmpty(str) || this.length == 0 || str.length > this.length) return false;

    if (this.substr(0, str.length) == str) return true;
    else return false;

    return true;
};
//是否以“xxx”字符结尾
String.prototype.EndWith = function (str) {
    if (IsNullOrEmpty(str) || this.length == 0 || str.length > this.length) return false;

    if (this.substr(this.length - str.length) == str) return true;
    else return false;

    return true;
};
//去掉字符
String.prototype.Trim = function (tag) {
    //去掉空格
    var source = this.replace(/(^\s*)|(\s*$)/g, "");

    if (tag) {
        //去掉字符串中的首尾字符
        while (true) {
            if (source.StartWith(tag)) {
                source = source.substr(tag.length);
                continue;
            }
            if (source.EndWith(tag)) {
                source = source.substr(0, source.length - tag.length);
                continue;
            }
            break;
        }
    }

    return source;
};
String.prototype.TrimStart = function (tag) {
    //去掉空格
    var source = this.replace(/(^\s*)|(\s*$)/g, "");

    if (tag) {
        //去掉字符串中的首尾字符
        while (true) {
            if (source.StartWith(tag)) {
                source = source.substr(tag.length);
                continue;
            }
            break;
        }
    }

    return source;
};
String.prototype.TrimEnd = function (tag) {
    //去掉空格
    var source = this.replace(/(^\s*)|(\s*$)/g, "");

    if (tag) {
        //去掉字符串中的首尾字符
        while (true) {
            if (source.EndWith(tag)) {
                source = source.substr(0, source.length - tag.length);
                continue;
            }
            break;
        }
    }

    return source;
};
//转换为Json对象
String.prototype.ToJson = function () {
    return eval('(' + this + ')');
};
//转换为Int对象
String.prototype.ToInt = function () {
    return parseInt(this);
};
//转换为Boolen对象
String.prototype.ToBoolen = function () {
    if (IsNullOrEmpty(this)) return false;
    if (this == "1" || this.toLowerCase() == "true" || this == "是") return true;
    return false;
};
//转换为HTML
String.prototype.ToHtml = function () {
    if (IsNullOrEmpty(this)) return false;
    return this.replace(/\r\n/g, "<br />").replace(/\r/g, "<br />").replace(/\n/g, "<br />");
};
//截取字符串 一个中文当两个字符
String.prototype.SubString = function (len, endStr) {
    if (this.Count() <= len) return this;

    var currentLen = 0;
    var strCount = 1;
    var chineseRegex = /[^\x00-\xff]/g;

    for (var i = 0; i < this.length; i++) {
        if (this.charAt(i).match(chineseRegex) != null) {
            currentLen += 2;
        } else {
            currentLen++;
        }

        if (currentLen >= len) break;
        strCount++;
    }

    var result = this.substr(0, strCount);

    if (endStr) result += endStr;
    else result += '...';

    return result;
};
//转换为显示日期 2012-03-07 前天 昨天 今天 N分钟前 N秒前
String.prototype.ShowDate = function () {
    var today = new Date();
    var source = this.ToDate();
    var timeSpan = TimeSpan(today, source);

    if (timeSpan.hours - today.getHours() - 48 > 0) return source.Format("yyyy-MM-dd HH:mm");
    else if (timeSpan.hours - today.getHours() - 24 > 0) return "前天 " + source.Format("HH:mm");
    else if (timeSpan.hours - today.getHours() > 0) return "昨天 " + source.Format("HH:mm");
    else if (timeSpan.hours < 24 && timeSpan.hours > 3) return "今天 " + source.Format("HH:mm");
    else if (timeSpan.hours < 3 && timeSpan.hours > 2) return "2小时前";
    else if (timeSpan.hours < 2 && timeSpan.hours > 1) return "1小时前";
    else if (timeSpan.minutes < 60 && timeSpan.minutes > 1) return Math.floor(timeSpan.minutes) + "分钟前";
    else if (timeSpan.minutes < 1) return Math.floor(timeSpan.seconds) + "秒前";
};
//是否日期格式
String.prototype.IsDate = function () {
    //var pattern = /^(19|20)\d\d+[-]*(0[1-9]|1[012])+[-]*(0[1-9]|[12][0-9]|3[01])$/
    var datetime = this;
    if (this.indexOf('T') > 0) datetime = this.replace(/T/g, ' ');

    //验证格式：2000-01-01 或 2017-01-01 00:00:00 或 2017-01-01 00:00:00.000 
    //          yyyy-MM-dd    yyyy-MM-dd HH:mm:ss    yyyy-MM-dd HH:mm:ss.fff
    var pattern = /(^(\d{4})\-(\d{1,2})\-(\d{1,2})$)|(^(\d{4})\-(\d{1,2})\-(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$)|(^(\d{4})\-(\d{1,2})\-(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2}).\d{1,6}$)/;
    if (!pattern.exec(datetime)) return false;
    return true;
};
//转换为日期
String.prototype.ToDate = function () {
    if (IsNullOrEmpty(this)) return "";
    var datetime = this;
    if (this.indexOf('T') > 0) datetime = this.replace(/T/g, ' ');

    if (!datetime.IsDate()) return "";
    var tempStrs = datetime.split(" ");
    if (IsNullOrEmpty(tempStrs)) return "";

    var dateStrs = tempStrs[0].split("-");
    var year = parseInt(dateStrs[0], 10);
    var month = parseInt(dateStrs[1], 10) - 1;
    var day = parseInt(dateStrs[2], 10);

    var hour = 0;
    var minute = 0;
    var second = 0;

    if (tempStrs.length == 2) {
        var timeStrs = tempStrs[1].split(":");
        hour = parseInt(timeStrs[0], 10);
        minute = parseInt(timeStrs[1], 10);
        second = parseInt(timeStrs[2], 10);
    }

    //返回日期
    return new Date(year, month, day, hour, minute, second);
};
//转换为日期
String.prototype.ToShowDate = function () {
    if (IsNullOrEmpty(this)) return "";
    var datetime = this;
    if (this.indexOf('T') > 0) datetime = this.replace(/T/g, ' ');

    if (!datetime.IsDate()) return "";
    var tempStrs = datetime.split(" ");
    if (IsNullOrEmpty(tempStrs)) return "";

    var dateStrs = tempStrs[0].split("-");
    var year = parseInt(dateStrs[0], 10);
    var month = parseInt(dateStrs[1], 10) - 1;
    var day = parseInt(dateStrs[2], 10) + 1;

    var hour = 0;
    var minute = 0;
    var second = 0;

    if (tempStrs.length == 2) {
        var timeStrs = tempStrs[1].split(":");
        hour = parseInt(timeStrs[0], 10);
        minute = parseInt(timeStrs[1], 10) - 1;
        second = parseInt(timeStrs[2], 10);
    }

    //返回日期
    var date = new Date(year, month, day, hour, minute, second);
    return date.Format('yyyy-MM-dd HH:mm:ss');
};


/*=========================================日期===============================================*/

//---------------------------------------------------  
// 日期格式化  
// 格式 YYYY/yyyy/YY/yy 表示年份  
// MM/M 月份  
// W/w 星期  
// dd/DD/d/D 日期  
// hh/HH/h/H 时间  
// mm/m 分钟  
// ss/SS/s/S 秒  
//---------------------------------------------------
Date.prototype.Format = function (formatStr) {
    var str = formatStr;
    var Week = ['日', '一', '二', '三', '四', '五', '六'];

    str = str.replace(/yyyy|YYYY/, this.getFullYear());
    str = str.replace(/yy|YY/, (this.getYear() % 100) > 9 ? (this.getYear() % 100).toString() : '0' + (this.getYear() % 100));

    str = str.replace(/MM/, this.getMonth() >= 9 ? (this.getMonth() + 1).toString() : '0' + (this.getMonth() + 1));
    str = str.replace(/M/g, (this.getMonth() + 1));

    str = str.replace(/w|W/g, Week[this.getDay()]);

    str = str.replace(/dd|DD/, this.getDate() > 9 ? this.getDate().toString() : '0' + this.getDate());
    str = str.replace(/d|D/g, this.getDate());

    str = str.replace(/hh|HH/, this.getHours() > 9 ? this.getHours().toString() : '0' + this.getHours());
    str = str.replace(/h|H/g, this.getHours());
    str = str.replace(/mm/, this.getMinutes() > 9 ? this.getMinutes().toString() : '0' + this.getMinutes());
    str = str.replace(/m/g, this.getMinutes());

    str = str.replace(/ss|SS/, this.getSeconds() > 9 ? this.getSeconds().toString() : '0' + this.getSeconds());
    str = str.replace(/s|S/g, this.getSeconds());

    return str;
};

//---------------------------------------------------  
// 日期计算  
//---------------------------------------------------
Date.prototype.DateAdd = function (strInterval, number) {
    var dtTmp = this;
    switch (strInterval) {
            //秒
        case 's': return new Date(Date.parse(dtTmp) + (1000 * number));
            //分
        case 'n': return new Date(Date.parse(dtTmp) + (60000 * number));
            //小时
        case 'h': return new Date(Date.parse(dtTmp) + (3600000 * number));
            //天
        case 'd': return new Date(Date.parse(dtTmp) + (86400000 * number));
            //周
        case 'w': return new Date(Date.parse(dtTmp) + ((86400000 * 7) * number));
            //季
        case 'q': return new Date(dtTmp.getFullYear(), (dtTmp.getMonth()) + number * 3, dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());
            //月
        case 'm': return new Date(dtTmp.getFullYear(), (dtTmp.getMonth()) + number, dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());
            //年
        case 'y': return new Date((dtTmp.getFullYear() + number), dtTmp.getMonth(), dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());
    }
};
//---------------------------------------------------  
// 比较日期差 dtEnd 格式为日期型或者 有效日期格式字符串  
//---------------------------------------------------
Date.prototype.DateDiff = function (strInterval, dtEnd) {
    var dtStart = this;
    if (typeof dtEnd == 'string')//如果是字符串转换为日期型  
    {
        dtEnd = StringToDate(dtEnd);
    }
    switch (strInterval) {
        case 's': return parseInt((dtEnd - dtStart) / 1000);
        case 'n': return parseInt((dtEnd - dtStart) / 60000);
        case 'h': return parseInt((dtEnd - dtStart) / 3600000);
        case 'd': return parseInt((dtEnd - dtStart) / 86400000);
        case 'w': return parseInt((dtEnd - dtStart) / (86400000 * 7));
        case 'm': return (dtEnd.getMonth() + 1) + ((dtEnd.getFullYear() - dtStart.getFullYear()) * 12) - (dtStart.getMonth() + 1);
        case 'y': return dtEnd.getFullYear() - dtStart.getFullYear();
    }
};
//---------------------------------------------------  
// 求两个时间的天数差 日期格式为 YYYY-MM-dd   
//---------------------------------------------------  
function DaysBetween(DateOne, DateTwo) {
    var OneMonth = DateOne.substring(5, DateOne.lastIndexOf('-'));
    var OneDay = DateOne.substring(DateOne.length, DateOne.lastIndexOf('-') + 1);
    var OneYear = DateOne.substring(0, DateOne.indexOf('-'));

    var TwoMonth = DateTwo.substring(5, DateTwo.lastIndexOf('-'));
    var TwoDay = DateTwo.substring(DateTwo.length, DateTwo.lastIndexOf('-') + 1);
    var TwoYear = DateTwo.substring(0, DateTwo.indexOf('-'));

    var cha = ((Date.parse(OneMonth + '/' + OneDay + '/' + OneYear) - Date.parse(TwoMonth + '/' + TwoDay + '/' + TwoYear)) / 86400000);
    return Math.abs(cha);
};
//---------------------------------------------------  
// 日期输出字符串，重载了系统的toString方法  
//---------------------------------------------------
Date.prototype.ToString = function (showWeek) {
    var myDate = this;
    var str = myDate.toLocaleDateString();
    if (showWeek) {
        var Week = ['日', '一', '二', '三', '四', '五', '六'];
        str += ' 星期' + Week[myDate.getDay()];
    }
    return str;
};
//---------------------------------------------------  
// 把日期分割成数组  
//---------------------------------------------------
Date.prototype.ToArray = function () {
    var myDate = this;
    var myArray = Array();
    myArray[0] = myDate.getFullYear();
    myArray[1] = myDate.getMonth();
    myArray[2] = myDate.getDate();
    myArray[3] = myDate.getHours();
    myArray[4] = myDate.getMinutes();
    myArray[5] = myDate.getSeconds();
    return myArray;
};
//---------------------------------------------------  
// 取得日期数据信息  
// 参数 interval 表示数据类型  
// y 年 m月 d日 w星期 ww周 h时 n分 s秒  
//---------------------------------------------------
Date.prototype.DatePart = function (interval) {
    var myDate = this;
    var partStr = '';
    var Week = ['日', '一', '二', '三', '四', '五', '六'];
    switch (interval) {
        case 'y': partStr = myDate.getFullYear(); break;
        case 'm': partStr = myDate.getMonth() + 1; break;
        case 'd': partStr = myDate.getDate(); break;
        case 'w': partStr = Week[myDate.getDay()]; break;
        case 'ww': partStr = myDate.WeekNumOfYear(); break;
        case 'h': partStr = myDate.getHours(); break;
        case 'n': partStr = myDate.getMinutes(); break;
        case 's': partStr = myDate.getSeconds(); break;
    }
    return partStr;
};
//---------------------------------------------------  
// 判断闰年  
//---------------------------------------------------
Date.prototype.IsLeapYear = function () {
    return (0 == this.getYear() % 4 && ((this.getYear() % 100 != 0) || (this.getYear() % 400 == 0)));
};
//---------------------------------------------------  
// 取得当前日期所在月的最大天数  
//---------------------------------------------------
Date.prototype.MaxDayOfDate = function () {
    var myDate = this;
    var ary = myDate.toArray();
    var date1 = (new Date(ary[0], ary[1] + 1, 1));
    var date2 = date1.dateAdd(1, 'm', 1);
    var result = dateDiff(date1.Format('yyyy-MM-dd'), date2.Format('yyyy-MM-dd'));
    return result;
};

/*时差 2012-03-07*/
function TimeSpan(today, source) {
    var value = Date.parse(today) - Date.parse(source);
    return {
        yeers: value / 1000 / 60 / 60 / 24 / 12 / 365,
        months: value / 1000 / 60 / 60 / 24 / 12,
        days: value / 1000 / 60 / 60 / 24,
        hours: value / 1000 / 60 / 60,
        minutes: value / 1000 / 60,
        seconds: value / 1000
    };
};

//---------------------------------------------------  
// 取得当前日期时间 
// 格式：yyyy-MM-dd HH:mm:ss
//---------------------------------------------------
function DateNow() {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }

    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }

    return date.getFullYear() + seperator1 + month + seperator1 + strDate + " " + date.getHours() + seperator2 + date.getMinutes() + seperator2 + date.getSeconds();
}
function GetTimestamp() {
    //精确到毫秒
    return new Date().getTime();
}

/*=========================================日期===============================================*/
//---------------------------------------------------
//是否包含项
//---------------------------------------------------
Array.prototype.contains = function (value) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] === value) return true;
    }
    return false;
}

/*=========================================网页===============================================*/

/*
公共方法
增加 getElementsByClassName 方法，按 ClassName 查询元素
*/
document.getElementsByClassName = function (cl) {
    var retnode = [];
    var myclass = new RegExp('\\b' + cl + '\\b');
    var elem = this.getElementsByTagName('*');
    for (var i = 0; i < elem.length; i++) {
        var classes = elem[i].className;
        if (myclass.test(classes)) retnode.push(elem[i]);
    }
    return retnode;
};

/*=============================================================================
*  Js扩展 END
*=============================================================================*/


/*=============================================================================
*  Js验证 BEGIN
*=============================================================================*/

function IsMobile(value) {
    //验证手机号码合法性
    value = value.replace("+86", "");
    value = value.replace("-", "");
    var regu = /^[1](3|4|5|6|7|8|9)[0-9]{9}$/;
    var re = new RegExp(regu);
    return re.test(value);
};
function IsTelphone(value) {
    //是否电话号码（固话、手机）
    value = value.replace("+86-", "");
    value = value.replace("+86", "");
    var regu = /^(((0[0-9]{2,3})\-\d{7,8})|(1[1-9]\d{9}))$/;
    var re = new RegExp(regu);
    return re.test(value);
};
function IsEmail(value) {
    //是否邮箱
    var regu = /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/;
    var re = new RegExp(regu);
    return re.test(value);
};
function IsInt(value) {
    //是否整数
    var regu = /^\d+$/;
    var re = new RegExp(regu);
    return re.test(value);
};
function IsFloat(value) {
    //是否浮点数
    var regu = /^[+-]?\d+(\.[\d]+)?$/;
    var re = new RegExp(regu);
    return re.test(value);
};
function IsFinite(obj) {
    //是否数字 有限数值
    return !isNaN(parseFloat(n)) && isFinite(n);
}
function IsNumber(obj) {
    //是否数字 
    return typeof obj === 'number' && !isNaN(obj);
}
function IsPassword(value) {
    //是否有效的密码
    var regu = /^([A-Z]|[a-z]|[0-9]|[`~!@#$%^&*()+=|{}':;',\\\\[\\\\].<>\/?~！￥……&*（）——+|{}【】‘；：”“'。，、？]){6,20}$/;
    var re = new RegExp(regu);
    return re.test(value);
};
function IsFunction(value) {
    //是否有值
    if (value == null || value == undefined) return false;
    //是否函数
    return (typeof (value) == "function");
};
function IsIE6() {
    //是否IE6
    var browserInfo = new Wsfly.BrowserInfo();
    return (browserInfo.msie && browserInfo.version == "6.0");
};
function IsSupportHTML5() {
    //是否支持HTML5
    if (window.applicationCache) {
        return true;
    }
    else {
        return false;
    }
};
function IsChinese(s) {
    //判断字符是否是中文字符 
    var patrn = /[\u4E00-\u9FA5]|[\uFE30-\uFFA0]/gi;
    if (!patrn.exec(s)) {
        return false;
    } else {
        return true;
    }
};
function Clone(obj) {
    //复制对象
    var o;
    if (typeof obj == "object") {
        if (obj === null) {
            o = null;
        }
        else {
            if (obj instanceof Array) {
                o = [];
                for (var i = 0, len = obj.length; i < len; i++) {
                    o.push(Clone(obj[i]));
                }
            }
            else {
                o = {};
                for (var j in obj) {
                    o[j] = Clone(obj[j]);
                }
            }
        }
    } else {
        o = obj;
    }
    return o;
};
/*=============================================================================
*  Js验证 END
*=============================================================================*/




/*=============================================================================
*  通用 BEGIN
*=============================================================================*/
function IsNullOrEmpty(value) {
    //是否为空
    if (value === undefined || value == null) {
        return true;
    }

    if (value.toString().replace(/(^\s+|\s$)/g, "") == "") {
        return true;
    } else {
        return false;
    }
};
function ToJson(value) {
    //转换为Json
    if (value === undefined || value == null) return {};
    return eval('(' + decodeURI(value) + ')');
}
function GetUrlUnionChar(url) {
    //Url的连接字符
    if (IsNullOrEmpty(url)) return "?";

    if (url.indexOf("?") >= 0) return "&";

    return "?";
};
function Millisecond(value) {
    //毫秒
    if (IsNullOrEmpty(value)) value = 3000;
    else if (value <= 0) value = 3000;
    else if (value < 10) value = value * 1000;
    else if (value < 100) value = value * 100;
    else if (value < 1000) value = value * 10;

    return value;
};
function GetPageCount(totalCount, pageSize) {
    //计算分页数量
    return totalCount % pageSize == 0 ? totalCount / pageSize : Math.ceil(totalCount / pageSize);
};
/*=============================================================================
*  通用 END
*=============================================================================*/

/*扩展Jquery*/
(function ($) {
    $.fn.extend({
        //滚动条事件
        wsmousewheel: function (Func) {
            return this.each(function () {
                var _self = this;
                _self.Direction = 0; //滚动方向：大于0向上，小于0向下

                if ($.browser && $.browser != undefined && ($.browser.msie || $.browser.safari)) {
                    _self.onmousewheel = function () {
                        _self.Direction = event.wheelDelta;
                        event.returnValue = false;
                        Func && Func.call(_self);
                    };
                } else {
                    _self.addEventListener("DOMMouseScroll", function (e) {
                        _self.Direction = e.detail > 0 ? -1 : 1;
                        e.preventDefault();
                        Func && Func.call(_self);
                    }, false);
                }
            });
        }
    });
})(jQuery);

/*=============================================================================
*  扩展Wsfly BEGIN
*=============================================================================*/
window.Wsfly = window.Wsfly || {};

//初始化
Wsfly.Init = function () {
    //装载事件
    Wsfly.Event.LoadEvent();
    //键盘事件初始化
    Wsfly.Keyboard.Init();
    //初始Wsfly 功能
    Wsfly.Actions.Init();
    //移除正在加载
    $("#divLoadingPage").remove();
};
/*
动态导入Js文件
Wsfly.Loader.LoadJs("/Scripts/JavaScript.Common.js", function () { Tips('abc'); });
*/
Wsfly.Browser = {
    ie: /msie/.test(window.navigator.userAgent.toLowerCase()),
    moz: /gecko/.test(window.navigator.userAgent.toLowerCase()),
    opera: /opera/.test(window.navigator.userAgent.toLowerCase()),
    safari: /safari/.test(window.navigator.userAgent.toLowerCase())
};
Wsfly.BrowserInfo = function appInfo() {
    var browser = {
        msie: false, firefox: false, opera: false, safari: false,
        chrome: false, netscape: false, appname: 'unknown', version: 0
    },
    userAgent = window.navigator.userAgent.toLowerCase();

    if (/(msie|firefox|opera|chrome|netscape)\D+(\d[\d.]*)/.test(userAgent)) {
        browser[RegExp.$1] = true;
        browser.appname = RegExp.$1;
        browser.version = RegExp.$2;
    } else if (/version\D+(\d[\d.]*).*safari/.test(userAgent)) { // safari
        browser.safari = true;
        browser.appname = 'safari';
        browser.version = RegExp.$2;
    }
    return browser;
};
//确认
Wsfly.Confirm = function (msg, okCallback, cancelCallback) {
    if (!IsFunction(cancelCallback)) cancelCallback = function () { }
    Wsfly.Alert(null, msg, okCallback, cancelCallback);
};
//提示
Wsfly.Alert = function (title, msg, okCallback, cancelCallback) {
    if (IsNullOrEmpty(title)) title = "温馨提示：";
    if (IsNullOrEmpty(msg)) return;

    if (IsFunction(okCallback) && IsFunction(cancelCallback)) {
        //两个回调函数
        //有确定回调函数
        return $.artDialog({
            lock: false,
            background: '#600',
            opacity: 0.87,
            drag: true,
            resize: true,
            title: title,
            content: msg,
            okValue: "确定",
            ok: okCallback,
            cancelValue: "取消",
            cancel: cancelCallback
        });
    }
    else if (IsFunction(okCallback)) {
        //有确定回调函数
        return $.artDialog({
            lock: false,
            background: '#600',
            opacity: 0.87,
            drag: true,
            resize: true,
            title: title,
            content: msg,
            okValue: "确定",
            ok: okCallback
        });
    }
    else if (IsFunction(cancelCallback)) {
        //有取消回调函数
        return $.artDialog({
            lock: false,
            background: '#600',
            opacity: 0.87,
            drag: true,
            resize: true,
            title: title,
            content: msg,
            okValue: "取消",
            ok: cancelCallback
        });
    }
    else {
        //无回调函数 仅提示
        return $.artDialog({
            lock: false,
            background: '#600',
            opacity: 0.87,
            drag: true,
            resize: true,
            title: title,
            content: msg,
            okValue: "确定",
            ok: true
        });
    }
};
//提示
Wsfly.ZENG = {};
Wsfly.ZENG.Tips = function (msg, type, seconds) {
    //type == 1：消息；4：正确；5：错误；6：请稍候
    if (IsNullOrEmpty(msg)) return;
    if (IsNullOrEmpty(type)) type = 1;
    if (type == 6) seconds = 0;

    if (IsNullOrEmpty(seconds)) seconds = 2000;
    else if (seconds <= 0) seconds = 24 * 60 * 60 * 1000;
    else if (seconds < 10) seconds = seconds * 1000;
    else if (seconds < 100) seconds = seconds * 100;
    else if (seconds < 1000) seconds = seconds * 10;

    ZENG = window.ZENG || {};

    if (ZENG.msgbox != undefined) {
        ZENG.msgbox.show(msg, type, seconds);
    }
    else {
        Wsfly.ShowTips(msg, seconds);
    }
};
//提示
Wsfly.ZENG.Tips.Info = function (msg, seconds) {
    Wsfly.ZENG.Tips(msg, 1, seconds);
};
//成功提示
Wsfly.ZENG.Tips.Ok = function (msg, seconds) {
    Wsfly.ZENG.Tips(msg, 4, seconds);
};
//失败提示
Wsfly.ZENG.Tips.Error = function (msg, seconds) {
    Wsfly.ZENG.Tips(msg, 5, seconds);
};
//等待提示
Wsfly.ZENG.Tips.Wait = function (msg, seconds) {
    Wsfly.ZENG.Tips(msg, 6, seconds);
};
///隐藏提示
Wsfly.ZENG.Tips.Hide = function () {
    ZENG = window.ZENG || {};

    if (ZENG.msgbox != undefined) {
        ZENG.msgbox.hide();
    }
    else {
        $(".div_Wsfly_MiniTips").remove();
    }
};
///模态框
Wsfly.Dialog = {
    Options: {
        Width: 300,
        Height: 300,
        Title: "对话框",
        Html: null,
        BackgroundColor: "#000",
        BackgroundImage: null,
        ShownCallback: function () { },
        CloseCallback: function () { },
        Lock: true
    },
    Show: function (options) {
        //参数化
        options = $.extend(Wsfly.Dialog.Options, options);

        //样式
        var style = "width:" + options.Width + "px;height:" + options.Height + "px; margin-left:-" + (options.Width / 2) + "px; margin-top:-" + (options.Height / 2) + "px; background:" + options.BackgroundColor + ";";
        //浮动层
        var html = "<div class='Wsfly_Dialog' style=\"" + style + "\">" +
                   "    <div class='Wsfly_Dialog_Top'>" +
                   "        <div class='Wsfly_Dialog_Title'>" + options.Title + "</div>" +
                   "        <div id='divDialogClose' class='Wsfly_Dialog_Close'></div>" +
                   "    </div>" +
                   "    <div class='Wsfly_Dialog_Content'>" + options.Html + "</div>" +
                   "</div>";

        if (options.Lock) {
            //锁定背景
            html += "<div class='Wsfly_Dialog_Lock'></div>";
        }

        //存放DIV
        var htmlObject = document.createElement("div");
        htmlObject.innerHTML = html;

        //添加对象
        $("body").append(htmlObject);

        //显示后回调函数
        if (IsFunction(options.ShownCallback)) {
            options.ShownCallback();
        }

        //固定
        $(".Wsfly_Dialog_Lock").width($(document).width())
        $(".Wsfly_Dialog_Lock").height($(document).height())

        //浏览器居中
        var top = $(window).height() / 2 + $(document).scrollTop();
        $(".Wsfly_Dialog").css({ top: top });

        //绑定滚动条事件
        $(window).bind('scroll', function () {
            var scrollTop = $(window).height() / 2 + $(document).scrollTop();
            $(".Wsfly_Dialog").css({ top: scrollTop });
        });

        //关闭事件
        $("#divDialogClose").click(function () {
            //移除Dialog
            $(this).parent().parent().remove();
            $(".Wsfly_Dialog_Lock").remove();

            //回调函数
            if (IsFunction(options.CloseCallback)) {
                options.CloseCallback();
            }
        });
    }
};
//加载
Wsfly.Loader = {
    LoadJs: function (sUrl, fCallback) {
        var _script = document.createElement('script');
        _script.setAttribute('charset', 'gb2312');
        _script.setAttribute('type', 'text/javascript');
        _script.setAttribute('src', sUrl);
        document.getElementsByTagName('head')[0].appendChild(_script);
        if (OOSite.Browser.ie) {
            _script.onreadystatechange = function () {
                if (this.readyState == 'loaded' || this.readyStaate == 'complete') {
                    if (fCallback != null && fCallback != undefined) {
                        fCallback();
                    }
                }
            };
        } else if (OOSite.Browser.moz) {
            if (fCallback != null && fCallback != undefined) {
                _script.onload = function () {
                    fCallback();
                };
            }
        } else if (fCallback != null && fCallback != undefined) {
            fCallback();
        }
    }
};
//当前
Wsfly.Location = {
    //跳转页面
    GoTo: function (url) {
        Wsfly.Tips.Wait("请稍候，正在跳转页面……");
        window.location.href = url;
    },
    //重新加载、刷新页面
    Reload: function () {
        Wsfly.Tips.Wait("请稍候，正在重新加载…");
        window.location.href = window.location.href;
    },
    //重新加载、刷新页面
    ReloadAndTips: function (msg, delay) {
        Wsfly.Tips.Info(msg);
        if (delay > 0) {
            window.setTimeout(function () {
                window.location.href = window.location.href;
            }, delay);

            return;
        }
        window.location.href = window.location.href;
    },
    //返回上一页
    Back: function () {
        window.history.go(-1);
    }
};
//窗口
Wsfly.Window = {
    //打开新窗口
    Open: function (url) { Wsfly.Window.OpenWindow(url, null, null, true, "newWindow_" + Math.random().toString().replace('.', "")); },
    //显示模态框
    Dialog: function (options) {
        //子页面返回
        //window.returnValue = jsonObj;
        //window.close();
        var defaultOptions = { Url: "/", Width: 400, Height: 300, Status: "no" };
        //默认参数
        options = $.extend(defaultOptions, options);
        //返回值
        var result = window.showModalDialog(options.Url, window, "dialogWidth:" + options.Width + "px;status:" + options.Status + ";dialogHeight:" + options.Height + "px");

        //空值
        if (result == undefined) result = null;

        //返回值
        return result;
    },
    //打开新窗口
    OpenWindow: function (url, width, height, showToolBar, windowName) {
        if (!IsNullOrEmpty(url)) {
            var scrWidth = (IsNullOrEmpty(width) ? screen.availWidth : width);
            var scrHeight = (IsNullOrEmpty(height) ? screen.availHeight : height);

            var toolBar = "";

            if (showToolBar == undefined || showToolBar) {
                toolBar = "resizable=yes,toolbar=yes, menubar=yes, scrollbars=yes, location=yes, status=yes, top=0, left=0, alwaysRaised=yes, z-look=yes, width=" + scrWidth + ", height=" + scrHeight;
            }
            else {
                toolBar = "resizable=no,toolbar=no, menubar=no, scrollbars=no, location=no, status=no, top=0, left=0, alwaysRaised=no, z-look=yes, width=" + scrWidth + ", height=" + scrHeight;
            }

            var self = window.open(url, "WsflyWindow_" + windowName, toolBar);

            try {
                self.resizeTo(scrWidth, scrHeight);
                self.moveTo(screen.availWidth / 2 - scrWidth / 2, screen.availHeight / 2 - scrHeight / 2);
            }
            catch (ex) { }
        }
    },
    Close: function () {
        //关闭页面
        window.close();
    }
};
//文档
Wsfly.Document = {
    FindParentByClassName: function (obj, className) {
        //根据Class查找父级
        var findObj = $(obj).parent();

        if (findObj[0].className.toLowerCase() == className.toLowerCase()) {
            return findObj;
        }
        else {
            if ($(obj)[0].tagName == "HTML") return null;

            return Wsfly.Document.FindParentByClassName($(obj).parent()[0], className);
        }
    },
    FindParentByTag: function (obj, tagName) {
        //根据标签查找父级
        var findObj = $(obj).parent();

        if (findObj[0].tagName.toLowerCase() == tagName.toLowerCase()) {
            return findObj;
        }
        else {
            if ($(obj)[0].tagName == "HTML") return null;

            return this.FindParentByTag($(obj).parent()[0], tagName);
        }
    },
    FindObject: function (obj, express) {
        //根据表达式查找对象（上一级的子级查询）
        var findObj = $(obj).parent().find(express);

        if (findObj.length <= 0) {
            //是否还有上级
            if ($(obj)[0].tagName == "HTML") return null;
            //递归查询对象
            return this.FindObject($(obj).parent(), express);
        }
        else {
            //返回对象
            return findObj;
        }
    },
    SelectOff: function (filter) {
        //取消对象的拖动选择
        var obj = $(objId);

        obj.attr("unselectable", "on");
        obj.bind("selectstart", function () { return false; });

        if (Wsfly.Browser.moz) {
            obj.css({ "-moz-user-focus": "ignore", "-moz-user-input": "disabled", "-moz-user-select": "none" });
        }
    },
    SelectOn: function (filter) {
        //恢复对象的拖动选择
        var obj = $(objId);

        obj.attr("unselectable", "off");
        obj.bind("selectstart", function () { return true; });

        if (Wsfly.Browser.moz) {
            obj.css({ "-moz-user-focus": "normal", "-moz-user-input": "auto", "-moz-user-select": "auto" });
        }
    },
    SelectOffAll: function () {
        //禁用所有选择
        $("*").attr("unselectable", "on");
        $("*").bind("selectstart", function () { return false; });

        if (Wsfly.Browser.moz) {
            $("*").css({ "-moz-user-focus": "ignore", "-moz-user-input": "disabled", "-moz-user-select": "none" });
        }
    },
    SelectOnAll: function () {
        //开启所有选择
        $("*").attr("unselectable", "off");
        $("*").bind("selectstart", function () { return true; });

        if (Wsfly.Browser.moz) {
            $("*").css({ "-moz-user-focus": "normal", "-moz-user-input": "auto", "-moz-user-select": "auto" });
        }
    },
    SameHeight: function (leftId, rightId, delay) {
        //两个层高度相同
        var left = document.getElementById(leftId);
        var right = document.getElementById(rightId);

        if (!left || !right) return;

        var height = Math.max(left.scrollHeight, right.scrollHeight);

        left.style.height = height + "px";
        right.style.height = height + "px";

        if (delay) {
            window.setInterval(function () {
                SameHeight(leftId, rightId);
            }, delay);
        }
    },
    GetPageSize: function () {
        var scrW, scrH;
        if (window.innerHeight && window.scrollMaxY) {
            // Mozilla
            scrW = window.innerWidth + window.scrollMaxX;
            scrH = window.innerHeight + window.scrollMaxY;
        }
        else if (document.body.scrollHeight > document.body.offsetHeight) {
            // all but IE Mac
            scrW = document.body.scrollWidth;
            scrH = document.body.scrollHeight;
        }
        else if (document.body) {
            // IE Mac
            scrW = document.body.offsetWidth;
            scrH = document.body.offsetHeight;
        }

        var winW, winH;
        if (window.innerHeight) {
            // all except IE
            winW = window.innerWidth;
            winH = window.innerHeight;
        }
        else if (document.documentElement && document.documentElement.clientHeight) {
            // IE 6 Strict Mode
            winW = document.documentElement.clientWidth;
            winH = document.documentElement.clientHeight;
        }
        else if (document.body) {
            // other
            winW = document.body.clientWidth;
            winH = document.body.clientHeight;
        }

        // for small pages with total size less then the viewport
        var pageW = (scrW < winW) ? winW : scrW;
        var pageH = (scrH < winH) ? winH : scrH;

        return { PageW: pageW, PageH: pageH, WinW: winW, WinH: winH };
    },
    //到页面顶部
    ToPageTop: function () {
        $('html, body').animate({ scrollTop: 0 });
    },
    //获取QueryString的数组
    QueryString: function () {
        var result = location.search.match(new RegExp("[\?\&][^\?\&]+=[^\?\&]+", "g"));
        if (result == null) {
            return "";
        }

        for (var i = 0; i < result.length; i++) {
            result[i] = result[i].substring(1);
        }
        return result;
    },
    //根据QueryString参数名称获取值
    GetQueryStringByName: function (name) {
        var result = location.search.match(new RegExp("[\?\&]" + name + "=([^\&]+)", "i"));
        if (result == null || result.length < 1) {
            return "";
        }
        result = result[0];
        var startIndex = result.indexOf("=") + 1;
        result = result.substring(startIndex);

        return result;
    },
    //根据QueryString参数索引获取值
    GetQueryStringByIndex: function (index) {
        if (index == null) {
            return "";
        }

        var queryStringList = QueryString();
        if (index >= queryStringList.length) {
            return "";
        }

        var result = queryStringList[index];
        var startIndex = result.indexOf("=") + 1;
        result = result.substring(startIndex);
        return result;
    },
    AllCheckBox: function (objId, wsTag) {
        $("#" + objId).change(function () {
            var obj = this;
            //复选框全选
            //var checked = $(obj).attr("checked");
            var checked = document.getElementById(objId).checked;
            if (checked == undefined) checked = false;
            else checked = true;

            if (checked) {
                $("input[wsTag='" + wsTag + "']").attr("checked", "true");
            } else {
                $("input[wsTag='" + wsTag + "']").removeAttr("checked");
            }
        });
    },
    CheckCheckBox: function (wsTag) {
        //检查复选框
        var count = $("input[wsTag='" + wsTag + "']:checkbox:checked").length;
        if (count > 0) return true;
        Wsfly.Tips.Info("请选择要操作的行记录！");
        return false;
    },
    GetAllCheckBoxValue: function (wsTag) {
        //得到所有复选框的值 以，分割
        var values = "";
        $("input[wsTag='" + wsTag + "']:checkbox:checked").each(function () {
            values += $(this).attr("value") + ",";
        });
        if (!IsNullOrEmpty(values)) values = values.Trim(",");
        return values;
    },
    /*
    名称：AddFavorite
    作用：加入收藏夹
    参数：sURL=页面地址
    sTitle=收藏标题
    示例：<a href="javascript:void(0);" onclick="AddFavorite(window.location,document.title)">加入收藏</a>
    */
    AddFavorite: function (sURL, sTitle) {
        try {
            window.external.addFavorite(sURL, sTitle);
        }
        catch (e) {
            try {
                window.sidebar.addPanel(sTitle, sURL, "");
            }
            catch (e) {
                alert("加入收藏失败，有劳您手动添加。");
            }
        }
    },
    /*
    名称：SetHome
    作用：设为主页
    参数：obj=操作对象 
    vrl=页面地址
    示例：<a href="javascript:void(0);" onclick="SetHome(this,window.location)">设为首页</a>
    */
    SetHome: function (obj, vrl) {
        try {
            obj.style.behavior = 'url(#default#homepage)'; obj.setHomePage(vrl);
        }
        catch (e) {
            if (window.netscape) {
                try {
                    netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
                }
                catch (e) {
                    alert("此操作被浏览器拒绝！\n请在浏览器地址栏输入“about:config”并回车\n然后将 [signed.applets.codebase_principal_support]的值设置为'true',双击即可。");
                }
                var prefs = Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefBranch);
                prefs.setCharPref('browser.startup.homepage', vrl);
            }
        }
    }
};
//坐标
Wsfly.Position = {
    GetRelativePosition: function (event) {
        ///得到事件坐标
        event = event || window.event;
        var target = event.target || event.srcElement; // 获得事件源
        var posX, posY;

        posX = event.layerX || event.offsetX;
        posY = event.layerY || event.offsetY;

        posX += target.offsetParent.offsetTop;
        posY += target.offsetParent.offsetLeft;

        return { x: posX, y: posY };
    }
};
//Cookies
Wsfly.Cookies = {
    /*设置Cookies*/
    Set: function (name, value, days) {
        days = days || 30;
        var exp = new Date();
        exp.setTime(exp.getTime() + days * 24 * 60 * 60 * 1000);
        document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
    },
    /*获取Cookies*/
    Get: function (name) {
        var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
        if (arr != null) return unescape(arr[2]);
        return null;
    },
    /*删除Cookies*/
    Del: function (name) {
        var cval = Wsfly.Cookies.Get(name);
        if (cval != null) {
            var exp = new Date();
            exp.setTime(exp.getTime() - 1);
            document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
        }
    }
};
//计算
Wsfly.Math = {
    GetRandomNumBy: function (miniNum, maxiNum) {
        return parseInt(Math.random() * (maxiNum - miniNum + 1) + miniNum);
    },
    GetRandomNum: function (maxiNum) {
        return GetRandomNumBy(0, maxiNum);
    }
};

/*****************************************************************************************
*
*       属性含有：wsTag='scroll' 则自动识别滚动条
*       自定义滚动条
*       
*       CSS
*       .Wsfly-ScrollBox{ width:500px; height:300px; overflow:hidden; zoom:1; border:solid 1px #ddd;}
*       .Wsfly-ScrollBox .ScrollBoxTitle{ height:40px; overflow:hidden; background:#eee; font-size:14px; font-weight:600; padding:0 10px; line-height:40px;  border-bottom:solid 1px #ddd;}
*       .Wsfly-ScrollBox .ScrollBoxList{ float:left; width:480px; height:260px; overflow:hidden; zoom:1;}
*       .Wsfly-ScrollBox .ContentInnerBox{ padding:10px; color:#555;}
*       .Scroll{ float:left; width:20px; height:100%; position:relative;}
*       .Scroll .ScrollLine{ height:100%; width:2px; background:#ddd; margin:0 auto;}
*       .Scroll .ScrollBar{ width:10px; height:40px; overflow:hidden; position:absolute; left:5px; top:0; cursor:pointer; background:#333; border-radius:5px;}
*       
*       HTML
*       <div class='Wsfly-ScrollBox'>
*           <div class='ScrollBoxTitle'>滚动列表标题</div>
*           <div class='ScrollBoxList' id="divScrollBoxList">
*               <div class='ContentInnerBox'>
*                   <ul>
*                       <li>列表1</li>
*                       <li>列表2</li>
*                       <li>列表3</li>
*                   </ul>
*               </div>
*           </div>
*           <div class='Scroll'>
*               <div class='ScrollLine'></div>
*               <div class='ScrollBar' wsTag='scroll' target='divScrollBoxList'></div>
*           </div>
*       </div>
*       
******************************************************************************************/
Wsfly.Actions = {
    Options: {
        InsetScrollIndex: 0
    },
    Init: function () {
        Wsfly.Actions.InitDrag();
        Wsfly.Actions.InitScroll();
    },
    InitDrag: function () {
        /*
        *  HTML
        *  说明：外层需加：position:absolute; left:xxx; top:xxx;
        *  <div id="targetDrag" style="position:absolute; left:50px; top:10px; padding:20px; background:red;">
        *      This is Content！
        *      <div style=" padding:10px; background:Blue; color:#fff;" wsTag="drag" target="targetDrag">Move Bar</div>
        *  </div>
        */
        $("div[wsTag='drag']").mousedown(function (clickEvent) {
            //计算坐标
            var clickPosX = clickEvent.screenX;
            var clickPosY = clickEvent.screenY;

            var obj = $(this);
            obj.attr("dragClick", 1);
            obj.attr("unselectable", "on");
            obj.css("-moz-user-select", "none");

            var targetObj = $("#" + $(this).attr("target"));
            if (targetObj.length <= 0) return;
            targetObj.css("position", "absolute");

            var left = targetObj.css("left").ToInt();
            var top = targetObj.css("top").ToInt();

            //固定不能移动
            var fixed = targetObj.attr("fixed");
            if (!IsNullOrEmpty(fixed) && fixed.ToBoolen()) obj.attr("dragClick", 0);

            //记录是否隐藏Iframe
            var isHideIframe = false;

            $(document).mousemove(function (moveEvent) {
                if (obj.attr("dragClick") != 1) return; //未点击不能移动
                if (!isHideIframe) $("iframe").hide(); //隐藏Iframe框架

                var movePosX = moveEvent.screenX;
                var movePosY = moveEvent.screenY;

                var differXValue = Math.abs(movePosX) - Math.abs(clickPosX);
                var differYValue = Math.abs(movePosY) - Math.abs(clickPosY);

                if ((left + differXValue) < 0 || (top + differYValue) < 0) return;

                targetObj.css("left", left + differXValue);
                targetObj.css("top", top + differYValue);
            });
            $(document).mouseup(function () {
                //对象移动取消
                obj.attr("dragClick", 0);
                //显示框架
                $("iframe").show();
            });
        });
    },
    InitScroll: function () {
        //初始有标记的滚动条
        //说明：
        //		1、wsTag对象需要设置高度
        $("div[wsTag='scroll']").mousedown(function (clickEvent) {
            var clickPosX = clickEvent.screenX;
            var clickPosY = clickEvent.screenY;

            var obj = $(this);
            var targetObj = $("#" + $(this).attr("target"));
            var container = $("#" + $(this).attr("target")).children().first();
            var cTop = parseInt(container.css("top"));
            var sTop = parseInt(obj.css("top"));

            if (targetObj.length <= 0) return;

            if (isNaN(sTop)) {
                sTop = 0;
            }
            if (isNaN(cTop)) {
                cTop = 0;
            }

            targetObj.css("position", "relative");
            container.css("position", "absolute");
            obj.attr("scrollClick", 1);
            obj.attr("unselectable", "on");
            obj.css("-moz-user-select", "none");

            $(document).mousemove(function (moveEvent) {
                if (obj.attr("scrollClick") != 1) return;

                var movePosX = moveEvent.screenX;
                var movePosY = moveEvent.screenY;

                var differValue = Math.abs(movePosY) - Math.abs(clickPosY);

                var toTop = sTop + differValue;
                var maxTop = $(obj).parent().height() - obj.height();

                if (toTop <= 0) toTop = 0;
                if (toTop > maxTop) toTop = maxTop;

                obj.css("top", toTop);

                var scale = container.height() / $(obj).parent().height();
                var moveToTop = cTop - scale * differValue;

                if (container.height() > container.parent().height()) {
                    if (container.height() + moveToTop < container.parent().height()) {
                        moveToTop = container.height() - container.parent().height();
                        moveToTop = -moveToTop;
                    }
                    if (moveToTop > 0) moveToTop = 0;
                    container.css("top", moveToTop);
                }
            });
            $(document).mouseup(function () {
                obj.attr("scrollClick", 0);
            });
        });
        $("div[wsTag='scroll']").each(function () {
            var container = $("#" + $(this).attr("target")).children().first();

            $("#" + $(this).attr("target")).css("position", "relative");
            $(container).css("position", "absolute");
        });
        ///滚动条事件
        if ($("div[wsTag='scroll']").length > 0) {
            $("div[wsTag='scroll']").parent().parent().mousewheel(Wsfly.Actions.ScrollEvent);
        }
    },
    InsetScroll: function (objId) {
        //嵌入滚动条
        //说明：
        //		1、objId对象需要设置高度
        //      调用方法：Wsfly.Actions.InsetScroll("divArticles");
        var obj = $("#" + objId);
        var hasScroll = obj.attr("hasScroll");

        if (!IsNullOrEmpty(hasScroll) && hasScroll.toString().ToBoolean()) return;

        var scrollId = "wsflyScrollContent_" + Wsfly.Actions.Options.InsetScrollIndex++;
        var innerBox = obj.clone();
        obj.html("");

        obj.attr("hasScroll", "true");

        innerBox.removeAttr("id");
        innerBox.removeAttr("style");
        innerBox.removeAttr("class");

        var container = document.createElement("div");
        var scrollBox = document.createElement("div");
        var contentBox = document.createElement("div");

        container = $(container);
        scrollBox = $(scrollBox);
        contentBox = $(contentBox);

        contentBox.attr({
            "id": scrollId,
            "class": "ContentOutBox"
        });
        contentBox.css({
            "height": obj.height(),
            "overflow": "hidden"
        });
        container.css({
            "padding-right": "22px",
            "position": "relative"
        });
        scrollBox.attr({
            "class": "Scroll"
        });
        scrollBox.css({
            "top": "0",
            "right": "0",
            "position": "absolute",
            "width": "20px",
            "height": "100%",
            "display": "block",
            "overflow": "hidden"
        });

        innerBox.css({
            "width": "100%",
            "overflow": "hidden",
            "zoom": "1"
        });
        innerBox.attr({
            "class": "ContentInnerBox"
        });

        scrollBox.append("<div class='ScrollLine'></div><div class='ScrollBar' wsTag='scroll' target='" + scrollId + "'></div>");

        contentBox.append(innerBox);
        container.append(contentBox);
        container.append(scrollBox);

        obj.append(container);

        if (contentBox[0].scrollHeight <= obj.height()) {
            scrollBox.find(".ScrollBar").css("display", "none");
        }

        obj.resize(function () {
            contentBox.height(obj.height());
            if (contentBox[0].scrollHeight <= obj.height()) {
                scrollBox.find(".ScrollBar").css("display", "none");
            }
            else {
                scrollBox.find(".ScrollBar").css("display", "block");
            }
        });

        ///滚动条事件
        $(container).mousewheel(Wsfly.Actions.ScrollEvent);
    },
    ScrollEvent: function (e) {
        //滑轮事件
        var container = $(this).find(".ContentInnerBox");
        var moveToTop = parseInt($(container).css("top"));
        var maxHeight = $(container).height();
        var screenHeight = $(container).parent().height();
        var scrollHeight = $(this).find(".Scroll").height();

        if ($(container).get(0).scrollHeight > maxHeight) {
            maxHeight = $(container).get(0).scrollHeight;
        }

        var wheelStep = 50;
        var scrollStep = (50 / maxHeight) * scrollHeight;
        var scrollTop = parseInt($(this).find(".ScrollBar").css("top"));

        if (isNaN(moveToTop)) moveToTop = 0;

        if (this.Direction > 0) {
            //向上
            if (moveToTop >= 0) return;
            moveToTop += wheelStep;
            scrollTop -= scrollStep;

            if (moveToTop >= 0) {
                moveToTop = 0;
                scrollTop = 0;
            }

            $(container).css("top", moveToTop);
            $(this).find(".ScrollBar").css("top", scrollTop)
        }
        else {
            //向下
            if (Math.abs(moveToTop) >= maxHeight - screenHeight) return;

            moveToTop -= wheelStep;
            scrollTop += scrollStep;

            if (Math.abs(moveToTop) >= maxHeight - screenHeight) {
                moveToTop = screenHeight - maxHeight;
                scrollTop = screenHeight - $(this).find(".ScrollBar").height();
            }

            $(container).css("top", moveToTop);
            $(this).find(".ScrollBar").css("top", scrollTop)
        }
    },
    StopRightKeyMenu: function () {
        //禁用右键菜单
        document.oncontextmenu = function () { return false; };
        $("body").attr("oncontextmenu", "return false;");
    }
};
//Ajax事件
Wsfly.Ajax = {
    Get: function (url, data, callback, dataType) {
        if (IsNullOrEmpty(url)) return;
        if (IsFunction(data)) callback = data;
        if (!IsFunction(callback)) callback = function () { };
        if (IsNullOrEmpty(dataType)) dataType = "json";

        $.ajax({
            type: "POST",
            url: url,
            data: data,
            dataType: dataType,
            success: callback,
            error: function (msg) {
                callback({ "Success": false, "Message": msg, "Data": "" });
            }
        });
    },
    Post: function (url, data, callback, dataType) {
        if (IsNullOrEmpty(url)) return;
        if (typeof (callback) != "function") callback = function () { };
        if (IsNullOrEmpty(dataType)) dataType = "json";

        $.ajax({
            type: "POST",
            url: url,
            data: data,
            dataType: dataType,
            success: callback,
            error: function (msg) {
                callback({ "Success": false, "Message": msg, "Data": "" });
            }
        });
    },
    Form: function (obj, callback, beforeSubmit) {
        var objForm = obj;

        if (obj.tagName != "form") {
            objForm = Wsfly.Document.FindObject(obj, "form");
            if (objForm.length <= 0) return;
        }

        if (typeof (beforeSubmit) != "function") beforeSubmit = function () { };
        if (typeof (callback) != "function") callback = function () { };

        $(objForm).ajaxSubmit({
            dataType: 'json',
            iframe: true,
            beforeSubmit: beforeSubmit,
            success: callback,
            error: function (e) {
                callback({ "Success": false, "Message": "Sorry，请求出现错误，请再试一次！", "Data": "" });
            }
        });
    },
    JsonP: function (url, data, callback) {
        if (IsNullOrEmpty(url)) return;
        if (typeof (callback) != "function") callback = function () { };

        $.ajax({
            type: "get",
            async: false,
            url: url,
            data: data,
            dataType: "jsonp",
            jsonp: "jsoncallback",
            //jsonpCallback: "?",
            success: callback,
            error: function (msg) {
                callback({ "Success": false, "Message": msg, "Data": "" });
            }
        });
    },
    Call: function (fnName, data, callback, dataType) {
        if (IsNullOrEmpty(fnName)) return;
        if (typeof (callback) != "function") callback = function () { };
        if (IsNullOrEmpty(dataType)) dataType = "json";

        $.ajax({
            type: "POST",
            url: "/Ajax/Call?fn=" + fnName,
            data: data,
            dataType: dataType,
            success: callback,
            error: function (msg) {
                callback({ "Success": false, "Message": msg, "Data": "" });
            }
        });
    }
};
//按键事件
Wsfly.Keyboard = {
    Options: {
        KeyValues: [],
        Callbacks: [],
        GroupKey: []
    },
    Init: function () {
        if (document.addEventListener) {
            //非IE
            document.addEventListener("keydown", Wsfly.Keyboard.KeyDown, false);
        }
        else if (document.attachEvent) {
            //IE
            document.attachEvent("onkeydown", Wsfly.Keyboard.KeyDown);
        }
    },
    KeyDown: function (e) {
        e = (e) ? e : window.event;
        var keyCode = e.keyCode;
        try {
            for (var i = 0; i < Wsfly.Keyboard.Options.KeyValues.length; i++) {
                var keyVal = Wsfly.Keyboard.Options.KeyValues[i];
                var callback = Wsfly.Keyboard.Options.Callbacks[i];
                var groupKeyVal = Wsfly.Keyboard.Options.GroupKey[i];

                if (groupKeyVal != null) {
                    //组合键
                    if (groupKeyVal == 16) {
                        //Shilft组合
                        if (e.shiftKey && keyCode == keyVal) {
                            callback();
                        }
                    }
                    else {
                        //Ctrl组合
                        if (e.ctrlKey && keyCode == keyVal) {
                            if (keyCode == 83) {
                                //阻止浏览器响应
                                Wsfly.Keyboard.StopBrowserEvent(e);
                            }
                            //回调
                            callback();
                        }
                    }
                }
                else {
                    if (keyCode == keyVal) {
                        callback();
                    }
                }
            }
        }
        catch (ex) { }
    },
    StopBrowserEvent: function (e) {
        //阻止浏览器响应
        if (e && e.preventDefault) {
            e.preventDefault();
        }
        else {
            window.event.returnValue = false;
        }
        return false;
    },
    RegisterKeyDown: function (keyVal, callback, groupKey) {
        if (groupKey == undefined || groupKey == "") groupKey = null;

        Wsfly.Keyboard.Options.KeyValues.push(keyVal);
        Wsfly.Keyboard.Options.Callbacks.push(callback);
        Wsfly.Keyboard.Options.GroupKey.push(groupKey);
    },
    RemoveKeyDown: function (keyVal) {
        for (var i = 0; i < Wsfly.Keyboard.Options.KeyValues.length; i++) {
            if (Wsfly.Keyboard.Options.KeyValues[i] == keyVal) {
                Wsfly.Keyboard.Options.KeyValues.splice(i, 1);
                Wsfly.Keyboard.Options.Callbacks.splice(i, 1);
                Wsfly.Keyboard.Options.GroupKey.splice(i, 1);
            }
        }
    },
    TestKeyCode: function () {
        //测试键值
        window.document.onkeydown = function (evt) {
            evt = (evt) ? evt : window.event
            alert(evt.keyCode);
        }
    },
    GetKeyCode: function (key) {
        //获取键的值
        var keyJson = {
            //字母区键码值
            "A": 65, "J": 74, "S": 83, "1": 49
            , "B": 66, "K": 75, "T": 84, "2": 50
            , "C": 67, "L": 76, "U": 85, "3": 51
            , "D": 68, "M": 77, "V": 86, "4": 52
            , "E": 69, "N": 78, "W": 87, "5": 53
            , "F": 70, "O": 79, "X": 88, "6": 54
            , "G": 71, "P": 80, "Y": 89, "7": 55
            , "H": 72, "Q": 81, "Z": 90, "8": 56
            , "I": 73, "R": 82, "0": 48, "9": 57

            //数字区键码值、功能区键码值
            , "0": 96, "8": 104, "F1": 112, "F7": 118
            , "1": 97, "9": 105, "F2": 113, "F8": 119
            , "2": 98, "*": 106, "F3": 114, "F9": 120
            , "3": 99, "+": 107, "F4": 115, "F10": 121
            , "4": 100, "Enter": 108, "F5": 116, "F11": 122
            , "5": 101, "-": 109, "F6": 117, "F12": 123
            , "6": 102, ".": 110
            , "7": 103, "/": 111

            //控制键键码值
            , "BackSpace": 8, "Esc": 27, "Right Arrow": 39, "-": 189, "_": 189
            , "Tab": 9, "Spacebar": 32, "Down Arrow": 40, ".": 190, ">": 190
            , "Clear": 12, "Page Up": 33, "Insert": 45, "/": 191, "?": 191
            , "Enter": 13, "Page Down": 34, "Delete": 46, "`": 192, "~": 192
            , "Shift": 16, "End": 35, "Num Lock": 144, "[": 219, "{": 219
            , "Control": 17, "Home": 36, ";": 186, ":": 186, "\\": 220, "|": 220
            , "Alt": 18, "Left Arrow": 37, "=": 187, "+": 187, "]": 221, "}": 221
            , "Cape Lock": 20, "Up Arrow": 38, "<": 188, "'": 222, "\"": 222

            //多媒体键码值
            , "搜索": 170, "收藏": 171, "浏览器": 172, "静音": 173, "音量减": 174, "音量加": 175, "停止": 179, "邮件": 180
        }

        return keyJson[key.toUpperCase()];
    },
    CtrlGroup: function (groupKey, callback) {
        this.RegisterKeyDown(groupKey, callback, 17);
    },
    CtrEnter: function (callback) {
        this.RegisterKeyDown(13, callback, 17);
    },
    CtrS: function (callback) {
        this.RegisterKeyDown(83, callback, 17);
    },
    Shift: function (callback) {
        this.RegisterKeyDown(16, callback);
    },
    Ctrl: function (callback) {
        this.RegisterKeyDown(17, callback);
    },
    Alt: function (callback) {
        this.RegisterKeyDown(18, callback);
    },
    CapsLock: function (callback) {
        this.RegisterKeyDown(20, callback);
    },
    Enter: function (callback) {
        this.RegisterKeyDown(13, callback);
    },
    Esc: function (callback) {
        this.RegisterKeyDown(27, callback);
    },
    Backspace: function (callback) {
        this.RegisterKeyDown(8, callback);
    },
    Tab: function (callback) {
        this.RegisterKeyDown(9, callback);
    },
    Space: function (callback) {
        this.RegisterKeyDown(32, callback);
    },
    Delete: function (callback) {
        this.RegisterKeyDown(46, callback);
    },
    PageUp: function (callback) {
        this.RegisterKeyDown(33, callback);
    },
    PageDown: function (callback) {
        this.RegisterKeyDown(34, callback);
    },
    End: function (callback) {
        this.RegisterKeyDown(35, callback);
    },
    Home: function (callback) {
        this.RegisterKeyDown(36, callback);
    },
    Left: function (callback) {
        this.RegisterKeyDown(37, callback);
    },
    Up: function (callback) {
        this.RegisterKeyDown(38, callback);
    },
    Right: function (callback) {
        this.RegisterKeyDown(39, callback);
    },
    Down: function (callback) {
        this.RegisterKeyDown(40, callback);
    }
};
//事件
Wsfly.Event = {
    Complete: "Complete",
    EventListenerEvent: [],
    EventListenerCallback: [],
    //添加事件
    AddEventListener: function (type, callback) {
        if (typeof (callback) != "function") return; //不是函数 不添加

        Wsfly.Event.EventListenerEvent.push(type);
        Wsfly.Event.EventListenerCallback.push(callback);
    },
    //移除事件
    RemoveEventListener: function (type, callback) {
        var callbacks = Wsfly.Event.EventListenerCallback;
        for (var i = 0; i < callbacks.length; i++) {
            if (callbacks[i] == callback) {
                Wsfly.Event.EventListenerEvent.splice(i, 1);
                Wsfly.Event.EventListenerCallback.splice(i, 1);
            }
        }
    },
    //装载事件
    LoadEvent: function () {
        var callbacks = Wsfly.Event.EventListenerCallback;
        if (callbacks != undefined && callbacks != null && callbacks.length > 0) {
            for (var i = 0; i < callbacks.length; i++) {
                callbacks[i]();
            }
        }
    }
};
//定时
Wsfly.Delay = function (callback, delay, isLoop) {
    //转换为毫秒
    delay = Millisecond(delay);
    //是否在回调函数
    if (callback) {
        if (isLoop && isLoop === true) {
            //循环执行
            return window.setInterval(callback, delay);
        }
        //只执行一次
        return window.setTimeout(callback, delay);
    }
};
///显示提示
Wsfly.ShowTips = function (msg, seconds) {
    var html = "<div id='div_Wsfly_MiniTips' class='div_Wsfly_MiniTips' style='background:#eee url(\"http://res.wsfly.com/v1.1/Images/Common/Loading-s.gif\") no-repeat left center; color:#333; border:solid 1px #ccc; padding:3px 10px 3px 35px; height:30px; line-height:30px; overflow:hidden; position:absolute; left:0; bottom:0;'>" + msg + "</div>";

    $("body").append(html);

    ///默认2秒 隐藏提示
    if (seconds == undefined || seconds == null || isNaN(seconds)) {
        seconds = 2000;
    }

    ///只有设置大于0的时间才会隐藏
    ///设置小于1的数不会隐藏
    if (seconds > 0) {
        var WsShowTipsTimer = window.setInterval(function () {
            $(".div_Wsfly_MiniTips").remove();
            window.clearInterval(WsShowTipsTimer);
            WsShowTipsTimer = null;
        }, seconds);
    }
};
//显示页面加载提示
Wsfly.ShowLoading = function (msg) {
    if (IsNullOrEmpty(msg)) msg = "Waiting...";
    var html = "<div id='divLoadingPage' title='" + msg + "' style='background:#fff url(\"" + _pageLoadingPic + "\") no-repeat 10px center; color:#333; padding:8px 10px 8px 40px; height:30px; line-height:30px; overflow:hidden; position:absolute; right:0; top:0; z-index:999999; border-radius:0px 0px 0px 15px;filter:alpha(opacity=80); opacity:0.8;'>" + msg + "</div>";
    document.write(html);
};
//进度
Wsfly.Process = {
    Options: {
        ContainerId: null,
        Background: "#eee",
        ScheduleColor: "#333",
        MaxValue: 100,
        CurrentValue: 0,
        CurrentLevelName: "Lv.1",
        NextLevelName: "Lv.2"
    },
    Init: function (options) {
        options = $.extend(Wsfly.Process.Options, options);

        if (options.MaxValue < 0) options.MaxValue = 0;
        if (options.CurrentValue > options.MaxValue) options.CurrentValue = options.MaxValue;

        var htmlProcess = '';
        var processBGStyle = '';
        var currentProcessStyle = '';

        if (!IsNullOrEmpty(options.Background)) {
            processBGStyle += "background-color:" + options.Background;
        }
        if (!IsNullOrEmpty(options.Background)) {
            currentProcessStyle += "background-color:" + options.ScheduleColor;
        }

        htmlProcess += '<div class="Wsfly_Process">';
        htmlProcess += '    <div class="Wsfly_ProcessBG" style="' + processBGStyle + '">';
        htmlProcess += '        <div class="Wsfly_CurrentProcess" style="' + currentProcessStyle + '">';
        htmlProcess += '            <div class="Wsfly_ProcessTextBox">' + options.CurrentValue + '</div>';
        htmlProcess += '        </div>';
        htmlProcess += '        <div class="Wsfly_ProcessNextLevelVal">' + options.MaxValue + '</div>';
        htmlProcess += '    </div>';
        htmlProcess += '    <div class="Wsfly_ProcessLevels">';
        htmlProcess += '        <div class="Wsfly_ProcessCurrentLevel">' + options.CurrentLevelName + '</div>';
        htmlProcess += '        <div class="Wsfly_ProcessNextLevel">' + options.NextLevelName + '</div>';
        htmlProcess += '    </div>';
        htmlProcess += '</div>';

        $("#" + options.ContainerId).html(htmlProcess);

        var container = $("#" + options.ContainerId);

        container.find(".Wsfly_CurrentProcess").animate({
            width: (options.CurrentValue / options.MaxValue * 100) + "%"
        }, "slow");
    }
};
Wsfly.Sounds = {
    Options: {
        "index": 1
    },
    Load: function (url) {
        //加载

        //当前索引
        var index = Wsfly.Sounds.Options.index;

        //添加对象
        var htmlSounds = "";
        if (-1 != navigator.userAgent.indexOf("MSIE")) {
            htmlSounds += ' <OBJECT id="Wsfly_Sounds_Player' + index + '" classid="clsid:6BF52A52-394A-11d3-B153-00C04F79FAA6" width="0" height="0" >' +
                           '   <param name="URL" value="' + url + '" />' +
                           '   <param name="AutoStart" value="false" /> ' +
                           '</OBJECT>';
        }
        else {
            htmlSounds += ' <OBJECT id="Wsfly_Sounds_Player' + index + '" type="application/x-ms-wmp" autostart="false" src="' + url + '" width="0" height="0"></OBJECT>';
        }

        //索引增加
        Wsfly.Sounds.Options.index++;

        //存放DIV
        var htmlObject = document.createElement("div");
        htmlObject.innerHTML = htmlSounds;

        //添加对象
        $("body").append(htmlObject);

        //返回索引
        return index;
    },
    Play: function (index) {
        //播放
        if (index <= 0 ||
        Wsfly.Sounds.Options.index == 1 ||
        index > Wsfly.Sounds.Options.index) return;

        $("#Wsfly_Sounds_Player" + index)[0].controls.play();
    },
    Stop: function (index) {
        //暂停
        if (index <= 0 ||
        Wsfly.Sounds.Options.index == 1 ||
        index > Wsfly.Sounds.Options.index) return;

        $("#Wsfly_Sounds_Player" + index)[0].controls.stop();
    },
    PlayDialog: function (params, name, path) {
        //在模态框中播放音乐
        if (!IsNullOrEmpty(params)) {
            params = params.replace(/&/g, "|").replace(/=/g, ":");
        }

        var html = '<div style="text-align:center;">' +
                   '    <object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=8,0,0,0" ' +
                   '        width="180" height="80" id="MusicPlayer" align="middle">' +
	               '        <param name="allowScriptAccess" value="sameDomain" />' +
	               '        <param name="allowFullScreen" value="false" />' +
	               '        <param name="movie" value="/Swf/SimpleMp3Player/SimpleMp3Player.swf" />' +
	               '        <param name="quality" value="high" />' +
	               '        <param name="wmode" value="transparent" />' +
	               '        <param name="bgcolor" value="#333333" />' +
	               '        <param name="flashvars" value="_params=' + params + '&_mp3Name=' + name + '&_mp3Path=' + path + '" />' +
	               '        <embed src="/Swf/SimpleMp3Player/SimpleMp3Player.swf" quality="high" ' +
	               '            wmode="transparent" bgcolor="#333333" width="180" height="80" name="MusicPlayer" align="middle" ' +
	               '            allowScriptAccess="sameDomain" allowFullScreen="false" type="application/x-shockwave-flash" ' +
	               '            FlashVars="_params=' + params + '&_mp3Name=' + name + '&_mp3Path=' + path + '"' +
	               '            pluginspage="http://www.macromedia.com/go/getflashplayer" />' +
	               '    </object>' +
                   '</div>';

        //在Dialog中播放
        Wsfly.Dialog.Show({
            Width: 300,
            Height: 150,
            BackgroundColor: "#666",
            Title: "配音播放",
            Html: html
        });
    },
    BackgroundMusic: function (path) {
        //背景音乐
        var audioId = "audio_" + GetTimestamp();
        var html = '';
        html += '<div class="BGMusic">';
        html += '   <div class="on" data-tag="BGM" data-target="' + audioId + '">';
        html += '      <audio id="' + audioId + '" loop="loop" src="' + path + '" preload="preload"></audio>';
        html += '   </div>';
        html += '</div>';
        $("body").append(html);

        //播放控制
        var BackgroundMusicPlayer = {
            ChangeClass: function (target) {
                //状态改变（样式改变）
                var className = $(target).attr('class');
                var targetId = $(target).attr("data-target");
                var bgMusic = document.getElementById(targetId);

                //控制播放、暂停
                (className == 'on') ? $(target).removeClass('on').addClass('off') : $(target).removeClass('off').addClass('on');
                (className == 'on') ? bgMusic.pause() : bgMusic.play();
            },
            VGradually: function () {
                //音量渐入
                var bgMusic = document.getElementById(audioId);
                bgMusic.volume = 0;
                var volume = 0.1;
                var timerBGMusic = setInterval(function () {
                    volume += 0.1;
                    if (volume <= 1) {
                        bgMusic.volume = volume;
                    } else {
                        clearInterval(timerBGMusic);
                    }
                }, 2000);
            },
            Play: function () {
                //播放音乐
                var bgMusic = document.getElementById(audioId);
                bgMusic.play();
            }
        };
        BackgroundMusicPlayer.VGradually();
        BackgroundMusicPlayer.Play();

        //点击切换状态
        $(".BGMusic div[data-tag='BGM']").bind("click", function () {
            BackgroundMusicPlayer.ChangeClass($(this));
        });
    }
};
//视频服务
Wsfly.Video = {
    //需要添加Js引用：Jquery.Wsfly.Controls.Box.v2.js
    PlaySWF: function (url) {
        //播放SWF
        jQuery.Wsfly.Controls.BoxV2.Show({
            "DisableClickBackgroundEvent": true,
            "HideBodyScroll": true,
            "HideIsRemove": true,
            "Width": 660,
            "Height": 500,
            "Html": '<div class="PA10"><embed src="' + url + '" allowFullScreen="true" quality="high" width="640" height="480" align="middle" allowScriptAccess="always" type="application/x-shockwave-flash"></embed></div>'
        });
    },
    PlayFLV: function (url, title) {
        //播放FLV
        jQuery.Wsfly.Controls.BoxV2.Show({
            "DisableClickBackgroundEvent": true,
            "HideBodyScroll": true,
            "HideIsRemove": true,
            "Width": 660,
            "Height": 500,
            "Html": '<div class="PA10"><object type="application/x-shockwave-flash" data="' + Webconfig.AppSettings.StaticSources + '/Plug-In/Vcastr3/vcastr3.swf" width="640" height="480" id="">' +
			        '   <param name="movie" value="' + Webconfig.AppSettings.StaticSources + '/Plug-In/Vcastr3/vcastr3.swf"/> ' +
			        '   <param name="allowFullScreen" value="true" />' +
			        '   <param name="FlashVars" value="xml=' +
			        '       <vcastr>' +
			        '           <channel>' +
			        '               <item>' +
			        '   	            <source>' + url + '</source>' +
			        '   	            <duration></duration>' +
			        '   	            <title>' + title + '</title>' +
			        '               </item>' +
			        '           </channel>' +
			        '           <config>' +
			        '           </config>' +
			        '           <plugIns>' +
			        '               <logoPlugIn>' +
			        '   	            <url>' + Webconfig.AppSettings.StaticSources + '/Plug-In/Vcastr3/logoPlugIn.swf</url>' +
			        '   	            <logoText>www.wsfly.com</logoText>' +
			        '   	            <logoTextAlpha>0.75</logoTextAlpha>' +
			        '   	            <logoTextFontSize>10</logoTextFontSize>' +
			        '   	            <logoTextLink>http://www.wsfly.com/</logoTextLink>' +
			        '   	            <logoTextColor>0xffffff</logoTextColor>' +
			        '   	            <textMargin>20 20 auto auto</textMargin>' +
			        '               </logoPlugIn>' +
			        '           </plugIns>' +
			        '       </vcastr>"/>' +
		            '</object></div>'
        });
    }
};
//HTML控件
Wsfly.Html = {
    Table: function (selector) {
        $(selector + " tr").mouseover(function () {
            //alert("test");
            //如果鼠标移到设定的表格的tr上时，执行函数
            $(this).addClass("Wsfly_Table_OverRow");
        }).mouseout(function () {
            //给这行添加class值为over，并且当鼠标一出该行时执行函数
            //移除该行的class
            $(this).removeClass("Wsfly_Table_OverRow");
        });

        //给设定的的表格的偶数行添加class值为Wsfly_Table_EvenRow
        $(selector + " tr:even").addClass("Wsfly_Table_EvenRow");
    },
    TextBox: function (txtBoxId) {
        //文本框
        var objTxtBox = $("#" + txtBoxId);
        objTxtBox.attr("ws-defaultvalue", objTxtBox.val());

        //聚焦时是默认文字则隐藏默认文字
        objTxtBox.focus(function () {
            var valTxt = $(this).val();
            var txtDefaultValue = $(this).attr("ws-defaultvalue");
            if (valTxt == txtDefaultValue) {
                $(this).val("");
            }
        });
        //离开时未输入则恢复默认文字
        objTxtBox.blur(function () {
            var valTxt = $(this).val();
            var txtDefaultValue = $(this).attr("ws-defaultvalue");

            if (valTxt == "") {
                $(this).val(txtDefaultValue);
            }
        });
    },
    TextArea: {
        InsertText: function (targetId, str) {
            //在光标处插入内容
            var obj = document.getElementById(targetId);
            if (document.selection) {
                var sel = document.selection.createRange();
                sel.text = str;
            }
            else if (typeof obj.selectionStart === 'number' && typeof obj.selectionEnd === 'number') {
                var startPos = obj.selectionStart,
                    endPos = obj.selectionEnd,
                    cursorPos = startPos,
                    tmpStr = obj.value;
                obj.value = tmpStr.substring(0, startPos) + str + tmpStr.substring(endPos, tmpStr.length);
                cursorPos += str.length;
                obj.selectionStart = obj.selectionEnd = cursorPos;
            }
            else {
                obj.value += str;
            }
        },
        MoveEnd: function (targetId) {
            //移动到内容末尾
            var obj = document.getElementById(targetId);
            obj.focus();
            var len = obj.value.length;
            if (document.selection) {
                var sel = obj.createTextRange();
                sel.moveStart('character', len);
                sel.collapse();
                sel.select();
            }
            else if (typeof obj.selectionStart == 'number' && typeof obj.selectionEnd == 'number') {
                obj.selectionStart = obj.selectionEnd = len;
            }
        }
    },
    TextAreaToHtml: function (str) {
        //TextArea转Html换行
        if (IsNullOrEmpty(str)) return "";
        var s = str.replace(/\r\n/g, "<br />");
        s = s.replace(/\r/g, "<br />");
        s = s.replace(/\n/g, "<br />");
        return s;
    },
    Encode: function (str) {
        if (IsNullOrEmpty(str)) return "";
        var s = "";
        s = str.replace(/&/g, "&gt;");
        s = s.replace(/</g, "&lt;");
        s = s.replace(/>/g, "&gt;");
        s = s.replace(/ /g, "&nbsp;");
        s = s.replace(/\'/g, "&#39;");
        s = s.replace(/\"/g, "&quot;");
        s = s.replace(/\n/g, "<br />");
        return s;
    },
    Decode: function (str) {
        if (IsNullOrEmpty(str)) return "";
        var s = "";
        s = str.replace(/&gt;/g, "&");
        s = s.replace(/&lt;/g, "<");
        s = s.replace(/&gt;/g, ">");
        s = s.replace(/&nbsp;/g, " ");
        s = s.replace(/&#39;/g, "\'");
        s = s.replace(/&quot;/g, "\"");
        s = s.replace(/<br \/>/g, "\n");
        return s;
    }
};
//初始返回页面顶部
Wsfly.InitToTop = function () {
    var divToTop = document.createElement("div");
    document.body.appendChild(divToTop);

    //得到对象
    var obj = $(divToTop);
    //点击返回顶部
    obj.click(Wsfly.Document.ToPageTop);

    //是否IE6浏览器
    if (IsIE6()) {
        obj.css("position", "absolute");
    }
    else {
        obj.css("position", "fixed");
    }

    //样式
    obj.css({
        "marginLeft": "600px",
        "bottom": "160px",
    });
    //属性
    obj.attr({
        "class": "TagToTop"
    });

    //切换显示状态
    ShowHideScrollTop();

    //绑定滚动条事件
    $(window).bind('scroll', function () {
        ShowHideScrollTop();
        var scrollTop = $(document).scrollTop();
        var viewHeight = $(window).height();
        if (IsIE6()) {
            var top = viewHeight + scrollTop - obj.outerHeight() - 160;
            obj.css('top', top + 'px');
        };
    });
    //显示隐藏回到顶部
    function ShowHideScrollTop() {
        var scrollTop = $(document).scrollTop();
        // 小于1则fadeOut 
        if (scrollTop <= 0) { obj.fadeOut(); }
            // 大于1则fadeIn 
        else { obj.fadeIn(); }
    };
};
//网站统计
Wsfly.Statistics = function (_VisitUrl) {
    //记录访客
    var cookieName_Date = "Wsfly.WebsiteLastViewDate";
    var cookieName_Count = "Wsfly.WebsiteLastViewCount";
    var date = Wsfly.Cookies.Get(cookieName_Date);
    var count = Wsfly.Cookies.Get(cookieName_Count);

    var isNewVisitor = 0;
    var url = window.location.href;

    //判断是否新访客
    if (!IsNullOrEmpty(date)) {
        var time = new Date().getTime() - Date.parse(date);
        var days = parseInt(time / (1000 * 60 * 60 * 24));

        if (days >= 1) {
            //今日新访客
            isNewVisitor = 1;
        }
    }
    //有数量
    if (!IsNullOrEmpty(count)) {
        count = parseInt(count);
    }
    else {
        count = 0;
    }

    //统计地址
    if (IsNullOrEmpty(_VisitUrl)) _VisitUrl = "/Home/StatisticsVisits";

    //访问记录
    Wsfly.Ajax.Get(_VisitUrl, { isNewVisitor: isNewVisitor, url: url }, function () {
        //当前日期
        var currentDate = new Date().Format("yyyy-MM-dd HH:mm:ss");

        //保存到Cookies
        Wsfly.Cookies.Set(cookieName_Date, currentDate, 365);
        Wsfly.Cookies.Set(cookieName_Count, (count + 1), 365);
    });
};
//网站广告位
//options = {target,width,height,adKey,type};
//Wsfly.Ads({ "target": "divContent", "width": "", "height": "", "adKey": "", "type": 2 });
Wsfly.Ads = function (options) {
    //没有存放Ad的容器
    if (IsNullOrEmpty(options.target)) return;
    //获取广告内容
    Wsfly.Ajax.Get("/Home/GetAd", ({ "w": options.width, "h": options.height, "k": options.adKey, "t": options.type }), function (result) {
        if (result.Success) {
            //加载广告
            $("#" + options.target).html(result.Data);
        }
        else {
            $("#" + options.target).remove();
        }
    });
};
//滚动条
Wsfly.Scroll = function (scrollId) {
    //调用方法：Wsfly.Scroll("divContent");
    //请设置内容层的高度、宽度  如：<div id="divContent">This is Content!</div>

    //滚动条
    var scrollObj = $("#" + scrollId);

    //内容上下Padding
    var cPaddingTop = scrollObj.css("paddingTop");
    var cPaddingBottom = scrollObj.css("paddingBottom");
    cPaddingTop = cPaddingTop.replace("px", "");
    cPaddingBottom = cPaddingBottom.replace("px", "");
    var cPaddingTB = parseInt(cPaddingTop) + parseInt(cPaddingBottom);

    //内容实际高度
    var sWidth = $(scrollObj).width();
    var sHeight = $(scrollObj)[0].scrollHeight;
    var cHeight = $(scrollObj).height() + cPaddingTB;
    //滚动条比例
    var sScale = sHeight / cHeight;
    //是否需要滚动条
    if (sScale <= 1) return;

    //内容框
    scrollObj.css({
        "position": "relative",
        "width": "" + (sWidth - 15) + "px",
        "padding-right": "15px",
        "overflow": "hidden",
        "-moz-user-select": "none"
    });
    scrollObj.attr("unselectable", "on");

    //滚动条背景
    var scrollBg = document.createElement("div");
    $(scrollBg).css({
        "position": "absolute",
        "top": "0px",
        "right": "0px",
        "width": "10px",
        "height": "100%",
        "padding": "0px",
        "background": "#eee"
    });

    //内容
    var scrollContent = document.createElement("div");
    $(scrollContent).css({
        "position": "absolute",
        "width": "" + (sWidth - 10) + "px",
        "top": "0px",
        "left": "0px",
        "height": "auto",
        "background": "#fff"
    });
    $(scrollContent).html(scrollObj.html());
    scrollObj.html("");

    //滚动条手柄
    var scrollBar = document.createElement("div");
    $(scrollBar).css({
        "position": "absolute",
        "top": "0px",
        "right": "0px",
        "width": "10px",
        "height": "30px",
        "background": "#666",
        "border-radius": "5px"
    });
    $(scrollBg).append(scrollBar);
    //将滚动条添加到内容框
    scrollObj.append(scrollBg);
    scrollObj.append(scrollContent);

    //鼠标点下
    $(scrollBar).mousedown(function (clickEvent) {
        var clickPosX = clickEvent.screenX;
        var clickPosY = clickEvent.screenY;

        var obj = $(this);
        var container = $(scrollContent);
        var cTop = parseInt(container.css("top"));
        var sTop = parseInt(obj.css("top"));

        if (isNaN(sTop)) {
            sTop = 0;
        }
        if (isNaN(cTop)) {
            cTop = 0;
        }

        container.css("position", "absolute");
        obj.attr("scrollClick", 1);
        obj.attr("unselectable", "on");
        obj.css("-moz-user-select", "none");

        $(document).mousemove(function (moveEvent) {
            if (obj.attr("scrollClick") != 1) return;

            var movePosX = moveEvent.screenX;
            var movePosY = moveEvent.screenY;

            var differValue = Math.abs(movePosY) - Math.abs(clickPosY);

            var toTop = sTop + differValue;
            var maxTop = $(obj).parent().height() - obj.height();

            if (toTop <= 0) toTop = 0;
            if (toTop > maxTop) toTop = maxTop;

            obj.css("top", toTop);

            var scale = container.height() / $(obj).parent().height();
            var moveToTop = cTop - scale * differValue;

            if (container.height() > container.parent().height()) {
                if (container.height() + moveToTop < container.parent().height()) {
                    moveToTop = container.height() - container.parent().height();
                    moveToTop = -moveToTop;
                }
                if (moveToTop > 0) moveToTop = 0;
                container.css("top", moveToTop);
            }
        });
        $(document).mouseup(function () {
            obj.attr("scrollClick", 0);
        });
    });
};
//页面加载完成执行事件
Wsfly.Ready = function (callback) {
    Wsfly.Event.AddEventListener(Wsfly.Event.Complete, callback);
};
//URL地址 编码
Wsfly.UrlEncode = function (url) {
    url = encodeURI(url);

    url = url.replace(/\!/g, "%21");
    url = url.replace(/\"/g, "%22");
    url = url.replace(/\#/g, "%23");
    url = url.replace(/\$/g, "%24");
    //url = url.replace(/\%/g, "%25");
    url = url.replace(/\&/g, "%26");
    url = url.replace(/\'/g, "%27");
    url = url.replace(/\(/g, "%28");
    url = url.replace(/\)/g, "%29");
    url = url.replace(/\*/g, "%2A");
    url = url.replace(/\+/g, "%2B");
    url = url.replace(/\,/g, "%2C");
    url = url.replace(/\-/g, "%2D");
    url = url.replace(/\./g, "%2E");
    url = url.replace(/\//g, "%2F");

    url = url.replace(/:/g, "%3A");
    url = url.replace(/;/g, "%3B");
    url = url.replace(/</g, "%3C");
    url = url.replace(/\=/g, "%3D");
    url = url.replace(/>/g, "%3E");
    url = url.replace(/\?/g, "%3F");

    url = url.replace(/@/g, "%40");

    url = url.replace(/\[/g, "%5B");
    url = url.replace(/\\/g, "%5C");
    url = url.replace(/\]/g, "%5D");
    url = url.replace(/\^/g, "%5E");
    url = url.replace(/_/g, "%5F");

    url = url.replace(/`/g, "%60");

    url = url.replace(/\{/g, "%7B");
    url = url.replace(/\|/g, "%7C");
    url = url.replace(/\}/g, "%7D");
    url = url.replace(/~/g, "%7E");
    return url;
};
//URL地址 解码
Wsfly.UrlDecode = function (url) {
    url = url.replace(/(%21)/g, "!");
    url = url.replace(/%22/g, "\"");
    url = url.replace(/%23/g, "#");
    url = url.replace(/%24/g, "$");
    //url = url.replace(/%25/g, "%");
    url = url.replace(/%26/g, "&");
    url = url.replace(/%27/g, "'");
    url = url.replace(/%28/g, "(");
    url = url.replace(/%29/g, ")");
    url = url.replace(/%2A/g, "*");
    url = url.replace(/%2B/g, "+");
    url = url.replace(/%2C/g, ",");
    url = url.replace(/%2D/g, "-");
    url = url.replace(/%2E/g, ".");
    url = url.replace(/%2F/g, "/");

    url = url.replace(/%3A/g, ":");
    url = url.replace(/%3B/g, ";");
    url = url.replace(/%3C/g, "<");
    url = url.replace(/%3D/g, "=");
    url = url.replace(/%3E/g, ">");
    url = url.replace(/%3F/g, "?");

    url = url.replace(/%40/g, "@");

    url = url.replace(/%5B/g, "[");
    url = url.replace(/%5C/g, "\\");
    url = url.replace(/%5D/g, "]");
    url = url.replace(/%5E/g, "^");
    url = url.replace(/%5F/g, "_");

    url = url.replace(/%60/g, "`");

    url = url.replace(/%7B/g, "{");
    url = url.replace(/%7C/g, "|");
    url = url.replace(/%7D/g, "}");
    url = url.replace(/%7E/g, "~");

    url = decodeURI(url);
    return url;
};

//显示加载页面
Wsfly.ShowLoading("loading...");
//如果已经加载完成 则执行初始化
if (document.readyState == "complete") {
    Wsfly.Init();
}
//添加页面加载完成事件
if (document.addEventListener) {
    //非IE
    window.addEventListener("load", Wsfly.Init, false);
}
else if (document.attachEvent) {
    //IE
    window.attachEvent("onload", Wsfly.Init);
}
/*=============================================================================
*  扩展Wsfly END
*=============================================================================*/





/*=============================================================================
*  更多函数 BEGIN
*=============================================================================*/
//Test Browser Version
Wsfly.TestBrowser = function () {
    //.BrowserTips{ padding:30px 0; text-align:center; font-size:18px; background:darkorange; color:#fff; position:absolute; left:0; bottom:0; position:fixed; width:100%; z-index:9999; filter:alpha(opacity=90); opacity:0.9;}
    var browserInfo = new Wsfly.BrowserInfo();
    var htmlBrowserTips = '<div class="BrowserTips" style="[Style]">您当前的浏览器[BrowserName] ' + browserInfo.version + '，为获得更佳的浏览效果，请将浏览器升级到：[Upgrade]。<span id="spanCloseBrowserTips" class="FWB Hand FZ24" title="关闭">×</span></div>';
    var browserName = "";
    var upgrade = "<a href='http://windows.microsoft.com/zh-cn/internet-explorer/ie-9-worldwide-languages' target='_blank' class='Blue' title='点击去升级'>Internet Explorer 9(IE9)</a>及以上";

    var showTips = false;
    var style = "";

    if (browserInfo.msie) {
        var version = parseFloat(browserInfo.version);
        browserName = "Internet Explorer";
        if (version < 9) showTips = true;
        if (version == 6) {
            var scrW = document.documentElement.clientWidth;
            var scrH = document.documentElement.clientHeight;
            document.getElementsByTagName('body')[0].style.overflow = 'hidden';
            document.getElementsByTagName('html')[0].style.overflow = 'hidden';
            document.body.onselectstart = document.body.ondrag = function () { return false; }
            style = "position:absolute; width:" + (scrW + 30) + "px; height:" + scrH + "px; line-height:" + scrH + "px; left:0; top:0; padding:0; filter:progid:DXImageTransform.Microsoft.Alpha(opacity=90);";
            $(document).scrollTop(0);
        }
    }
    else if (browserInfo.firefox) { browserName = "Mozilla Firefox"; }
    else if (browserInfo.opera) { browserName = "Opera"; }
    else if (browserInfo.safari) { browserName = "Safari"; }
    else if (browserInfo.chrome) { browserName = "Google Chrome"; }
    else { browserName = browserInfo.appname; }

    htmlBrowserTips = htmlBrowserTips.replace('[Upgrade]', upgrade);
    htmlBrowserTips = htmlBrowserTips.replace('[BrowserName]', browserName);
    htmlBrowserTips = htmlBrowserTips.replace('[Style]', style);

    if (showTips) {
        $("body").append(htmlBrowserTips);
        if (browserInfo.msie && browserInfo.version == "6.0") {
            $("#spanCloseBrowserTips").remove();
        }
        else {
            $("#spanCloseBrowserTips").click(function () { $(".BrowserTips").remove(); });
        }
    }
};

/*Share*/
function ShareDocument(type, title) {
    var link = '';
    var pics = new Array();

    switch (type) {
        /*新浪 sina.com*/
        case 'sina':
            link = 'http://v.t.sina.com.cn/share/share.php?&url={url}&title={title}&content=gb2312';
            break;
            /*qq空间 qzone.qq.com*/
        case 'qzone':
            link = 'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url={url}&title={title}';
            break;
            /*qq微博 v.t.qq.com*/
        case 'qqt':
            link = 'http://v.t.qq.com/share/share.php?title={title}&url={url}&pic={pic:|}';
            break;
            /*人人网 renren.com*/
        case 'renren':
            link = 'http://share.renren.com/share/buttonshare.do?link={url}&title={title}';
            break;
            /*豆瓣 douban.com*/
        case 'douban':
            link = "http://www.douban.com/recommend/?url={url}&title";
            break;
            /*腾讯朋友 qzone.qq.com*/
        case 'pengyou':
            link = "http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?to=pengyou&url={url}&title={title}";
            break;
            /*msn*/
        case 'msn':
            link = "http://profile.live.com/P.mvc#!/badge?url={url}&title={title}&pic={pic:|}";
            break;
            /*猫扑 mop.com*/
        case 'mop':
            link = "http://tt.mop.com/share/shareV.jsp?pageUrl={url}&title={title}";
            break;
    }

    $('img').each(function (i, n) {
        pics.push(n.src);
    });

    /*标题*/
    title = title != null ? title : $("title")[0].innerText;

    /*生成分享连接*/
    link = link.replace('{title}', encodeURIComponent(title.Decode()));
    link = link.replace('{url}', encodeURIComponent(window.location.href));
    link = link.replace('{pic:|}', pics.join('|'));

    window.open(link);
};
Wsfly.ShareToWX = function (showCover) {
    //Share To WeiXin
    //Head Tag Add: <meta name="viewport" content="initial-scale=1.0, user-scalable=no" />
    //CSS
    //.ShareListBG,
    //.ShareListBar{ overflow:hidden; position:fixed; left:0; bottom:0; width:100%; height:50px; z-index:99997;}
    //.ShareListBG{ filter:alpha(opacity=90); opacity:0.9; z-index:99996; background:#ddd; border-top:solid 1px #bbb;}
    //.ShareListBar ul{ text-align:center; overflow:hidden; zoom:1; list-style:none; padding:0; margin:0; padding:13px 0;}
    //.ShareListBar ul li{ display:inline-block; font-size:12px; cursor:pointer; height:24px; line-height:24px; margin-right:10px;}
    //.ShareListBar ul li.Title{ cursor:default;}
    //.ShareListBar .ShareToWX{ padding-left:35px; background:url("wx.png") no-repeat left top;}
    //.ShareCoverBG,
    //.ShareCoverCT{ width:100%; height:100%; overflow:hidden; position:fixed; left:0; top:0; z-index:99999; display:none;}
    //.ShareCoverBG{ z-index:99998; background:#000;  filter:alpha(opacity=80); opacity:0.8;}
    //.ShareCoverCT{ background:url("ShareWX.png") no-repeat right top;}
    var html = '<div class="ShareListBG"></div>' +
		       '<div class="ShareListBar">' +
			   '    <ul>' +
               '        <li>分享：</li>' +
               '        <li class="ShareToWX">微信</li>' +
               '    </ul>' +
		       '</div>' +
		       '<div class="ShareCoverBG"></div>' +
		       '<div class="ShareCoverCT"></div>';

    $(document.body).append(html);

    $(".ShareToWX").click(function () {
        //点击关闭
        $(".ShareCoverBG").show();
        $(".ShareCoverCT").show();

        $(".ShareCoverBG").click(function () {
            $(".ShareCoverBG").hide();
            $(".ShareCoverCT").hide();

            $(".ShareCoverBG").unbind("click");
        });
        $(".ShareCoverCT").click(function () {
            $(".ShareCoverBG").hide();
            $(".ShareCoverCT").hide();

            $(".ShareCoverCT").unbind("click");
        });
    });

    if (showCover) {
        $(".ShareToWX").click();
    }
};
/*
* 初始UL选项卡
  <div class="ULHTabs">
    <ul class="ULHTabHD">
        <li class="Current" data-target="ULHTabCT1">Tab1</li>
        <li data-target="ULHTabCT2">Tab2</li>
    </ul>
    <div class="ULHTabCT">
       <div id="ULHTabCT1" class='ULHTabCTBox'></div>
       <div id="ULHTabCT2" class='ULHTabCTBox' style='display:none;'></div>
    </div>
  </div>
*/
function InitULHorizontalTab(fn) {
    $(".ULHTabHD li").click(function () {
        //移除样式
        $(this).parent().find("li").removeAttr("class");
        //当前选中
        $(this).attr("class", "Current");

        //触发对象
        var target = $(this).attr("data-target");
        $(this).parent().parent().find(".ULHTabCTBox").hide();
        $(this).parent().parent().find("#" + target).fadeIn();

        //回调函数
        if (IsFunction(fn)) fn($(this));
    });
};
//浮动 div
Wsfly.Float = {
    InitFloatService: function (content, isLi) {
        //是否有客服列表
        if (IsNullOrEmpty(content)) return;

        //初始浮动客服
        var divFloatService = document.createElement("div");
        document.body.appendChild(divFloatService);

        //得到对象
        var obj = $(divFloatService);

        obj.attr({
            "class": "FloatService"
        });
        obj.css({
            "": ""
        });

        //服务列表
        var serviceList = "";

        if (IsNullOrEmpty(isLi) || isLi == false) {
            //QQ列表
            var qqs = content.split(",");
            for (var i = 0; i < qqs.length; i++) {
                serviceList += '<li><a target="_blank" href="http://wpa.qq.com/msgrd?v=3&uin=' + qqs[i] + '&site=qq&menu=yes"><img border="0" src="http://wpa.qq.com/pa?p=1:' + qqs[i] + ':51" alt="点击这里给我发消息" title="点击这里给我发消息"></a></li>';
            }
        }
        else {
            serviceList = content;
        }

        //Html内容
        obj.html('<div class="FloatService_Bar"></div>' +
                 '<div class="FloatService_List">' +
                      '<ul id="ulFloatService">' + serviceList + '</ul>' +
                 '</div>');

        //鼠标在客服列表
        obj.hover(function () {
            $(this).find(".FloatService_List").show();
        }, function () {
            $(this).find(".FloatService_List").hide();
        });
    },
    InitFloatInvite: function () {
        //初始浮动邀请
        var divFloatService = document.createElement("div");
        document.body.appendChild(divFloatService);

        //得到对象
        var obj = $(divFloatService);

        //属性
        obj.attr({
            "class": "FloatInvite"
        });
        //样式
        obj.css({
            "": ""
        });

        //Html内容
        obj.html('<div class="FloatInvite_Close"></div>' +
                 '<div class="FloatInvite_Ok"></div>' +
                 '<div class="FloatInvite_Cancel"></div>');

        $(obj.find(".FloatInvite_Close")).click(function () {
            obj.fadeOut();
        });
        $(obj.find(".FloatInvite_Cancel")).click(function () {
            obj.fadeOut();
        });
        $(obj.find(".FloatInvite_Ok")).click(function () {
            //obj.fadeOut();
        });
    }
};
//显示QQ浮动
//参数：
//    qqs QQ号码 123456,1234567,12345678|123456789
//    names 分组名称 分组1|分组2|分组3
Wsfly.ShowQQFloat = function (qqs, wxs, names, title) {
    title = IsNullOrEmpty(title) ? "在线客服" : title;

    var qqItem = '<div class="RightQQItem"><a href="http://wpa.qq.com/msgrd?v=3&amp;uin=[qq]&amp;site=qq&amp;menu=yes" target="_blank"><img title="点击这里给我发消息" border="0" alt="点击这里给我发消息" align="middle" src="http://wpa.qq.com/pa?p=2:[qq]:41" /></a></div>';
    var wxItem = '<div class="RightWXItem"><img src="[wx]" /><br />微信扫一扫</div>';
    var strHtml = "<div class='RightFloatQQ'><div class='RightFloatQQCT'>";
    strHtml += "<div class='RightFloatTitle'>" + title + "</div>";

    if (IsNullOrEmpty(qqs) && IsNullOrEmpty(wxs)) return;

    //QQ客服
    if (!IsNullOrEmpty(qqs)) {
        if (!IsNullOrEmpty(names)) {
            var arrayNames = names.split('|');

            for (var i = 0; i < arrayNames.length; i++) {
                var name = arrayNames[i];

                strHtml += "<div class='QQGroupName'>" + name + "</div>";

                var arrayQQs = qqs.split('|')[i].split(',');

                for (var j = 0; j < arrayQQs.length; j++) {
                    strHtml += qqItem.replace(/\[qq\]/g, arrayQQs[j]);
                }
            }
        }
        else {
            qqs = qqs.replace(/\|/g, ",");
            var arrayQQs = qqs.split(',');

            for (var k = 0; k < arrayQQs.length; k++) {
                strHtml += qqItem.replace(/\[qq\]/g, arrayQQs[k]);
            }
        }
    }

    //微信客服
    if (!IsNullOrEmpty(wxs)) {
        strHtml += "<div class='QQGroupName'>微信客服</div>";
        wxs = wxs.replace(/\|/g, ",");
        var arrayWXs = wxs.split(',');
        for (var m = 0; m < arrayWXs.length; m++) {
            strHtml += wxItem.replace(/\[wx\]/g, arrayWXs[m]);
        }
    }
    strHtml += "</div><div class='RightFloatQQTag'></div>";
    strHtml += "</div>";


    Wsfly.InitRightBar(strHtml);

    //定时器
    var timerRightFloatQQ = null;

    //自动切换小图标
    timerRightFloatQQ = Wsfly.Delay(function () {
        $(".RightFloatQQCT").hide();
        $(".RightFloatQQTag").show();
        $(".RightFloatQQ").width(40);
    }, 3000);

    $(".RightFloatQQ").hover(function () {
        window.clearTimeout(timerRightFloatQQ);

        $(".RightFloatQQCT").show();
        $(".RightFloatQQTag").hide();
        $(".RightFloatQQ").width(77);
    }, function () {
        timerRightFloatQQ = Wsfly.Delay(function () {
            $(".RightFloatQQCT").hide();
            $(".RightFloatQQTag").show();
            $(".RightFloatQQ").width(40);
        }, 3000);
    });
};
//初始右侧浮动栏
Wsfly.InitRightBar = function (html) {
    var divRightBar = document.createElement("div");
    document.body.appendChild(divRightBar);

    //得到对象
    var obj = $(divRightBar);

    //内容
    obj.html(html);

    //是否IE6浏览器
    if (IsIE6()) {
        obj.css("position", "absolute");
    }
    else {
        obj.css("position", "fixed");
    }

    //样式
    obj.css({
        "right": "10px",
        "bottom": "400px",
        "cursor": "pointer",
        "z-index": "999999"
    });
    //属性
    obj.attr({
        "class": "RightBar"
    });

    //绑定滚动条事件
    $(window).bind('scroll', function () {
        var scrollTop = $(document).scrollTop();
        var viewHeight = $(window).height();
        if (IsIE6()) {
            var top = viewHeight + scrollTop - obj.outerHeight() - 400;
            obj.css('top', top + 'px');
        };
    });
};
//本地化
Wsfly.Local = {
    HasValue: function () {
        //是否有值
        return Wsfly.Local.Get() != null;
    },
    UniqueKey: function () {
        //唯一编号
        return Wsfly.Cookies.Get("Wsfly.com_Customer-UniqueKey");
    },
    IP: function () {
        //IP地址
        return Wsfly.Cookies.Get("Wsfly.com_Customer-LocalIPKey");
    },
    Country: function () {
        //国家
        var local = Wsfly.Local.Get();
        return local == null ? null : local.Country;
    },
    Province: function () {
        //省份
        var local = Wsfly.Local.Get();
        return local == null ? null : local.Province;
    },
    City: function () {
        //城市
        var local = Wsfly.Local.Get();
        return local == null ? null : local.City;
    },
    Service: function () {
        //城市
        var local = Wsfly.Local.Get();
        return local == null ? null : local.Service;
    },
    LastUpdateTime: function () {
        //最后更新时间
        var local = Wsfly.Local.Get();
        return local == null ? null : local.LastUpdateTime;
    },
    Get: function () {
        //获取
        var local = Wsfly.Cookies.Get("Wsfly.com_Customer-LocalKey");
        if (IsNullOrEmpty(local)) return null;
        return local.toString().ToJson();
    },
    SetObj: function (obj) {
        var local = '{"Country":"' + obj.Country + '","Province":"' + obj.Province + '","City":"' + obj.City + '","LastUpdateTime":"' + obj.LastUpdateTime + '","Service":""}';

        //设置2小时过期
        var exp = new Date();
        exp.setTime(exp.getTime() + 2 * 60 * 60 * 1000);
        document.cookie = "Wsfly.com_Customer-LocalKey=" + encodeURI(local) + ";expires=" + exp.toGMTString();
    },
    Set: function (country, province, city) {
        //设置
        var local = { Country: country, Province: province, City: city, LastUpdateTime: new Date() };
        Wsfly.Local.SetObj(local);
    },
    Exec: function (callback) {
        //执行
        //如果没有IP 则去初始化
        //如果有IP 则直接执行
        if (IsNullOrEmpty(Wsfly.Local.IP())) {
            Wsfly.Local.Init(callback);
        }
        else {
            callback();
        }
    },
    Init: function (callback) {
        //初始化
        Wsfly.Local.InitIP(function (ip) {
            Wsfly.Local.InitLocal(ip, callback);
        });
    },
    InitIP: function (callback) {
        //初始化IP 通过API得到
        var url = "http://pv.sohu.com/cityjson";

        //得到IP地址 保存到Cookies
        jQuery.getScript(url, function () {
            try {
                if (returnCitySN) {
                    var ip = returnCitySN.cip;
                    var exp = new Date();
                    exp.setTime(exp.getTime() + 2 * 60 * 60 * 1000);
                    document.cookie = "Wsfly.com_Customer-LocalIPKey=" + encodeURI(ip) + ";expires=" + exp.toGMTString();

                    //回调函数
                    if (IsFunction(callback)) callback(ip);
                }
            } catch (ex) { }
        });
    },
    InitLocal: function (ip, callback) {
        //初始化地址
        var url = "http://counter.sina.com.cn/ip?ip=" + ip;
        $.ajax({
            dataType: 'script',
            scriptCharset: 'gbk',
            url: url,
            success: function () {
                try {
                    if (ILData) {
                        //保存到Cookies
                        Wsfly.Local.Set(ILData[1], ILData[2], ILData[3]);
                        //是否有回调函数
                        if (IsFunction(callback)) {
                            callback();
                        }
                    }
                } catch (ex) { }
            }
        })
    }
};
//中文相关
Wsfly.Chinese = {
    //中文
    /*
    作者:梅雪香
    功能:生成与中文字符串相对映的拼音首字母串  
    版本: V1.0 alpha
    */
    ChineseFirstPY: "YDYQSXMWZSSXJBYMGCCZQPSSQBYCDSCDQLDYLYBSSJGYZZJJFKCCLZDHWDWZJLJPFYYNWJJTMYHZWZHFLZPPQHGSCYYYNJQYXXGJHHSDSJNKKTMOMLCRXYPSNQSECCQZGGLLYJLMYZZSECYKYYHQWJSSGGYXYZYJWWKDJHYCHMYXJTLXJYQBYXZLDWRDJRWYSRLDZJPCBZJJBRCFTLECZSTZFXXZHTRQHYBDLYCZSSYMMRFMYQZPWWJJYFCRWFDFZQPYDDWYXKYJAWJFFXYPSFTZYHHYZYSWCJYXSCLCXXWZZXNBGNNXBXLZSZSBSGPYSYZDHMDZBQBZCWDZZYYTZHBTSYYBZGNTNXQYWQSKBPHHLXGYBFMJEBJHHGQTJCYSXSTKZHLYCKGLYSMZXYALMELDCCXGZYRJXSDLTYZCQKCNNJWHJTZZCQLJSTSTBNXBTYXCEQXGKWJYFLZQLYHYXSPSFXLMPBYSXXXYDJCZYLLLSJXFHJXPJBTFFYABYXBHZZBJYZLWLCZGGBTSSMDTJZXPTHYQTGLJSCQFZKJZJQNLZWLSLHDZBWJNCJZYZSQQYCQYRZCJJWYBRTWPYFTWEXCSKDZCTBZHYZZYYJXZCFFZZMJYXXSDZZOTTBZLQWFCKSZSXFYRLNYJMBDTHJXSQQCCSBXYYTSYFBXDZTGBCNSLCYZZPSAZYZZSCJCSHZQYDXLBPJLLMQXTYDZXSQJTZPXLCGLQTZWJBHCTSYJSFXYEJJTLBGXSXJMYJQQPFZASYJNTYDJXKJCDJSZCBARTDCLYJQMWNQNCLLLKBYBZZSYHQQLTWLCCXTXLLZNTYLNEWYZYXCZXXGRKRMTCNDNJTSYYSSDQDGHSDBJGHRWRQLYBGLXHLGTGXBQJDZPYJSJYJCTMRNYMGRZJCZGJMZMGXMPRYXKJNYMSGMZJYMKMFXMLDTGFBHCJHKYLPFMDXLQJJSMTQGZSJLQDLDGJYCALCMZCSDJLLNXDJFFFFJCZFMZFFPFKHKGDPSXKTACJDHHZDDCRRCFQYJKQCCWJDXHWJLYLLZGCFCQDSMLZPBJJPLSBCJGGDCKKDEZSQCCKJGCGKDJTJDLZYCXKLQSCGJCLTFPCQCZGWPJDQYZJJBYJHSJDZWGFSJGZKQCCZLLPSPKJGQJHZZLJPLGJGJJTHJJYJZCZMLZLYQBGJWMLJKXZDZNJQSYZMLJLLJKYWXMKJLHSKJGBMCLYYMKXJQLBMLLKMDXXKWYXYSLMLPSJQQJQXYXFJTJDXMXXLLCXQBSYJBGWYMBGGBCYXPJYGPEPFGDJGBHBNSQJYZJKJKHXQFGQZKFHYGKHDKLLSDJQXPQYKYBNQSXQNSZSWHBSXWHXWBZZXDMNSJBSBKBBZKLYLXGWXDRWYQZMYWSJQLCJXXJXKJEQXSCYETLZHLYYYSDZPAQYZCMTLSHTZCFYZYXYLJSDCJQAGYSLCQLYYYSHMRQQKLDXZSCSSSYDYCJYSFSJBFRSSZQSBXXPXJYSDRCKGJLGDKZJZBDKTCSYQPYHSTCLDJDHMXMCGXYZHJDDTMHLTXZXYLYMOHYJCLTYFBQQXPFBDFHHTKSQHZYYWCNXXCRWHOWGYJLEGWDQCWGFJYCSNTMYTOLBYGWQWESJPWNMLRYDZSZTXYQPZGCWXHNGPYXSHMYQJXZTDPPBFYHZHTJYFDZWKGKZBLDNTSXHQEEGZZYLZMMZYJZGXZXKHKSTXNXXWYLYAPSTHXDWHZYMPXAGKYDXBHNHXKDPJNMYHYLPMGOCSLNZHKXXLPZZLBMLSFBHHGYGYYGGBHSCYAQTYWLXTZQCEZYDQDQMMHTKLLSZHLSJZWFYHQSWSCWLQAZYNYTLSXTHAZNKZZSZZLAXXZWWCTGQQTDDYZTCCHYQZFLXPSLZYGPZSZNGLNDQTBDLXGTCTAJDKYWNSYZLJHHZZCWNYYZYWMHYCHHYXHJKZWSXHZYXLYSKQYSPSLYZWMYPPKBYGLKZHTYXAXQSYSHXASMCHKDSCRSWJPWXSGZJLWWSCHSJHSQNHCSEGNDAQTBAALZZMSSTDQJCJKTSCJAXPLGGXHHGXXZCXPDMMHLDGTYBYSJMXHMRCPXXJZCKZXSHMLQXXTTHXWZFKHCCZDYTCJYXQHLXDHYPJQXYLSYYDZOZJNYXQEZYSQYAYXWYPDGXDDXSPPYZNDLTWRHXYDXZZJHTCXMCZLHPYYYYMHZLLHNXMYLLLMDCPPXHMXDKYCYRDLTXJCHHZZXZLCCLYLNZSHZJZZLNNRLWHYQSNJHXYNTTTKYJPYCHHYEGKCTTWLGQRLGGTGTYGYHPYHYLQYQGCWYQKPYYYTTTTLHYHLLTYTTSPLKYZXGZWGPYDSSZZDQXSKCQNMJJZZBXYQMJRTFFBTKHZKBXLJJKDXJTLBWFZPPTKQTZTGPDGNTPJYFALQMKGXBDCLZFHZCLLLLADPMXDJHLCCLGYHDZFGYDDGCYYFGYDXKSSEBDHYKDKDKHNAXXYBPBYYHXZQGAFFQYJXDMLJCSQZLLPCHBSXGJYNDYBYQSPZWJLZKSDDTACTBXZDYZYPJZQSJNKKTKNJDJGYYPGTLFYQKASDNTCYHBLWDZHBBYDWJRYGKZYHEYYFJMSDTYFZJJHGCXPLXHLDWXXJKYTCYKSSSMTWCTTQZLPBSZDZWZXGZAGYKTYWXLHLSPBCLLOQMMZSSLCMBJCSZZKYDCZJGQQDSMCYTZQQLWZQZXSSFPTTFQMDDZDSHDTDWFHTDYZJYQJQKYPBDJYYXTLJHDRQXXXHAYDHRJLKLYTWHLLRLLRCXYLBWSRSZZSYMKZZHHKYHXKSMDSYDYCJPBZBSQLFCXXXNXKXWYWSDZYQOGGQMMYHCDZTTFJYYBGSTTTYBYKJDHKYXBELHTYPJQNFXFDYKZHQKZBYJTZBXHFDXKDASWTAWAJLDYJSFHBLDNNTNQJTJNCHXFJSRFWHZFMDRYJYJWZPDJKZYJYMPCYZNYNXFBYTFYFWYGDBNZZZDNYTXZEMMQBSQEHXFZMBMFLZZSRXYMJGSXWZJSPRYDJSJGXHJJGLJJYNZZJXHGXKYMLPYYYCXYTWQZSWHWLYRJLPXSLSXMFSWWKLCTNXNYNPSJSZHDZEPTXMYYWXYYSYWLXJQZQXZDCLEEELMCPJPCLWBXSQHFWWTFFJTNQJHJQDXHWLBYZNFJLALKYYJLDXHHYCSTYYWNRJYXYWTRMDRQHWQCMFJDYZMHMYYXJWMYZQZXTLMRSPWWCHAQBXYGZYPXYYRRCLMPYMGKSJSZYSRMYJSNXTPLNBAPPYPYLXYYZKYNLDZYJZCZNNLMZHHARQMPGWQTZMXXMLLHGDZXYHXKYXYCJMFFYYHJFSBSSQLXXNDYCANNMTCJCYPRRNYTYQNYYMBMSXNDLYLYSLJRLXYSXQMLLYZLZJJJKYZZCSFBZXXMSTBJGNXYZHLXNMCWSCYZYFZLXBRNNNYLBNRTGZQYSATSWRYHYJZMZDHZGZDWYBSSCSKXSYHYTXXGCQGXZZSHYXJSCRHMKKBXCZJYJYMKQHZJFNBHMQHYSNJNZYBKNQMCLGQHWLZNZSWXKHLJHYYBQLBFCDSXDLDSPFZPSKJYZWZXZDDXJSMMEGJSCSSMGCLXXKYYYLNYPWWWGYDKZJGGGZGGSYCKNJWNJPCXBJJTQTJWDSSPJXZXNZXUMELPXFSXTLLXCLJXJJLJZXCTPSWXLYDHLYQRWHSYCSQYYBYAYWJJJQFWQCQQCJQGXALDBZZYJGKGXPLTZYFXJLTPADKYQHPMATLCPDCKBMTXYBHKLENXDLEEGQDYMSAWHZMLJTWYGXLYQZLJEEYYBQQFFNLYXRDSCTGJGXYYNKLLYQKCCTLHJLQMKKZGCYYGLLLJDZGYDHZWXPYSJBZKDZGYZZHYWYFQYTYZSZYEZZLYMHJJHTSMQWYZLKYYWZCSRKQYTLTDXWCTYJKLWSQZWBDCQYNCJSRSZJLKCDCDTLZZZACQQZZDDXYPLXZBQJYLZLLLQDDZQJYJYJZYXNYYYNYJXKXDAZWYRDLJYYYRJLXLLDYXJCYWYWNQCCLDDNYYYNYCKCZHXXCCLGZQJGKWPPCQQJYSBZZXYJSQPXJPZBSBDSFNSFPZXHDWZTDWPPTFLZZBZDMYYPQJRSDZSQZSQXBDGCPZSWDWCSQZGMDHZXMWWFYBPDGPHTMJTHZSMMBGZMBZJCFZWFZBBZMQCFMBDMCJXLGPNJBBXGYHYYJGPTZGZMQBQTCGYXJXLWZKYDPDYMGCFTPFXYZTZXDZXTGKMTYBBCLBJASKYTSSQYYMSZXFJEWLXLLSZBQJJJAKLYLXLYCCTSXMCWFKKKBSXLLLLJYXTYLTJYYTDPJHNHNNKBYQNFQYYZBYYESSESSGDYHFHWTCJBSDZZTFDMXHCNJZYMQWSRYJDZJQPDQBBSTJGGFBKJBXTGQHNGWJXJGDLLTHZHHYYYYYYSXWTYYYCCBDBPYPZYCCZYJPZYWCBDLFWZCWJDXXHYHLHWZZXJTCZLCDPXUJCZZZLYXJJTXPHFXWPYWXZPTDZZBDZCYHJHMLXBQXSBYLRDTGJRRCTTTHYTCZWMXFYTWWZCWJWXJYWCSKYBZSCCTZQNHXNWXXKHKFHTSWOCCJYBCMPZZYKBNNZPBZHHZDLSYDDYTYFJPXYNGFXBYQXCBHXCPSXTYZDMKYSNXSXLHKMZXLYHDHKWHXXSSKQYHHCJYXGLHZXCSNHEKDTGZXQYPKDHEXTYKCNYMYYYPKQYYYKXZLTHJQTBYQHXBMYHSQCKWWYLLHCYYLNNEQXQWMCFBDCCMLJGGXDQKTLXKGNQCDGZJWYJJLYHHQTTTNWCHMXCXWHWSZJYDJCCDBQCDGDNYXZTHCQRXCBHZTQCBXWGQWYYBXHMBYMYQTYEXMQKYAQYRGYZSLFYKKQHYSSQYSHJGJCNXKZYCXSBXYXHYYLSTYCXQTHYSMGSCPMMGCCCCCMTZTASMGQZJHKLOSQYLSWTMXSYQKDZLJQQYPLSYCZTCQQPBBQJZCLPKHQZYYXXDTDDTSJCXFFLLCHQXMJLWCJCXTSPYCXNDTJSHJWXDQQJSKXYAMYLSJHMLALYKXCYYDMNMDQMXMCZNNCYBZKKYFLMCHCMLHXRCJJHSYLNMTJZGZGYWJXSRXCWJGJQHQZDQJDCJJZKJKGDZQGJJYJYLXZXXCDQHHHEYTMHLFSBDJSYYSHFYSTCZQLPBDRFRZTZYKYWHSZYQKWDQZRKMSYNBCRXQBJYFAZPZZEDZCJYWBCJWHYJBQSZYWRYSZPTDKZPFPBNZTKLQYHBBZPNPPTYZZYBQNYDCPJMMCYCQMCYFZZDCMNLFPBPLNGQJTBTTNJZPZBBZNJKLJQYLNBZQHKSJZNGGQSZZKYXSHPZSNBCGZKDDZQANZHJKDRTLZLSWJLJZLYWTJNDJZJHXYAYNCBGTZCSSQMNJPJYTYSWXZFKWJQTKHTZPLBHSNJZSYZBWZZZZLSYLSBJHDWWQPSLMMFBJDWAQYZTCJTBNNWZXQXCDSLQGDSDPDZHJTQQPSWLYYJZLGYXYZLCTCBJTKTYCZJTQKBSJLGMGZDMCSGPYNJZYQYYKNXRPWSZXMTNCSZZYXYBYHYZAXYWQCJTLLCKJJTJHGDXDXYQYZZBYWDLWQCGLZGJGQRQZCZSSBCRPCSKYDZNXJSQGXSSJMYDNSTZTPBDLTKZWXQWQTZEXNQCZGWEZKSSBYBRTSSSLCCGBPSZQSZLCCGLLLZXHZQTHCZMQGYZQZNMCOCSZJMMZSQPJYGQLJYJPPLDXRGZYXCCSXHSHGTZNLZWZKJCXTCFCJXLBMQBCZZWPQDNHXLJCTHYZLGYLNLSZZPCXDSCQQHJQKSXZPBAJYEMSMJTZDXLCJYRYYNWJBNGZZTMJXLTBSLYRZPYLSSCNXPHLLHYLLQQZQLXYMRSYCXZLMMCZLTZSDWTJJLLNZGGQXPFSKYGYGHBFZPDKMWGHCXMSGDXJMCJZDYCABXJDLNBCDQYGSKYDQTXDJJYXMSZQAZDZFSLQXYJSJZYLBTXXWXQQZBJZUFBBLYLWDSLJHXJYZJWTDJCZFQZQZZDZSXZZQLZCDZFJHYSPYMPQZMLPPLFFXJJNZZYLSJEYQZFPFZKSYWJJJHRDJZZXTXXGLGHYDXCSKYSWMMZCWYBAZBJKSHFHJCXMHFQHYXXYZFTSJYZFXYXPZLCHMZMBXHZZSXYFYMNCWDABAZLXKTCSHHXKXJJZJSTHYGXSXYYHHHJWXKZXSSBZZWHHHCWTZZZPJXSNXQQJGZYZYWLLCWXZFXXYXYHXMKYYSWSQMNLNAYCYSPMJKHWCQHYLAJJMZXHMMCNZHBHXCLXTJPLTXYJHDYYLTTXFSZHYXXSJBJYAYRSMXYPLCKDUYHLXRLNLLSTYZYYQYGYHHSCCSMZCTZQXKYQFPYYRPFFLKQUNTSZLLZMWWTCQQYZWTLLMLMPWMBZSSTZRBPDDTLQJJBXZCSRZQQYGWCSXFWZLXCCRSZDZMCYGGDZQSGTJSWLJMYMMZYHFBJDGYXCCPSHXNZCSBSJYJGJMPPWAFFYFNXHYZXZYLREMZGZCYZSSZDLLJCSQFNXZKPTXZGXJJGFMYYYSNBTYLBNLHPFZDCYFBMGQRRSSSZXYSGTZRNYDZZCDGPJAFJFZKNZBLCZSZPSGCYCJSZLMLRSZBZZLDLSLLYSXSQZQLYXZLSKKBRXBRBZCYCXZZZEEYFGKLZLYYHGZSGZLFJHGTGWKRAAJYZKZQTSSHJJXDCYZUYJLZYRZDQQHGJZXSSZBYKJPBFRTJXLLFQWJHYLQTYMBLPZDXTZYGBDHZZRBGXHWNJTJXLKSCFSMWLSDQYSJTXKZSCFWJLBXFTZLLJZLLQBLSQMQQCGCZFPBPHZCZJLPYYGGDTGWDCFCZQYYYQYSSCLXZSKLZZZGFFCQNWGLHQYZJJCZLQZZYJPJZZBPDCCMHJGXDQDGDLZQMFGPSYTSDYFWWDJZJYSXYYCZCYHZWPBYKXRYLYBHKJKSFXTZJMMCKHLLTNYYMSYXYZPYJQYCSYCWMTJJKQYRHLLQXPSGTLYYCLJSCPXJYZFNMLRGJJTYZBXYZMSJYJHHFZQMSYXRSZCWTLRTQZSSTKXGQKGSPTGCZNJSJCQCXHMXGGZTQYDJKZDLBZSXJLHYQGGGTHQSZPYHJHHGYYGKGGCWJZZYLCZLXQSFTGZSLLLMLJSKCTBLLZZSZMMNYTPZSXQHJCJYQXYZXZQZCPSHKZZYSXCDFGMWQRLLQXRFZTLYSTCTMJCXJJXHJNXTNRZTZFQYHQGLLGCXSZSJDJLJCYDSJTLNYXHSZXCGJZYQPYLFHDJSBPCCZHJJJQZJQDYBSSLLCMYTTMQTBHJQNNYGKYRQYQMZGCJKPDCGMYZHQLLSLLCLMHOLZGDYYFZSLJCQZLYLZQJESHNYLLJXGJXLYSYYYXNBZLJSSZCQQCJYLLZLTJYLLZLLBNYLGQCHXYYXOXCXQKYJXXXYKLXSXXYQXCYKQXQCSGYXXYQXYGYTQOHXHXPYXXXULCYEYCHZZCBWQBBWJQZSCSZSSLZYLKDESJZWMYMCYTSDSXXSCJPQQSQYLYYZYCMDJDZYWCBTJSYDJKCYDDJLBDJJSODZYSYXQQYXDHHGQQYQHDYXWGMMMAJDYBBBPPBCMUUPLJZSMTXERXJMHQNUTPJDCBSSMSSSTKJTSSMMTRCPLZSZMLQDSDMJMQPNQDXCFYNBFSDQXYXHYAYKQYDDLQYYYSSZBYDSLNTFQTZQPZMCHDHCZCWFDXTMYQSPHQYYXSRGJCWTJTZZQMGWJJTJHTQJBBHWZPXXHYQFXXQYWYYHYSCDYDHHQMNMTMWCPBSZPPZZGLMZFOLLCFWHMMSJZTTDHZZYFFYTZZGZYSKYJXQYJZQBHMBZZLYGHGFMSHPZFZSNCLPBQSNJXZSLXXFPMTYJYGBXLLDLXPZJYZJYHHZCYWHJYLSJEXFSZZYWXKZJLUYDTMLYMQJPWXYHXSKTQJEZRPXXZHHMHWQPWQLYJJQJJZSZCPHJLCHHNXJLQWZJHBMZYXBDHHYPZLHLHLGFWLCHYYTLHJXCJMSCPXSTKPNHQXSRTYXXTESYJCTLSSLSTDLLLWWYHDHRJZSFGXTSYCZYNYHTDHWJSLHTZDQDJZXXQHGYLTZPHCSQFCLNJTCLZPFSTPDYNYLGMJLLYCQHYSSHCHYLHQYQTMZYPBYWRFQYKQSYSLZDQJMPXYYSSRHZJNYWTQDFZBWWTWWRXCWHGYHXMKMYYYQMSMZHNGCEPMLQQMTCWCTMMPXJPJJHFXYYZSXZHTYBMSTSYJTTQQQYYLHYNPYQZLCYZHZWSMYLKFJXLWGXYPJYTYSYXYMZCKTTWLKSMZSYLMPWLZWXWQZSSAQSYXYRHSSNTSRAPXCPWCMGDXHXZDZYFJHGZTTSBJHGYZSZYSMYCLLLXBTYXHBBZJKSSDMALXHYCFYGMQYPJYCQXJLLLJGSLZGQLYCJCCZOTYXMTMTTLLWTGPXYMZMKLPSZZZXHKQYSXCTYJZYHXSHYXZKXLZWPSQPYHJWPJPWXQQYLXSDHMRSLZZYZWTTCYXYSZZSHBSCCSTPLWSSCJCHNLCGCHSSPHYLHFHHXJSXYLLNYLSZDHZXYLSXLWZYKCLDYAXZCMDDYSPJTQJZLNWQPSSSWCTSTSZLBLNXSMNYYMJQBQHRZWTYYDCHQLXKPZWBGQYBKFCMZWPZLLYYLSZYDWHXPSBCMLJBSCGBHXLQHYRLJXYSWXWXZSLDFHLSLYNJLZYFLYJYCDRJLFSYZFSLLCQYQFGJYHYXZLYLMSTDJCYHBZLLNWLXXYGYYHSMGDHXXHHLZZJZXCZZZCYQZFNGWPYLCPKPYYPMCLQKDGXZGGWQBDXZZKZFBXXLZXJTPJPTTBYTSZZDWSLCHZHSLTYXHQLHYXXXYYZYSWTXZKHLXZXZPYHGCHKCFSYHUTJRLXFJXPTZTWHPLYXFCRHXSHXKYXXYHZQDXQWULHYHMJTBFLKHTXCWHJFWJCFPQRYQXCYYYQYGRPYWSGSUNGWCHKZDXYFLXXHJJBYZWTSXXNCYJJYMSWZJQRMHXZWFQSYLZJZGBHYNSLBGTTCSYBYXXWXYHXYYXNSQYXMQYWRGYQLXBBZLJSYLPSYTJZYHYZAWLRORJMKSCZJXXXYXCHDYXRYXXJDTSQFXLYLTSFFYXLMTYJMJUYYYXLTZCSXQZQHZXLYYXZHDNBRXXXJCTYHLBRLMBRLLAXKYLLLJLYXXLYCRYLCJTGJCMTLZLLCYZZPZPCYAWHJJFYBDYYZSMPCKZDQYQPBPCJPDCYZMDPBCYYDYCNNPLMTMLRMFMMGWYZBSJGYGSMZQQQZTXMKQWGXLLPJGZBQCDJJJFPKJKCXBLJMSWMDTQJXLDLPPBXCWRCQFBFQJCZAHZGMYKPHYYHZYKNDKZMBPJYXPXYHLFPNYYGXJDBKXNXHJMZJXSTRSTLDXSKZYSYBZXJLXYSLBZYSLHXJPFXPQNBYLLJQKYGZMCYZZYMCCSLCLHZFWFWYXZMWSXTYNXJHPYYMCYSPMHYSMYDYSHQYZCHMJJMZCAAGCFJBBHPLYZYLXXSDJGXDHKXXTXXNBHRMLYJSLTXMRHNLXQJXYZLLYSWQGDLBJHDCGJYQYCMHWFMJYBMBYJYJWYMDPWHXQLDYGPDFXXBCGJSPCKRSSYZJMSLBZZJFLJJJLGXZGYXYXLSZQYXBEXYXHGCXBPLDYHWETTWWCJMBTXCHXYQXLLXFLYXLLJLSSFWDPZSMYJCLMWYTCZPCHQEKCQBWLCQYDPLQPPQZQFJQDJHYMMCXTXDRMJWRHXCJZYLQXDYYNHYYHRSLSRSYWWZJYMTLTLLGTQCJZYABTCKZCJYCCQLJZQXALMZYHYWLWDXZXQDLLQSHGPJFJLJHJABCQZDJGTKHSSTCYJLPSWZLXZXRWGLDLZRLZXTGSLLLLZLYXXWGDZYGBDPHZPBRLWSXQBPFDWOFMWHLYPCBJCCLDMBZPBZZLCYQXLDOMZBLZWPDWYYGDSTTHCSQSCCRSSSYSLFYBFNTYJSZDFNDPDHDZZMBBLSLCMYFFGTJJQWFTMTPJWFNLBZCMMJTGBDZLQLPYFHYYMJYLSDCHDZJWJCCTLJCLDTLJJCPDDSQDSSZYBNDBJLGGJZXSXNLYCYBJXQYCBYLZCFZPPGKCXZDZFZTJJFJSJXZBNZYJQTTYJYHTYCZHYMDJXTTMPXSPLZCDWSLSHXYPZGTFMLCJTYCBPMGDKWYCYZCDSZZYHFLYCTYGWHKJYYLSJCXGYWJCBLLCSNDDBTZBSCLYZCZZSSQDLLMQYYHFSLQLLXFTYHABXGWNYWYYPLLSDLDLLBJCYXJZMLHLJDXYYQYTDLLLBUGBFDFBBQJZZMDPJHGCLGMJJPGAEHHBWCQXAXHHHZCHXYPHJAXHLPHJPGPZJQCQZGJJZZUZDMQYYBZZPHYHYBWHAZYJHYKFGDPFQSDLZMLJXKXGALXZDAGLMDGXMWZQYXXDXXPFDMMSSYMPFMDMMKXKSYZYSHDZKXSYSMMZZZMSYDNZZCZXFPLSTMZDNMXCKJMZTYYMZMZZMSXHHDCZJEMXXKLJSTLWLSQLYJZLLZJSSDPPMHNLZJCZYHMXXHGZCJMDHXTKGRMXFWMCGMWKDTKSXQMMMFZZYDKMSCLCMPCGMHSPXQPZDSSLCXKYXTWLWJYAHZJGZQMCSNXYYMMPMLKJXMHLMLQMXCTKZMJQYSZJSYSZHSYJZJCDAJZYBSDQJZGWZQQXFKDMSDJLFWEHKZQKJPEYPZYSZCDWYJFFMZZYLTTDZZEFMZLBNPPLPLPEPSZALLTYLKCKQZKGENQLWAGYXYDPXLHSXQQWQCQXQCLHYXXMLYCCWLYMQYSKGCHLCJNSZKPYZKCQZQLJPDMDZHLASXLBYDWQLWDNBQCRYDDZTJYBKBWSZDXDTNPJDTCTQDFXQQMGNXECLTTBKPWSLCTYQLPWYZZKLPYGZCQQPLLKCCYLPQMZCZQCLJSLQZDJXLDDHPZQDLJJXZQDXYZQKZLJCYQDYJPPYPQYKJYRMPCBYMCXKLLZLLFQPYLLLMBSGLCYSSLRSYSQTMXYXZQZFDZUYSYZTFFMZZSMZQHZSSCCMLYXWTPZGXZJGZGSJSGKDDHTQGGZLLBJDZLCBCHYXYZHZFYWXYZYMSDBZZYJGTSMTFXQYXQSTDGSLNXDLRYZZLRYYLXQHTXSRTZNGZXBNQQZFMYKMZJBZYMKBPNLYZPBLMCNQYZZZSJZHJCTZKHYZZJRDYZHNPXGLFZTLKGJTCTSSYLLGZRZBBQZZKLPKLCZYSSUYXBJFPNJZZXCDWXZYJXZZDJJKGGRSRJKMSMZJLSJYWQSKYHQJSXPJZZZLSNSHRNYPZTWCHKLPSRZLZXYJQXQKYSJYCZTLQZYBBYBWZPQDWWYZCYTJCJXCKCWDKKZXSGKDZXWWYYJQYYTCYTDLLXWKCZKKLCCLZCQQDZLQLCSFQCHQHSFSMQZZLNBJJZBSJHTSZDYSJQJPDLZCDCWJKJZZLPYCGMZWDJJBSJQZSYZYHHXJPBJYDSSXDZNCGLQMBTSFSBPDZDLZNFGFJGFSMPXJQLMBLGQCYYXBQKDJJQYRFKZTJDHCZKLBSDZCFJTPLLJGXHYXZCSSZZXSTJYGKGCKGYOQXJPLZPBPGTGYJZGHZQZZLBJLSQFZGKQQJZGYCZBZQTLDXRJXBSXXPZXHYZYCLWDXJJHXMFDZPFZHQHQMQGKSLYHTYCGFRZGNQXCLPDLBZCSCZQLLJBLHBZCYPZZPPDYMZZSGYHCKCPZJGSLJLNSCDSLDLXBMSTLDDFJMKDJDHZLZXLSZQPQPGJLLYBDSZGQLBZLSLKYYHZTTNTJYQTZZPSZQZTLLJTYYLLQLLQYZQLBDZLSLYYZYMDFSZSNHLXZNCZQZPBWSKRFBSYZMTHBLGJPMCZZLSTLXSHTCSYZLZBLFEQHLXFLCJLYLJQCBZLZJHHSSTBRMHXZHJZCLXFNBGXGTQJCZTMSFZKJMSSNXLJKBHSJXNTNLZDNTLMSJXGZJYJCZXYJYJWRWWQNZTNFJSZPZSHZJFYRDJSFSZJZBJFZQZZHZLXFYSBZQLZSGYFTZDCSZXZJBQMSZKJRHYJZCKMJKHCHGTXKXQGLXPXFXTRTYLXJXHDTSJXHJZJXZWZLCQSBTXWXGXTXXHXFTSDKFJHZYJFJXRZSDLLLTQSQQZQWZXSYQTWGWBZCGZLLYZBCLMQQTZHZXZXLJFRMYZFLXYSQXXJKXRMQDZDMMYYBSQBHGZMWFWXGMXLZPYYTGZYCCDXYZXYWGSYJYZNBHPZJSQSYXSXRTFYZGRHZTXSZZTHCBFCLSYXZLZQMZLMPLMXZJXSFLBYZMYQHXJSXRXSQZZZSSLYFRCZJRCRXHHZXQYDYHXSJJHZCXZBTYNSYSXJBQLPXZQPYMLXZKYXLXCJLCYSXXZZLXDLLLJJYHZXGYJWKJRWYHCPSGNRZLFZWFZZNSXGXFLZSXZZZBFCSYJDBRJKRDHHGXJLJJTGXJXXSTJTJXLYXQFCSGSWMSBCTLQZZWLZZKXJMLTMJYHSDDBXGZHDLBMYJFRZFSGCLYJBPMLYSMSXLSZJQQHJZFXGFQFQBPXZGYYQXGZTCQWYLTLGWSGWHRLFSFGZJMGMGBGTJFSYZZGZYZAFLSSPMLPFLCWBJZCLJJMZLPJJLYMQDMYYYFBGYGYZMLYZDXQYXRQQQHSYYYQXYLJTYXFSFSLLGNQCYHYCWFHCCCFXPYLYPLLZYXXXXXKQHHXSHJZCFZSCZJXCPZWHHHHHAPYLQALPQAFYHXDYLUKMZQGGGDDESRNNZLTZGCHYPPYSQJJHCLLJTOLNJPZLJLHYMHEYDYDSQYCDDHGZUNDZCLZYZLLZNTNYZGSLHSLPJJBDGWXPCDUTJCKLKCLWKLLCASSTKZZDNQNTTLYYZSSYSSZZRYLJQKCQDHHCRXRZYDGRGCWCGZQFFFPPJFZYNAKRGYWYQPQXXFKJTSZZXSWZDDFBBXTBGTZKZNPZZPZXZPJSZBMQHKCYXYLDKLJNYPKYGHGDZJXXEAHPNZKZTZCMXCXMMJXNKSZQNMNLWBWWXJKYHCPSTMCSQTZJYXTPCTPDTNNPGLLLZSJLSPBLPLQHDTNJNLYYRSZFFJFQWDPHZDWMRZCCLODAXNSSNYZRESTYJWJYJDBCFXNMWTTBYLWSTSZGYBLJPXGLBOCLHPCBJLTMXZLJYLZXCLTPNCLCKXTPZJSWCYXSFYSZDKNTLBYJCYJLLSTGQCBXRYZXBXKLYLHZLQZLNZCXWJZLJZJNCJHXMNZZGJZZXTZJXYCYYCXXJYYXJJXSSSJSTSSTTPPGQTCSXWZDCSYFPTFBFHFBBLZJCLZZDBXGCXLQPXKFZFLSYLTUWBMQJHSZBMDDBCYSCCLDXYCDDQLYJJWMQLLCSGLJJSYFPYYCCYLTJANTJJPWYCMMGQYYSXDXQMZHSZXPFTWWZQSWQRFKJLZJQQYFBRXJHHFWJJZYQAZMYFRHCYYBYQWLPEXCCZSTYRLTTDMQLYKMBBGMYYJPRKZNPBSXYXBHYZDJDNGHPMFSGMWFZMFQMMBCMZZCJJLCNUXYQLMLRYGQZCYXZLWJGCJCGGMCJNFYZZJHYCPRRCMTZQZXHFQGTJXCCJEAQCRJYHPLQLSZDJRBCQHQDYRHYLYXJSYMHZYDWLDFRYHBPYDTSSCNWBXGLPZMLZZTQSSCPJMXXYCSJYTYCGHYCJWYRXXLFEMWJNMKLLSWTXHYYYNCMMCWJDQDJZGLLJWJRKHPZGGFLCCSCZMCBLTBHBQJXQDSPDJZZGKGLFQYWBZYZJLTSTDHQHCTCBCHFLQMPWDSHYYTQWCNZZJTLBYMBPDYYYXSQKXWYYFLXXNCWCXYPMAELYKKJMZZZBRXYYQJFLJPFHHHYTZZXSGQQMHSPGDZQWBWPJHZJDYSCQWZKTXXSQLZYYMYSDZGRXCKKUJLWPYSYSCSYZLRMLQSYLJXBCXTLWDQZPCYCYKPPPNSXFYZJJRCEMHSZMSXLXGLRWGCSTLRSXBZGBZGZTCPLUJLSLYLYMTXMTZPALZXPXJTJWTCYYZLBLXBZLQMYLXPGHDSLSSDMXMBDZZSXWHAMLCZCPJMCNHJYSNSYGCHSKQMZZQDLLKABLWJXSFMOCDXJRRLYQZKJMYBYQLYHETFJZFRFKSRYXFJTWDSXXSYSQJYSLYXWJHSNLXYYXHBHAWHHJZXWMYLJCSSLKYDZTXBZSYFDXGXZJKHSXXYBSSXDPYNZWRPTQZCZENYGCXQFJYKJBZMLJCMQQXUOXSLYXXLYLLJDZBTYMHPFSTTQQWLHOKYBLZZALZXQLHZWRRQHLSTMYPYXJJXMQSJFNBXYXYJXXYQYLTHYLQYFMLKLJTMLLHSZWKZHLJMLHLJKLJSTLQXYLMBHHLNLZXQJHXCFXXLHYHJJGBYZZKBXSCQDJQDSUJZYYHZHHMGSXCSYMXFEBCQWWRBPYYJQTYZCYQYQQZYHMWFFHGZFRJFCDPXNTQYZPDYKHJLFRZXPPXZDBBGZQSTLGDGYLCQMLCHHMFYWLZYXKJLYPQHSYWMQQGQZMLZJNSQXJQSYJYCBEHSXFSZPXZWFLLBCYYJDYTDTHWZSFJMQQYJLMQXXLLDTTKHHYBFPWTYYSQQWNQWLGWDEBZWCMYGCULKJXTMXMYJSXHYBRWFYMWFRXYQMXYSZTZZTFYKMLDHQDXWYYNLCRYJBLPSXCXYWLSPRRJWXHQYPHTYDNXHHMMYWYTZCSQMTSSCCDALWZTCPQPYJLLQZYJSWXMZZMMYLMXCLMXCZMXMZSQTZPPQQBLPGXQZHFLJJHYTJSRXWZXSCCDLXTYJDCQJXSLQYCLZXLZZXMXQRJMHRHZJBHMFLJLMLCLQNLDXZLLLPYPSYJYSXCQQDCMQJZZXHNPNXZMEKMXHYKYQLXSXTXJYYHWDCWDZHQYYBGYBCYSCFGPSJNZDYZZJZXRZRQJJYMCANYRJTLDPPYZBSTJKXXZYPFDWFGZZRPYMTNGXZQBYXNBUFNQKRJQZMJEGRZGYCLKXZDSKKNSXKCLJSPJYYZLQQJYBZSSQLLLKJXTBKTYLCCDDBLSPPFYLGYDTZJYQGGKQTTFZXBDKTYYHYBBFYTYYBCLPDYTGDHRYRNJSPTCSNYJQHKLLLZSLYDXXWBCJQSPXBPJZJCJDZFFXXBRMLAZHCSNDLBJDSZBLPRZTSWSBXBCLLXXLZDJZSJPYLYXXYFTFFFBHJJXGBYXJPMMMPSSJZJMTLYZJXSWXTYLEDQPJMYGQZJGDJLQJWJQLLSJGJGYGMSCLJJXDTYGJQJQJCJZCJGDZZSXQGSJGGCXHQXSNQLZZBXHSGZXCXYLJXYXYYDFQQJHJFXDHCTXJYRXYSQTJXYEFYYSSYYJXNCYZXFXMSYSZXYYSCHSHXZZZGZZZGFJDLTYLNPZGYJYZYYQZPBXQBDZTZCZYXXYHHSQXSHDHGQHJHGYWSZTMZMLHYXGEBTYLZKQWYTJZRCLEKYSTDBCYKQQSAYXCJXWWGSBHJYZYDHCSJKQCXSWXFLTYNYZPZCCZJQTZWJQDZZZQZLJJXLSBHPYXXPSXSHHEZTXFPTLQYZZXHYTXNCFZYYHXGNXMYWXTZSJPTHHGYMXMXQZXTSBCZYJYXXTYYZYPCQLMMSZMJZZLLZXGXZAAJZYXJMZXWDXZSXZDZXLEYJJZQBHZWZZZQTZPSXZTDSXJJJZNYAZPHXYYSRNQDTHZHYYKYJHDZXZLSWCLYBZYECWCYCRYLCXNHZYDZYDYJDFRJJHTRSQTXYXJRJHOJYNXELXSFSFJZGHPZSXZSZDZCQZBYYKLSGSJHCZSHDGQGXYZGXCHXZJWYQWGYHKSSEQZZNDZFKWYSSTCLZSTSYMCDHJXXYWEYXCZAYDMPXMDSXYBSQMJMZJMTZQLPJYQZCGQHXJHHLXXHLHDLDJQCLDWBSXFZZYYSCHTYTYYBHECXHYKGJPXHHYZJFXHWHBDZFYZBCAPNPGNYDMSXHMMMMAMYNBYJTMPXYYMCTHJBZYFCGTYHWPHFTWZZEZSBZEGPFMTSKFTYCMHFLLHGPZJXZJGZJYXZSBBQSCZZLZCCSTPGXMJSFTCCZJZDJXCYBZLFCJSYZFGSZLYBCWZZBYZDZYPSWYJZXZBDSYUXLZZBZFYGCZXBZHZFTPBGZGEJBSTGKDMFHYZZJHZLLZZGJQZLSFDJSSCBZGPDLFZFZSZYZYZSYGCXSNXXCHCZXTZZLJFZGQSQYXZJQDCCZTQCDXZJYQJQCHXZTDLGSCXZSYQJQTZWLQDQZTQCHQQJZYEZZZPBWKDJFCJPZTYPQYQTTYNLMBDKTJZPQZQZZFPZSBNJLGYJDXJDZZKZGQKXDLPZJTCJDQBXDJQJSTCKNXBXZMSLYJCQMTJQWWCJQNJNLLLHJCWQTBZQYDZCZPZZDZYDDCYZZZCCJTTJFZDPRRTZTJDCQTQZDTJNPLZBCLLCTZSXKJZQZPZLBZRBTJDCXFCZDBCCJJLTQQPLDCGZDBBZJCQDCJWYNLLZYZCCDWLLXWZLXRXNTQQCZXKQLSGDFQTDDGLRLAJJTKUYMKQLLTZYTDYYCZGJWYXDXFRSKSTQTENQMRKQZHHQKDLDAZFKYPBGGPZREBZZYKZZSPEGJXGYKQZZZSLYSYYYZWFQZYLZZLZHWCHKYPQGNPGBLPLRRJYXCCSYYHSFZFYBZYYTGZXYLXCZWXXZJZBLFFLGSKHYJZEYJHLPLLLLCZGXDRZELRHGKLZZYHZLYQSZZJZQLJZFLNBHGWLCZCFJYSPYXZLZLXGCCPZBLLCYBBBBUBBCBPCRNNZCZYRBFSRLDCGQYYQXYGMQZWTZYTYJXYFWTEHZZJYWLCCNTZYJJZDEDPZDZTSYQJHDYMBJNYJZLXTSSTPHNDJXXBYXQTZQDDTJTDYYTGWSCSZQFLSHLGLBCZPHDLYZJYCKWTYTYLBNYTSDSYCCTYSZYYEBHEXHQDTWNYGYCLXTSZYSTQMYGZAZCCSZZDSLZCLZRQXYYELJSBYMXSXZTEMBBLLYYLLYTDQYSHYMRQWKFKBFXNXSBYCHXBWJYHTQBPBSBWDZYLKGZSKYHXQZJXHXJXGNLJKZLYYCDXLFYFGHLJGJYBXQLYBXQPQGZTZPLNCYPXDJYQYDYMRBESJYYHKXXSTMXRCZZYWXYQYBMCLLYZHQYZWQXDBXBZWZMSLPDMYSKFMZKLZCYQYCZLQXFZZYDQZPZYGYJYZMZXDZFYFYTTQTZHGSPCZMLCCYTZXJCYTJMKSLPZHYSNZLLYTPZCTZZCKTXDHXXTQCYFKSMQCCYYAZHTJPCYLZLYJBJXTPNYLJYYNRXSYLMMNXJSMYBCSYSYLZYLXJJQYLDZLPQBFZZBLFNDXQKCZFYWHGQMRDSXYCYTXNQQJZYYPFZXDYZFPRXEJDGYQBXRCNFYYQPGHYJDYZXGRHTKYLNWDZNTSMPKLBTHBPYSZBZTJZSZZJTYYXZPHSSZZBZCZPTQFZMYFLYPYBBJQXZMXXDJMTSYSKKBJZXHJCKLPSMKYJZCXTMLJYXRZZQSLXXQPYZXMKYXXXJCLJPRMYYGADYSKQLSNDHYZKQXZYZTCGHZTLMLWZYBWSYCTBHJHJFCWZTXWYTKZLXQSHLYJZJXTMPLPYCGLTBZZTLZJCYJGDTCLKLPLLQPJMZPAPXYZLKKTKDZCZZBNZDYDYQZJYJGMCTXLTGXSZLMLHBGLKFWNWZHDXUHLFMKYSLGXDTWWFRJEJZTZHYDXYKSHWFZCQSHKTMQQHTZHYMJDJSKHXZJZBZZXYMPAGQMSTPXLSKLZYNWRTSQLSZBPSPSGZWYHTLKSSSWHZZLYYTNXJGMJSZSUFWNLSOZTXGXLSAMMLBWLDSZYLAKQCQCTMYCFJBSLXCLZZCLXXKSBZQCLHJPSQPLSXXCKSLNHPSFQQYTXYJZLQLDXZQJZDYYDJNZPTUZDSKJFSLJHYLZSQZLBTXYDGTQFDBYAZXDZHZJNHHQBYKNXJJQCZMLLJZKSPLDYCLBBLXKLELXJLBQYCXJXGCNLCQPLZLZYJTZLJGYZDZPLTQCSXFDMNYCXGBTJDCZNBGBQYQJWGKFHTNPYQZQGBKPBBYZMTJDYTBLSQMPSXTBNPDXKLEMYYCJYNZCTLDYKZZXDDXHQSHDGMZSJYCCTAYRZLPYLTLKXSLZCGGEXCLFXLKJRTLQJAQZNCMBYDKKCXGLCZJZXJHPTDJJMZQYKQSECQZDSHHADMLZFMMZBGNTJNNLGBYJBRBTMLBYJDZXLCJLPLDLPCQDHLXZLYCBLCXZZJADJLNZMMSSSMYBHBSQKBHRSXXJMXSDZNZPXLGBRHWGGFCXGMSKLLTSJYYCQLTSKYWYYHYWXBXQYWPYWYKQLSQPTNTKHQCWDQKTWPXXHCPTHTWUMSSYHBWCRWXHJMKMZNGWTMLKFGHKJYLSYYCXWHYECLQHKQHTTQKHFZLDXQWYZYYDESBPKYRZPJFYYZJCEQDZZDLATZBBFJLLCXDLMJSSXEGYGSJQXCWBXSSZPDYZCXDNYXPPZYDLYJCZPLTXLSXYZYRXCYYYDYLWWNZSAHJSYQYHGYWWAXTJZDAXYSRLTDPSSYYFNEJDXYZHLXLLLZQZSJNYQYQQXYJGHZGZCYJCHZLYCDSHWSHJZYJXCLLNXZJJYYXNFXMWFPYLCYLLABWDDHWDXJMCXZTZPMLQZHSFHZYNZTLLDYWLSLXHYMMYLMBWWKYXYADTXYLLDJPYBPWUXJMWMLLSAFDLLYFLBHHHBQQLTZJCQJLDJTFFKMMMBYTHYGDCQRDDWRQJXNBYSNWZDBYYTBJHPYBYTTJXAAHGQDQTMYSTQXKBTZPKJLZRBEQQSSMJJBDJOTGTBXPGBKTLHQXJJJCTHXQDWJLWRFWQGWSHCKRYSWGFTGYGBXSDWDWRFHWYTJJXXXJYZYSLPYYYPAYXHYDQKXSHXYXGSKQHYWFDDDPPLCJLQQEEWXKSYYKDYPLTJTHKJLTCYYHHJTTPLTZZCDLTHQKZXQYSTEEYWYYZYXXYYSTTJKLLPZMCYHQGXYHSRMBXPLLNQYDQHXSXXWGDQBSHYLLPJJJTHYJKYPPTHYYKTYEZYENMDSHLCRPQFDGFXZPSFTLJXXJBSWYYSKSFLXLPPLBBBLBSFXFYZBSJSSYLPBBFFFFSSCJDSTZSXZRYYSYFFSYZYZBJTBCTSBSDHRTJJBYTCXYJEYLXCBNEBJDSYXYKGSJZBXBYTFZWGENYHHTHZHHXFWGCSTBGXKLSXYWMTMBYXJSTZSCDYQRCYTWXZFHMYMCXLZNSDJTTTXRYCFYJSBSDYERXJLJXBBDEYNJGHXGCKGSCYMBLXJMSZNSKGXFBNBPTHFJAAFXYXFPXMYPQDTZCXZZPXRSYWZDLYBBKTYQPQJPZYPZJZNJPZJLZZFYSBTTSLMPTZRTDXQSJEHBZYLZDHLJSQMLHTXTJECXSLZZSPKTLZKQQYFSYGYWPCPQFHQHYTQXZKRSGTTSQCZLPTXCDYYZXSQZSLXLZMYCPCQBZYXHBSXLZDLTCDXTYLZJYYZPZYZLTXJSJXHLPMYTXCQRBLZSSFJZZTNJYTXMYJHLHPPLCYXQJQQKZZSCPZKSWALQSBLCCZJSXGWWWYGYKTJBBZTDKHXHKGTGPBKQYSLPXPJCKBMLLXDZSTBKLGGQKQLSBKKTFXRMDKBFTPZFRTBBRFERQGXYJPZSSTLBZTPSZQZSJDHLJQLZBPMSMMSXLQQNHKNBLRDDNXXDHDDJCYYGYLXGZLXSYGMQQGKHBPMXYXLYTQWLWGCPBMQXCYZYDRJBHTDJYHQSHTMJSBYPLWHLZFFNYPMHXXHPLTBQPFBJWQDBYGPNZTPFZJGSDDTQSHZEAWZZYLLTYYBWJKXXGHLFKXDJTMSZSQYNZGGSWQSPHTLSSKMCLZXYSZQZXNCJDQGZDLFNYKLJCJLLZLMZZNHYDSSHTHZZLZZBBHQZWWYCRZHLYQQJBEYFXXXWHSRXWQHWPSLMSSKZTTYGYQQWRSLALHMJTQJSMXQBJJZJXZYZKXBYQXBJXSHZTSFJLXMXZXFGHKZSZGGYLCLSARJYHSLLLMZXELGLXYDJYTLFBHBPNLYZFBBHPTGJKWETZHKJJXZXXGLLJLSTGSHJJYQLQZFKCGNNDJSSZFDBCTWWSEQFHQJBSAQTGYPQLBXBMMYWXGSLZHGLZGQYFLZBYFZJFRYSFMBYZHQGFWZSYFYJJPHZBYYZFFWODGRLMFTWLBZGYCQXCDJYGZYYYYTYTYDWEGAZYHXJLZYYHLRMGRXXZCLHNELJJTJTPWJYBJJBXJJTJTEEKHWSLJPLPSFYZPQQBDLQJJTYYQLYZKDKSQJYYQZLDQTGJQYZJSUCMRYQTHTEJMFCTYHYPKMHYZWJDQFHYYXWSHCTXRLJHQXHCCYYYJLTKTTYTMXGTCJTZAYYOCZLYLBSZYWJYTSJYHBYSHFJLYGJXXTMZYYLTXXYPZLXYJZYZYYPNHMYMDYYLBLHLSYYQQLLNJJYMSOYQBZGDLYXYLCQYXTSZEGXHZGLHWBLJHEYXTWQMAKBPQCGYSHHEGQCMWYYWLJYJHYYZLLJJYLHZYHMGSLJLJXCJJYCLYCJPCPZJZJMMYLCQLNQLJQJSXYJMLSZLJQLYCMMHCFMMFPQQMFYLQMCFFQMMMMHMZNFHHJGTTHHKHSLNCHHYQDXTMMQDCYZYXYQMYQYLTDCYYYZAZZCYMZYDLZFFFMMYCQZWZZMABTBYZTDMNZZGGDFTYPCGQYTTSSFFWFDTZQSSYSTWXJHXYTSXXYLBYQHWWKXHZXWZNNZZJZJJQJCCCHYYXBZXZCYZTLLCQXYNJYCYYCYNZZQYYYEWYCZDCJYCCHYJLBTZYYCQWMPWPYMLGKDLDLGKQQBGYCHJXY",
    MultiDiff: { "19969": "DZ", "19975": "WM", "19988": "QJ", "20048": "YL", "20056": "SC", "20060": "NM", "20094": "QG", "20127": "QJ", "20167": "QC", "20193": "YG", "20250": "KH", "20256": "ZC", "20282": "SC", "20285": "QJG", "20291": "TD", "20314": "YD", "20340": "NE", "20375": "TD", "20389": "YJ", "20391": "CZ", "20415": "PB", "20446": "YS", "20447": "SQ", "20504": "TC", "20608": "KG", "20854": "QJ", "20857": "ZC", "20911": "PF", "20504": "TC", "20608": "KG", "20854": "QJ", "20857": "ZC", "20911": "PF", "20985": "AW", "21032": "PB", "21048": "XQ", "21049": "SC", "21089": "YS", "21119": "JC", "21242": "SB", "21273": "SC", "21305": "YP", "21306": "QO", "21330": "ZC", "21333": "SDC", "21345": "QK", "21378": "CA", "21397": "SC", "21414": "XS", "21442": "SC", "21477": "JG", "21480": "TD", "21484": "ZS", "21494": "YX", "21505": "YX", "21512": "HG", "21523": "XH", "21537": "PB", "21542": "PF", "21549": "KH", "21571": "E", "21574": "DA", "21588": "TD", "21589": "O", "21618": "ZC", "21621": "KHA", "21632": "ZJ", "21654": "KG", "21679": "LKG", "21683": "KH", "21710": "A", "21719": "YH", "21734": "WOE", "21769": "A", "21780": "WN", "21804": "XH", "21834": "A", "21899": "ZD", "21903": "RN", "21908": "WO", "21939": "ZC", "21956": "SA", "21964": "YA", "21970": "TD", "22003": "A", "22031": "JG", "22040": "XS", "22060": "ZC", "22066": "ZC", "22079": "MH", "22129": "XJ", "22179": "XA", "22237": "NJ", "22244": "TD", "22280": "JQ", "22300": "YH", "22313": "XW", "22331": "YQ", "22343": "YJ", "22351": "PH", "22395": "DC", "22412": "TD", "22484": "PB", "22500": "PB", "22534": "ZD", "22549": "DH", "22561": "PB", "22612": "TD", "22771": "KQ", "22831": "HB", "22841": "JG", "22855": "QJ", "22865": "XQ", "23013": "ML", "23081": "WM", "23487": "SX", "23558": "QJ", "23561": "YW", "23586": "YW", "23614": "YW", "23615": "SN", "23631": "PB", "23646": "ZS", "23663": "ZT", "23673": "YG", "23762": "TD", "23769": "ZS", "23780": "QJ", "23884": "QK", "24055": "XH", "24113": "DC", "24162": "ZC", "24191": "GA", "24273": "QJ", "24324": "NL", "24377": "TD", "24378": "QJ", "24439": "PF", "24554": "ZS", "24683": "TD", "24694": "WE", "24733": "LK", "24925": "TN", "25094": "ZG", "25100": "XQ", "25103": "XH", "25153": "PB", "25170": "PB", "25179": "KG", "25203": "PB", "25240": "ZS", "25282": "FB", "25303": "NA", "25324": "KG", "25341": "ZY", "25373": "WZ", "25375": "XJ", "25384": "A", "25457": "A", "25528": "SD", "25530": "SC", "25552": "TD", "25774": "ZC", "25874": "ZC", "26044": "YW", "26080": "WM", "26292": "PB", "26333": "PB", "26355": "ZY", "26366": "CZ", "26397": "ZC", "26399": "QJ", "26415": "ZS", "26451": "SB", "26526": "ZC", "26552": "JG", "26561": "TD", "26588": "JG", "26597": "CZ", "26629": "ZS", "26638": "YL", "26646": "XQ", "26653": "KG", "26657": "XJ", "26727": "HG", "26894": "ZC", "26937": "ZS", "26946": "ZC", "26999": "KJ", "27099": "KJ", "27449": "YQ", "27481": "XS", "27542": "ZS", "27663": "ZS", "27748": "TS", "27784": "SC", "27788": "ZD", "27795": "TD", "27812": "O", "27850": "PB", "27852": "MB", "27895": "SL", "27898": "PL", "27973": "QJ", "27981": "KH", "27986": "HX", "27994": "XJ", "28044": "YC", "28065": "WG", "28177": "SM", "28267": "QJ", "28291": "KH", "28337": "ZQ", "28463": "TL", "28548": "DC", "28601": "TD", "28689": "PB", "28805": "JG", "28820": "QG", "28846": "PB", "28952": "TD", "28975": "ZC", "29100": "A", "29325": "QJ", "29575": "SL", "29602": "FB", "30010": "TD", "30044": "CX", "30058": "PF", "30091": "YSP", "30111": "YN", "30229": "XJ", "30427": "SC", "30465": "SX", "30631": "YQ", "30655": "QJ", "30684": "QJG", "30707": "SD", "30729": "XH", "30796": "LG", "30917": "PB", "31074": "NM", "31085": "JZ", "31109": "SC", "31181": "ZC", "31192": "MLB", "31293": "JQ", "31400": "YX", "31584": "YJ", "31896": "ZN", "31909": "ZY", "31995": "XJ", "32321": "PF", "32327": "ZY", "32418": "HG", "32420": "XQ", "32421": "HG", "32438": "LG", "32473": "GJ", "32488": "TD", "32521": "QJ", "32527": "PB", "32562": "ZSQ", "32564": "JZ", "32735": "ZD", "32793": "PB", "33071": "PF", "33098": "XL", "33100": "YA", "33152": "PB", "33261": "CX", "33324": "BP", "33333": "TD", "33406": "YA", "33426": "WM", "33432": "PB", "33445": "JG", "33486": "ZN", "33493": "TS", "33507": "QJ", "33540": "QJ", "33544": "ZC", "33564": "XQ", "33617": "YT", "33632": "QJ", "33636": "XH", "33637": "YX", "33694": "WG", "33705": "PF", "33728": "YW", "33882": "SR", "34067": "WM", "34074": "YW", "34121": "QJ", "34255": "ZC", "34259": "XL", "34425": "JH", "34430": "XH", "34485": "KH", "34503": "YS", "34532": "HG", "34552": "XS", "34558": "YE", "34593": "ZL", "34660": "YQ", "34892": "XH", "34928": "SC", "34999": "QJ", "35048": "PB", "35059": "SC", "35098": "ZC", "35203": "TQ", "35265": "JX", "35299": "JX", "35782": "SZ", "35828": "YS", "35830": "E", "35843": "TD", "35895": "YG", "35977": "MH", "36158": "JG", "36228": "QJ", "36426": "XQ", "36466": "DC", "36710": "JC", "36711": "ZYG", "36767": "PB", "36866": "SK", "36951": "YW", "37034": "YX", "37063": "XH", "37218": "ZC", "37325": "ZC", "38063": "PB", "38079": "TD", "38085": "QY", "38107": "DC", "38116": "TD", "38123": "YD", "38224": "HG", "38241": "XTC", "38271": "ZC", "38415": "YE", "38426": "KH", "38461": "YD", "38463": "AE", "38466": "PB", "38477": "XJ", "38518": "YT", "38551": "WK", "38585": "ZC", "38704": "XS", "38739": "LJ", "38761": "GJ", "38808": "SQ", "39048": "JG", "39049": "XJ", "39052": "HG", "39076": "CZ", "39271": "XT", "39534": "TD", "39552": "TD", "39584": "PB", "39647": "SB", "39730": "LG", "39748": "TPB", "40109": "ZQ", "40479": "ND", "40516": "HG", "40536": "HG", "40583": "QJ", "40765": "YQ", "40784": "QJ", "40840": "YK", "40863": "QJG" },

    GetFirstPYLetters: function (str) {
        //参数:中文字符串
        //返回值:拼音首字母串数组
        if (typeof (str) != "string") throw new Error(-1, "需要字符串类型参数!");
        //保存中间结果的数组
        var arrResult = new Array();
        for (var i = 0, len = str.length; i < len; i++) {
            //获得unicode码
            var ch = str.charAt(i);
            //检查该unicode码是否在处理范围之内,在则返回该码对映汉字的拼音首字母,不在则调用其它函数处理
            arrResult.push(Wsfly.Chinese.CheckCh(ch));
        }
        //处理arrResult,返回所有可能的拼音首字母串数组  
        return Wsfly.Chinese.MakeResult(arrResult);
    },
    GetFirstPYLettersOne: function (str) {
        //参数:中文字符串
        //返回值:拼音首字母串
        var arrResult = Wsfly.Chinese.GetFirstPYLetters(str);
        if (arrResult == undefined || arrResult == null || IsNullOrEmpty(arrResult)) return "";
        return arrResult[0];
    },
    CheckCh: function (ch) {
        var uni = ch.charCodeAt(0);
        //如果不在汉字处理范围之内,返回原字符,也可以调用自己的处理函数  
        if (uni > 40869 || uni < 19968) return ch;
        //检查是否是多音字,是按多音字处理,不是就直接在ChineseFirstPY字符串中找对应的首字母  
        return (Wsfly.Chinese.MultiDiff[uni] ? Wsfly.Chinese.MultiDiff[uni] : (Wsfly.Chinese.ChineseFirstPY.charAt(uni - 19968)));
    },
    MakeResult: function (arr) {
        var arrRslt = [""];
        for (var i = 0, len = arr.length; i < len; i++) {
            var str = arr[i];
            var strlen = str.length;
            if (strlen == 1) {
                for (var k = 0; k < arrRslt.length; k++) {
                    arrRslt[k] += str;
                }
            }
            else {
                var tmpArr = arrRslt.slice(0);
                arrRslt = [];
                for (k = 0; k < strlen; k++) {
                    //复制一个相同的arrRslt  
                    var tmp = tmpArr.slice(0);
                    //把当前字符str[k]添加到每个元素末尾  
                    for (var j = 0; j < tmp.length; j++) {
                        tmp[j] += str.charAt(k);
                    }
                    //把复制并修改后的数组连接到arrRslt上  
                    arrRslt = arrRslt.concat(tmp);
                }
            }
        }
        return arrRslt;
    }
};
//验证控件
Wsfly.Validate = function ($form) {
    //验证表单
    var validatePass = true;
    $form.find("input").each(function () {
        //移除未通过样式
        $(this).removeClass("ValidateFail");
        $(this).attr("title", "");
        //数据类型 int,float,string,date,password,mobile,telphone,email  默认：string
        var valType = $(this).attr("data-vtype");
        //是否为空 1,0 默认：1(不可为空)
        var validateNull = $(this).attr("data-vnull");
        //最小长度
        var minLength = $(this).attr("data-minlength");
        //最大长度
        var maxLength = $(this).attr("data-maxlength");

        //当前值
        var value = $(this).val();

        //验证是否为空
        if (validateNull == "1" && IsNullOrEmpty(value)) {
            //验证失败
            validatePass = false;
            ValidateFail($(this), "不可为空！");
            return true;
        }

        //验证数据类型
        if (!IsNullOrEmpty(valType)) {
            //最小化
            valType = valType.toLowerCase();
            //判断
            switch (valType) {
                case "num":
                case "int":
                    if (!IsInt(value)) {
                        //验证失败
                        ValidateFail($(this), "请输入数字！");
                    }
                    break;
                case "float":
                    if (!IsFloat(value)) {
                        //验证失败
                        ValidateFail($(this), "请输入数字！");
                    }
                    break;
                case "date":
                    if (!value.IsDate()) {
                        //验证失败
                        ValidateFail($(this), "请输入日期！");
                    }
                    break;
                case "mobile":
                    if (!IsMobile(value)) {
                        //验证失败
                        ValidateFail($(this), "请输入手机号码！");
                    }
                    break;
                case "telphone":
                    if (!IsTelphone(value)) {
                        //验证失败
                        ValidateFail($(this), "请输入电话号码！");
                    }
                    break;
                case "email":
                    if (!IsEmail(value)) {
                        //验证失败
                        ValidateFail($(this), "请输入邮箱地址！");
                    }
                    break;
                case "password":
                    if (!IsPassword(value)) {
                        //验证失败
                        ValidateFail($(this), "请输入6-20位密码！");
                    }
                    break;
            }
        }

        //验证长度
        if (!IsNullOrEmpty(minLength) && parseInt(minLength) > 0) {
            //验证最小长度
            if (value.length < parseInt(minLength)) {
                //验证失败
                ValidateFail($(this), "最小长度" + minLength + "！");
            }
        }
        if (!IsNullOrEmpty(maxLength) && parseInt(maxLength) > 0) {
            //验证最大长度
            if (value.length > parseInt(maxLength)) {
                //验证失败
                ValidateFail($(this), "最大长度" + maxLength + "！");
            }
        }
    });

    function ValidateFail($this, title) {
        //验证失败
        $this.addClass("ValidateFail");
        $this.attr("title", title);
        validatePass = false;
    };

    return validatePass;
};
/*=============================================================================
*  更多函数 END
*=============================================================================*/
