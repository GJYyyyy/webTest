/*!
 * [description]
 * Function:Tools.js工具类
 * author:zhouqiyuan
 * Released under the MIT license
 *
 * Date: 2016-11-25
 */
(function (win) {
    var _extend, _isObject;

    _isObject = function (o) {
        return Object.prototype.toString.call(o) === '[object Object]';
    }

    _extend = function self(destination, source) {
        var property;
        for (property in destination) {
            if (destination.hasOwnProperty(property)) {
                // 若destination[property]和sourc[property]都是对象，则递归
                if (_isObject(destination[property]) && _isObject(source[property])) {
                    self(destination[property], source[property]);
                }
                ;
                // 若sourc[property]已存在，则跳过
                if (source.hasOwnProperty(property)) {
                    continue;
                } else {
                    source[property] = destination[property];
                }
            }
        }
    }

    // creact Tools Object
    function Tools() {
    }

    Tools.prototype = {
        constructor: Tools,
        /**
         * @description  简单的浏览器检查结果。
         *
         * * `webkit`  webkit版本号，如果浏览器为非webkit内核，此属性为`undefined`。
         * * `chrome`  chrome浏览器版本号，如果浏览器为chrome，此属性为`undefined`。
         * * `ie`  ie浏览器版本号，如果浏览器为非ie，此属性为`undefined`。**暂不支持ie10+**
         * * `firefox`  firefox浏览器版本号，如果浏览器为非firefox，此属性为`undefined`。
         * * `safari`  safari浏览器版本号，如果浏览器为非safari，此属性为`undefined`。
         * * `opera`  opera浏览器版本号，如果浏览器为非opera，此属性为`undefined`。
         *
         * @property {Object} [browser]
         */
        browser: (function (ua) {
            var ret = {},
                webkit = ua.match(/WebKit\/([\d.]+)/),
                chrome = ua.match(/Chrome\/([\d.]+)/) ||
                    ua.match(/CriOS\/([\d.]+)/),

                ie = ua.match(/MSIE\s([\d\.]+)/) ||
                    ua.match(/(?:trident)(?:.*rv:([\w.]+))?/i),
                firefox = ua.match(/Firefox\/([\d.]+)/),
                safari = ua.match(/Safari\/([\d.]+)/),
                opera = ua.match(/OPR\/([\d.]+)/);

            webkit && (ret.webkit = parseFloat(webkit[1]));
            chrome && (ret.chrome = parseFloat(chrome[1]));
            ie && (ret.ie = parseFloat(ie[1]));
            firefox && (ret.firefox = parseFloat(firefox[1]));
            safari && (ret.safari = parseFloat(safari[1]));
            opera && (ret.opera = parseFloat(opera[1]));

            return ret;
        })(navigator.userAgent),

        /**
         * @description  操作系统检查结果。
         *
         * * `android`  如果在android浏览器环境下，此值为对应的android版本号，否则为`undefined`。
         * * `ios` 如果在ios浏览器环境下，此值为对应的ios版本号，否则为`undefined`。
         * @property {Object} [os]
         */
        os: (function (ua) {
            var ret = {},

                // osx = !!ua.match( /\(Macintosh\; Intel / ),
                android = ua.match(/(?:Android);?[\s\/]+([\d.]+)?/),
                ios = ua.match(/(?:iPad|iPod|iPhone).*OS\s([\d_]+)/);

            // osx && (ret.osx = true);
            android && (ret.android = parseFloat(android[1]));
            ios && (ret.ios = parseFloat(ios[1].replace(/_/g, '.')));

            return ret;
        })(navigator.userAgent),

        /**
         * [isSupportTransition description]
         * 是否支持css3 transition动画属性
         * @return {Boolean} [description]
         */
        isSupportTransition: function () {
            var s = document.createElement('p').style,
                r = 'transition' in s ||
                    'WebkitTransition' in s ||
                    'MozTransition' in s ||
                    'msTransition' in s ||
                    'OTransition' in s;
            s = null;
            return r;
        },

        isIE: function () {
            if (!!window.ActiveXObject || 'ActiveXObject' in window) {
                return true
            } else {
                return false;
            }
        },

        // 检测是否已经安装flash，检测flash的版本
        flashVersion: function () {
            var version;
            try {
                version = navigator.plugins['Shockwave Flash'];
                version = version.description;
            } catch (ex) {
                try {
                    version = new ActiveXObject('ShockwaveFlash.ShockwaveFlash')
                        .GetVariable('$version');
                } catch (ex2) {
                    version = '0.0';
                }
            }
            version = version.match(/\d+/g);
            return parseFloat(version[0] + '.' + version[1], 10);
        },

        /**
         * [isSupportBase64 description]
         * @return {Boolean} 判断浏览器是否支持图片base64
         */
        isSupportBase64: function () {
            var data = new Image();
            var support = true;
            data.onload = data.onerror = function () {
                if (this.width != 1 || this.height != 1) {
                    support = false;
                }
            }
            data.src =
                "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
            return support;
        },
        /**
         * [trim description]去除前后空格
         * @param  {[type]} str
         * @return {[string]}
         */
        trim: function (str) {
            return str.replace(/(^\s*)|(\s*$)/g, '');
        },
        /**
         * [extend description]扩张对象方法
         * @return {[Object]} [description]
         */
        extend: function () {
            var arr = arguments,
                result = {},
                i;
            if (!arr.length) return {};
            for (i = arr.length - 1; i >= 0; i--) {
                if (_isObject(arr[i])) {
                    _extend(arr[i], result);
                }
            }
            arr[0] = result;
            return result;
        },
        /**
         * url通过名字获取参数
         * @param attrName
         * @returns {*}
         */
        getUrlParamByName: function (attrName) {
            var locs = location.href.split("?");
            if (locs.length == 1) {
                return null;
            }
            var params = locs[1].split("&");
            var value = null;
            for(var i=0;i<params.length;i++){
                var param = params[i].split("=");
                if (param[0] == attrName) {
                    value = param[1];
                    break;
                }
            }

            return value;
        }
    };

    // Expose Tools identifiers, even in AMD
    // and CommonJS for browser emulators
    if (typeof define === "function") {
        define("Tools", [], function () {
            return new Tools();
        });
    } else {
        window.Tools = new Tools();
        return Tools;
    }
})(window);
