# 背景

针对纳税人的“电子办税服务厅”这类WEB产品，基本都是以河北网厅产品为基础进行修改的，但可复用性提炼不够，无论是前端还是后端成果，由于时间紧急，再加上或多或少有一些差异化需求，都是复制代码后按新工程进行修改，后续就变成两个不同的产品分别维护。最终导致各地开发，虽然需求基本类似，但各地都要在现有产品中做一遍，造成了资源的浪费以及后续维护成本增高，同时产品本身的工程和代码很庞大、复杂。为了提高前后端的开发效率、代码的复用性、协调一致性，故制定此common-front工程，便于后续的开发复用维护

## Usage

You can see 源码 at: components/.. and scripts/... js合并打包后的文件在 build/...，
ps：开发直接引入common-front.js即可,上线生产后用压缩版common-front.min.js

### api:

#### Tools工具类
attribute：
* **browser.ie** : ie版本.
* **browser.chrome** : chrome版本.
* **browser.Firefox** : firfox版本.
* **browser.safari** : safari版本.
* **os.android** : 此值为对应的android版本号，否则为undefined.
* **os.ios** : 此值为对应的ios版本号，否则为undefined.


functions:

* **isSupportTransition** : 是否支持css3@return {Boolean}.
* **isIE** : 是否是ie浏览器@return {Boolean}.
* **flashVersion** : 检测flash版本.
* **isSupportBase64** : 判断浏览器是否支持图片base64@return {Boolean}.
* **trim** : 去除前后空格.
* **extend** : 对象扩展或继承@return {Object}.
* **getUrlParamByName** : 通过名称获取url中的参数@return {String}.

Here is single example:

```html
<!DOCTYPE html>
<html>

<head>
  <meta charset="utf-8">
  <title>Tools</title>
</head>

<body>
  <script src="./Tools.js"></script>
  <script type="text/javascript">
  if (Tools.isIE() && Tools.browser.ie <= 8){
    alert("该浏览器是IE8以下浏览器");
  }else{
    alert("不是ie浏览器");
  }
  </script>
</body>

</html>
```

```javascript
//调用实例Tools的方法 e.g
Tools.isIE();
```

#### Validator: 校验类（all return boolean）
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


#### VerificationCode: 图形、短信验证码组件
Here is more detailed example:

```html
<!DOCTYPE html>
<html lang="en">

<head>
	<meta charset="UTF-8">
	<title>短信、图形验证码组件demo</title>
</head>

<body>
	<h3>验证码组件</h3>
	<div id="verificationCode-image"></div>

	<div id="verificationCode-message"></div>
	<script src="http://cdn.bootcss.com/require.js/2.1.10/require.min.js" data-main="./main"></script>
  <!-- 不用requirejs则直接引入 -->
  <!-- <script src="http://cdn.bootcss.com/reqwest/2.0.1/reqwest.min.js"></script>
	<script src="./VerificationCode.js"></script>
	<script src="./main.js"></script> -->
  <script type="text/javascript">
  require(['./dist/js/VerificationCode.min'], function(VerificationCode) {
    // console.log(VerificationCode);
    VerificationCode.get("verificationCode-image", {
      api: "/api/..."//图形验证码api 不传用默认值
    });

    VerificationCode.get("verificationCode-message", {
      //e.g.
      countTime: 5, //倒计时
      telNum: "", //电话号码
      api: "api/message/.." //发送短信api 不传用默认值
    });
  });
  </script>
</body>

</html>
```
### api Options:

the first params is DOM id.the second params is object,the full list of available options is the following:

* **api** (string): 后端请求api.
* **countTime** (number): 倒计时秒数.
* **telNum** (string): 用户输入的电话号码.

```javascript
VerificationCode.get("verificationCode-image", {
  api: "/api/..."
});

VerificationCode.get("verificationCode-message", {
  //e.g.
  countTime: 5,
  telNum: "",
  api: "api/message/.."
});
```

#### miniUI校验: 扩展vtype，基于Validator类
自定义扩展vtype
* **telephone** (string): 固定电话.
* **int_14_digit_2** (number):14位整数，两位小数金额.
* **specialChar** (string): 非特殊字符.
* **int_14_digit_2** (number):14位整数，两位小数金额.
* **numeric** (string): 数字.
* **double12** (string): 最大12位整数，4位小数金额.
* **yzbm** (number):邮政编码.
* **zjhm** (string): 证件号码(证件号码不同于身份证号码)，数字、字母或-，长度为20位.
* **sfzjhm** (string): 身份证号码.
* **zzjgdm** (number):组织机构代码必须为9位数字字母，字母为半角大写.
* **username** (string): 用户名（8-16位字符(字母、数字或字母数字组合)）.
* **englishAndNum32** (string): 8-32位英文和数字.
* **mobilePhone** (string): 手机号码.
* **nsrsbh** (number):纳税人识别号.
* **isChinese42** (string): 少于42个汉字.



store 公共类
--------------------------------------
用于管理浏览器端（客户端）数据存储，基于 [WebStorage API](http://www.w3.org/TR/webstorage/)

基本方法
--------------------------------------
一、localStorage API 本地持久化存储 需要手动删除
```js
// 存储 key 和 value
store.setLocal('Key', 'value')

// 获取 'Key' 对应的 value
store.getLocal('Key')

// 删除 'Key' 和 对应的 value
store.removeLocal('Key')

// 清除所有的 'key'
store.clearLocal()

// 是否有某一个 'key'
store.hasLocal('key')

// 支持存储 json 对象
store.setLocal('user', { name: 'value', likes: 'javascript' })

// 获取 json 对象
var user = store.getLocal('user')
alert(user.name + ' likes ' + user.likes)

// 获取所有的localStorage中的 key 和 value
store.getAllLocal().user.name == 'value'

// each 方法
store.eachLocal(function(key, val) {
	console.log('key', '==', val)
})
```

二、sessionStorage API 会话存储 窗口关闭即删除
```js
// 存储 key 和 value
store.setSession('Key', 'value')

// 获取 'Key' 对应的 value
store.getSession('Key')

// 删除 'Key' 和 对应的 value
store.removeSession('Key')

// 清除所有的 'key'
store.clearSession()

// 是否有某一个 'key'
store.hasSession('key')

// 支持存储 json 对象
store.setSession('user', { name: 'value', likes: 'javascript' })

// 获取 json 对象
var user = store.getSession('user')
alert(user.name + ' likes ' + user.likes)

// 获取所有的localStorage中的 key 和 value
store.getAllSession().user.name == 'value'

// each 方法
store.eachSession(function(key, val) {
	console.log('key', '==', val)
})
````

三、Cookie API  基于 [jquery.cookie.js](https://github.com/js-cookie/js-cookie)
```js
// 设置cookie ,key 和 value 必选，过期时间和路劲可选
store.setCookie('Key', 'value','days', 'path')

// 获取 cookie
store.getCookie('Key')

// 删除 cookie , 如果设置cookie时有path参数，删除时必须也要有同样的path参数
store.removeCookie('Key')

// 获取所有的cookie key 和 value
store.getAllCookie()

// 是否存在
store.hasCookie('key')
````

安装和使用
--------------------------------------
````
bower install store --save -dev
````
引入store.min.js 即可，建议先检测是否支持store方法：
````
<script src="store.min.js"></script>
<script>
    init()
    function init() {
        if (!store.enabled) {
            alert('您的浏览器不支持localStorage，请检查是否禁用了本地存储或者开启了隐身模式，建议升级您的浏览器版本')
            return
        }
        var user = store.get('user')
        // ... and so on ...
    }
</script>
````

兼容性说明
--------------------------------------

- 支持 Firefox
- 支持 Chrome
- 支持 IE （IE6+）
- 支持 Safari
- 支持 Opera

- 说明：IE6 & IE7 最大存储为 1MB 每一个 'path' 或 'document' 128 KB
见： http://msdn.microsoft.com/en-us/library/ms531424(v=vs.85).aspx
     http://dev-test.nemikor.com/web-storage/support-test/

ajax 公共类
--------------------------------------
封装了ajax.get 和 ajax.post 方法
````js
ajax.get(url, params, successCallback, errCallback);

ajax.post(url, params, successCallback, errCallback);
````
**参数说明**

**url**：即 ajax 请求中的 url

**params**：即 ajax 请求中的 data

**successCallback**：即 ajax 请求中的 success 回调函数

**errCallback**：即 ajax 请求中的 error 回调函数

nsrxxUtil 公共类
--------------------------------------
对纳税人信息操作的公共方法，后续仍需完善。

目前仅一个方法：nsrxxUtil.getNsrxxVO = function(url){}，如果没有指定的获取纳税人基本信息的接口，则参数 url 可以省略，
即使用默认接口： /login/login_getNsrxxVo.do? ，该接口为深圳项目的接口，请注意！

miniui 的定制
--------------------------------------

**1.校验属性 vtype 的扩展**

````js
// 自定义vtype:固定电话
vtype = "telephone"
telephoneErrorText = "请输入数字和“-”"

// 自定义vtype:14位整数，两位小数金额
vtype = "int_14_digit_2"
int_14_digit_2ErrorText = "请输入最大14位整数2位小数"


// 自定义vtype:10位整数
vtype = "int_10"
int_10ErrorText = "请输入不大于9,999,999,999的数！"

// 自定义vtype:非特殊字符,如果为null 不再校验，如果想检验不能为空，请加上 required="true"
vtype = "specialChar"
specialCharErrorText = "不能输入特殊字符"

// 自定义vtype:如果不为空再开始校验是否为float
vtype = "numeric"
numericErrorText = "请输入数字"

// 自定义vtype:12位整数，4位小数金额
vtype = "double12"
double12ErrorText = "请输入最大12位整数4位小数"

// 自定义vtype:邮政编码*/
vtype = "yzbm"
yzbmErrorText = "请输入0～9数字，长度为6位"

// 自定义vtype:证件号码(证件号码不同于身份证号码)
vtype = "zjhm"
zjhmErrorText = "请输入数字、字母或-，长度为20位"

// 自定义vtype:身份证件号码
vtype = "sfzjhm"
sfzjhmErrorText = "请输入正确的身份证号码。"

// 自定义vtype:组织机构代码
vtype = "zzjgdm"
zzjgdmErrorText = "组织机构代码必须为9位数字字母，字母为半角大写。"

// 自定义vtype: 用户名
vtype = "username"
usernameErrorText = "请输入8-16位字符(字母、数字组合)"

/*自定义vtype: 8-32位英文和数字*/
vtype = "englishAndNum32"
englishAndNum32ErrorText = "请输入8-32位字符(字母、数字组合)区分大小写"

// 自定义vtype:两次密码输入
vtype = "rePassword"
rePasswordErrorText = "两次密码输入不一致"

// 自定义vtype:手机号码(1+[3-8]+任意9位数)
vtype = "mobilePhone"
mobilePhoneErrorText = "请输入11位数字的手机号码"

// 自定义vtype:纳税人识别号
vtype = "nsrsbh"
nsrsbhErrorText = "请输入正确的纳税人识别号"

// 自定义vtype：42位以内的字符且必须都是汉字
vtype = "isChinese42"
isChinese42ErrorText = "请输入少于42个汉字"

````

**2.mini Form 增加getDataAndText方法**
用法：
````js
// 通过 id 指定，注意要加 # 号，且 id 为 form1 标签内的所有需要获取的字段
// 都必须为 miniui 的控件才能获取到值，字段的名称使用 name 属性来指定

var form = new mini.Form('#form1');

````
````html
<div id="form1">
    <!--同时添加 name 和 id 方便使用 mini.get('userName') 来获取某个指定字段的值-->
    <input class="mini-textbox" name="userName" id="userName"/>
</div>

````

Date 日期类定制化（prototype）
--------------------------------------
```js

var date = new Date('2011-11-11');

/*
* 日期格式化
* @param Date date,String formatStr
* @returns String
* */

/*
 * 支持的格式有以下这些
 * 'yyyy/M/d'
 * 'yyyy/M/d hh:mm'
 * 'yyyy/M/d hh:mm:ss'
 * 'yyyy/MM/dd'
 * 'yyyy/MM/dd hh:mm'
 * 'yyyy/MM/dd hh:mm:ss'
 * 'yyyy-M-d'
 * 'yyyy-M-d hh:mm'
 * 'yyyy-M-d hh:mm:ss'
 * 'yyyy-MM-dd'
 * 'yyyy-MM-dd hh:mm'
 * 'yyyy-MM-dd hh:mm:ss'
 * 'yyyy.M.d'
 * 'yyyy.M.d hh:mm'
 * 'yyyy.M.d hh:mm:ss'
 *
 */

var formatStr = 'yyyy/M/d';
var newDate = date.format(formatStr);


/*
* 获取当月第一天
* @param [formatStr]
* reutrn Date/String
* */

var firstDay = date.getFirstDateOfMonth(formatStr);

/*
 * 获取当月最后一天
 * @param [formatStr]
 * reutrn Date/String
 * */

var lastDay = date.getLastDateOfMonth(formatStr);

/*
 * 获取下个月的第一天
 * @param [formatStr]
 * reutrn Date/String
 * */

var firstDay_next = date.getFirstDateOfNextMonth(formatStr);

/*
 * 获取下个月的最后一天
 * @param [formatStr]
 * reutrn Date/String
 * */

var lastDay_next = date.getLastDateOfNextMonth(formatStr); //还有问题

/*
 * 获取上个月的第一天
 * @param [formatStr]
 * reutrn Date/String
 * */

var firstDay_prev = date.getFirstDateOfPrevMonth(formatStr);

/*
 * 获取上个月的最后一天
 * @param [formatStr]
 * reutrn Date/String
 * */

var lastDay_prev = date.getLastDateOfPrevMonth(formatStr);//还有问题

/*
 * 获取本年第一季度的起止日期
 * @param [formatStr]
 * reutrn Array
 * */

var dateArr1 = date.getDatesOfFirstSeason(formatStr);

/*
 * 获取本年第二季度的起止日期
 * @param [formatStr]
 * reutrn Array
 * */

var dateArr2 = date.getDatesOfSecondSeason(formatStr);

/*
 * 获取本年第三季度的起止日期
 * @param [formatStr]
 * reutrn Array
 * */

var dateArr3 = date.getDatesOfThirdSeason(formatStr);

/*
 * 获取本年第四季度的起止日期
 * @param [formatStr]
 * reutrn Array
 * */

var dateArr4 = date.getDatesOfForthSeason(formatStr);

/*
* 日期比较-早于
* @param Int/String/Date date
* return boolean
* */

var flag = date.earlierThan(dateObj);

/*
 * 日期比较-晚于
 * @param Int/String/Date date
 * @return boolean
 * */

flag = date.laterThan(dateObj);

/*
* 获取本地时间
* @return Date
* */

// 格式化成指定格式

var localDate = Date.getLocalDate(formatStr);

// 不格式化

localDate = Date.localDate;

/*
 * 获取服务器时间,接口待定
 * @return Date
 * */

// 格式化成指定格式

var serverDate = Date.getServerDate(formatStr,url);

// 不格式化

serverDate = Date.serverDate;

```
