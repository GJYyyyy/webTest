/**
 *@Name：Validator
 *@description:js校验通用类
 *@author：zhouqy
 *@create：2017-01-12
 */
! function(win) {
  var defaults = {
    messages: {
      required: '%s 不能为空',
    },
    callback: function(errors) {

    }
  };
  /*
   * Define the regular expressions
   */
  var numericReg = /^[0-9]+$/, //正整数
    integerReg = /^\-?[0-9]+$/, //整型（负整数和正整数）
    decimalReg = /^\-?[0-9]*\.?[0-9]+$/, //浮点型(整数和小数)
    userNameReg = /^[a-zA-Z0-9]{8,16}$/, //8到16位 数字、字母或字母数字组合
    nsrsbhReg = /^[a-zA-Z0-9\-]{15,20}$/, //15位到20位数字或字母（纳税人识别号）
    yzbm = /^[0-9]{6}$/, //邮政编码
    zjhm = /^([0-9A-Za-z]|[-]){0,20}$/,
    organizationCodeReg = /^[A-Z0-9]{9}$/, //组织机构代码（必须为9位数字字母，字母为半角大写）
    moneyReg = /^(([-]?[0-9]{1,14}[.]{1}[0-9]{1,2})$|([-]?[0-9]{1,14})$)/, //最大14位整数，最多两位小数金额
    emailReg =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/, //邮箱
    alphaReg = /^[a-z]+$/i, //字母
    alphaNumericReg = /^[a-z0-9]+$/i, //字母、数字或者数字字母组合
    alphaDashReg = /^[a-z0-9_\-]+$/i, //可以含有下划线的字母、数字或者数字字母组合
    naturalReg = /^[0-9]+$/i, //自然数
    chineseReg = /^[\u4e00-\u9fa5]+$/, //中文字符
    //phoneNumReg = /^1[34578]\d{9}$/, //手机号码
    phoneNumReg = /^1[3456789]\d{9}$/,
    telNumReg = /^(0\d{2,3}-){0,1}\d{7,8}$/, //固定电话
    sfzhmReg =
    /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/, //身份证号码
    noSpecialChar = /^[\u4e00-\u9fa5a-zA-Z0-9_\(\)$#@!\-]+$/, //不允许特殊字符
    alphaAndNumReg = /^(?=.*?[a-zA-Z])(?=.*?[0-9])[a-zA-Z0-9]/, //数字和字母组合
    urlReg =
    /^((http|https):\/\/(\w+:{0,1}\w*@)?(\S+)|)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/, //url
    pwdReg =
    /(?:\d.*_)|(?:_.*\d)|(?:[A-Za-z].*_)|(?:_.*[A-Za-z])|(?:[A-Za-z].*\d)|(?:\d.*[A-Za-z])/;
  var _extend, _isObject;
  //校验位的检测
  var checkParity = function(card) {
    //15位转18位
    card = changeFivteenToEighteen(card);
    var len = card.length;
    if (len == '18') {
      var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4,
        2);
      var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3',
        '2');
      var cardTemp = 0,
        i, valnum;
      for (i = 0; i < 17; i++) {
        cardTemp += card.substr(i, 1) * arrInt[i];
      }
      valnum = arrCh[cardTemp % 11];
      if (valnum == card.substr(17, 1)) {
        return true;
      }
      return false;
    }
    return false;
  };

  // 15位转18位身份证号
  var changeFivteenToEighteen = function(card) {
    if (card.length == '15') {
      var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8,
        4, 2);
      var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3',
        '2');
      var cardTemp = 0,
        i;
      card = card.substr(0, 6) + '19' + card.substr(6, card.length - 6);
      for (i = 0; i < 17; i++) {
        cardTemp += card.substr(i, 1) * arrInt[i];
      }
      card += arrCh[cardTemp % 11];
      return card;
    }
    return card;
  };

  // 检查号码是否符合规范，包括长度，类型
  var isCardNo = function(card) {
    // 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
    var reg = /(^\d{15}$)|(^\d{17}(\d|X)$)/;
    if (reg.test(card) === false) {
      return false;
    }
    return true;
  };

  _isObject = function(o) {
    return Object.prototype.toString.call(o) === '[object Object]';
  };

  _extend = function(destination, source) {
    var property;
    for (property in destination) {
      if (destination.hasOwnProperty(property)) {
        // 若destination[property]和sourc[property]都是对象，则递归调用
        if (_isObject(destination[property]) && _isObject(source[property])) {
          arguments.callee(destination[property], source[property]);
        }
        // 若sourc[property]已存在，则跳过
        if (source.hasOwnProperty(property)) {
          continue;
        } else {
          source[property] = destination[property];
        }
      }
    }
  };
  //Validator 校验类
  function Validator() {}
  Validator.prototype = {
    //正整数
    isNumeric: function(val) {
      if (numericReg.test(val)) return true;
      return false;
    },
    //整型（负整数和正整数）
    isInteger: function(val) {
      if (integerReg.test(val)) return true;
      return false;
    },
    //邮政编码
    isYzbm: function(val) {
      if (yzbm.test(val)) return true;
      return false;
    },
    //证件号码(证件号码不同于身份证号码)
    isZjhm: function(val) {
      if (zjhm.test(val)) return true;
      return false;
    },
    //浮点型(整数和小数)
    isDecimal: function(val) {
      if (decimalReg.test(val)) return true;
      return false;
    },
    //最大14位整数，最多两位小数金额
    isMoney: function(val) {
      if (moneyReg.test(val)) return true;
      return false;
    },
    //邮箱
    isEmail: function(val) {
      if (emailReg.test(val)) return true;
      return false;
    },
    //字母
    isAlpha: function(val) {
      if (alphaReg.test(val)) return true;
      return false;
    },
    //字母、数字或者数字字母组合
    isAlphaNumeric: function(val) {
      if (alphaNumericReg.test(val)) return true;
      return false;
    },
    //可以含有下划线的字母、数字或者数字字母组合
    isAlphaDash: function(val) {
      if (alphaDashReg.test(val)) return true;
      return false;
    },
    //自然数
    isNatural: function(val) {
      if (naturalReg.test(val)) return true;
      return false;
    },
    //中文
    isChinese: function(val) {
      if (chineseReg.test(val)) return true;
      return false;
    },
    //手机号码
    isPhoneNum: function(val) {
      if (phoneNumReg.test(val)) return true;
      return false;
    },
    //固定电话
    isTelNum: function(val) {
      if (telNumReg.test(val)) return true;
      return false;
    },
    //身份证号码
    isSfzhm: function(val) {
      //检验位的检测
      if (!checkParity(val)) {
        return false;
      }
      //校验长度，类型
      if (!isCardNo(val)) {
        return false;
      }
      return true;
    },
    //特殊字符
    isNoSpecialChar: function(val) {
      if (noSpecialChar.test(val)) return true;
      return false;
    },
    //url
    isUrl: function(val) {
      if (urlReg.test(val)) return true;
      return false;
    },
    //组织机构代码，必须为9位数字字母，字母为半角大写
    isOrganizationCode: function(val) {
      if (organizationCodeReg.test(val)) return true;
      return false;
    },
    //8到16位 数字、字母或字母数字组合
    isUserName: function(val) {
      if (userNameReg.test(val)) return true;
      return false;
    },
    //密码需要8位以上，数字和英文组合，可以含有下划线
    isPwd: function(val) {
      if (pwdReg.test(val) && val.length > 7 && val.length<=16) return true;
      return false;
    },
    //数字和字母组合
    isAlphaAndNum: function(val) {
      if (alphaAndNumReg.test(val)) return true;
      return false;
    },
    //纳税人识别号(15位到20位 数字或字母)
    isNsrsbh: function(val) {
      if (nsrsbhReg.test(val)) return true;
      return false;
    }

  };
  typeof define === 'function' && define.amd ? define(function() { //requirejs加载
    return Validator;
  }) : function() { //普通script标签加载
    window.Validator = Validator;
  }();
}(window);
