/**
 * Created with JetBrains WebStorm
 * Author：lizm
 * Date：2017/1/25
 * Time：18:03
 *
 */
/**
 * Created with JetBrains WebStorm
 * Author：lizm
 * Date：2016/11/30
 * Time：17:05
 *
 */

/*前置条件，检查是否有资格做相关备案和申请*/


window.gldUtil = function () {

    var wssq = {};

    wssq.currentSwsxDm = null;

    // 纳税人基本信息
    wssq.nsrjbxx = null;

    /**
     * 抛出错误
     * @param message
     */
    function throwError(message) {
        if (arguments.length > 1) {
            message = message.format(Array.prototype.slice.call(arguments, 1));
        }
        throw new Error(message);
    }
    /**
     *  加载 js
     * @param htmlUrl
     */
    wssq.loadScript = function (url) {
        var script = document.createElement("script"),
            body = document.getElementsByTagName('body')[0];

        script.src = url.indexOf('.html') !== -1 ? url.replace('.html', '.js') : url;
        body.appendChild(script);
    };
    /**
     * 在 <head> 中加载js
     * @param url
     */
    wssq.loadHeadScript = function (url) {
        var script = document.createElement("script"),
            head = document.getElementsByTagName('head')[0];

        script.src = url.indexOf('.html') !== -1 ? url.replace('.html', '.js') : url;
        head.appendChild(script);
    };
    /**
     * 加载 css
     */
    wssq.loadCss = function (url) {
        var link = document.createElement("link"),
            head = document.getElementsByTagName('head')[0];

        link.href = url;
        link.rel = "stylesheet";
        head.appendChild(link);
    };
    /**
     * 创建 <meta>
     * @param propObj 属性
     * @returns {Element}
     */
    wssq.createMeta = function (propObj) {
        var meta = document.createElement("meta");
        for (var prop in propObj) {
            meta[prop] = propObj[prop];
        }
        return meta;
    };

    /**
     *  加载模版
     * @param url
     * @param Data
     * @returns {string}
     */
    wssq.loadTemplate = function (url, Data) {
        var html = '';
        $.ajax({
            url: url,
            type: 'GET',
            async: false,
            dataType: 'html',
            success: function (data, textStatus) {
                if (!!Data) {
                    try {
                        var reg = /(?:\{\{)(\w[\.\w]*)(?:\}\})/g; // 匹配 {{ data.param }}
                        data = data.replace(reg, function (_, item) {
                            return eval("Data." + item);
                        });
                    } catch (e) {
                        // TODO
                    }
                }
                html = data;
                //wssq.loadScript(url);
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                console.log('加载html出错');
            }
        });
        return html;
    };

    /**
     * mini show tips
     * @param title
     * @param content
     * @param type
     * @param time
     */
    wssq.showTips = function (title, content, type, time) {
        var _time = 3000;
        if (!!time) {
            _time = time;
        }
        mini.showTips({
            content: "<b>" + title + "</b><br/>" + content,
            state: type,
            x: 'center',
            y: 'top',
            offset: [0, 58],
            timeout: _time
        })
    };

    /**
     * 设置miniui控件的提示
     * @param id 控件id
     * @param text 显示的内容
     * @param position 显示的位置
     * @param width 宽度
     * @param targetEl 容器el
     */
    wssq.setMiniToolTip = function (id, text, cfg) {
        cfg = cfg || {};
        var dfCfg = {
            len: 20, // 内容超过20个字才会设置tooltip
            position: 'top',
            width: 350,
            targetEl: document
        };
        var _cfg = $.extend({}, dfCfg, cfg);
        // 长度小于20 ，可以完全显示
        if (text.length < _cfg.length) {
            return;
        }
        $('#' + id).find('input:eq(0)').attr({
            'data-tooltip': '<div style="width:' + _cfg.width + 'px">' + text + '</div>',
            'data-placement': _cfg.position
        });
        var tip = new mini.ToolTip();
        tip.set({
            target: _cfg.targetEl,
            selector: '[data-tooltip]'
        });
    };


    wssq.autoInclude = function () {
        var title = document.getElementsByTagName('title')[0];
        var metas = '<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">' +
            '<meta http-equiv="content-type" content="text/html; charset=UTF-8"/>' +
            '<meta name="renderer" content="webkit">' +
            '<meta name="description" content=' + title.innerText + '>' +
            '<meta name="keywords" content="河北省,国家税务局,云厅,云办税厅,网厅,网上办税服务厅,' + title.innerText + '">' +
            '<meta name="viewport" content="width=device-width, initial-scale=1">';
        $(title).before(metas);
        if (isIE8 || isIE9) {
            wssq.loadCss('../../../apps/styles/ie-fix.css'),
                // 在 head 内加载 scripts
                wssq.loadHeadScript('../../../lib/html5shiv/html5shiv.min.js'),
                wssq.loadHeadScript('../../../lib/respond/respond.min.js');
        }

        return 'autoInclude css and js successfully';
    }();

    wssq.getParamFromUrl = function () {
        var hrefs = window.location.href.split("?");
        if (hrefs.length <= 1) {
            return null;
        }
        var result = {};
        var params = hrefs[1].split("&");

        for (var i = 0; i < params.length; i++) {
            var param = params[i].split("=");
            if (param.length <= 1) {
                continue;
            }
            result[param[0].trim()] = param[1].trim();
        }
        return result;
    };

    //添加水印
    wssq.addWaterInPages = function () {

      //  wssq.loadHeadScript('/dzgzpt-wsys/dzgzpt-wsys/apps/scripts/efg_water.js');

        var swryInfo = sessionStorage.getItem('waterUserInfo') ? JSON.parse(sessionStorage.getItem('waterUserInfo')) : {};

        jQuery.ajax({
            url: '/burial/water.json',
            type: "get",
            success: function (result) {
                SyWater.init(Object.assign({}, result, {text: swryInfo.name + '-' + swryInfo.id }))
            }
        })

        // var region = sessionStorage.getItem('evnVersion') ? JSON.parse(sessionStorage.getItem('evnVersion')) : false;
        // var op = {
        //     show: true, //是否开启水印,
        //     region: region && region.type === "生成环境" ?  false : region.type + region.version,
        //     text: swryInfo.name + ' - ' + swryInfo.id,
        //     noTime: false,
        //     x: 20,
        //     y: 20,
        //     rows: 0,
        //     cols: 0,
        //     x_space: 80,
        //     y_space: 80,
        //     font: '微软雅黑',
        //     color: 'black',
        //     fontsize: '16px',
        //     alpha: 0.15,
        //     width: 200, 
        //     height: 80,
        //     angle: 345
        // }

        // SyWater.init(op)
    }

    return wssq;
}();


(function ($) {
    var $_ajax = $.ajax;
    $.extend({
        _ajax: $_ajax,
        ajax: function (options, el) {
            options = $.extend({
                url: "",
                type: "POST",
                data: {},
                dataType: "json",
                success: $.noop,
                failure: $.noop,
                timeout: 1000000,
                async: false, // 默认改成同步
                showMask: false,
                headers: {},
                contentType: "application/x-www-form-urlencoded;charset=utf-8", // 默认为
                maskMassage: "数据加载中，请稍后..." // 等待提示信息
            }, options);

            if (!options.error) {
                options.error = $.noop;
            }

            if (options.showMask) {
                mini.mask({
                    el: el,
                    html: options.maskMassage
                });
            }

            //防止XSS攻击，对提交数据进行过滤
            //options.url = options.url.replace(regx, "").replace(/</g, "&lt;").replace(/>/g, "&gt;");
            //options.data = this.dataFilter(options.data);

            return $_ajax({
                url: options.url,
                type: options.type,
                dataType: options.dataType,
                contentType: options.contentType,
                data: options.data,
                timeout: options.timeout,
                cache: false,
                async: options.async,
                headers: options.headers,
                complete: function (req, st) {
                    var res = req.responseText;
                    try {
                        var jsonResult = JSON.parse(res);
                        if (!jsonResult.success && jsonResult.message === 'ajaxSessionTimeOut') {
                            mini.alert('由于您长时间未操作，登录信息已失效，请重新登录', '提示', function () {
                                if (jsonResult.value) {
                                    top.location.href = jsonResult.value;
                                }
                            });
                        }
                    } catch (e) {}
                    if (options.complete) {
                        options.complete.call(this, req, st);
                    }
                    if (options.showMask) {
                        mini.unmask(el);
                    }
                    if (st == "success" && req.status == "200") {
                        if (req.responseJSON) { // jsonp\json
                            if (req.responseJSON.success == false) {
                                if (req.responseJSON.messageCode == "SESSION_TIME_OUT") { //session超时
                                    //top.location.replace("/BsfwtWeb/apps/views/login/login.html");
                                } else {
                                    options.success.call(this, req.responseJSON);
                                    //                                     alert(req.responseJSON.message, function() {
                                    //                                         options.failure.call(this, req.responseJSON);
                                    //                                     });
                                }
                            } else { //成功
                                options.success.call(this, req.responseJSON);
                            }
                        } else if (req.responseXML) {
                            options.success.call(this, req.responseXML);
                        } else { //其他
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
                                if (obj.messageCode == "SESSION_TIME_OUT") { //session超时
                                    //top.location.replace("/BsfwtWeb/apps/views/login/login.html");
                                } else {
                                    options.error.call(this, req, st);
                                    //                                     alert(obj.message, function() {
                                    //                                         options.failure.call(this, req.responseText);
                                    //                                     });
                                }
                                delete obj;
                            } else {
                                if (options.dataType == "json") { //兼容低版本jquery
                                    obj = jQuery.parseJSON(req.responseText);
                                    options.success.call(this, obj);
                                } else if (options.dataType == "xml") {
                                    obj = jQuery.parseXML(req.responseText);
                                    options.success.call(this, obj);
                                } else {
                                    options.success.call(this, req.responseText);
                                }
                            }
                        }
                    }
                }
            });
        }

    });
})(jQuery);

$(function () {
    mini.alert = function (msg, title, callback) {
        //top.alert(msg, callback, title);
        window.alert(msg, callback, title);
        // document.body.scrollTop = 0;
    }
});

/**
 * 文书预审办理状态代码常量
 * @type {{BLZT_DSL: string, BLZT_SLTG: string, BLZT_SLBTG: string, BLZT_DSP: string, BLZT_SPTG: string, BLZT_SPBTG: string, BLZT_BZZL: string, BLZT_DJS: string, BLZT_DSZRD: string, BLZT_SZRDBJ: string, BLZT_YBCDKP: string, BLZT_PPDK_YJSWJ: string, BLZT_PPDK_MSDKWJ: string}}
 */
var WSYS_BLZT_DM = {
    /** 待受理 */
    BLZT_DSL: "00",
    /** 受理通过 */
    BLZT_SLTG: "01",
    /** 不予受理 */
    BLZT_SLBTG: "02",
    /** 待审批 */
    BLZT_DSP: "03",
    /** 审批通过 */
    BLZT_SPTG: "04",
    /** 审批不通过 */
    BLZT_SPBTG: "05",
    /** 补正资料 */
    BLZT_BZZL: "06",
    /** 已补正 */
    BLZT_YBZ: "07",
    /** 受理中 */
    BLZT_SLZ: "10",
    /** 已撤销 */
    BLZT_YCX: "11",
    /** 待确认 */
    BLZT_DQR: "12",
    /** 受理通过未缴邮费 */
    BLZT_PPDK_YJSWJ: "30",
    /** 受理通过已缴邮费 */
    BLZT_PPDK_MSDKWJ: "31",
    /** 邮件已寄出 */
    BLZT_PPDK_YJSWJ: "32"
};
/**
 * 文书预审受理审核方式代码常量类
 * @type {{SLSHFS_MSLMSH: string, SLSHFS_JB: string, SLSHFS_FJB: string}}
 */
var WSYS_SLSHFS_DM = {
    /**免受理免审核*/
    SLSHFS_MSLMSH: "01",
    /**即办*/
    SLSHFS_JB: "02",
    /**非即办*/
    SLSHFS_FJB: "03"
};

/**
 * 文书预审之税务事项代码常量类
 * @type {{FP_PZHD: string, FP_PZHDBG: string}}
 */
var WSYS_SWSX_DM = {
    /**票种核定*/
    FP_PZHD: "110207",
    /**票种变更*/
    FP_PZHDBG: "110208"
};

/**
 * 文书预审之任务状态代码常量类
 */
var WSYS_RWZT = {
    WCL: "00",
    YCL: "01",
    DSZDJ: "02",
    SLYC: "99"
}