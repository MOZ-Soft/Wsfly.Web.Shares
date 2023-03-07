jQuery.Wsfly = jQuery.Wsfly || {};

jQuery.Wsfly.Area = {
    /*************************************
    *  
    *   jQuery.Wsfly.Area
    *   Author:Wsfly.com
    *   Version:1.0
    *   Url:http://www.wsfly.com/
    *
    *   Explan:
    *           
    *
    *************************************/

    Options: {
        "Server": "/",
        "Area": "/Com/GetAreaChildren",
        "Level": 2,
        "CurrentLevel": 0,
        "CurrentOperateObject": null,
        "CurrentBg": null,
        "CurrentContainer": null,
        "IsExpansion": false,
        "Single": true
    },
    //初始化
    Init: function () {
        $("div[wsTag='cascade']").html("<div style='color:#666; text-align:center;'>[--请选择--]</div>");
        $("div[wsTag='cascade']").css({
            "width": "190px",
            "height": "18px",
            "line-height": "16px",
            "padding": "3px",
            "border": "solid 1px #ccc",
            "background": "white",
            "font-size": "12px",
            "cursor": "pointer",
            "overflow": "hidden",
            "zoom": "1",
            "text-align": "center",
            "white-space": "nowrap",
            "text-overflow": "ellipsis"
        });
        $("div[wsTag='cascade']").click(function () {
            jQuery.Wsfly.Area.Show($(this));
        });

        $("div[wsTag='cascade']").each(function () {
            var id = $(this).attr("id");

            var txtId = document.createElement("input");
            var txtName = document.createElement("input");

            $(txtId).attr({
                "id": id + "_Ids",
                "name": id + "_Ids",
                "type": "hidden"
            });

            $(txtName).attr({
                "id": id + "_Names",
                "name": id + "_Names",
                "type": "hidden"
            });

            $(this).parent().append(txtName);
            $(this).parent().append(txtId);
        });


        var style = "<style>" +
                                ".CascadeContentList{}" +
                                ".CascadeContentList ul{ margin:0; padding:0; list-style:none; width:100%; overflow:hidden; zoom:1;}" +
                                ".CascadeContentList ul li{ float:left; padding:0 10px; cursor:pointer;  white-space:nowrap; border:solid 1px #f2f2f2;}" +
                                ".CascadeContentList ul li:hover{ border:solid 1px #ddd; background:#eee;}" +
                            "</style>";
        $("head").append(style);
    },
    Show: function (obj) {
        this.Options.CurrentLevel = 0;
        this.Options.CurrentOperateObject = obj;

        var bg = document.createElement("div");
        var container = document.createElement("div");
        var containerTitle = document.createElement("div");
        var containerContent = document.createElement("div");
        var containerTips = document.createElement("div");

        //标题
        $(containerTitle).html('<div style="width:100%; height:100%; overflow:hidden; position:absolute; background:#000; filter:alpha(opacity=60) !important; opacity:0.6;"></div>' +
                               '<div style="width:100%; height:100%; overflow:hidden; position:absolute; zoom:1;">' +
                               '    <div id="divChooseAreaTitle" style="float:left; height:30px; overflow:hidden; padding:2px 10px; color:#eee;">请选择地区</div>' +
                               '    <div id="divChooseAreaClose" style="float:right; height:30px; overflow:hidden; padding:2px 5px; cursor:pointer; color:#eee;">关闭</div>' +
                               '</div>');

        $(containerTitle).attr({
            "class": "CascadeContentTitle"
        });
        $(containerTitle).css({
            "position": "relative",
            "height": "30px",
            "line-height": "30px",
            "font-size": "12px",
            "overflow": "hidden"
        });

        //内容
        $(containerContent).attr({
            "id": "CascadeContentList_0",
            "class": "CascadeContentList"
        });
        $(containerContent).css({
            "padding": "10px",
            "line-height": "30px"
        });

        //提示
        $(containerTips).html("请稍候，正在加载...");
        $(containerTips).attr({
            "class": "CascadeContentTips"
        });
        $(containerTips).css({
            "padding": "10px",
            "line-height": "30px",
            "text-align": "center"
        });

        //背景
        $(bg).attr({
            "class": "BackgroundDarkCover",
            "style": "_position:absolute;"
        });
        $(bg).css({
            "background": "black",
            "width": "100%",
            "height": "100%",
            "overflow": "hidden",
            "position": "fixed",
            "left": "0",
            "top": "0",
            "z-index": "99999",
            "filter": "alpha(opacity=60)!important",
            "opacity": "0.6"
        });

        //容器
        $(container).attr({ "class": "CascadeContent" });
        $(container).css({
            "width": "500px",
            "height": "300px",
            "border": "solid 4px #333",
            "background": "#f2f2f2",
            "font-size": "12px",
            "overflow": "hidden",
            "position": "absolute",
            "left": "50%",
            "top": "50%",
            "margin-top": "-150px",
            "margin-left": "-250px",
            "z-index": "999999",
            "zoom": "1"
        });

        ///是否IE6
        if ($.browser.msie && ($.browser.version == "6.0")) {
            //高度 长度 IE6
            var width = $(window).width() > $(document).width() ? $(window).width() : $(document).width();
            var height = $(window).height() > $(document).height() ? $(window).height() : $(document).height();

            $(bg).css({
                "width": width + "px",
                "height": height + "px",
                "position": "absolute"
            });

            $("select").hide();
            $("iframe").hide();
        };

        containerContent.appendChild(containerTips);
        container.appendChild(containerTitle);
        container.appendChild(containerContent);

        $("body").append(bg);
        $("body").append(container);

        //当前背景、内容
        this.Options.CurrentBg = bg;
        this.Options.CurrentContainer = container;

        //点击后将层移到屏幕中央
        $(bg).click(function () {
            var top = $(window).height() / 2 - $(container).height() / 2;
            var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
            $(container).css({
                "top": (scrollTop + top) + "px",
                "margin-top": "0"
            })
        });

        //点击关闭隐藏
        $(containerTitle).find("#divChooseAreaClose").click(function () {
            jQuery.Wsfly.Area.Hide(bg, container);
        });

        //加载数据
        this.LoadData(containerContent, 0);
    },
    Hide: function (bg, container) {
        if (bg == undefined) {
            bg = jQuery.Wsfly.Area.Options.CurrentBg;
            container = jQuery.Wsfly.Area.Options.CurrentContainer;
        }

        //隐藏/移除
        $(bg).remove();
        $(container).remove();

        jQuery.Wsfly.Area.Options.CurrentBg = null;
        jQuery.Wsfly.Area.Options.CurrentOperateObject = null;

        if ($.browser.msie && ($.browser.version == "6.0")) {
            $("select").show();
            $("iframe").show();
        }
    },
    LoadData: function (container, pid, callback) {
        //加载数据操作
        var url = this.Options.Area;
        var type = $(this.Options.CurrentOperateObject).attr("wsType");

        //没有类型
        if (type == undefined) return;
        //类型
        type = type.toLowerCase();

        ///请求类型
        if (type == "area") url = this.Options.Area;
        else if (type == "department") url = this.Options.Department;

        //加载数据
        $.ajax({
            url: url,
            data: ({ pid: pid }),
            type: "POST",
            success: function (data) {
                jQuery.Wsfly.Area.Prograss(data.data, container, pid);

                if (typeof (callback) == "function") {
                    callback(data);
                }
            }
        });
    },
    Prograss: function (result, container, pid) {
        //处理数据

        //是否有数据
        if (result.length <= 0) {
            jQuery.Wsfly.Area.Hide(this.Options.CurrentBg, this.Options.CurrentContainer);
            return;
        }

        var html = "<ul>";

        ///循环添加项
        for (var i = 0; i < result.length; i++) {
            if (this.Options.Single) {
                html += "<li onclick='jQuery.Wsfly.Area.Choose(" + result[i].Value + ",\"" + result[i].Name + "\"," + pid + ");'>" + result[i].Name + "</li>";
            }
            else {
                html += "<li><input id='cbArea' name='cbArea' value='" + result[i].Value + "' type='checkbox' /><span  onclick='jQuery.Wsfly.Area.SetChoose(this);'>" + result[i].Name + "</span></li>";
            }
        }

        html += "</ul>";

        $(container).html(html);
    },
    Choose: function (id, name, pid) {
        //选择项
        var objId = $(this.Options.CurrentOperateObject).attr("id");
        //ID保存对象
        var txtIds = $("#" + objId + "_Ids");
        var txtNames = $("#" + objId + "_Names");

        if (pid == 0) {
            txtIds.val(id);
            txtNames.val(name);
        }
        else {
            txtIds.val(txtIds.val() + "|" + id);
            txtNames.val(txtNames.val() + "|" + name);
        }

        var chooseNames = txtNames.val().replace(/\|/g, "-");

        ///显示级别 Level 为0 则不限制
        ///如果当前级别 等于最大级别 则停止
        if (this.Options.Level == 0 || this.Options.CurrentLevel < this.Options.Level) {
            //展开下一级
            this.Expansion(pid, id);
            $(this.Options.CurrentContainer).find("#divChooseAreaTitle").html(chooseNames);
            $(this.Options.CurrentOperateObject).html(chooseNames);
            $(this.Options.CurrentOperateObject).attr({
                "title": chooseNames
            });
        }
        else {
            //已经到最后一层
            this.Hide(this.Options.CurrentBg, this.Options.CurrentContainer);
            $(this.Options.CurrentOperateObject).html(chooseNames);
            $(this.Options.CurrentOperateObject).attr({
                "title": chooseNames
            });
        }

        if (this.Options.CurrentLevel > 0 && this.Options.CurrentLevel == this.Options.Level) {
            this.Hide();
        }
    },
    SetChoose: function (obj) {
        //标记选择
        var checked = $(obj).parent().find("input:checkbox").attr("checked");
        $(obj).parent().find("input:checkbox").attr("checked", !checked);


    },
    Expansion: function (fid, pid) {
        //展开下一级
        this.Options.CurrentLevel++;

        //如果没有下一级则直接选中
        var containerList = $(this.Options.CurrentContainer);
        containerList.find(".CascadeContentList").hide();

        var subContainerList = containerList.find("#CascadeContentList_" + pid);

        if (subContainerList.length <= 0) {
            //子项
            var subContainerList_new = document.createElement("div");
            $(subContainerList_new).attr({
                "id": "CascadeContentList_" + pid,
                "class": "CascadeContentList"
            });

            $(subContainerList_new).css({
                "padding": "10px",
                "line-height": "30px"
            });
            $(this.Options.CurrentContainer).append(subContainerList_new);

            //加载数据
            this.LoadData(subContainerList_new, pid, function () {
                var divAction = document.createElement("div");
                $(divAction).css({
                    "text-align": "center"
                });
                $(divAction).html("<a href='javascript:void(0);' onclick='jQuery.Wsfly.Area.Reutrn(" + fid + "," + pid + ");'>返回上一级</a>&nbsp; &nbsp; <a id='divChooseAreaOK' href='javascript:void(0);'>确定</a>");
                $("#CascadeContentList_" + pid).append(divAction);
                $(divAction).find("#divChooseAreaOK").click(function () {
                    jQuery.Wsfly.Area.Hide();
                });
            });
        }
        else {
            subContainerList.show();
        }
    },
    Reutrn: function (fid, pid) {
        //返回上一级
        $("#CascadeContentList_" + pid).hide();
        $("#CascadeContentList_" + fid).show();

        this.Options.CurrentLevel--;

        //选择项
        var objId = $(this.Options.CurrentOperateObject).attr("id");
        //ID保存对象
        var txtIds = $("#" + objId + "_Ids");
        var txtNames = $("#" + objId + "_Names");

        var ids = txtIds.val();
        var names = txtNames.val();

        if (ids.indexOf("|") <= 0) return;

        ids = ids.substring(0, ids.lastIndexOf("|"));
        names = names.substring(0, names.lastIndexOf("|"));

        txtIds.val(ids);
        txtNames.val(names);
    }
};


jQuery(document).ready(jQuery.Wsfly.Area.Init);