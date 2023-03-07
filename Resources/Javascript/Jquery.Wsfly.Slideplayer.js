
jQuery.Wsfly = jQuery.Wsfly || {};

jQuery.Wsfly.Slideplayer = {
    /*************************************************************************************************
    *
    *
    *       jQuery Plugin Slideplayer
    *       Author: Wsfly.com
    *       Copyright (c) 2011 Wsfly.com
    * 
    *       Date: 2011-01-31
    *       Vesion: 1.0
    *       Example: 
            <style type="text/css">
                .Slideplayer{ overflow:hidden; zoom:1; position:relative;}

                .Slideplayer .SlideplayerList{ width:100%; height:100%; position:relative; z-index:1;}
                .Slideplayer .SlideplayerList .ulMarquee{width:100%; height:450px; margin-top:0px; overflow:hidden; position:relative;}
                .Slideplayer .SlideplayerList .ulMarquee li{ float:left; position:relative; width:100%; height:100%;}
                .Slideplayer .SlideplayerList .ulMarquee li img{ position:absolute; left:50%; margin-left:-960px;}

                .Slideplayer .SlideplayerAc{ width:100%; height:70px; overflow:hidden; zoom:1; position:absolute; top:50%; margin-top:-35px; z-index:2;}
                .Slideplayer .SlideplayerAc .ArrowLeft,
                .Slideplayer .SlideplayerAc .ArrowRight{ width:70px; height:70px; overflow:hidden; position:absolute; left:10px; margin-left:0px; background:url('Images/tag.Arrow.png'); cursor:pointer; filter:alpha(opacity=50); opacity:0.5;}
                .Slideplayer .SlideplayerAc .ArrowLeft:hover,
                .Slideplayer .SlideplayerAc .ArrowRight:hover{ filter:alpha(opacity=100); opacity:1;}
                .Slideplayer .SlideplayerAc .ArrowRight{ left:auto; right:10px; background-position:0 -70px;}

                .Slideplayer .SlideplayerRemote{ margin:0 auto; height:16px; position:absolute; z-index:3; left:50%; margin-left:-40px; top:100%; margin-top:-30px;}
                .Slideplayer .SlideplayerRemote ul{}
                .Slideplayer .SlideplayerRemote li{ float:left; width:16px; height:16px; border-radius:25px; background:#000; margin:0 2px; cursor:pointer; border:solid 2px #eee; opacity:0.5;}
                .Slideplayer .SlideplayerRemote li:hover{ background:#3eaddb; opacity:1;}
                .Slideplayer .SlideplayerRemote li.Current{ background:#3eaddb; opacity:1;}
            </style>
            <div class="Banners">
                <div class="Slideplayer">
                    <div class="SlideplayerAc">
                        <div class="ArrowLeft" id="divArrowLeft"></div>
                        <div class="ArrowRight" id="divArrowRight"></div>
                    </div>
                    <div class="SlideplayerRemote">
                        <ul id="ulRemotes">
                            <li></li>
                            <li></li>
                            <li></li>
                            <li></li>
                        </ul>
                    </div>
                    <div class="SlideplayerList">
                        <ul class="ulMarquee" id="ulMarquee">
                            <li><img src="/Uploads/Images/banner1.jpg" /></li>
                            <li><img src="/Uploads/Images/banner2.jpg" /></li>
                            <li><img src="/Uploads/Images/banner3.jpg" /></li>
                            <li><img src="/Uploads/Images/banner4.jpg" /></li>
                        </ul>
                    </div>
                </div>
            </div>
    *
    *
    **************************************************************************************************/
    Options: {
        "ContainerId": null,                    //容器ID
        "ToLeftId": null,                       //向左切换ID
        "ToRightId": null,                      //向右切换ID
        "Step": 5,                              //切换间隔
        "MarqueeSpeed": 50,                     //滚动间隔
        "RemoteId": null,                       //选择切换ID
        "BuildRemote": true,                   //生成选择切换
        "BuildLeftRight": false,                //生成左右切换
        "BefaultChange": function () { },       //切换前调用
        "AfterChange": function () { }          //切换后调用
    },
    Init: function (options) {
        //初始值
        options = $.extend({}, jQuery.Wsfly.Slideplayer.Options, options);

        /*是否有容器 wsfly*/
        if (options.ContainerId == null || options.ContainerId == '') return;

        /*容器 wsfly*/
        var container = $("#" + options.ContainerId);
        var btnLeft = $("#" + options.ToLeftId);
        var btnRight = $("#" + options.ToRightId);
        var ulRemote = $("#" + options.RemoteId);

        var index = 0;
        var len = container.children().length;

        var slideTimer = null;
        var step = 5000;

        var lock = false;
        var hasRemote = false;

        /*有定时播放 wsfly*/
        if (!isNaN(options.Step)) {
            step = options.Step;

            if (step < 10) {
                step = step * 1000;
            }
            else if (step < 100) {
                step = step * 100;
            }
            else if (step < 1000) {
                step = step * 10;
            }
        }

        /*生成选择切换*/
        if (options.BuildRemote) {
            options.RemoteId = "ulRemotes_" + options.ContainerId;
            container.parent().before();
            var htmlRemotes = '<div class="SlideplayerRemote"><ul id="' + options.RemoteId + '">';
            for (var i = 0; i < container.children().length; i++) {
                htmlRemotes += '<li></li>';
            }
            htmlRemotes += '</ul></div>';
            container.parent().before(htmlRemotes);
            ulRemote = $("#" + options.RemoteId);
            $(".SlideplayerRemote").css({ "margin-left": "-" + ((container.children().length * 18) / 2) + "px" });
        }

        /*生成左右切换*/
        if (options.BuildLeftRight) {
            options.ToLeftId = "divArrowLeft_" + options.ContainerId;
            options.ToRightId = "divArrowRight_" + options.ContainerId;
            container.parent().before('<div class="SlideplayerAc"><div class="ArrowLeft" id="' + options.ToLeftId + '"></div><div class="ArrowRight" id="' + options.ToRightId + '"></div></div>');

            btnLeft = $("#" + options.ToLeftId);
            btnRight = $("#" + options.ToRightId);
        }

        /*自动播放 wsfly*/
        SlideAutoPlay();

        /*隐藏全部 wsfly*/
        container.children().hide();
        container.children().eq(0).show();

        /*鼠标在图片上面 wsfly*/
        container.children().hover(function () {
            ClearSlidePlay();
        }, function () {
            SlideAutoPlay();
        });

        /*是否有向左移动按钮 wsfly*/
        if (options.ToLeftId != undefined && options.ToLeftId != null && options.ToLeftId != '') {
            /*向左移动 wsfly*/
            btnLeft.click(function () {
                SlideToLeft();
            });

            //            btnLeft.hover(function () {
            //                ClearSlidePlay();
            //            }, function () {
            //                SlideAutoPlay();
            //            });
        };

        /*是否有向右移动按钮 wsfly*/
        if (options.ToRightId != undefined && options.ToRightId != null && options.ToRightId != '') {
            /*向右移动 wsfly*/
            btnRight.click(function () {
                SlideToRight()
            });

            //            btnRight.hover(function () {
            //                ClearSlidePlay();
            //            }, function () {
            //                SlideAutoPlay();
            //            });
        };

        /*是否有选择切换*/
        if (options.RemoteId != undefined && options.RemoteId != null && options.RemoteId != '') {
            //显示切换按钮
            hasRemote = true;
            //第一个为选中
            ulRemote.find("li").eq(0).attr("class", "Current");

            ulRemote.find("li").hover(function () {
                ClearSlidePlay();

                var remoteIndex = ulRemote.find("li").index(this);
                var result = { "Index": remoteIndex, "Object": container.children().eq(remoteIndex) };

                //切换前事件
                if (IsFunction(options.BefaultChange)) {
                    options.BefaultChange(result);
                }

                //隐藏当前图片
                container.children().eq(index).fadeOut("slow");
                //显示下一张图片
                container.children().eq(remoteIndex).fadeIn("fast");

                //索引标记为下一张
                index = remoteIndex;

                ulRemote.find("li").removeAttr("class");
                ulRemote.find("li").eq(remoteIndex).attr("class", "Current");

                if (IsFunction(options.AfterChange)) {
                    options.AfterChange(result);
                }
            }, function () {
                SlideAutoPlay();
            });

        };

        /*向左滑动 wsfly*/
        function SlideToLeft() {
            if (slideTimer == null) return;

            var result = { "Index": (index <= 0 ? len - 1 : index - 1), "Object": container.children().eq(index) };

            //切换事件
            if (IsFunction(options.BefaultChange)) {
                options.BefaultChange(result);
            }

            var prevIndex = index;
            index = index <= 0 ? len - 1 : index - 1;

            //隐藏当前图片
            container.children().eq(prevIndex).fadeOut("slow");
            //显示上一张
            container.children().eq(index).fadeIn("fast");

            if (hasRemote) {
                ulRemote.find("li").removeAttr("class");
                ulRemote.children().eq(index).attr("class", "Current");
            }

            if (IsFunction(options.AfterChange)) {
                options.AfterChange(result);
            }
        };
        /*向右滑动 wsfly*/
        function SlideToRight(timerCurrent) {
            if (slideTimer == null) return;

            var result = { "Index": (index >= len - 1 ? 0 : index + 1), "Object": container.children().eq(index) };

            //切换事件
            if (IsFunction(options.BefaultChange)) {
                options.BefaultChange(result);
            }

            var prevIndex = index;
            index = index >= len - 1 ? 0 : index + 1;

            //隐藏当前图片
            container.children().eq(prevIndex).fadeOut("slow");
            //显示下一张
            container.children().eq(index).fadeIn("fast");

            if (hasRemote) {
                ulRemote.find("li").removeAttr("class");
                ulRemote.children().eq(index).attr("class", "Current");
            }

            if (IsFunction(options.AfterChange)) {
                options.AfterChange(result);
            }
        };
        /*自动播放 wsfly*/
        function SlideAutoPlay() {
            if (lock) return;
            lock = true;

            slideTimer = window.setInterval(function () {
                SlideToRight();
            }, step);

            lock = false;
        };
        /*清空播放时间 wsfly*/
        function ClearSlidePlay() {
            if (lock) return;
            lock = true;

            window.clearInterval(slideTimer);
            slideTimer = null;

            lock = false;
        };
    },
    /*******************************
    *
    *      示例1：<div id="marquee" class="MarqueeLeftRight">
    *                  <dl>
    *                      <dt>【内容】</dt>
    *                      <dd></dd>
    *                  </dl>
    *             </div>
    *
    *      示例2：<dl id="marquee" class="MarqueeUpDown">
    *                  <dt>【内容】</dt>
    *                  <dd></dd>
    *              </dl>
    *
    *      示例3：<ul id="marquee" class="MarqueeText"><li>【内容】</li></ul>
    *
    *
    *******************************/
    Marquee: {
        //向左翻页
        FlipLeft: function (id, speed) {
            try { document.execCommand("BackgroundImageCache", false, true); } catch (e) { };
            var container = document.getElementById(id),
                original = container.getElementsByTagName("dt")[0],
                clone = container.getElementsByTagName("dd")[0];

            if (speed == undefined) speed = 10000;
            clone.innerHTML = original.innerHTML;

            window.onresize = function () {
                container.scrollLeft = 0;
            };
            var rolling = function () {
                if (container.scrollLeft >= clone.offsetLeft) {
                    container.scrollLeft = 0;
                } else {
                    var cWidth = $(container).width();
                    container.scrollLeft += cWidth;
                }
            }
            var timer = setInterval(rolling, speed)//设置定时器
            container.onmouseover = function () { clearInterval(timer) }//鼠标移到marquee上时，清除定时器，停止滚动
            container.onmouseout = function () { timer = setInterval(rolling, speed) }//鼠标移开时重设定时器
        },
        //向左滚动
        Left: function (id) {
            try { document.execCommand("BackgroundImageCache", false, true); } catch (e) { };
            var container = document.getElementById(id),
                original = container.getElementsByTagName("dt")[0],
                clone = container.getElementsByTagName("dd")[0],
                speed = arguments[1] || jQuery.Wsfly.Slideplayer.Options.MarqueeSpeed;

            clone.innerHTML = original.innerHTML;
            var rolling = function () {
                if (container.scrollLeft >= clone.offsetLeft) {
                    container.scrollLeft = 0;
                } else {
                    container.scrollLeft++;
                }
            }
            var timer = setInterval(rolling, speed)//设置定时器
            container.onmouseover = function () { clearInterval(timer) } //鼠标移到marquee上时，清除定时器，停止滚动
            container.onmouseout = function () { timer = setInterval(rolling, speed) } //鼠标移开时重设定时器
        },
        //向右滚动
        Right: function (id) {
            try { document.execCommand("BackgroundImageCache", false, true); } catch (e) { };
            var container = document.getElementById(id),
                original = container.getElementsByTagName("dt")[0],
                clone = container.getElementsByTagName("dd")[0],
                speed = arguments[1] || jQuery.Wsfly.Slideplayer.Options.MarqueeSpeed;
            clone.innerHTML = original.innerHTML;
            container.scrollLeft = clone.offsetLeft
            var rolling = function () {
                if (container.scrollLeft == 0) {
                    container.scrollLeft = clone.offsetLeft;
                } else {
                    container.scrollLeft--;
                }
            }
            var timer = setInterval(rolling, speed)//设置定时器
            container.onmouseover = function () { clearInterval(timer) } //鼠标移到marquee上时，清除定时器，停止滚动
            container.onmouseout = function () { timer = setInterval(rolling, speed) } //鼠标移开时重设定时器
        },
        Up: function Up(id) {
            try { document.execCommand("BackgroundImageCache", false, true); } catch (e) { };
            var container = document.getElementById(id),
                original = container.getElementsByTagName("dt")[0],
                clone = container.getElementsByTagName("dd")[0],
                speed = arguments[1] || jQuery.Wsfly.Slideplayer.Options.MarqueeSpeed;
            clone.innerHTML = original.innerHTML;
            var rolling = function () {
                if (container.scrollTop >= clone.offsetTop) {
                    container.scrollTop = 0;
                } else {
                    container.scrollTop++;
                }
            }
            var timer = setInterval(rolling, speed)//设置定时器
            container.onmouseover = function () { clearInterval(timer) } //鼠标移到marquee上时，清除定时器，停止滚动
            container.onmouseout = function () { timer = setInterval(rolling, speed) } //鼠标移开时重设定时器
        },
        Down: function (id) {
            try { document.execCommand("BackgroundImageCache", false, true); } catch (e) { };
            var container = document.getElementById(id),
                original = container.getElementsByTagName("dt")[0],
                clone = container.getElementsByTagName("dd")[0],
                speed = arguments[1] || jQuery.Wsfly.Slideplayer.Options.MarqueeSpeed;
            clone.innerHTML = original.innerHTML;
            container.scrollTop = clone.offsetTop;
            var rolling = function () {
                if (container.scrollTop == 0) {
                    container.scrollTop = clone.offsetTop;
                } else {
                    container.scrollTop--;
                }
            }
            var timer = setInterval(rolling, speed)//设置定时器
            container.onmouseover = function () { clearInterval(timer) } //鼠标移到marquee上时，清除定时器，停止滚动
            container.onmouseout = function () { timer = setInterval(rolling, speed) } //鼠标移开时重设定时器
        },
        Text: function (id) {
            try { document.execCommand("BackgroundImageCache", false, true); } catch (e) { };
            var container = document.getElementById(id),
                speed = arguments[1] || jQuery.Wsfly.Slideplayer.Options.MarqueeSpeed * 100;

            $(container).find("li").attr({
                "class": "Arraw-Right"
            });

            $(container).find("li").hide();
            $(container).find("li:first").show();

            var rolling = function () {
                var index = $(container).attr("index") || 0;
                $(container).children().eq(index).fadeOut();
                index = parseInt(index) + 1;

                if (index >= $(container).children().length) index = 0;

                $(container).children().eq(index).fadeIn();
                $(container).attr("index", index);
            }
            var timer = setInterval(rolling, speed)//设置定时器
            container.onmouseover = function () { clearInterval(timer) } //鼠标移到marquee上时，清除定时器，停止滚动
            container.onmouseout = function () { timer = setInterval(rolling, speed) } //鼠标移开时重设定时器
        }
    },
    /*******************************
    *   背景图片切换
    *   容器需包含样式示例：.container{ min-height:1200px; overflow:hidden; zoom:1; position:relative;}
    *   调用：
    *       1、$("#divLoginPage").BackgroundPlayer(backgroundImages);
    *       2、jQuery.Wsfly.Slideplayer.BackgroundPlayer.Init(params);
    *******************************/
    BackgroundPlayer: {
        Param: {
            "interval": 10,
            "target": "",
            "effect ": "fade",
            "images": []
        },
        Init: function (param) {
            //背景播放器
            if (param == null || param.images == null || param.images.length <= 0) return;

            //填充默认参数
            param = $.extend(jQuery.Wsfly.Slideplayer.BackgroundPlayer.Param, param);

            //播放间隔
            var interval = param.interval || 5;

            //背景层列表
            var divBGs = new Array(param.images.length);

            //生成背景
            for (var i = 0; i < param.images.length; i++) {
                var divBG = document.createElement("div");
                divBG.style.backgroundImage = "url(" + param.images[i] + ")";
                divBG.style.position = "absolute";
                divBG.style.width = "100%";
                divBG.style.height = $(document).height() + "px";
                divBG.style.opacity = 0;
                divBG.style.zIndex = 1;
                $(divBG).css({ "opacity": 0 });

                //保存到背景层列表
                divBGs[i] = divBG;

                //添加对象
                $("#" + param.target).css({ "position": "relative", "overflow": "hidden" });
                $("#" + param.target).append(divBG);
            }

            //切换进度条
            var divProgress = document.createElement("div");
            divProgress.style.width = "0px";
            divProgress.style.height = "3px";
            divProgress.style.position = "absolute";
            divProgress.style.bottom = 0;
            divProgress.style.zIndex = 2;
            divProgress.style.backgroundColor = "red";
            divProgress.style.opacity = 0.3;
            $(divProgress).css({ opacity: 0.3 });
            //添加对象
            $("#" + param.target).append(divProgress);

            //第一张显示
            $(divBGs[0]).css({ opacity: 1 });

            //没有超过1张图片
            if (divBGs.length <= 1) return;

            //窗口大小发生改变
            $(window).resize(function () {
                for (var i = 0; i < divBGs.length; i++) {
                    //重新设置高度
                    divBGs[i].style.height = $(window).height() + "px";
                }
            });

            //播放索引
            var playIndex = 1;
            var divProgressIsFull = true;

            //进度
            $(divProgress).animate({ width: "100%" }, interval * 1000);

            //定时播放
            window.setInterval(function () {
                //显示
                $(divBGs[playIndex]).animate({ opacity: 1 }, 1000);
                //隐藏
                $(divBGs[(playIndex - 1 < 0 ? divBGs.length - 1 : playIndex - 1)]).animate({ opacity: 0 }, 1000);

                //下一张图片索引
                playIndex++;

                if (playIndex >= param.images.length) {
                    //重置索引
                    playIndex = 0;
                }

                //进度条动画
                if (divProgressIsFull) {
                    $(divProgress).animate({ width: "0" }, interval * 1000);
                    divProgressIsFull = false;
                }
                else {
                    $(divProgress).animate({ width: "100%" }, interval * 1000);
                    divProgressIsFull = true;
                }
            }, interval * 1000)
        }
    }
};

/*扩展Jquery*/
(function ($) {
    $.fn.extend({
        //幻灯片播放
        Slideplayer: function (options) {
            return this.each(function () {
                var id = $(this).attr("id");
                options = $.extend(jQuery.Wsfly.Slideplayer.Options, options);
                options.ContainerId = id;

                jQuery.Wsfly.Slideplayer.Init(options);
            });
        },
        //向左翻页
        FlipLeft: function (speed) {
            return this.each(function () {
                var id = $(this).attr("id");
                jQuery.Wsfly.Slideplayer.Marquee.FlipLeft(id, speed);
            });
        },
        //向左移动
        MarqueeLeft: function () {
            return this.each(function () {
                var id = $(this).attr("id");
                jQuery.Wsfly.Slideplayer.Marquee.Left(id);
            });
        },
        //向右移动
        MarqueeRight: function () {
            return this.each(function () {
                var id = $(this).attr("id");
                jQuery.Wsfly.Slideplayer.Marquee.Right(id);
            });
        },
        //向上移动
        MarqueeUp: function () {
            return this.each(function () {
                var id = $(this).attr("id");
                jQuery.Wsfly.Slideplayer.Marquee.Up(id);
            });
        },
        //向下移动
        MarqueeDown: function () {
            return this.each(function () {
                var id = $(this).attr("id");
                jQuery.Wsfly.Slideplayer.Marquee.Down(id);
            });
        },
        //移动文字
        MarqueeText: function () {
            return this.each(function () {
                var id = $(this).attr("id");
                jQuery.Wsfly.Slideplayer.Marquee.Text(id);
            });
        },
        //背景播放
        BackgroundPlayer: function (imgs) {
            return this.each(function () {
                var id = $(this).attr("id");
                var param = {
                    "target": id,
                    "images": imgs
                };
                jQuery.Wsfly.Slideplayer.BackgroundPlayer.Init(param);
            });
        }
    });
})(jQuery);