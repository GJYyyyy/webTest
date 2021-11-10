
store.js
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
