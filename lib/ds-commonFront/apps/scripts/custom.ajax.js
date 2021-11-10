/**
 * Created with JetBrains WebStorm
 * Author：lizm
 * Date：2017/1/25
 * Time：17:05
 *
 */
var regx = /(onload|onclick|onchange|onmousedown|onmouseover|onmouseenter|onmouseouter|onmouseup|javascript:|onmouseout|onkeyup|onkeydown|onkeypress|<script|<\/script)/gi;

(function($) {
    var $_ajax = $.ajax;
    $.extend({
        _ajax : $_ajax,
        /**
         * 重写ajax方法：增加遮罩配置及异常处理
         *
         * @param options
         *            请参见jquery.ajax参数
         * @param options.url
         *            请求url
         * @param options.type
         *            请求方式:[GET\POST]
         * @param options.data
         *            发送到服务器的数据
         * @param options.dataType
         *            预期服务器返回的数据类型，默认为json
         * @param options.success
         *            请求成功时的回调函数（error=0的情况）
         * @param options.failure
         *            请求失败时的回调函数
         * @param options.timeout
         *            请求超时时间（毫秒）
         * @param options.showMask
         *            是否显示遮罩，默认为false，手动调用时需将其设置为true
         * @param options.maskMassage
         *            显示遮罩时显示的信息，默认为"数据加载中，请稍后..."
         * @param el
         *            遮罩对象（DOM id），可选，默认为document.body
         */

        dataFilter: function(data){
            if(typeof data == "string"){
                data = data.replace(regx, "").replace(/</g, "&lt;").replace(/>/g, "&gt;");
            }else if(typeof data == "object" && typeof data != "undefined" && data != null){
                for(var i in data){
                    if(data[i] instanceof Array){
                        var arry = [];
                        for(var j=0;j<data[i].length;j++){
                            arry.push(this.dataFilter(data[i][j]));
                        }
                        data[i] = arry;
                    }else{
                        data[i] = this.dataFilter(data[i]);
                    }
                }
            }
            return data;
        },
        addTimeStamp:function (url) {
            var fileType = url.split('.').pop();
            var typeArr = ['html','css','js','json','xml','txt'];
            var newUrl='';
            if($.inArray(fileType,typeArr)>-1){
                newUrl = url + '?_t=' + new Date().getTime();
            }else{
                newUrl = url;
            }
            return newUrl;
        },
        ajax : function(options, el) {
            options = $.extend({
                url : "",
                type : "POST",
                data : {},
                dataType : "json",
                success : $.noop,
                failure : $.noop,
                timeout : 1000000,
                async : false, // 默认改成同步
                showMask : false,
                headers: {},
                contentType : "application/json; charset=UTF-8", // 默认为 application/x-www-form-urlencoded
                maskMassage : "数据加载中，请稍后..." // 等待提示信息
            }, options);

            //options.url = this.addTimeStamp(options.url); // 'html','css','js','json','xml','txt' 添加时间戳

            if (!options.error) {
                options.error = $.noop;
            }

            if (options.showMask) {
                mini.mask({
                    el : el,
                    html : options.maskMassage
                });
            }

            //防止XSS攻击，对提交数据进行过滤
            //options.url = options.url.replace(regx, "").replace(/</g, "&lt;").replace(/>/g, "&gt;");
            //options.data = this.dataFilter(options.data);

            return $_ajax({
                url : options.url,
                type : options.type,
                dataType : options.dataType,
                contentType: options.contentType,
                data : options.data,
                timeout : options.timeout,
                cache : false,
                async : options.async,
                headers : options.headers,
                complete : function(req, st) {
                    if(options.complete){
                        options.complete.call(this, req, st);
                    }
                    if (options.showMask) {
                        mini.unmask(el);
                    }
                    if (st == "success" && req.status == "200") {
                        if (req.responseJSON) {// jsonp\json
                            if (req.responseJSON.success == false) {
                                if (req.responseJSON.messageCode == "SESSION_TIME_OUT") {//session超时
                                    //top.location.replace("/BsfwtWeb/apps/views/login/login.html");
                                } else {
                                    options.success.call(this, req.responseJSON);
//                                     alert(req.responseJSON.message, function() {
//                                         options.failure.call(this, req.responseJSON);
//                                     });
                                }
                            } else {//成功
                                options.success.call(this, req.responseJSON);
                            }
                        } else if(req.responseXML){
                            options.success.call(this, req.responseXML);
                        } else {//其他
                            var regx = /"success"[ ]?:[ ]?false/g;
                            if (regx.test(req.responseText)) {
                                var obj;
                                try {
                                    if (mini) {
                                        obj = mini.decode(req.responseText);
                                    } else {
                                        obj = jQuery.parseJSON(req.responseText);
                                    }
                                } catch (e) {
                                    obj = req.responseText;
                                }
                                if(obj.messageCode == "SESSION_TIME_OUT"){//session超时
                                    //top.location.replace("/BsfwtWeb/apps/views/login/login.html");
                                }else{
                                    options.error.call(this, req, st);
//                                     alert(obj.message, function() {
//                                         options.failure.call(this, req.responseText);
//                                     });
                                }
                                delete obj;
                            } else {
                                if(options.dataType == "json") {//兼容低版本jquery
                                    obj = jQuery.parseJSON(req.responseText);
                                    options.success.call(this, obj);
                                }else if(options.dataType == "xml"){
                                    obj = jQuery.parseXML(req.responseText);
                                    options.success.call(this, obj);
                                }else{
                                    options.success.call(this, req.responseText);
                                }
                            }
                        }
                    }else if(st == "error"){
                        options.error.call(this, req, st);
                    }
                }
            });
        }

    });
})(jQuery)

;(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory();
    } else {
        // Browser globals (root is window)
        root.ajax = factory();
    }
}(this, function () {
    var ajax={};
    var errorMap = {
        '404': '错误：404，服务未找到',
        '500': '错误：500，服务出错',
        '502': '系统出现异常，请联系运维人员或稍后重试！',
        '900': '错误：900，session超时',
        'timeout': '错误：timeout，连接超时',
        'parsererror': '错误：parsererror，发送数据异常'
    };
    function executeAjax(async,method, url, params, successCallback, errCallback) {

        if(!errCallback){
            // 默认的ajax error 回调函数
            errCallback=function (req, st) {
                var msg = getLocalMessage(req, st);
                mini.alert(msg);
                return false;
            }
        }
        
        $.ajax({
            type: method,
            url: url,
            data: params,
            async:async,
            success: function(res) {

                if(res.message==='ajaxSessionTimeOut'){
                    top.location.reload(true);
                    return;
                }
                ajax.response = res;
                successCallback(res);

            },
            error: function(req,st) {
                if(!req.message){
                    req.message = getLocalMessage(req,st) || '服务异常！';
                }
                errCallback(req,st);
            }
        });
    }
    function getLocalMessage(req, st) {
        var localMsg = "";
        if(st === 'error'){
            localMsg = errorMap[req.status];
        }else if( ['timeout','parsererror'].indexOf(st) !== -1 ){
            localMsg = errorMap[st];
        }
        return localMsg;
    }
    // 同步请求
    ajax.get=function (url, params, successCallback, errCallback) {

        executeAjax(false,'get',url, params, successCallback, errCallback);
    };

    ajax.post=function (url, params, successCallback, errCallback) {

        executeAjax(false,'post',url, params, successCallback, errCallback);
    };

     // 异步请求
    ajax.asyncGet=function (url, params, successCallback, errCallback) {

        executeAjax(true,'get',url, params, successCallback, errCallback);
    };

    ajax.asyncPost=function (url, params, successCallback, errCallback) {

        executeAjax(true,'post',url, params, successCallback, errCallback);
    };

    return ajax;

}));

