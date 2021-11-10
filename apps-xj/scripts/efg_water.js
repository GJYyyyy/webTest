// 水印
(function (watermark) {
    window.watermarkdivs = [];
    window.resetWater = false;
    window.defaultWaterSetting = null;
    // 加载水印
    var loadMark = function (settings) {
        var pre = 'watermark_';
        var defaultSettings = {
            watermark_text: "",
            watermark_region: true,
            watermark_x: 20,//水印起始位置x轴坐标
            watermark_x_space: 40,//水印x轴间隔
            watermark_y: 20,//水印起始位置Y轴坐标
            watermark_y_space: 40,//水印x轴间隔
            watermark_rows: 0,//水印行数
            watermark_cols: 0,//水印列数
            watermark_font: '微软雅黑',//水印字体
            watermark_color: '#000000',//水印字体颜色
            watermark_fontsize: '24px',//水印字体大小
            watermark_s_fontsize:'16px',//次级水印字体大小
            watermark_alpha: 0.1,//水印透明度，要求设置在大于等于0.003
            watermark_width: 260,//水印宽度
            watermark_height: 100,//水印长度
            watermark_angle: 24,//水印倾斜度数
            watermark_noTime: false,//是否展示当前时间
            watermark_preText: [],//最先展示的信息
            watermark_nextText: [],//最末展示的信息
            watermark_odd_row_left: 0,//最末展示的信息
            watermark_even_row_left: 0,//最末展示的信息
            watermark_odd_col_top: 0,//最末展示的信息
            watermark_even_col_top: 0,//最末展示的信息
        };
        //采用配置项替换默认值，作用类似jquery.extend
        if (arguments.length === 1 && typeof arguments[0] === "object") {
            var src =arguments[0] || {};
            for (var key in src) {
                if (src[key] && defaultSettings[pre + key] && src[key] === defaultSettings[pre+key])
                    continue;
                else 
                    defaultSettings[pre+key] = src[key];

            }
        }
        if (window.watermarkdivs && window.watermarkdivs.length > 0) {
            var dd = document.getElementById("otdivid");
            dd && document.body.removeChild(dd);
            window.watermarkdivs = [];
        }

        //获取页面最大宽度
        var page_width = Math.max(document.body.scrollWidth, document.body.clientWidth);
        //获取页面最大长度
        var page_height = Math.max(document.body.scrollHeight, document.body.clientHeight);
        // var page_height = Math.max(document.body.scrollTop,document.body.clientHeight);

        // 创建文档碎片
        var oTemp = document.createDocumentFragment();
        //创建水印外壳div
        var otdiv = document.getElementById("otdivid");

        if (!otdiv) {
            otdiv = document.createElement('div');
            otdiv.id = "otdivid";
            otdiv.style.pointerEvents = "none";
            otdiv.style.position = "absolute";
            document.body.appendChild(otdiv);
        }

        //如果将水印列数设置为0，或水印列数设置过大，超过页面最大宽度，则重新计算水印列数和水印x轴间隔
        if (defaultSettings.watermark_cols == 0 || (parseInt(defaultSettings.watermark_x + defaultSettings.watermark_width * defaultSettings.watermark_cols + defaultSettings.watermark_x_space * (defaultSettings.watermark_cols - 1)) > page_width)) {
            defaultSettings.watermark_cols = parseInt((page_width - defaultSettings.watermark_x + defaultSettings.watermark_x_space) / (defaultSettings.watermark_width + defaultSettings.watermark_x_space));
            defaultSettings.watermark_x_space = parseInt((page_width - defaultSettings.watermark_x - defaultSettings.watermark_width * defaultSettings.watermark_cols) / (defaultSettings.watermark_cols - 1));
        }
        // 如果设置的行列所占大小小于屏幕宽高，则设置均匀平铺间距
        else if (!settings.watermark_x_space && defaultSettings.watermark_cols && parseInt(defaultSettings.watermark_x + defaultSettings.watermark_width * defaultSettings.watermark_cols + defaultSettings.watermark_x_space * defaultSettings.watermark_cols) < page_width) {
            defaultSettings.watermark_x_space = defaultSettings.watermark_x = parseInt((page_width - defaultSettings.watermark_width * defaultSettings.watermark_cols) / (defaultSettings.watermark_cols + 1));
        }
        //如果将水印行数设置为0，或水印行数设置过大，超过页面最大长度，则重新计算水印行数和水印y轴间隔
        if (defaultSettings.watermark_rows == 0 || (parseInt(defaultSettings.watermark_y + defaultSettings.watermark_height * defaultSettings.watermark_rows + defaultSettings.watermark_y_space * (defaultSettings.watermark_rows - 1)) > page_height)) {
            defaultSettings.watermark_rows = parseInt((defaultSettings.watermark_y_space + page_height - defaultSettings.watermark_y) / (defaultSettings.watermark_height + defaultSettings.watermark_y_space));
            defaultSettings.watermark_y_space = parseInt(((page_height - defaultSettings.watermark_y) - defaultSettings.watermark_height * defaultSettings.watermark_rows) / (defaultSettings.watermark_rows - 1));
        }
        // 如果设置的行列所占大小小于屏幕宽高，则设置均匀平铺间距
        else if (!settings.watermark_y_space && defaultSettings.watermark_rows && parseInt(defaultSettings.watermark_y + defaultSettings.watermark_height * defaultSettings.watermark_rows + defaultSettings.watermark_y_space * defaultSettings.watermark_rows) < page_height) {
            defaultSettings.watermark_y_space = defaultSettings.watermark_y = parseInt((page_height - defaultSettings.watermark_height * defaultSettings.watermark_rows) / (defaultSettings.watermark_rows + 1));
        }
        var x;
        var y;
        for (var i = 0; i < defaultSettings.watermark_rows; i++) {
            y = defaultSettings.watermark_y + (defaultSettings.watermark_y_space + defaultSettings.watermark_height) * i;
            for (var j = 0; j < defaultSettings.watermark_cols; j++) {
                x = defaultSettings.watermark_x + (defaultSettings.watermark_width + defaultSettings.watermark_x_space) * j;
                var mask_div = document.createElement('div');
                var notes = [];
                if(defaultSettings.watermark_preText.length){
                    notes = notes.concat(defaultSettings.watermark_preText);
                }
                if(defaultSettings.watermark_region){
                    notes.push(typeof defaultSettings.watermark_region == 'string' ? defaultSettings.watermark_region : document.location.host)
                }
                if(defaultSettings.watermark_text){
                    notes.push(defaultSettings.watermark_text+'~')
                }
                if(!defaultSettings.watermark_noTime){
                    notes.push(new Date().toLocaleString()+'~')
                }
                if(defaultSettings.watermark_nextText.length){
                    notes = notes.concat(defaultSettings.watermark_nextText);
                }
                if(notes.length){
                    for (var ii = 0, len = notes.length; ii < len; ii += 1) {
                        var divContainer = document.createElement('div'),
                            isLower = notes[ii].indexOf('~')> -1,
                            dom= isLower ? notes[ii].split('~')[0] : notes[ii];
                            divContainer.appendChild(document.createTextNode(dom));
                            divContainer.style.fontSize = defaultSettings['watermark_'+ ( isLower ? 's' : '') +'_fontsize'] ;
                            mask_div.appendChild(divContainer);
                       
                    }
                }
                // 设置水印相关属性start
                mask_div.id = 'mask_div' + i + j;
                mask_div.onselectstart = "return false";
                //设置水印div倾斜显示
                mask_div.style.filter = "progid:DXImageTransform.Microsoft.Matrix(sizingMethod='auto expand', M11=0.96593, M12=0.25882, M21=-0.25882, M22=0.96593) progid:DXImageTransform.Microsoft.Alpha(opacity=15)";
                //逆时针旋转45度：progid:DXImageTransform.Microsoft.Matrix(sizingMethod='auto expand', M11=0.70710678118655, M12=0.70710678118655, M21=-0.70710678118655, M22=0.70710678118655);
                mask_div.style.webkitTransform = "rotate(-" + defaultSettings.watermark_angle + "deg)";

                mask_div.style.MozTransform = "rotate(-" + defaultSettings.watermark_angle + "deg)";
                mask_div.style.msTransform = "rotate(-" + defaultSettings.watermark_angle + "deg)";
                mask_div.style.OTransform = "rotate(-" + defaultSettings.watermark_angle + "deg)";
                mask_div.style.transform = "rotate(-" + defaultSettings.watermark_angle + "deg)";
                mask_div.style.visibility = "";
                mask_div.style.position = "fixed";
                //选不中

                mask_div.style.left = x + 'px';
                mask_div.style.top = y + 'px';
                mask_div.style.overflow = "hidden";
                mask_div.style.zIndex = "9999";
                //mask_div.style.border="solid #eee 1px";
                mask_div.style.opacity = defaultSettings.watermark_alpha;
                mask_div.style.fontSize = defaultSettings.watermark_fontsize;
                mask_div.style.lineHeight = defaultSettings.watermark_fontsize;
                mask_div.style.fontFamily = defaultSettings.watermark_font;
                mask_div.style.color = defaultSettings.watermark_color;
                mask_div.style.textAlign = "left";
                mask_div.style.width = defaultSettings.watermark_width + 'px';
                mask_div.style.height = defaultSettings.watermark_height + 'px';
                mask_div.style.display = "block";
                //设置水印相关属性end
               
                mask_div.style.marginLeft = defaultSettings['watermark_'+ (i%2==0 ? 'odd':'even') + '_row_left'] + 'px';
                mask_div.style.marginTop = defaultSettings['watermark_'+ (j%2==0 ? 'odd':'even') + '_col_top'] + 'px';
                //附加到文档碎片中
                otdiv.appendChild(mask_div)
                otdiv.style.cursor = "default";
               
            };
           
            window.watermarkdivs.push(otdiv); //控制页面大小变化时水印字体
        };
        //一次性添加到document中
        document.body.appendChild(oTemp);
        window.resetWater = false;
    };
    watermark.init = function (settings) {
        window.defaultWaterSetting = settings;
        window.onload = function () {
            loadMark(settings);
        };
        window.onresize = function () {
            window.resetWater = true;
            loadMark(settings);
        };
    };
    watermark.load = function (settings) {
        loadMark(settings);
        PointerEventsPolyfill();
    };
    function loaded(e){
        var dom = e.srcElement || e.target,
        id = dom.id;
    if (id === 'otdivid' && !window.resetWater) {
        watermark.load(window.defaultWaterSetting);
    }
    }
    // addEvent('DOMNodeRemoved',function(e){
    //     var dom = e.srcElement || e.target,id = dom.id;
    //     if(id === 'otdivid' && !window.resetWater){
    //         watermark.load(window.defaultWaterSetting);
    //     }
    // },false);
    function addEvent(type, fn, flag) {
        if (document.addEventListener) {
            document.addEventListener(type, fn, flag);
        } else {
            document.attachEvent(type, fn, flag);
        }
    }
    addEvent('DOMNodeRemoved', function (e) {
        loaded(e)
    }, false);
    addEvent('DOMSubtreeModified', function (e) {
        loaded(e)
    }, false);

})(window.SyWater={});

/*
 * Pointer Events Polyfill: Adds support for the style attribute
 * "pointer-events: none" to browsers without this feature (namely, IE).
 * (c) 2013, Kent Mewhort, licensed under BSD. See LICENSE.txt for details.
 */

// constructor
function PointerEventsPolyfill(options) {
    // set defaults
    this.options = {
        selector: '*',
        mouseEvents: ['click', 'dblclick', 'mousedown', 'mouseup'],
        usePolyfillIf: function () {
            // if (navigator.appName == 'Microsoft Internet Explorer')
            // {
            /* jshint ignore:start */
            var agent = navigator.userAgent;
            // if (agent.match(/MSIE ([0-9]{1,}[\.0-9]{0,})/) != null) {
            //     var version = parseFloat(RegExp.jQ1);
            //     if (version < 11)
            return true;
            // }
            /* jshint ignore:end */
            // }
            // return false;
        }
    };
    if (options) {
        var obj = this;
        $.each(options, function (k, v) {
            obj.options[k] = v;
        });
    }

    if (this.options.usePolyfillIf())
        this.register_mouse_events();
}


/**
 * singleton initializer
 *
 * @param   {object}    options     Polyfill options.
 * @return  {object}    The polyfill object.
 */

PointerEventsPolyfill.initialize = function (options) {
    /* jshint ignore:start */
    if (PointerEventsPolyfill.singleton == null)
        PointerEventsPolyfill.singleton = new PointerEventsPolyfill(options);
    /* jshint ignore:end */
    return PointerEventsPolyfill.singleton;
};


/**
 * handle mouse events w/ support for pointer-events: none
 */
PointerEventsPolyfill.prototype.register_mouse_events = function () {
    // register on all elements (and all future elements) matching the selector
    $(document).on(
        this.options.mouseEvents.join(' '),
        this.options.selector,
        function (e) {
            if ($(this).css('pointerEvents') == 'none') {

                // peak at the element below
                var origDisplayAttribute = $(this).css('display');
                $(this).css('display', 'none');

                var underneathElem = document.elementFromPoint(
                    e.clientX,
                    e.clientY);

                if (origDisplayAttribute)
                    $(this)
                        .css('display', origDisplayAttribute);
                else
                    $(this).css('display', '');

                // fire the mouse event on the element below
                e.target = underneathElem;
                $(underneathElem).trigger(e);
                return false;
            }
            return true;
        });
};
