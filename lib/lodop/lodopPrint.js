/**
 * Created with JetBrains WebStorm
 * Author：lizm
 * Date：2016/12/13
 * Time：9:03
 *
 */

$.fn.lodopPrint = function () {
    lodopUtil.print.apply(this, arguments)
};
var lodopUtil = function () {

    var LODOP, lodopCss, printPath, printConfig;

    // 获取某个js文件的绝对路径
    function _CreateJSPath(js) {
        var scripts = document.getElementsByTagName("script");
        var path = "";
        for (var i = 0, l = scripts.length; i < l; i++) {
            var src = scripts[i].src;
            if (src.indexOf(js) != -1) {
                var sss = src.split(js);
                path = sss[0];
                break;
            }
        }
        var href = location.href;
        href = href.split("#")[0];
        href = href.split("?")[0];
        var ss = href.split("/");
        ss.length = ss.length - 1;
        href = ss.join("/");
        if (path.indexOf("https:") == -1 && path.indexOf("http:") == -1 && path.indexOf("file:") == -1 && path.indexOf("\/") != 0) {
            path = href + "/" + path;
        }
        return path;
    }

    // 打印参数配置说明
    printConfig = {
        direct: 1,       // 打印方向： 1 正向 2 横向，默认 1
        display: 1,      // 显示方向：1 正向显示，0 横向显示
        view: 1,         // 预览方式：0 适高，1 正常，2 适宽

        zoom: '100%',    // 缩放比例：Full-Width 按整宽，会变形；Full-Height 按整高，会变形；Full-Page 按整页，会变形
                         // Auto-Width 整宽不变形；Full-Height 整高不变形
                         // Width：200%、Height：200%、Width：200%;Height：200%、200%
        link:true,       // 是否引入页面link样式文件
        css: '',         // 额外的css样式
        cssLink: '',     // 通过link引入的css样式文件
        style: true      // 页面的 <style></style> 标签
    };

    // 初始化打印配置
    function _setPrintConfig() {
        lodopCss='';
        $.extend(printConfig, arguments[0]);
        printPath = _CreateJSPath('lodopPrint.js');

        var links = document.getElementsByTagName("link");
        // 是否引入页面link样式文件
        if(printConfig.link){
            for(var i=0;i<links.length;i++){
                var link = '<link type="text/css" rel="stylesheet" href="' + links[i].href +'"/>';
                lodopCss += link;
            }
        }


        // 是否有额外的 link 样式
        if (printConfig.cssLink) {
            lodopCss += '<link href="' + printConfig.cssLink + '" type="text/css" rel="stylesheet">';
        }
        // 是否引入页面<style></style>
        if (printConfig.style) {
            if($('style').length!=0){
                lodopCss += "<style>" + $('style')[0].innerHTML;
            }else{
                lodopCss += "<style>";
            }
        }else{
            lodopCss += "<style>";
        }
        // 自定义样式
        var cssStr = 'html,body{margin:0;padding:0,width:100%;height:100%;background:#fff !important}.mini-grid-topRightCell,' +
            '.mini-grid-scrollHeaderCell{display:none}.mini-grid-splitters{display:none}.mini-pager-left{display:none}';

        var _configStyle = cssStr + '</style>';
        // 是否有css 样式字符串 参数
        if (printConfig.css) {
            _configStyle = printConfig.css + cssStr + "</style>";
        }else{
            _configStyle =  cssStr + "</style>";
        }

        lodopCss += _configStyle;
        LODOP = getLodop();
        if(!LODOP){
            return;
        }
        var strFormHtml = lodopCss + "<body>" + $(this)[0].outerHTML + "</body>";
        var task = "打印任务_" + Math.random() * 100;
        LODOP.PRINT_INIT(task);
        LODOP.SET_PRINT_PAGESIZE(printConfig.direct, 0, 0, "A4"); //A4纸张横向打印 第一个参数 1正向，2横向
        LODOP.SET_SHOW_MODE("LANDSCAPE_DEFROTATED", printConfig.display);// 1正向显示，0横向显示
        LODOP.SET_PRINT_MODE("PRINT_PAGE_PERCENT", printConfig.zoom); // Auto-Width 整宽不变形
        LODOP.SET_PREVIEW_WINDOW(printConfig.view, 0, 0, 0, 0, task); // 第一个参数 0适高，1正常，2适宽，其他不要改
        LODOP.ADD_PRINT_HTM("5mm", "5mm", "RightMargin:5mm", "BottomMargin:5mm", strFormHtml); // 边距设置
        LODOP.PREVIEW(); // 打开打印预览窗口

    }

    return {
        print: function () {
            return _setPrintConfig.apply(this, arguments);
        },
        creatJSPath: function () {
            return _CreateJSPath.apply(this, arguments);
        }

    }

}();


var CreatedOKLodop7766=null;

//====判断是否需要安装CLodop云打印服务器:====
function needCLodop(){
    try{
        var ua=navigator.userAgent;
        if (ua.match(/Windows\sPhone/i) !=null) return true;
        if (ua.match(/iPhone|iPod/i) != null) return true;
        if (ua.match(/Android/i) != null) return true;
        if (ua.match(/Edge\D?\d+/i) != null) return true;
        if (ua.match(/QQBrowser/i) != null) return false;
        var verTrident=ua.match(/Trident\D?\d+/i);
        var verIE=ua.match(/MSIE\D?\d+/i);
        var verOPR=ua.match(/OPR\D?\d+/i);
        var verFF=ua.match(/Firefox\D?\d+/i);
        var x64=ua.match(/x64/i);
        if ((verTrident==null)&&(verIE==null)&&(x64!==null))
            return true; else
        if ( verFF !== null) {
            verFF = verFF[0].match(/\d+/);
            if ( verFF[0] >= 42 ) return true;
        } else
        if ( verOPR !== null) {
            verOPR = verOPR[0].match(/\d+/);
            if ( verOPR[0] >= 32 ) return true;
        } else
        if ((verTrident==null)&&(verIE==null)) {
            var verChrome=ua.match(/Chrome\D?\d+/i);
            if ( verChrome !== null ) {
                verChrome = verChrome[0].match(/\d+/);
                if (verChrome[0]>=42) return true;
            };
        };
        return false;
    } catch(err) {return true;};
};

//====页面引用CLodop云打印必须的JS文件：====
if (needCLodop()) {
    var head = document.head || document.getElementsByTagName("head")[0] || document.documentElement;
    var oscript = document.createElement("script");
    var protocol = location.protocol; //获取当前网络协议
    //本服务的俩http端口默认是"8000"和"18000"，安全协议https端口是"8443"
    if(protocol === 'https:'){
        oscript.src ="https://localhost:8443/CLodopfuncs.js?priority=1";
        head.insertBefore( oscript,head.firstChild );
    }else{
        oscript.src ="http://localhost:8000/CLodopfuncs.js?priority=1";
        head.insertBefore( oscript,head.firstChild );
        oscript = document.createElement("script");
        oscript.src ="http://localhost:18000/CLodopfuncs.js?priority=2";
        head.insertBefore( oscript,head.firstChild );
    }
};

//====获取LODOP对象的主过程：====
function getLodop(oOBJECT,oEMBED){
    var lodopPath = lodopUtil.creatJSPath('lodopPrint.js');

    var strHtmInstall="<br><font color='#FF00FF'>打印控件未安装!点击这里<a href=" + lodopPath + "install_lodop32.exe target='_self'>执行安装</a>,安装后请刷新页面或重新进入。</font>";
    var strHtmUpdate="<br><font color='#FF00FF'>打印控件需要升级!点击这里<a href=" + lodopPath + "install_lodop32.exe target='_self'>执行升级</a>,升级后请重新进入。</font>";
    var strHtm64_Install="<br><font color='#FF00FF'>打印控件未安装!点击这里<a href=" + lodopPath + "install_lodop64.exe target='_self'>执行安装</a>,安装后请刷新页面或重新进入。</font>";
    var strHtm64_Update="<br><font color='#FF00FF'>打印控件需要升级!点击这里<a href=" + lodopPath + "install_lodop64.exe target='_self'>执行升级</a>,升级后请重新进入。</font>";
    var strHtmFireFox="<br><br><font color='#FF00FF'>（注意：如曾安装过Lodop旧版附件npActiveXPLugin,请在【工具】->【附加组件】->【扩展】中先卸它）</font>";
    var strHtmChrome="<br><br><font color='#FF00FF'>(如果此前正常，仅因浏览器升级或重安装而出问题，需重新执行以上安装）</font>";
    var strCLodopInstall="<br><font color='#FF00FF'>CLodop云打印服务(localhost本地)未安装启动!点击这里<a href=" + lodopPath + "CLodop_Setup_for_Win32NT_https_2.102.exe target='_self'>执行安装</a>,安装后请刷新页面。</font>";
    var strCLodopUpdate="<br><font color='#FF00FF'>CLodop云打印服务需升级!点击这里<a href=" + lodopPath + "CLodop_Setup_for_Win32NT_https_2.102.exe target='_self'>执行升级</a>,升级后请刷新页面。</font>";
    var LODOP;
    try{
        var isIE = (navigator.userAgent.indexOf('MSIE')>=0) || (navigator.userAgent.indexOf('Trident')>=0);
        if (needCLodop()) {
            try{ LODOP=getCLodop();} catch(err) {};
            if (!LODOP && document.readyState!=="complete") {alert("C-Lodop没准备好，请稍后再试！"); return;};
            if (!LODOP) {
                if (isIE) document.write(strCLodopInstall); else
                    document.documentElement.innerHTML=strCLodopInstall+document.documentElement.innerHTML;
                return;
            } else {

                if (CLODOP.CVERSION<"2.0.6.8") {
                    if (isIE) document.write(strCLodopUpdate); else
                        document.documentElement.innerHTML=strCLodopUpdate+document.documentElement.innerHTML;
                };
                if (oEMBED && oEMBED.parentNode) oEMBED.parentNode.removeChild(oEMBED);
                if (oOBJECT && oOBJECT.parentNode) oOBJECT.parentNode.removeChild(oOBJECT);
            };
        } else {
            var is64IE  = isIE && (navigator.userAgent.indexOf('x64')>=0);
            //=====如果页面有Lodop就直接使用，没有则新建:==========
            if (oOBJECT!=undefined || oEMBED!=undefined) {
                if (isIE) LODOP=oOBJECT; else  LODOP=oEMBED;
            } else if (CreatedOKLodop7766==null){
                LODOP=document.createElement("object");
                LODOP.setAttribute("width",0);
                LODOP.setAttribute("height",0);
                LODOP.setAttribute("style","position:absolute;left:0px;top:-100px;width:0px;height:0px;");
                if (isIE) LODOP.setAttribute("classid","clsid:2105C259-1E0C-4534-8141-A753534CB4CA");
                else LODOP.setAttribute("type","application/x-print-lodop");
                document.documentElement.appendChild(LODOP);
                CreatedOKLodop7766=LODOP;
            } else LODOP=CreatedOKLodop7766;
            //=====Lodop插件未安装时提示下载地址:==========
            if ((LODOP==null)||(typeof(LODOP.VERSION)=="undefined")) {
                if (navigator.userAgent.indexOf('Chrome')>=0)
                    document.documentElement.innerHTML=strHtmChrome+document.documentElement.innerHTML;
                if (navigator.userAgent.indexOf('Firefox')>=0)
                    document.documentElement.innerHTML=strHtmFireFox+document.documentElement.innerHTML;
                if (is64IE) document.write(strHtm64_Install); else
                if (isIE)   document.write(strHtmInstall);    else
                    document.documentElement.innerHTML=strHtmInstall+document.documentElement.innerHTML;
                return LODOP;
            };
        };
        if (LODOP.VERSION<"6.2.0.8") {
            if (needCLodop())
                document.documentElement.innerHTML=strCLodopUpdate+document.documentElement.innerHTML; else
            if (is64IE) document.write(strHtm64_Update); else
            if (isIE) document.write(strHtmUpdate); else
                document.documentElement.innerHTML=strHtmUpdate+document.documentElement.innerHTML;
            return LODOP;
        };
        //===如下空白位置适合调用统一功能(如注册语句、语言选择等):===
        LODOP.SET_LICENSES("税友软件集团股份有限公司","F4EDB261FAE17DEF5C9B4F547E83CA27","","");

        //===========================================================
        return LODOP;
    } catch(err) {alert("getLodop出错:"+err);};
};



// 绑定打印按钮
$(function(){

    $('.lodopPrint').bind('click',function(){
        var configStr=$(this).attr('data-printConfig');
        if(configStr){
            configStr = configStr.replace('{','').replace('}','');
        }else{
            configStr='';
        }

        var target = $(this).attr('data-printTag');
        var config={};
        if(configStr.indexOf(',')!=-1){
            var perms=configStr.split(',');
            var kvs;
            for(var i=0;i<perms.length;i++){
                kvs = perms[i].split(':');
                config[kvs[0]]=kvs[1];
            }
        }else{
            var kv = configStr.split(':');
            config[kv[0]]=kv[1];
        }

        $(target).lodopPrint(config);
    }).css({'background':'#298abc','color':'#fff','padding':'6px 20px','border':'none','cursor':'pointer'});
});