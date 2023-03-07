window.Wsfly = window.Wsfly || {};

Wsfly.Regex = {
    /*************************************
    *  
    *   Wsfly.Regex
    *   Author:Wsfly.com
    *   Version:1.0.2
    *   Address:http://www.wsfly.com/
    *
    *************************************/

    //初始化
    Init: function () {

    },
    IsNullOrEmpty: function (value) {
        //验证是否为空
        if (value == undefined || value == null) {
            return true;
        }
        //是否为空
        if (value.toString().replace(/(^\s+|\s$)/g, "") == "") return true;
        else return false;
    },
    IsCN: function (s) {
        //判断字符是否是中文字符 
        var pattern = /^([\u4E00-\u9FA5]|[\uFE30-\uFFA0])+$/;
        return Wsfly.Regex.Test(s, pattern);
    },
    IsEN: function (s) {
        //是否英文字符串
        return Wsfly.Regex.Test(s, /^[A-Za-z]+$/);
    },
    IsNum: function (s) {
        //是否数字
        return Wsfly.Regex.Test(s, /^\d*$/);
    },
    IsENNum: function (s) {
        //是否英文数字
        return Wsfly.Regex.Test(s, /^[A-Za-z0-9]+$/);
    },
    IsDouble: function (s) {
        //是否浮点数
        return Wsfly.Regex.Test(s, /^(-?\d+)(\.\d+)?$/);
    },
    IsDate: function (s) {
        //验证日期
        var pattern = /^(19|20)\d\d+[-]*(0[1-9]|1[012])+[-]*(0[1-9]|[12][0-9]|3[01])$/
        return Wsfly.Regex.Test(s, pattern);
    },
    IsDateTime: function (s) {
        //验证日期
        var pattern = /^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/;
        return Wsfly.Regex.Test(s, pattern);
    },
    IsRegisterUserName: function (s) {
        //校验登录名：只能输入5-20个以字母开头、可带数字、“_”、“.”的字串
        var pattern = /^[a-zA-Z]{1}([a-zA-Z0-9._]){4,19}$/;
        return Wsfly.Regex.Test(s, pattern);
    },
    IsPasswd: function (s) {
        //校验密码：只能输入6-20个字母、数字
        var pattern = /^[a-zA-Z0-9]{6,20}$/;
        return Wsfly.Regex.Test(s, pattern);
    },
    IsMobile: function (s) {
        //验证手机号码合法性
        s = s.replace("+86", "");
        var pattern = /^[1]([3][0-9]{1}|59|58|8[5-9])[0-9]{8}$/;
        return Wsfly.Regex.Test(s, pattern);
    },
    IsPostalCode: function (s) {
        //校验邮政编码
        var pattern = /^[1-9]{1}(\d){5}$/;
        return Wsfly.Regex.Test(s, pattern);
    },
    IsSearch: function (s) {
        //校验搜索关键字
        var pattern = /^[^`~!@#$%^&*()+=|\\\[\]\{\}:;\'\,.<>\/? ]{1}[^`~!@$%^&()+=|\\\[\]\{\}:;\'\,.<>?]{0,19}$/;
        return Wsfly.Regex.Test(s, pattern);
    },
    IsIP: function (s) {
        //校验是否为ip地址
        var pattern = /^[0-9.]{1,20}$/;
        return Wsfly.Regex.Test(s, pattern);
    },
    IsEmail: function (s) {
        //是否邮箱
        var pattern = /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/;
        return Wsfly.Regex.Test(s, pattern);
    },
    IsUrl: function (s) {
        var pattern = /^([a-zA-z]+:\/\/)?([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?$/;
        return Wsfly.Regex.Test(s, pattern);
    },
    HasSpecialChar: function (s) {
        //是否有特殊字符
        var pattern = /[\`\~\!\@\#\$\%\^\&\*\(\)\+\=\|\{\}\'\:\;,\/\"\\\[\]\.\<\>\?\~！@\#￥\%……\&\*（）——\+\|\{\}【】‘；：”“’。，、？]/;
        return Wsfly.Regex.Test(s, pattern);
    },
    IsIdCardNo: function (num) {
        //验证身份证
        var factorArr = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1);
        var error;
        var varArray = new Array();
        var intValue;
        var lngProduct = 0;
        var intCheckDigit;
        var intStrLen = num.length;
        var idNumber = num;
        // initialize
        if ((intStrLen != 15) && (intStrLen != 18)) {
            //error = "输入身份证号码长度不对！"; 
            return false;
        }
        // check and set value
        for (i = 0; i < intStrLen; i++) {
            varArray[i] = idNumber.charAt(i);
            if ((varArray[i] < '0' || varArray[i] > '9') && (i != 17)) {
                //error = "错误的身份证号码！."; 
                return false;
            } else if (i < 17) {
                varArray[i] = varArray[i] * factorArr[i];
            }
        }
        if (intStrLen == 18) {
            //check date
            var date8 = idNumber.substring(6, 14);
            if (Wsfly.Regex.IsDate(date8) == false) {
                //error = "身份证中日期信息不正确！."; 
                return false;
            }
            // calculate the sum of the products
            for (i = 0; i < 17; i++) {
                lngProduct = lngProduct + varArray[i];
            }
            // calculate the check digit 
            intCheckDigit = 12 - lngProduct % 11;
            switch (intCheckDigit) {
                case 10:
                    intCheckDigit = 'X';
                    break;
                case 11:
                    intCheckDigit = 0;
                    break;
                case 12:
                    intCheckDigit = 1;
                    break;
            }
            // check last digit 
            if (varArray[17].toUpperCase() != intCheckDigit) {
                //error = "身份证效验位错误！"; 
                return false;
            }
        }
        else {
            //length is 15 
            //check date 
            var date6 = idNumber.substring(6, 12);
            if (Wsfly.Regex.IsDate(date6) == false) {
                //alert("身份证日期信息有误！"); 
                return false;
            }
        }
        return true;
    },
    Test: function (s, pattern) {
        //测试
        if (!pattern.exec(s)) return false;
        return true;
    }
};