/**
 * Created with JetBrains WebStorm
 * Author：lizm
 * Date：2016/11/22
 * Time：11:12
 *
 */

var moneyUtil = function () {
    // 阿拉伯数字金额转成中文大写金额
    var _arabicToChinese = function (arabicNum) {
        var arabicNum = new String(Math.round(arabicNum * 100)); // 数字金额
        var chineseValue = ""; // 转换后的汉字金额
        var String1 = "零壹贰叁肆伍陆柒捌玖"; // 汉字数字
        var String2 = "万仟佰拾亿仟佰拾万仟佰拾元角分"; // 对应单位
        var len = arabicNum.length; // arabicNum 的字符串长度
        var Ch1; // 数字的汉语读法
        var Ch2; // 数字位的汉字读法
        var nZero = 0; // 用来计算连续的零值的个数
        var String3; // 指定位置的数值
        if (len > 15) {
            alert("超出计算范围");
            return "";
        }
        if (arabicNum == 0) {
            chineseValue = "零元整";
            return chineseValue;
        }
        String2 = String2.substr(String2.length - len, len); // 取出对应位数的STRING2的值
        for (var i = 0; i < len; i++) {
            String3 = parseInt(arabicNum.substr(i, 1), 10); // 取出需转换的某一位的值
            if (i != (len - 3) && i != (len - 7) && i != (len - 11)
                && i != (len - 15)) {
                if (String3 == 0) {
                    Ch1 = "";
                    Ch2 = "";
                    nZero = nZero + 1;
                } else if (String3 != 0 && nZero != 0) {
                    Ch1 = "零" + String1.substr(String3, 1);
                    Ch2 = String2.substr(i, 1);
                    nZero = 0;
                } else {
                    Ch1 = String1.substr(String3, 1);
                    Ch2 = String2.substr(i, 1);
                    nZero = 0;
                }
            } else { // 该位是万亿，亿，万，元位等关键位
                if (String3 != 0 && nZero != 0) {
                    Ch1 = "零" + String1.substr(String3, 1);
                    Ch2 = String2.substr(i, 1);
                    nZero = 0;
                } else if (String3 != 0 && nZero == 0) {
                    Ch1 = String1.substr(String3, 1);
                    Ch2 = String2.substr(i, 1);
                    nZero = 0;
                } else if (String3 == 0 && nZero >= 3) {
                    Ch1 = "";
                    Ch2 = "";
                    nZero = nZero + 1;
                } else {
                    Ch1 = "";
                    Ch2 = String2.substr(i, 1);
                    nZero = nZero + 1;
                }
                if (i == (len - 11) || i == (len - 3)) { // 如果该位是亿位或元位，则必须写上
                    Ch2 = String2.substr(i, 1);
                }
            }
            chineseValue = chineseValue + Ch1 + Ch2;
        }
        if (String3 == 0) { // 最后一位（分）为0时，加上“整”
            chineseValue = chineseValue + "整";
        }
        return chineseValue;
    };
    //toFixed js默认Number类型的toFixed方法是 四舍六入，现在改为四舍五入
    var _nativeToFixed = function (origin,s) {
        var e, changeNum, index, i, j;
        // 如果值小于0，先转成正数
        if (origin < 0) {
            e = -origin;
        }
        else {
            e = origin;
        }
        changeNum = (parseInt(e * Math.pow(10, s) + 0.5) / Math.pow(10, s)).toString();
        index = changeNum.indexOf(".");
        if (index < 0 && s > 0) {
            changeNum = changeNum + ".";
            for (i = 0; i < s; i++) {
                changeNum = changeNum + "0";
            }
        } else {
            index = changeNum.length - index;
            for (j = 0; j < (s - index) + 1; j++) {
                changeNum = changeNum + "0";
            }
        }
        if (origin < 0) {
            if (Number(s) > 0) {
                return '-' + changeNum;
            }
            else {
                return -changeNum;
            }
        }
        else {
            return changeNum;
        }
    };
    return {
        arabicToChinese: function () {
            return _arabicToChinese.apply(this, arguments);
        },
        toFixed: function (origin,s) {
            return _nativeToFixed(origin,s);
        }
    }
}();
Number.prototype.toFixed = function (s) {
    var temp = moneyUtil.toFixed(this,s+4);
    return moneyUtil.toFixed(Number(temp),s);
};
//toFixed js默认Number类型的toFixed方法是 四舍六入，现在改为四舍五入
/*Number.prototype.toFixed = function (d) {
    var s = this + "";
    if (!d) d = 0;
    if (s.indexOf(".") === -1) s += ".";
    s += new Array(d + 1).join("0");
    if (new RegExp("^(-|\\+)?(\\d+(\\.\\d{0," + (d + 1) + "})?)\\d*$").test(s)) {
        s = "0" + RegExp.$2;
        var pm = RegExp.$1,
            a = RegExp.$3.length,
            b = true;
        if (a === d + 2) {
            a = s.match(/\d/g);
            if (parseInt(a[a.length - 1]) > 4) {
                for (var i = a.length - 2; i >= 0; i--) {
                    a[i] = parseInt(a[i]) + 1;
                    if (a[i] === 10) {
                        a[i] = 0;
                        b = i !== 1;
                    } else break;
                }
            }
            s = a.join("").replace(new RegExp("(\\d+)(\\d{" + d + "})\\d$"), "$1.$2");

        }
        if (b) s = s.substr(1);
        return (pm + s).replace(/\.$/, "");
    }
    return this + "";
};*/