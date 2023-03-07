jQuery.Wsfly = jQuery.Wsfly || {};

jQuery.Wsfly.Calendar = {
    /*************************************
    *  
    *   jQuery.Wsfly.Calendar
    *   Author:Wsfly.com
    *   Version:1.0
    *   Address:http://www.wsfly.com/
    *
    *************************************/
    Options: {
        "Container": null,
        "ContainerId": null,
        "Target": null,
        "Inited": false,
        "DefaultDate": null,
        "ChooseDate": null,
        "ChooseYear": null,
        "ChooseMonth": null,
        "ChooseDay": null,
        "CalendarDate": null,
        "CurrentDate": null,
        "CurrentYear": null,
        "CurrentMonth": null,
        "CurrentDay": null,
        "AppendedStyle": false,
        "InitedCallback": function (options) { },
        "ChooseDayCallback": function (options) { },
        "ChooseMonthCallback": function (options) { },
        "TodayCallback": function (options) { }
    },
    Init: function (options) {
        //初始化
        //合并参数
        options = $.extend({}, jQuery.Wsfly.Calendar.Options, options);
        //附加样式
        jQuery.Wsfly.Calendar.AppendStyle(options);

        //没有初始化的容器
        if (options.Container == null && options.ContainerId == null) {
            return;
        }

        //获取容器
        if (options.Container == null) {
            //存放容器
            options.Container = $("#" + options.ContainerId);
        }
        if (options.ContainerId == null) {
            //容器ID
            options.ContainerId = options.Container.attr("id");
        }

        //当前日期
        options.CurrentDate = new Date();
        options.CurrentYear = options.CurrentDate.getFullYear();
        options.CurrentMonth = options.CurrentDate.getMonth() + 1;
        options.CurrentDay = options.CurrentDate.getDate();

        if (options.DefaultDate == null) {
            //默认日期为当前日期
            options.DefaultDate = options.CurrentDate;
        }
        else {
            //选中日期为默认日期
            options.DefaultDate = new Date(options.DefaultDate);
        }
        
        //当前选中的日期
        options.ChooseDate = options.DefaultDate;
        options.ChooseYear = options.ChooseDate.getFullYear();
        options.ChooseMonth = options.ChooseDate.getMonth() + 1;
        options.ChooseDay = options.ChooseDate.getDate();

        //日历日期
        options.CalendarDate = options.DefaultDate;

        //生成日历表
        jQuery.Wsfly.Calendar.BuildCalendarTable(options);

        //初始完成回调
        if (jQuery.Wsfly.Calendar.IsFunction(options.InitedCallback)) {
            options.InitedCallback(options);
        }

        return options;
    },
    SetTagHidden: function (options, date) {
        //设置标签颜色-隐藏
        jQuery.Wsfly.Calendar.SetTagColor(options, date);
    },
    SetTagGray: function (options, date) {
        //设置标签颜色-灰色
        jQuery.Wsfly.Calendar.SetTagColor(options, date, "Gray");
    },
    SetTagRed: function (options, date) {
        //设置标签颜色-红色
        jQuery.Wsfly.Calendar.SetTagColor(options, date, "Red");
    },
    SetTagGreen: function (options, date) {
        //设置标签颜色-绿色
        jQuery.Wsfly.Calendar.SetTagColor(options, date, "Green");
    },
    SetTagColor: function (options, date, color) {
        //设置标签颜色
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();

        //标签颜色：Gray、Read、Green
        if (color) color = "EventTag-" + color;
        else color = "";

        //设置颜色
        options.Container.find("div[data-calender-date='" + year + "-" + month + "-" + day + "']").parent().find(".CalendarEventTag").attr("class", "CalendarEventTag " + color);
    },
    BuildCalendarTable: function (options) {
        //生成日历表
        if (options.Container == null) return;
        //日历存放容器
        $this = options.Container;

        //日期
        var date = jQuery.Wsfly.Calendar.FormatDate(options.ChooseDate);
        var prevMonth = jQuery.Wsfly.Calendar.FormatDate(new Date(date.Year, date.Month - 2, 1));
        var currentMonth = jQuery.Wsfly.Calendar.FormatDate(new Date(date.Year, date.Month - 1, 1));
        var nextMonth = jQuery.Wsfly.Calendar.FormatDate(new Date(date.Year, date.Month, 1));

        //生成HTML代码
        var htmlCalendar = '<div class="WsflyCalendar">';

        var htmlCalendarHead = '<div class="CalenderHead">' +
                               '    <div class="CalenderHead_Left">' +
                               '        <span data-calender-tag="year">' + date.Year + '</span>' +
                               '        <span class="Gray">年</span>' +
                               '        <span data-calender-tag="month">' + date.Month + '</span>' +
                               '        <span class="Gray">月</span>' +
                               '    </div>' +
                               '    <div class="CalenderHead_Right">' +
                               '        <button class="CalenderBtn" data-calender-tag="today">今天</button>' +
                               '        <button class="CalenderBtn" data-calender-tag="prevMonth">' + prevMonth.Month + '月</button>' +
                               '        <button class="CalenderBtn" data-calender-tag="nextMonth">' + nextMonth.Month + '月</button>' +
                               '    </div>' +
                               '</div>';

        //头部
        htmlCalendar += htmlCalendarHead;

        var htmlCalendarBody = '<div class="CalenderBody">' +
                               '    <table>' +
                               '        <thead>' +
                               '            <tr>' +
                               '                <th class="Gray">周日</th>' +
                               '                <th>周一</th>' +
                               '                <th>周二</th>' +
                               '                <th>周三</th>' +
                               '                <th>周四</th>' +
                               '                <th>周五</th>' +
                               '                <th class="Gray">周六</th>' +
                               '            </tr>' +
                               '        </thead>' +
                               '        <tbody>';

        //生成月HTML
        htmlCalendarBody += jQuery.Wsfly.Calendar.BuildMonthDays(options);

        htmlCalendarBody += '        </tbody>' +
                               '    </table>' +
                               '</div>';
        htmlCalendar += htmlCalendarBody;
        htmlCalendar += '</div>';

        //显示HTML
        $this.html(htmlCalendar);

        //日历对象
        options.Target = $this.find(".WsflyCalendar");

        //今日
        $this.find("button[data-calender-tag='today']").click(function () {
            jQuery.Wsfly.Calendar.MoveToDate(options, new Date());

            //点击今日回调
            if (jQuery.Wsfly.Calendar.IsFunction(options.TodayCallback)) {
                options.TodayCallback(options);
            }
        });
        //上一月
        $this.find("button[data-calender-tag='prevMonth']").click(function () {
            //当前选择日期
            var chooseDate = jQuery.Wsfly.Calendar.FormatDate(options.ChooseDate);

            //上月总天数
            var prevMonthDays = new Date(chooseDate.Year, chooseDate.Month - 1, 0).getDate();

            //选择上月的日
            var prevMonthChooseDay = chooseDate.Day;

            //如果上月的总天数小于选择日期的天数 则选择日期为上月的最后一天
            if (prevMonthDays < prevMonthChooseDay) prevMonthChooseDay = prevMonthDays;

            //设置上月选择日期
            var prevMonthDate = new Date(chooseDate.Year, chooseDate.Month - 2, prevMonthChooseDay);

            //移动到日期
            jQuery.Wsfly.Calendar.MoveToDate(options, prevMonthDate);

            //点击上一月回调
            if (jQuery.Wsfly.Calendar.IsFunction(options.ChooseMonthCallback)) {
                options.ChooseMonthCallback(options);
            }
        });
        //下一月
        $this.find("button[data-calender-tag='nextMonth']").click(function () {
            //选择日期
            var chooseDate = jQuery.Wsfly.Calendar.FormatDate(options.ChooseDate);

            //下月总天数
            var nextMonthDays = new Date(chooseDate.Year, chooseDate.Month + 1, 0).getDate();

            //选择下月的日
            var nextMonthChooseDay = chooseDate.Day;

            //如果下月的总天数小于选择日期的天数 则选择日期为下月的最后一天
            if (nextMonthDays < nextMonthChooseDay) nextMonthChooseDay = nextMonthDays;

            //设置下月选择日期
            var nextMonthDate = new Date(chooseDate.Year, chooseDate.Month, nextMonthChooseDay);

            //移动到下月日期
            jQuery.Wsfly.Calendar.MoveToDate(options, nextMonthDate);

            //点击下一月回调
            if (jQuery.Wsfly.Calendar.IsFunction(options.ChooseMonthCallback)) {
                options.ChooseMonthCallback(options);
            }
        });
        //选择日期
        $this.find(".CalenderBody tbody td").click(function () {
            //选择日期
            var $td = $(this);
            jQuery.Wsfly.Calendar.ChooseDay(options, $td);
        });
    },
    MoveToDate: function (options, date) {
        //移动到日期
        var calendarDate = jQuery.Wsfly.Calendar.FormatDate(options.CalendarDate);
        var chooseDate = jQuery.Wsfly.Calendar.FormatDate(options.ChooseDate);
        var moveToDate = jQuery.Wsfly.Calendar.FormatDate(date);

        //无需移动
        if (chooseDate.Year == moveToDate.Year && chooseDate.Month == moveToDate.Month && chooseDate.Day == moveToDate.Day) return;
        
        //更换选择日期
        options.ChooseDate = date;
        options.ChooseYear = options.ChooseDate.getFullYear();
        options.ChooseMonth = options.ChooseDate.getMonth() + 1;
        options.ChooseDay = options.ChooseDate.getDate();

        //在本月 无需换日历表
        if (calendarDate.Year == moveToDate.Year && calendarDate.Month == moveToDate.Month) {
            var $td = options.Container.find("div[data-calender-date='" + moveToDate.Year + '-' + moveToDate.Month + '-' + moveToDate.Day + "']").parent();
            jQuery.Wsfly.Calendar.ChooseDay(options, $td);
            return;
        }

        //更换日历
        var prevMonth = jQuery.Wsfly.Calendar.FormatDate(new Date(moveToDate.Year, moveToDate.Month - 2, 1));
        var nextMonth = jQuery.Wsfly.Calendar.FormatDate(new Date(moveToDate.Year, moveToDate.Month, 1));

        //日历日期
        options.CalendarDate = date;
        
        options.Container.find("span[data-calender-tag='year']").html(moveToDate.Year);
        options.Container.find("span[data-calender-tag='month']").html(moveToDate.Month);
        options.Container.find("button[data-calender-tag='prevMonth']").html(prevMonth.Month + "月");
        options.Container.find("button[data-calender-tag='nextMonth']").html(nextMonth.Month + "月");

        //生成HTML日历天
        var htmlMonthDays = jQuery.Wsfly.Calendar.BuildMonthDays(options);
        options.Container.find(".CalenderBody tbody").html(htmlMonthDays);

        //选择日期
        $this.find(".CalenderBody tbody td").click(function () {
            //选择日期
            var $td = $(this);
            jQuery.Wsfly.Calendar.ChooseDay(options, $td);
        });

        //选择日期回调
        if (jQuery.Wsfly.Calendar.IsFunction(options.ChooseDayCallback)) {
            options.ChooseDayCallback(options);
        }
    },
    ChooseDay: function (options, $td) {
        var $div = $td.find("div[data-calender-day]");
        var chooseDate = $div.attr("data-calender-date");

        //选中日期
        var dateStr = chooseDate.split('-');
        options.ChooseDate = new Date(dateStr[0], parseInt(dateStr[1]) - 1, dateStr[2]);
        options.ChooseYear = options.ChooseDate.getFullYear();
        options.ChooseMonth = options.ChooseDate.getMonth() + 1;
        options.ChooseDay = options.ChooseDate.getDate();

        //查找样式
        options.Container.find(".CalenderBody tbody td").removeAttr("Class");
        options.Container.find(".CalenderBody tbody td[data-IsCurrentDay='true']").attr("class", "CurrentDay");
        options.Container.find(".CalenderBody tbody td[data-IsChooseDay='true']").attr("data-IsChooseDay", "false");

        $td.attr("class", "ChooseDay");
        $td.attr("data-IsChooseDay", "true");

        //选择日期回调
        if (jQuery.Wsfly.Calendar.IsFunction(options.ChooseDayCallback)) {
            options.ChooseDayCallback(options);
        }
    },
    BuildMonthDays: function (options) {
        //生成月的天HTML

        //日期
        var date = jQuery.Wsfly.Calendar.FormatDate(options.ChooseDate);
        var currentDate = jQuery.Wsfly.Calendar.FormatDate(options.CurrentDate);
        var prevMonth = jQuery.Wsfly.Calendar.FormatDate(new Date(date.Year, date.Month - 2, 1));
        var currentMonth = jQuery.Wsfly.Calendar.FormatDate(new Date(date.Year, date.Month - 1, 1));
        var nextMonth = jQuery.Wsfly.Calendar.FormatDate(new Date(date.Year, date.Month, 1));

        var dateArray = new Array();

        //生成上一月的日期
        for (var i = currentMonth.Week - 1; i >= 0; i--) {
            //上月天
            var prevMonthDay = prevMonth.MonthDays - i;

            //是否今日
            var isCurrentDay = false;
            if (prevMonth.Year == currentDate.Year && prevMonth.Month == currentDate.Month && prevMonthDay == currentDate.Day) isCurrentDay = true;

            //是否选中
            var isChooseDay = false;
            if (prevMonth.Year == date.Year && prevMonth.Month == date.Month && prevMonthDay == date.Day) isChooseDay = true;

            //添加天
            dateArray.push({ Year: prevMonth.Year, Month: prevMonth.Month, Day: prevMonthDay, IsCurrentDay: isCurrentDay, IsChooseDay: isChooseDay });
        }
        //生成本月的日期
        for (var i = 1; i <= currentMonth.MonthDays; i++) {
            //是否今日
            var isCurrentDay = false;
            if (currentMonth.Year == currentDate.Year && currentMonth.Month == currentDate.Month && i == currentDate.Day) isCurrentDay = true;

            //是否选中
            var isChooseDay = false;
            if (currentMonth.Year == date.Year && currentMonth.Month == date.Month && i == date.Day) isChooseDay = true;

            //添加天
            dateArray.push({ Year: currentMonth.Year, Month: currentMonth.Month, Day: i, IsCurrentDay: isCurrentDay, IsChooseDay: isChooseDay });
        }
        //生成下一月的日期
        var nextMonthShowDays = 42 - currentMonth.Week - currentMonth.MonthDays;
        for (var i = 1; i <= nextMonthShowDays; i++) {
            //是否今日
            var isCurrentDay = false;
            if (nextMonth.Year == currentDate.Year && nextMonth.Month == currentDate.Month && i == currentDate.Day) isCurrentDay = true;

            //是否选中
            var isChooseDay = false;
            if (nextMonth.Year == date.Year && nextMonth.Month == date.Month && i == date.Day) isChooseDay = true;

            //添加天
            dateArray.push({ Year: nextMonth.Year, Month: nextMonth.Month, Day: i, IsCurrentDay: isCurrentDay, IsChooseDay: isChooseDay });
        }

        //生成日历的天HTML
        var htmlDays = "";
        var dayIndex = 0;
        for (var i = 0; i < 6; i++) {
            htmlDays += "<tr>";
            for (var j = 0; j < 7; j++) {
                //天
                var currentDay = dateArray[dayIndex];
                var divClass = "";
                var tdClass = "";

                //是否不是当前月份
                if (currentDay.Year != currentMonth.Year || currentDay.Month != currentMonth.Month) divClass = "Gray";

                //是否是当前日期
                if (currentDay.IsCurrentDay) tdClass += "CurrentDay ";

                //是否是选中日期
                if (currentDay.IsChooseDay) {
                    tdClass += "ChooseDay ";
                }

                //HTML
                htmlDays += '<td class="' + tdClass + '" data-IsCurrentDay="' + currentDay.IsCurrentDay + '" data-IsChooseDay="' + currentDay.IsChooseDay + '"><div class="' + divClass + '" data-calender-date="' + currentDay.Year + '-' + currentDay.Month + '-' + currentDay.Day + '" data-calender-day="' + currentDay.Day + '">' + currentDay.Day + '</div><div class="CalendarEventTag"></div></td>';

                //下一天
                dayIndex++;
            }
            htmlDays += "</tr>";
        }
        return htmlDays;
    },
    FormatDate: function (date) {
        //获取日期
        var shortyear = date.getYear();       //获取当前年份(2位)
        var year = date.getFullYear();        //获取完整的年份(4位,1970-????)
        var month = date.getMonth() + 1;      //获取当前月份(0-11,0代表1月)
        var day = date.getDate();             //获取当前日(1-31)
        var hour = date.getHours();           //获取当前小时数(0-23)
        var minutes = date.getMinutes();      //获取当前分钟数(0-59)
        var seconds = date.getSeconds();      //获取当前秒数(0-59)
        var milliseconds = date.getMilliseconds();    //获取当前毫秒数(0-999)
        var week = date.getDay();                     //获取当前星期X(0-6,0代表星期天)
        var timestamp = date.getTime();               //获取当前时间(从1970.1.1开始的毫秒数)

        var monthDays = new Date(year, month, 0).getDate();    //月的天数

        return {
            Year: year,
            Month: month,
            Day: day,
            Hour: hour,
            Minutes: minutes,
            Seconds: seconds,
            Milliseconds: milliseconds,
            MonthDays: monthDays,
            Week: week,
            Timestamp: timestamp
        };
    },
    ShowFormatDate: function (date, formatStr) {
        ///格式化字符串
        if (!formatStr) formatStr = "yyyy-MM-dd";
        var str = formatStr;
        var week = ['日', '一', '二', '三', '四', '五', '六'];

        str = str.replace(/yyyy|YYYY/, date.getFullYear());
        str = str.replace(/yy|YY/, (date.getYear() % 100) > 9 ? (date.getYear() % 100).toString() : '0' + (date.getYear() % 100));

        str = str.replace(/MM/, date.getMonth() > 9 ? (date.getMonth() + 1).toString() : '0' + (date.getMonth() + 1));
        str = str.replace(/M/g, (date.getMonth() + 1));

        str = str.replace(/w|W/g, week[date.getDay()]);

        str = str.replace(/dd|DD/, date.getDate() > 9 ? date.getDate().toString() : '0' + date.getDate());
        str = str.replace(/d|D/g, date.getDate());

        str = str.replace(/hh|HH/, date.getHours() > 9 ? date.getHours().toString() : '0' + date.getHours());
        str = str.replace(/h|H/g, date.getHours());
        str = str.replace(/mm/, date.getMinutes() > 9 ? date.getMinutes().toString() : '0' + date.getMinutes());
        str = str.replace(/m/g, date.getMinutes());

        str = str.replace(/ss|SS/, date.getSeconds() > 9 ? date.getSeconds().toString() : '0' + date.getSeconds());
        str = str.replace(/s|S/g, date.getSeconds());

        return str;
    },
    AppendStyle: function (options) {
        //附加样式
        if (options.AppendedStyle) return;

        var style = "";
        style = "<style type=\"text/css\">" +
                    "    .WsflyCalendar{ width:100%; overflow:hidden; zoom:1; font-family:'Trebuchet MS','Lucida Sans Unicode','Lucida Grande','Lucida Sans',Arial,sans-serif;}" +
                    "    .WsflyCalendar .CalenderHead{ width:100%; height:40px; line-height:40px; overflow:hidden; zoom:1;}" +
                    "    .WsflyCalendar .CalenderHead .CalenderHead_Left{ float:left; height:40px; line-height:40px; font-size:16px;}" +
                    "    .WsflyCalendar .CalenderHead .CalenderHead_Left span{ display:block; float:left; height:40px; line-height:40px; font-size:18px; margin-right:3px;}" +
                    "    .WsflyCalendar .CalenderHead .CalenderHead_Left span .Gray{ color:gray;}" +
                    "    .WsflyCalendar .CalenderHead .CalenderHead_Right{ float:right;}" +
                    "    .WsflyCalendar .CalenderHead .CalenderHead_Right .CalenderBtn{ margin-top:5px; cursor:pointer; height:30px; line-height:30px; border-radius:3px; border:1px solid;background-color:#f5f5f5;background-image:-moz-linear-gradient(top,#fff,#e6e6e6);background-image:-webkit-gradient(linear,0 0,0 100%,from(#fff),to(#e6e6e6));background-image:-webkit-linear-gradient(top,#fff,#e6e6e6);background-image:-o-linear-gradient(top,#fff,#e6e6e6);background-image:linear-gradient(to bottom,#fff,#e6e6e6);background-repeat:repeat-x;border-color:#e6e6e6 #e6e6e6 #bfbfbf;border-color:rgba(0,0,0,.1) rgba(0,0,0,.1) rgba(0,0,0,.25);color:#333;text-shadow:0 1px 1px rgba(255,255,255,.75);box-shadow:inset 0 1px 0 rgba(255,255,255,.2),0 1px 2px rgba(0,0,0,.05)}" +
                    "    .WsflyCalendar .CalenderHead .CalenderHead_Right .CalenderIcon{font-family:\"Courier New\",Courier,monospace;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}" +
                    "    .WsflyCalendar .CalenderBody{ width:100%;}" +
                    "    .WsflyCalendar .CalenderBody table{ width:100%;border-spacing:3px;}" +
                    "    .WsflyCalendar .CalenderBody table thead{}" +
                    "    .WsflyCalendar .CalenderBody table thead th{ height:40px; line-height:40px; font-weight:bold;}" +
                    "    .WsflyCalendar .CalenderBody table thead th.Gray{ color:gray;}" +
                    "    .WsflyCalendar .CalenderBody table tbody{}" +
                    "    .WsflyCalendar .CalenderBody table tbody td{ text-align:center; background-color:rgba(255,255,255,0.6); position:relative; cursor:pointer;}" +
                    "    .WsflyCalendar .CalenderBody table tbody td div{ width:50px; height:50px; margin:0 auto; line-height:40px; display:block; overflow:hidden; zoom:1; border-radius:30px;}" +
                    "    .WsflyCalendar .CalenderBody table tbody td div:hover{ background:#99e0fe; font-weight:bold;}" +
                    "    .WsflyCalendar .CalenderBody table tbody td.CurrentDay{ background:rgba(150,220,255,0.3)}" +
                    "    .WsflyCalendar .CalenderBody table tbody td.CurrentDay div{ color:orangered; font-size:18px; font-weight:bold;}" +
                    "    .WsflyCalendar .CalenderBody table tbody td.ChooseDay{ background:none;}" +
                    "    .WsflyCalendar .CalenderBody table tbody td.ChooseDay div{ color:white; background:#00b4ff; font-weight:bold;}" +
                    "    .WsflyCalendar .CalenderBody table tbody td div.Gray{ color:#999;}" +
                    "    .WsflyCalendar .CalenderBody table tbody td div.CalendarEventTag{ width:8px; height:8px; overflow:hidden; zoom:1; border-radius:8px; position:absolute; bottom:10px; left:50%; margin-left:-4px;}" +
                    "    .WsflyCalendar .CalenderBody table tbody td div.EventTag-Gray{ background:#ccc;}" +
                    "    .WsflyCalendar .CalenderBody table tbody td div.EventTag-Red{ background:red;}" +
                    "    .WsflyCalendar .CalenderBody table tbody td div.EventTag-Green{ background:green;}" +
                    "</style>";
        $("head").append(style);

        options.AppendedStyle = true;
    },
    IsFunction: function (value) {
        //是否有值
        if (value == null || value == undefined) return false;
        //是否函数
        return (typeof (value) == "function");
    }
};

//jQuery(document).ready(jQuery.Wsfly.Calendar.Init);

/*扩展Jquery*/
(function ($) {
    $.fn.extend({
        //控件
        WsflyCalendar: function (options) {
            //生成Options
            options = $.extend({}, jQuery.Wsfly.Calendar.Options, options);
            //循环初始对象
            return this.each(function () {
                //容器
                options.Container = $(this);
                //初始化
                return jQuery.Wsfly.Calendar.Init(options);
            });
        }
    });
})(jQuery);