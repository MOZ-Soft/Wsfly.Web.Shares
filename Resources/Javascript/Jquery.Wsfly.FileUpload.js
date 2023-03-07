jQuery.Wsfly = jQuery.Wsfly || {};

var WsflyFileuploadOptionIndex = 0;
var WsflyFileUploadOptions = new Array();


jQuery.Wsfly.FileUpload = {
    /*************************************
    *  
    *   jQuery.Wsfly.FileUpload
    *   Author:Wsfly.com
    *   Version:1.0
    *   Address:http://www.wsfly.com/
    *
    *************************************/
    Options: {
        "UpAction": "/Com/WsUploadFile",
        "DelAction": "/Com/WsDeleteFile",
        "TargetObj": null,
        "TargetId": "",
        "BtnText": "添加附件",
        "LinkIndex": 0,
        "Result": null,
        "MultiFiles": true,
        "OkCallBack": function () { }
    },
    //初始化
    Init: function () {
        var style = "";
        style = "<style type=\"text/css\">" +
        			".Wsfly-FileUpload{ overflow:hidden; position:relative;}" +
                    ".Wsfly-FileUpload-Btn{float:left; position: relative;overflow: hidden;margin-right: 4px;display:inline-block; *display:inline;padding:4px 10px 4px;font-size:14px;line-height:18px;*line-height:20px;color:#fff;text-align:center;vertical-align:middle;cursor:pointer;background:#5CACEE;border:1px solid #cccccc;border-color:#e6e6e6 #e6e6e6 #bfbfbf;border-bottom-color:#b3b3b3;-webkit-border-radius:4px;-moz-border-radius:4px;border-radius:4px;}" +
					".Wsfly-FileUpload-Btn input{position: absolute;width:60px;top: 0; right: 0;margin: 0;border:solid transparent;opacity: 0;filter:alpha(opacity=0); cursor: pointer;}" +
					".Wsfly-FileUpload-Progress{ position:relative; margin-left:100px; margin-top:5px; background:#ccc; width:200px;padding: 1px; border-radius:3px; display:none}" +
					".Wsfly-FileUpload-Progress-Bar{background-color: #5CACEE; display:block; width:0%; height:26px;line-height:26px;border-radius:3px; } " +
					".Wsfly-FileUpload-Progress-Percent{position:absolute; height:20px; display:inline-block;top:3px; left:2%; color:#fff }" +
					".Wsfly-FileUpload-Files{clear:both;height:auto; line-height:22px; margin:0; padding-top:10px;} " +
					".Wsfly-FileUpload-DelImg{margin-left:20px; color:#5CACEE; cursor:pointer} " +
                    "</style>";
        $("head").append(style);
    },
    InitControl: function (options) {
        //初始控件
        var src = $(options.TargetObj).html();
        src = "<a href='" + src + "' target='_blank'>" + src + "</a>";

        var html = '<div id="Wsfly-FileUpload_' + options.TargetId + '">' +
    				        '	<div class="Wsfly-FileUpload-Btn">' +
    				        '		<span>' + options.BtnText + '</span>' +
    				        '		<form id="Wsfly-Upload_' + options.TargetId + '" style="width:auto;height:auto;display:block;*position:absolute;overflow:visible;padding:0; margin:0;" action="' + options.UpAction + '" method="post" enctype="multipart/form-data">' +
			                '			<input id="file_' + options.TargetId + '" type="file" name="fu_WsflyUploadFile" >' +
			                '		</form>' +
			                '	</div>' +
			                '	<div class="Wsfly-FileUpload-Progress">' +
			    	        '		<span class="Wsfly-FileUpload-Progress-Bar"></span><span class="Wsfly-FileUpload-Progress-Percent">0%</span >' +
					        '	</div>' +
			                '	<div class="Wsfly-FileUpload-Files">' + src + '</div>' +
			                '</div>';

        //<form id="Wsfly-Upload_' + options.TargetId + '" style="width:auto;height:auto;display:block;*position:absolute;overflow:visible;padding:0; margin:0;" action="' + options.UpAction + '" method="post" enctype="multipart/form-data">
        $(options.TargetObj).html(html);
        //$("#file_" + options.TargetId).wrap("<form id='Wsfly-Upload_" + options.TargetId + "' style='width:auto;height:auto;display:block;*position:absolute;overflow:visible;padding:0; margin:0;' action='" + options.UpAction + "' method='post' enctype='multipart/form-data'></form>");

        WsflyFileUploadOptions[WsflyFileuploadOptionIndex++] = options;
        $("#file_" + options.TargetId).attr("OptIndex", WsflyFileuploadOptionIndex - 1);

        $("#file_" + options.TargetId).change(function () {
            var id = $(this).attr("id").replace("file_", "");
            var fileObj = $(this);

            //参数配置
            var optionIndex = fileObj.attr("OptIndex");
            options = WsflyFileUploadOptions[optionIndex];

            //选择文件
            var bar = $('#Wsfly-FileUpload_' + id + ' .Wsfly-FileUpload-Progress-Bar');
            var percent = $('#Wsfly-FileUpload_' + id + ' .Wsfly-FileUpload-Progress-Percent');
            var progress = $('#Wsfly-FileUpload_' + id + ' .Wsfly-FileUpload-Progress');
            var files = $('#Wsfly-FileUpload_' + id + ' .Wsfly-FileUpload-Files');
            var btn = $('#Wsfly-FileUpload_' + id + ' .Wsfly-FileUpload-Btn span');

            var showimg = $('#Wsfly-FileUpload_' + id + ' #showimg');

            var btnText = btn.html();

            $("#Wsfly-Upload_" + id).ajaxSubmit({
                dataType: 'json', 			//数据格式为json 
                beforeSend: function () { 	//开始上传 
                    showimg.empty(); 		//清空显示的图片 
                    progress.show(); 		//显示进度条 
                    var percentVal = '0%'; 	//开始进度为0% 
                    bar.width(percentVal); 	//进度条的宽度 
                    percent.html(percentVal); 	//显示进度为0% 
                    btn.html("上传中..."); 		//上传按钮显示上传中 
                },
                uploadProgress: function (event, position, total, percentComplete) {
                    var percentVal = percentComplete + '%'; //获得进度 
                    bar.width(percentVal); 					//上传进度条宽度变宽 
                    percent.html(percentVal); 				//显示上传进度百分比 
                },
                success: function (data) {
                    if (data.success === false) {
                        //上传失败
                        btn.html("上传失败！");
                        bar.width('0');
                        //返回失败信息
                        files.html(data.message);
                        return;
                    }

                    //上传成功
                    //获得后台返回的json数据，显示文件名，大小，以及删除按钮
                    var index = jQuery.Wsfly.FileUpload.Options.LinkIndex++;
                    var htmlFile = "<div>";
                    htmlFile += "   <a href='" + data.url + "' target='_blank'>" + data.name + "(" + data.size + "kb)</a>";
                    htmlFile += "   <a id='Wsfly-FileUpload-Delete-" + index + "' href=\"javascript:jQuery.Wsfly.FileUpload.Remove('Wsfly-FileUpload-Delete-" + (index) + "');\" class='Wsfly-FileUpload-DelImg' rel='" + data.url + "' del='" + id + "' tar='txt" + id + "'>删除</a>";
                    htmlFile += "</div>";

                    //追加内容
                    if (options.MultiFiles) files.append(htmlFile);
                    else files.html(htmlFile);

                    //上传按钮还原
                    btn.html(btnText);
                    //显示进度条
                    progress.hide();

                    //返回结果
                    options.Result = data;

                    //调用成功函数
                    options.OkCallBack(options);
                    //保存值
                    if (options.MultiFiles) $("#txt" + id).val($("#txt" + id).val() + "|" + data.url);
                    else $("#txt" + id).val(data.url);
                },
                error: function (xhr) {
                    //上传失败 
                    btn.html("上传失败！");
                    bar.width('0');
                    //返回失败信息
                    //alert(xhr.responseText);
                    files.html(xhr.responseText);
                }
            });
        });
    },
    Remove: function (id) {
        ///删除上传的文件
        var currentObj = $("#" + id);
        var url = $(currentObj).attr("rel");
        var tar = $(currentObj).attr("tar");
        $.post(jQuery.Wsfly.FileUpload.Options.DelAction, { url: url }, function (result) {
            if (result === 1 || result === "1") {
                //移除值
                var hasUrls = $("#" + tar).val();
                $("#" + tar).val(hasUrls.replace(url, ""));
                //提示删除成功
                $(currentObj).parent().remove();
                $(currentObj).parent().parent().find(".Wsfly-FileUpload-Progress").hide();
            } else {
                Wsfly.Tips.Error("删除失败！");
            }
        });
    }
};

/*扩展Jquery*/
(function ($) {
    $.fn.extend({
        //文件上传
        WsFileUpload: function (options) {
            if (options == undefined || options == null) options = {};

            return this.each(function () {
                var id = $(this).attr("id");
                options = $.extend({}, jQuery.Wsfly.FileUpload.Options, options);
                options.TargetId = id;
                options.TargetObj = $(this);

                jQuery.Wsfly.FileUpload.InitControl(options);
            });
        }
    });
})(jQuery);

jQuery(document).ready(jQuery.Wsfly.FileUpload.Init);