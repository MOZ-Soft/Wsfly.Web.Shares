jQuery.Wsfly = jQuery.Wsfly || {};

jQuery.Wsfly.Box = {
    /*************************************
    *  
    *   jQuery.Wsfly.Box
    *   Author:Wsfly.com
    *   Version:2.0
    *   Address:http://www.wsfly.com/
    *
    *************************************/
    Options: {
        "Obj": null,
        "Html": null,
        "Target": null,
        "Inited": false,
        "Width": 350,
        "Height": 250,
        "Url": null,
        "DisableClickBackgroundEvent": true,
        "HideIsRemove": true,
        "ShowCloseBtn": true,
        "ShowCallback": function () { },
        "HideCallback": function () { },
        "RemoveCallback": function () { },
        "OkCallback": function () { },
        "CancelCallback": null,
        "CloseCallback": function () { }
    },
    //初始化
    Init: function (options) {
        options = $.extend({}, jQuery.Wsfly.Box.Options, options);

        var style = "";
        style = "<style type=\"text/css\">" +
                    ".Wsfly-Controls-Box-V2{width:100%;height:100%;position:absolute;top:0;left:0;overflow:hidden;}" +
                    ".Wsfly-Controls-Box-V2-Close{width:30px; height:30px; line-height:26px; overflow:hidden; font-size:20px;  font-weight:bold; border-radius:30px; text-align:center;position:absolute; left:50%; top:50%; background:#fff; z-index:999999; cursor:pointer;}" +
                    ".Wsfly-Controls-Box-V2-Close:hover{color:white; background:red; font-size:24px;}" +
                    ".Wsfly-Controls-Box-V2-Content{position:absolute; left:50%; top:50%; line-height:30px; border:solid 0px #fff;border-radius:10px;overflow:hidden; background:#fff; z-index:999999; text-align:left; font-size:14px; font-weight:bold; color:#666;}" +
                    ".Wsfly-Controls-Box-V2-Content img{vertical-align:middle;}" +
                    ".Wsfly-Controls-Box-V2-Event{position:absolute; top:0; left:0; width:100%; height:100%; overflow:hidden;z-index:999998;}" +
                    ".Wsfly-Controls-Box-V2-Frame{position:absolute; top:0; left:0; width:100%; height:100%; overflow:hidden; background:#000;z-index:999997;filter:alpha(opacity=30);opacity:0.3;}" +
                    ".Wsfly-Controls-Box-V2-Iframe{width:100%;height:100%;display:block;filter:alpha(opacity=0);opacity:0;}" +
                "</style>";
        $("head").append(style);
    },
    //显示
    Show: function (options) {
        //参数序列化
        options = $.extend({}, jQuery.Wsfly.Box.Options, options);

        if (options.Inited) {
            $(options.Target).show();
        } else {
            //标记已经初始化
            options.Inited = true;

            var divBox = document.createElement("div");
            $(divBox).attr({
                "name": "Wsfly-Controls-Box-V2",
                "class": "Wsfly-Controls-Box-V2",
                "style": "height:" + $(document.body).height() + "px;"
            });

            var htmlContent = options.Html;
            if (options.Url != undefined && options.Url != null && !IsNullOrEmpty(options.Url)) {
                htmlContent = "<iframe src='" + options.Url + "' frameborder='0' scrolling='auto' width='" + options.Width + "' height='" + options.Height + "' />";
            }

            var html = "<div class=\"Wsfly-Controls-Box-V2-Close\" name=\"Wsfly-Controls-Box-V2-Close\">×</div>" +
                              "<div class=\"Wsfly-Controls-Box-V2-Content\" name=\"Wsfly-Controls-Box-V2-Content\">" +
                              "    <div class=\"Wsfly-Controls-Box-V2-Content-Html\">" + htmlContent + "</div> " +
                              "</div>" +
                              "<div class=\"Wsfly-Controls-Box-V2-Event\" title=\"\"></div>" +
                              "<div class=\"Wsfly-Controls-Box-V2-Frame\"><iframe class=\"Wsfly-Controls-Box-Iframe\" frameborder=\"0\"></iframe></div>";


            $(divBox).html(html);
            $("body").append(divBox);

            //是否显示关闭按钮
            if (!options.ShowCloseBtn) {
                $(divBox).find(".Wsfly-Controls-Box-V2-Close").remove();
            }
            //关闭按钮样式
            $(divBox).find(".Wsfly-Controls-Box-V2-Close").css({
                "margin-top": -(options.Height / 2 + 70) + "px",
                "margin-left": (options.Width / 2) + "px"
            });
            //内容样式
            $(divBox).find(".Wsfly-Controls-Box-V2-Content").css({
                "width": options.Width,
                "height": options.Height,
                "margin-top": -(options.Height / 2) + "px",
                "margin-left": -(options.Width / 2) + "px"
            });
            //内容HTML样式
            $(divBox).find(".Wsfly-Controls-Box-V2-Content-Html").css({
                "width": "100%",
                "height": options.Height,
                "overflow": "hidden"
            });

            options.Target = divBox;

            //点击背景事件
            if (!options.DisableClickBackgroundEvent) {
                $(divBox).find(".Wsfly-Controls-Box-V2-Event").click(function () {
                    options.Target = divBox;
                    jQuery.Wsfly.Box.Hidden(options);
                });
            }
            //确定事件
            $(divBox).find("#btnOk").click(function () {
                options.Target = divBox;
                jQuery.Wsfly.Box.Ok(options);
            });
            //取消事件
            $(divBox).find("#btnCancel").click(function () {
                options.Target = divBox;
                jQuery.Wsfly.Box.Cancel(options);
            });
            //关闭事件
            $(divBox).find(".Wsfly-Controls-Box-V2-Close").click(function () {
                options.Target = divBox;
                jQuery.Wsfly.Box.Cancel(options);
            });
        }

        $("div[name='Wsfly-Controls-Box-V2']").height($(document).height());
        $("div[name='Wsfly-Controls-Box-V2-Close']").css({
            "top": ($(window).height() / 2 - (options.Height / 2) + $(document).scrollTop() - 30) + "px",
            "margin-top": "0px"
        });
        $("div[name='Wsfly-Controls-Box-V2-Content']").css({
            "top": ($(window).height() / 2 - (options.Height / 2) + $(document).scrollTop()) + "px",
            "margin-top": "0px"
        });

        //显示完成后回调函数
        if (jQuery.Wsfly.Box.IsFunction(options.ShowCallback)) {
            options.ShowCallback(options);
        }

        //返回
        return options;
    },
    SetContent: function (options, html) {
        //显示内容
        $(options.Target).find(".Wsfly-Controls-Box-V2-Content-Html").html(html);
    },
    SetSize: function (options, width, height) {
        //设置窗口大小
        $(options.Target).find(".Wsfly-Controls-Box-V2-Content").css({
            "width": width,
            "height": height,
            "margin-top": -(width / 2) + "px",
            "margin-left": -(height / 2) + "px"
        });
        $(options.Target).find(".Wsfly-Controls-Box-V2-Content-Html").css({
            "width": "100%",
            "height": heightt,
            "overflow": "hidden"
        });
    },
    Ok: function (options) {
        //确定
        try {
            //回调函数
            if (jQuery.Wsfly.Box.IsFunction(options.OkCallback)) {
                options.OkCallback(options);
            }
            //隐藏
            jQuery.Wsfly.Box.Hidden(options);
        }
        catch (ex) { }
    },
    Cancel: function (options) {
        //取消
        try {
            jQuery.Wsfly.Box.Hidden(options);
            //回调函数
            if (jQuery.Wsfly.Box.IsFunction(options.CancelCallback)) {
                options.CancelCallback(options);
            }
        }
        catch (ex) { }
    },
    Close: function (options) {
        //关闭
        try {
            $(options.Target).remove();
            //回调函数
            if (jQuery.Wsfly.Box.IsFunction(options.CloseCallback)) {
                options.CloseCallback(options);
            }
        }
        catch (ex) { }
    },
    Hidden: function (options) {
        //隐藏
        try {
            $(options.Target).hide();
            //回调函数
            if (jQuery.Wsfly.Box.IsFunction(options.HideCallback)) {
                options.HideCallback(options);
            }
            //隐藏即移除
            if (options.HideIsRemove) {
                $(options.Target).remove();
            }
        }
        catch (ex) { }
    },
    Remove: function (options) {
        //移除
        try {
            $(options.Target).remove();
            //回调函数
            if (jQuery.Wsfly.Box.IsFunction(options.RemoveCallback)) {
                options.RemoveCallback(options);
            }
        }
        catch (ex) { }
    },
    IsFunction: function (value) {
        //是否有值
        if (value == null || value == undefined) return false;
        //是否函数
        return (typeof (value) == "function");
    }
};

jQuery(document).ready(jQuery.Wsfly.Box.Init);

/*扩展Jquery*/
(function ($) {
    $.fn.extend({
        //控件
        Box: function (options) {
            options = $.extend({}, jQuery.Wsfly.Box.Options, options);
            //循环初始对象
            return this.each(function () {
                options.Obj = $(this);
                $(this).click(function () {
                    jQuery.Wsfly.Box.Show(options);
                });
            });
        }
    });
})(jQuery);