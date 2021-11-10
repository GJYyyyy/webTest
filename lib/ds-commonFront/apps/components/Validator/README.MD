# Validator: 校验类

一些常用的正则校验

## Usage

### api Functions(all return boolean):

the param is value you need,the full list of available functions are the following:

* **isNumeric** : 正整数.
* **isInteger** : 整型（负整数和正整数）.
* **isEmail** : 邮箱.
* **isDecimal** : 浮点型(整数和小数).
* **isAlpha** : 字母.
* **isAlphaNumeric** : 字母、数字或者数字字母组合.
* **isAlphaDash** : 可以含有下划线的字母、数字或者数字字母组合.
* **isNatural** : 自然数.
* **isChinese** : 中文.
* **isPhoneNum** : 手机号码.
* **isTelNum** : 固定电话.
* **isSfzhm** : 身份证号码.
* **isNoSpecialChar** : 不能含有特殊字符.
* **isOrganizationCode** : 税务机关代码（必须为9位数字字母，字母为半角大写）.
* **isUserName** : 用户名（8到16位 数字、字母或字母数字组合）.
* **isNsrsbh** : 纳税人识别号（15位到20位 数字或字母）.
* **isMoney** : 金额（最大14位整数，最多两位小数金额）.
* **isUrl** : url.
* **isYzbm** : 邮政编码.
* **isZjhm** : 证件号码(证件号码不同于身份证号码).
* **isPwd** : 密码(密码需要8位以上，数字和英文组合，可以含有下划线).
* **isAlphaAndNum** : 数字和字母组合.

```javascript
var validator = new Validator();
//调用实例validator的方法，e.g validator.isPhoneNum(value)
```
