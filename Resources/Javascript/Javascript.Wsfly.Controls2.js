

window.Wsfly = window.Wsfly || {};

Wsfly.Controls = {
    InitDateOptions: function (yearId, monthId, dayId) {
        /*************************************************
        *
        *       年月日联动插件
        *       Author: Wsfly.com
        *       CopyRight (c) 2012 IROR
        * 
        *       $Date: 2012-04-01
        *       $Vesion: 1.0
        *  
        *       说明：
        *            1/所选择日期不大于当前日期
        *            2/
        *       示例：
        *            Wsfly.Controls.InitDateOptions("ddlYear","ddlMonth","ddlDay");
        *
        *************************************************/
        var year = null, month = null, day = null;

        var _currentDate = new Date();
        var _currentYear = _currentDate.getFullYear();
        var _currentMonth = _currentDate.getMonth() + 1;
        var _currentDay = _currentDate.getDate();

        var chooseYear = _currentYear;
        var chooseMonth = _currentMonth;
        var chooseDay = _currentDay;

        var option = "";

        if (yearId) {
            //有年份下拉框
            year = $("#" + yearId);
            //初始年
            InitYears();
        };
        if (monthId) {
            //有月份下拉框
            month = $("#" + monthId);
            //初始月
            InitMonths(_currentYear);

            $(year).change(function () {
                //记录状态
                chooseYear = year.val();
                chooseMonth = month.val();

                //更新月份
                InitMonths(year.val());

                if (day) {
                    chooseDay = day.val();
                    InitDays(year.val(), month.val());
                }
            });
        };
        if (dayId) {
            //有日下拉框
            day = $("#" + dayId);
            //初始日
            InitDays(_currentYear, _currentMonth);

            $(month).change(function () {
                //记录状态
                chooseYear = year.val();
                chooseMonth = month.val();
                chooseDay = day.val();

                //更新日
                InitDays(year.val(), month.val());
            });
        };

        //初始年
        function InitYears() {
            year.empty(); //清空

            var minYear = year.attr("minYear") ? parseInt(year.attr("minYear")) : _currentYear - 50;
            var maxYear = year.attr("maxYear") ? parseInt(year.attr("maxYear")) : _currentYear;

            for (var i = minYear; i < maxYear + 1; i++) {
                if (i == chooseYear) {
                    option = "<option value='" + i + "' selected='true'>" + i + "</option>";
                } else {
                    option = "<option value='" + i + "'>" + i + "</option>";
                }

                year.append(option);
            }
        };
        //初始月
        function InitMonths(iYear) {
            month.empty(); //清空

            for (var i = 1; i <= 12; i++) {
                if (iYear == _currentYear && i > _currentMonth) return;

                if (i == chooseMonth) {
                    option = "<option value='" + i + "' selected='true'>" + i + "</option>";
                } else {
                    option = "<option value='" + i + "'>" + i + "</option>";
                }
                month.append(option);
            }
        };
        //初始日
        function InitDays(iYear, iMonth) {
            day.empty(); //清空
            var daysInMonth = GetDays(iYear, iMonth); //得到本月天数

            for (i = 1; i <= parseInt(daysInMonth); i++) {
                if (iYear == _currentYear && iMonth == _currentMonth && i > _currentDay) return;

                if (i == chooseDay) {
                    option = "<option value=" + i + " selected='true'>" + i + "</option>";
                } else {
                    option = "<option value='" + i + "'>" + i + "</option>";
                }

                day.append(option);
            }
        };
        ///得到本月总天数
        function GetDays(iYear, iMonth) {
            //本月
            var chooseDate = new Date(iYear, iMonth, 0);
            //返回天数
            return chooseDate.getDate();
        };
        //初始默认值
        function InitDefaultValue() {
            var defaultValue = year.attr("defaultValue");
            if (defaultValue != undefined && defaultValue != null && defaultValue != "") {
                year.attr("value", defaultValue);

                //更新月份
                InitMonths(year.val());
                //更新日
                InitDays(year.val(), month.val());
            }

            defaultValue = month.attr("defaultValue");
            if (defaultValue != undefined && defaultValue != null && defaultValue != "") {
                defaultValue = defaultValue.TrimStart('0');
                month.attr("value", defaultValue);
                //更新日
                InitDays(year.val(), month.val());
            }

            defaultValue = day.attr("defaultValue");
            if (defaultValue != undefined && defaultValue != null && defaultValue != "") {
                defaultValue = defaultValue.TrimStart('0');
                day.attr("value", defaultValue);
            }
        }
        InitDefaultValue();
    },
    InitAreaOptions: function (countryId, provinceId, cityId) {
        /*************************************************
        *
        *       国家、省份、城市联动插件
        *       Author: Wsfly.com
        *       CopyRight (c) 2012 IROR
        * 
        *       $Date: 2012-04-01
        *       $Vesion: 1.0
        *  
        *       说明：
        *       示例：
        *            Wsfly.Controls.InitAreaOptions("ddlCountry","ddlProvince","ddlCity");
        *
        *************************************************/
        var country = null, province = null, city = null;
        var countryValue = null, provinceValue = null, cityValue = null;
        var option = "";
        var firstLoadCity = true;
        var apiUrl = "/Com/GetAreaChildren";

        if (countryId && countryId != null) {
            country = $("#" + countryId);
            country.parent().append("<input type='hidden' id='" + countryId + "_value' name='" + countryId + "_value' />");
            countryValue = $("#" + countryId + "_value");


            InitCountry();
        };
        if (provinceId) {
            province = $("#" + provinceId);
            province.parent().append("<input type='hidden' id='" + provinceId + "_value' name='" + provinceId + "_value' />");
            provinceValue = $("#" + provinceId + "_value");


            if (country != null) {
                InitProvince(country.val());

                $(country).change(function () {
                    InitProvince(country.val());
                    if (city) {
                        InitCity(province.val());
                    }
                    countryValue.val(country.find("option:selected").text());
                });
            }
            else {
                InitProvince(0);
            }
        };
        if (cityId) {
            city = $("#" + cityId);
            city.parent().append("<input type='hidden' id='" + cityId + "_value' name='" + cityId + "_value' />");
            cityValue = $("#" + cityId + "_value");

            $(province).change(function () {
                if (city) {
                    city.empty();
                    city.append("<option value=''>请稍候...</option>");

                    InitCity(province.val());
                }
                provinceValue.val(province.find("option:selected").text());
            });

            $(city).change(function () {
                cityValue.val(city.find("option:selected").text());
            });
        };

        //初始国家
        function InitCountry() {
            option = "<option value='0' selected='true'>中国</option>";
            country.append(option);
            countryValue.val(country.find("option:selected").text());
        };
        //初始省份
        function InitProvince(iCountry) {
            province.empty();

            $.post(apiUrl, { pId: iCountry }, function (data) {
                if (data.Success && data.Data.length > 0) {
                    province.show();
                    var result = data.Data;

                    for (var i = 0; i < result.length; i++) {
                        var option = "<option value='" + result[i].Id + "'>" + result[i].AreaName + "</option>";
                        province.append(option);
                    }

                    if (cityId) {
                        InitCity(province.val());
                    }
                    else {
                        InitDefaultValue();
                    }

                    provinceValue.val(province.find("option:selected").text());
                }
                else {
                    province.hide();
                }
            }, "json");
        };
        //初始城市
        function InitCity(iProvince, callback) {
            city.empty();

            var defaultValue = city.attr("defaultValue");

            if (firstLoadCity && !IsNullOrEmpty(defaultValue)) {
                firstLoadCity = false;
                InitDefaultValue();
                return;
            }

            $.post(apiUrl, { pId: iProvince }, function (data) {
                if (data.Success && data.Data.length > 0) {
                    city.show();
                    var result = data.Data;

                    for (var i = 0; i < result.length; i++) {
                        var option = "<option value='" + result[i].Id + "'>" + result[i].AreaName + "</option>";
                        city.append(option);
                    }

                    cityValue.val(city.find("option:selected").text());

                    if (firstLoadCity) {
                        firstLoadCity = false;
                        InitDefaultValue();
                    }

                    if (callback) {
                        callback();
                    }

                    $(city).change();
                }
                else {
                    city.hide();
                }
            }, "json");
        };
        //初始默认值
        function InitDefaultValue() {
            if (country) {
                var countryDefaultValue = country.attr("defaultValue");
                if (countryDefaultValue != undefined && countryDefaultValue != null && countryDefaultValue != "") {
                    countryValue.val(countryDefaultValue);
                    country.children().each(function () {
                        country.val($(this).val())
                    });
                }
            }

            var provincDefaultValue = province.attr("defaultValue");
            if (provincDefaultValue != undefined && provincDefaultValue != null && provincDefaultValue != "") {
                provinceValue.val(provincDefaultValue);
                province.children().each(function () {
                    if ($(this).text() == provincDefaultValue) {
                        var pid = $(this).val();
                        province.val(pid);

                        if (cityId) {
                            InitCity(pid, function () {
                                var cityDefaultValue = city.attr("defaultValue");
                                if (cityDefaultValue != undefined && cityDefaultValue != null && cityDefaultValue != "") {
                                    cityValue.val(cityDefaultValue);
                                    city.children().each(function () {
                                        if ($(this).text() == cityDefaultValue) {
                                            city.val($(this).val());
                                        }
                                    });
                                }
                            });
                        }
                    }
                });
            }
            else {
                //没有省份默认值
                InitCity(province.val());
            }
        }
    }
};


