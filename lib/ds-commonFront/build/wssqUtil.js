/**
 * Created with JetBrains WebStorm
 * Author：lizm
 * Date：2017/1/25
 * Time：18:03
 *
 */

// 文书申请工具类

window.wssqUtil=function () {

    var wssq={};
    wssq.isValid=true;
    wssq.isSaved=true;
    // 当前功能的税务事项代码
    wssq.currentSwsxDm = null;

    // 纳税人基本信息
    wssq.nsrjbxx = null;

    // 登记序号

    wssq.djxh = null;

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
    wssq.loadScript=function (url) {
        var script = document.createElement("script"),
            body = document.getElementsByTagName('body')[0];
        url = url + '?_=' + new Date().getTime();
        script.src = url.indexOf('.html')!==-1 ? url.replace('.html', '.js') : url;
        body.appendChild(script);
    };
    /**
     * 加载 css
     */
    wssq.loadCss =function (url) {
        var link = document.createElement("link"),
            head = document.getElementsByTagName('head')[0];

        link.href = url + '?_=' + new Date().getTime();
        link.rel = "stylesheet";
        head.appendChild(link);
    };
    /**
     *  加载模版
     * @param url
     * @param Data
     * @returns {string}
     */
    wssq.loadTemplate=function(url,Data) {
        var html='';
        $.ajax({
            url: url,
            type: 'GET',
            async: false,
            dataType: 'html',
            success: function (data, textStatus) {
                if(!!Data){
                    try{
                        var reg = /(?:\{\{)(\w[\.\w]*)(?:\}\})/g; // 匹配 {{ data.param }}
                        data = data.replace(reg, function(_, item) {
                            return eval("Data." + item);
                        });
                    } catch (e){
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
     * 插入模板片段
     * @param templateUrl
     * @param targetDom
     * @param templateData
     */
    wssq.appendTemplate=function(templateUrl,targetDom,templateData) {
        targetDom.append(this.loadTemplate(templateUrl,templateData));
    };
    /**
     * 替换html模板片段
     * @param templateUrl
     * @param targetDom
     * @param templateData
     */
    wssq.htmlTemplate=function(templateUrl,targetDom,templateData) {
        targetDom.html(this.loadTemplate(templateUrl,templateData));
    };
    /**
     * 在某个元素之前插入 模板片段
     * @param templateUrl
     * @param targetDom
     * @param templateData
     */
    wssq.beforeTemplate=function(templateUrl,targetDom,templateData) {
        targetDom.before(this.loadTemplate(templateUrl,templateData));
    };
    /**
     * 在某个元素之后插入模板片段
     * @param templateUrl
     * @param targetDom
     * @param templateData
     */
    wssq.afterTemplate=function(templateUrl,targetDom,templateData) {
        targetDom.after(this.loadTemplate(templateUrl,templateData));
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
     * mini-datagrid 编辑按钮，激活改datagrid
     * @param grid_id
     * @private
     */
    function _editGrid(grid_id) {
        var grid = mini.get(grid_id);
        var gridToolBar = $('#'+grid_id).prev();
        grid.setAllowCellEdit(true);
        // 校验表格，以激活颜色
        grid.validate();
        gridToolBar.find('.grid-edit').hide();
        gridToolBar.find('.grid-save').css('display','inline-block');
        wssq.isSaved = false;

    }

    /**
     * mini-datagrid 保存修改
     * @param grid_id
     * @returns {boolean}
     * @private
     */
    function _saveGrid(grid_id) {
        var grid = mini.get(grid_id);
        // 校验表格
        grid.validate();
        if(!grid.isValid()){
            var errors = grid.getCellErrors(),errorObj={},errorText='';
            for (var i = 0; i < errors.length; i++) {
                errorObj = errors[i];
                errorText += errorObj.column.header + errorObj.errorText +'<br/>';
            }
            wssq.showTips('保存失败',errorText,'danger');
            wssq.isValid=false;
            return false;
        }else{
            var gridToolBar = $('#'+grid_id).prev();
            grid.setAllowCellEdit(false);
            grid.validate();
            gridToolBar.find('.grid-edit').show();
            gridToolBar.find('.grid-save').hide();
            wssq.showTips('保存成功','表格数据保存成功','success',2000);

            wssq.isValid=true;
            wssq.isSaved=true;

            var stepSection = gridToolBar.parent();
            if(!stepSection.is('section')){
                return true;
            }else{
                var currentIndex = Number(stepSection.attr('id').replace('wizard-p-',''));
                var newIndex = Number(stepSection.next().attr('id').replace('wizard-h-',''));
                stepNav.onStepDataSaved(this,currentIndex,newIndex);
            }
        }
    }

    /**
     * mini-datagrid 删除行
     * @param grid_id
     * @private
     */
    function _removeRow (grid_id) {
        var grid = mini.get(grid_id);
        var rows = grid.getSelecteds();
        if (rows.length > 0) {
            mini.confirm('确定删除选中的记录吗？','提示',function (action) {
                if(action==='ok'){
                    grid.removeRows(rows, false); // false 不会自动选中下一条记录
                    wssq.showTips('删除成功','表格数据删除成功','success',2000);
                }
            });
        } else {
            mini.alert("请选中一条记录");
        }
    }

    /**
     * mini-datagrid 增加行 ，
     * @param grid_id
     * @param url
     */
    wssq.addRow = function (grid_id,url) {

        var grid = mini.get(grid_id);
        // 如果是参数含有html，则使用 mini.open
        if(url.indexOf('.html')>-1){
            mini.open({
                url: url,        //页面地址
                title: '增加',      //标题
                iconCls: '',    //标题图标
                width: 760,      //宽度
                height: 600,     //高度
                allowResize: false,       //允许尺寸调节
                allowDrag: true,         //允许拖拽位置
                showCloseButton: true,   //显示关闭按钮
                showMaxButton: false,     //显示最大化按钮
                showModal: true,         //显示遮罩
                currentWindow:false,      //是否在本地弹出页面,默认false
                effect:'fast',              //打开和关闭时的特果:'none','slow','fast',默认'none'
                onload: function () {       //弹出页面加载完成
                    var iframe = this.getIFrameEl();
                    var data = {};
                    //调用弹出页面方法进行初始化
                    //iframe.contentWindow.SetData(data);

                },
                ondestroy: function (action) {  //弹出页面关闭前
                    if (action == "ok") {       //如果点击“确定”
                        var iframe = this.getIFrameEl();
                        //获取选中、编辑的结果
                        //var data = iframe.contentWindow.GetData();
                        var data = mini.clone(data);    //必须。克隆数据。
                    }
                }

            });
        }else{ // show指定的 mini-window id
            try{
                var form = new mini.Form('#'+url);
                form.clear()
            }catch (e){
                // TODO
            }
            mini.get(url).show();
        }
    };

    /**
     * 设置datagrid tool bar
     * @returns {string}
     */
    wssq.initGridToolBar = function () {

        $('.grid-toolbar').each(function () {

            // 绑定纳税人信息面板展开方法
            $(this).delegate('a.nsrxx-pannel','click',function () {
                $(this).find('ul').slideToggle();
            });

            // 每一个 grid-toolbar 必须通过自定义属性 data-bind-grid 绑定一个 mini-datagrid
            var bindedGrid = $(this).attr('data-bind-grid'),
                optionCollection = $(this).children('a.mini-button');

            for(var i=0;i<optionCollection.length;i++){

                var btn = $(optionCollection[i]),
                    classCollection = btn.attr('class');
                /*if (classCollection.indexOf('grid-add') !== -1) {
                 btn.on('click', function () {
                 wssq.addRow(bindedGrid);
                 });
                 }*/
                if (classCollection.indexOf('grid-edit') !== -1) {
                    btn.on('click', function () {
                        _editGrid(bindedGrid)
                    });
                }
                if (classCollection.indexOf('grid-save') !== -1) {
                    btn.on('click', function () {
                        _saveGrid(bindedGrid)
                    });
                }
                if (classCollection.indexOf('grid-remove') !== -1) {
                    btn.on('click', function () {
                        _removeRow(bindedGrid)
                    });
                }
            }
            var targetGrid = ''; // 绑定的grid
            if(!!bindedGrid){
                targetGrid = mini.get(bindedGrid);
                targetGrid.setShowModified(false); // 不显示 修改后的小三角
                targetGrid.setAllowCellValid(true); //　编辑后自动校验
                /*targetGrid.on('cellendedit',function (e) {
                 e.sender.validate();
                 });*/
                targetGrid.on('cellvalidation',function (e) {
                    if(!!e.errorText){
                        //e.focus()
                        wssq.showTips('修改失败',e.errorText,'danger');
                        wssq.isValid = false;
                        return false;
                    }else if(!e.errorText){
                        wssq.isValid = true;
                    }
                })
            }else{
                var nextDom = $(this).next();
                if (nextDom.is('div') && nextDom.hasClass('mini-datagrid')) {

                }
            }
        });
        return 'GridToolBarInitialized';
    };

    /**
     * 初始化前置条件
     * @param reason
     * @param pre
     * @param url
     */
    wssq.showPrePage=function (reason,pre,url) {

        // 加载模版
        var data = {reason:reason,pre:pre,url:url,preTime:10,goText:'立刻跳转到'+ pre },
            html = wssq.loadTemplate('../../../apps/views/public/prepare/PrepareView.html',data);
        $(stepNav.wizard).before(html);

        // 设置跳转倒计时
        var preTime=9,
            preInterval = setInterval(function () {
                if (preTime < 10) {
                    preTime = '0' + preTime;
                }
                $('#pre-time').text(preTime);
                preTime--;
                if(preTime==-1){
                    clearInterval(preInterval);
                    window.location.href=url;
                }
            },1000);
    };

    /**
     * steps 最后一步结束后 ，显示结果页面
     * @param reason
     * @param pre
     * @param url
     */
    wssq.showResult=function (reason,pre,url) {

        //加载模版
        var data = {reason:reason,pre:pre,url:url},
            html = wssq.loadTemplate('../../../apps/views/public//result/ResultView.html',data);
        stepNav.wizard.children().last().hide().prev().html(html);

        // 倒计时 15 秒 跳转
        var preTime=14,
            preInterval = setInterval(function () {
                if (preTime < 10) {
                    preTime = '0' + preTime;
                }
                $('#pre-time').text(preTime);
                preTime--;
                if(preTime==-1){
                    clearInterval(preInterval);
                    window.location.href=url;
                }
            },1000);
    };

    /**
     * 初始化页面头部和页脚,私有静态方法
     */
    wssq.initPageHdFt=function (type) {
        var HdFt= type,tplUrl='';
        // 如果有参数指定初始化头或尾，则按参数来初始化
        if(!!HdFt){
            if(HdFt=='head'){
                stepNav = window.stepNav||{};
                var nsrxxvo = nsrxxUtil.getNsrxxVO()||{};
                var nsrxx = stepNav.isLoggedIn ? nsrxxvo : {};
                nsrxx.title = document.title;
                tplUrl = '../../../apps/views/public/head/HeadView.html';
                var html= wssq.loadTemplate(tplUrl,nsrxx);
                $('body').prepend(html);

                // 有纳税人识别号和纳税人名称时才显示
                if(!nsrxx.hasOwnProperty('nsrsbh') || !nsrxx.hasOwnProperty('nsrmc')){
                    $('.company-info').remove();
                }

                return 'Page Header Initialized';
            }else if(HdFt=='foot'){
                return 'Page Footer Initialized';
            }

        }else{ // 若没有参数，则页头页脚都初始化

            return 'Page Header And Footer Initialized';
        }

    };
    wssq.yltjIndex=null;
    wssq.setBtnDisabled=function(btn,seconds) {
        wssq.yltjIndex = wssq.yltjIndex || stepNav.yltjStep;
        var curentNav = 0;
        $(btn).attr({disabled:'disabled',href:'href'}).css('cursor','not-allowed').text(seconds+'秒后重试');
        var timer = setInterval(function () {
            seconds = Number(seconds)-1;
            if(seconds<10){
                seconds = '0' + seconds;
            }
            $(btn).text(seconds+'秒后重试');
            if(Number(seconds)==0){
                $('li[role="tab"]').each(function (i,v) {
                    if($(v).hasClass('current')){
                        curentNav = i;
                    }
                });
                var btnText = curentNav<wssq.yltjIndex?'下一步':'提交';
                clearInterval(timer);
                $(btn).text(btnText).removeAttr('disabled').attr('href','#next').css('cursor','pointer');
            }
        },1000);
    };
    wssq.tjsq = function (url,content,success,err,extraParams) {

        // 校验缓存的登记序号是否和当前记录的登记序号一致
        if(stepNav.isLoggedIn && !_validateDjxh()){
            mini.unmask();
            return false;
        }
        // ca 验签
        /*if(!_makeCaEcp()){
            return false;
        }*/

        var _lqfsDm ='',
            _yjddxx='',
            fbzl = '[]';
        // 组织领取方式代码
        if(!!window.lqfs){
            _lqfsDm = lqfs.selected;
        }
        // 邮寄订单信息
        if(typeof emailInfo !='undefined'){
            _yjddxx = mini.encode(emailInfo.getData());
        }
        // 组织附报资料数据
        if(!!window.fbzldata){
            filterExcessData();
            fbzl = mini.encode(fbzldata);
        }
        var data={
            data:content,
            djxh:wssq.nsrjbxx.djxh,
            nsrmc:wssq.nsrjbxx.nsrmc,
            nsrsbh:wssq.nsrjbxx.nsrsbh,
            lqfsDm: _lqfsDm,
            yjDdxxDto: _yjddxx,
            fbzlList:fbzl,
            stepConfig:mini.encode(stepNav.config),
            viewData:mini.encode(_getViewData())
        };
        // err 回调 可以不写，直接写 object 参数
        if (typeof err === 'object') {
            extraParams = mini.clone(err);
            err = undefined;
        }
        //
        if(typeof extraParams === 'object'){
            $.extend(data,extraParams);
        }

        ajax.post(url,mini.encode(data),function (response) {

            if(response.success && response.value){
                wssq.tjsqResponse = response.value;
                wssq.sqxh = response.value.sqxh;

                //初始化办理状态
                blzt.initBlzt();
            }else{
                stepNav.confirmSubmit = false;

                mini.alert(response.message,'提示',function () {
                    wssq.setBtnDisabled($('a[href="#next"]'),60);
                });

            }
            // 执行各自业务的回调
            success(response);

        },err);
        mini.unmask();
    };

    wssq.tjsqGr = function (url,content,extraParams,success,err) {

        // 校验缓存的登记序号是否和当前记录的登记序号一致
        if(stepNav.isLoggedIn && !_validateDjxh()){
            mini.unmask();
            return false;
        }
        // ca 验签
        /*if(!_makeCaEcp()){
            return false;
        }*/

        var _lqfsDm ='',
            _yjddxx='',
            fbzl = '[]';
        // 组织领取方式代码
        if(!!window.lqfs){
            _lqfsDm = lqfs.selected;
        }
        // 邮寄订单信息
        if(typeof emailInfo !='undefined'){
            _yjddxx = mini.encode(emailInfo.getData());
        }
        // 组织附报资料数据
        if(!!window.fbzldata){
            filterExcessData();
            fbzl = mini.encode(fbzldata);
        }
        var data={
            data:content,
            lqfsDm: _lqfsDm,
            yjDdxxDto: _yjddxx,
            fbzlList:fbzl,
            stepConfig:mini.encode(stepNav.config),
            viewData:mini.encode(_getViewData())
        };
        $.extend(data,extraParams);
        ajax.post(url,mini.encode(data),function (response) {

            if(response.success && response.value){
                wssq.tjsqResponse = response.value;
                wssq.sqxh = response.value.sqxh;

                //初始化办理状态
                blzt.initBlzt();
            }else{
                stepNav.confirmSubmit = false;

                mini.alert(response.message,'提示',function () {
                    wssq.setBtnDisabled($('a[href="#next"]'),60);
                });

            }
            // 执行各自业务的回调
            success(response);

        },err);
        mini.unmask();
    };

    // 检查登记序号是否一致
    function _validateDjxh() {
        var curNsrxx = nsrxxUtil.getUserInfo(true) || {};
        curNsrxx.NsrInfo = curNsrxx.NsrInfo ||{};// 税务登记信息补录没有NsrInfo
        var curDjxh = curNsrxx.NsrInfo.djxh || store.getSession('grDjxh') ||'';
        if(curDjxh !== wssqUtil.djxh){
            mini.alert('会话已经过期，请重新打开页面','提示',function () {
                window.close();
            });
            return false;
        }
        return true;
    }

    // ca 验签
    function _makeCaEcp() {
        var result = null;
        ajax.post('/wszx-web/api/casz/query/nsrcaszxx',{},function (result) {
            if(result.success && !!result.value){
                wssq.caType = result.value.catype;
            }else{
                mini.alert(result.message);
                return false;
            }
        });
        if(!!wssq.caType){
            if(wssq.caType==='HBCA'){ // 联通CA
                result = CAES.signWithHBCA();
            }else if(wssq.caType==='HBDSCA'){ // 河北CA
                result = CAES.signWithHBDSCA();
            }else if(wssq.caType==='BJCA'){ // 北京CA
                result = CAES.signWithBJCA();
            }
        }
        return result;
    }

    // 获取查看我的附报资料的数据
    function _getViewData() {
        var elements = document.querySelectorAll("[data-view-type]"),
            targetId = null,
            targetType = null,
            data = {};
        for(var i=0,len =elements.length;i<len;i++ ){
            targetId = elements[i].getAttribute("id");
            targetType = elements[i].getAttribute("data-view-type");
            if(!!targetType){
                targetType = targetType.toLowerCase();
                if(targetType==="form"){
                    var form = new mini.Form("#"+targetId);
                    data[targetId] = form.getDataAndText(true); // form 获取下拉框和树数据的text

                } else if(targetType==="datagrid"){
                    targetId =  elements[i].children[0].getAttribute("id")||$(elements[i]).children(0)._id();
                    if(!targetId){
                        throwError("data-view-type=datagrid 第一个子节点的id未获取到，请检查第一个子节点！");
                        return false;
                    }
                    var grid = mini.get(targetId);
                    data[targetId] = grid.getData();
                }
            }else{
                // 报错
                throwError("预览提交模版页面上某个标签的属性[data-view-type]没有被赋值，请检查！")
            }
        }
        return data;
    }

    // 查询是否有正在办理的业务
    wssq.checkZzbl = function (swsxDm) {
        var url='../../../api/base/zzblrw/query/'+swsxDm;
        var hasZzblyw = true;
        ajax.post(url,{},function (result) {
            // 没有正在办理
            if(result.success){
                hasZzblyw = true;
            }else{ // 有正在办理
                hasZzblyw = false;
                mini.alert(result.message,'提示',function () {
                    window.close();
                })
            }
        });

        return hasZzblyw;

    };
    // 关闭 mini open 的window
    wssq.closeWin = function (action) {
        if (window.CloseOwnerWindow) {
            return window.CloseOwnerWindow(action);
        }
        else {
            if (navigator.userAgent.indexOf("Firefox") != -1 || navigator.userAgent.indexOf("Chrome") !=-1) {
                window.location.href="about:blank";
                win_close();
            } else {
                window.opener = null;
                window.open("", "_self");
                win_close();
            }
        }
    };

    wssq.payLoad = function (e) {
        e.contentType='application/json;charset=utf-8';
        e.data=mini.encode(e.data);
    };

    /**
     * mini-datagrid 去除 tabindex 属性，否则会在focus事件触发是位置发生改变 ,私有静态方法
     */
    /* wssq.removeTabIndex=function () {
     $('div.mini-grid.mini-datagrid').removeAttr('tabindex');
     return 'GridTabIndexRemoved';
     }();*/

    // 事项监控
    wssq.prepareValidateApi = '../../../api/validate/beforehand/';
    wssq.prepareValidate = function () {
        var resultData = {};
        var code = Tools.getUrlParamByName('code'),
            id = Tools.getUrlParamByName('id');
        var url = this.prepareValidateApi + code + '/' + id;
        mini.mask('系统正在进行事前监控校验，请稍候...');
        ajax.asyncGet(url,{},function (result) {
            mini.unmask();
            if(!result.success){
                mini.alert(result.message,'提示',function () {
                    wssq.closeWin();
                });
                return;
            }
            if(!result.value || result.value.ruleResults.length===0){
                return;
            }
            //由于智数中心返回errorcount不正确，暂时自己计算 begin
            var errorCount = 0;
            var resultCount = 0;
            var errorResult = [];
            var isNull = true; //是否都为空标识
            var needCloseWin = false; // 是否需要关闭整个功能页面
            var data = result.value.ruleResults;
            for(var i=0;i<data.length;i++){
                if(!data[i].resultValue && data[i].ruleDegree=='01'){
                    errorResult[resultCount]=data[i];
                    resultCount++;
                    errorCount++;
                    needCloseWin = true;
                }
                if(!data[i].resultValue && data[i].ruleDegree=='02'){
                    errorResult[resultCount]=data[i];
                    resultCount++;
                    errorCount++;
                }
            }
            for(var j =0;j<errorResult.length;j++){
                if(!!errorResult[j].resultUrl){
                    isNull = false;
                }
            }
            result.value.ruleErrorCount = errorCount;   //由于智数中心返回errorcount不正确，暂时自己计算
            result.value.ruleResults = errorResult; // 只保留校验不通过的数据
            resultData = result.value;
            // 校验不通过的项目大于0条就弹窗提示
            if(errorCount>0){
                mini.open({
                    url: "../itemValidate/validationWin.html",        //页面地址
                    title: "事项监控",      //标题
                    width: 1200,      //宽度
                    height: 600,     //高度
                    allowResize: false,       //允许尺寸调节
                    allowDrag: true,         //允许拖拽位置
                    showCloseButton: false,   //显示关闭按钮
                    showMaxButton: false,     //显示最大化按钮
                    showModal: true,         //显示遮罩
                    currentWindow: false,      //是否在本地弹出页面,默认false
                    onload: function () {       //弹出页面加载完成
                        var iframe = this.getIFrameEl();
                        //调用弹出页面方法进行初始化
                        var data = mini.clone(resultData);
                        iframe.contentWindow.initValidateGrid(data,isNull,needCloseWin);
                    }
                })
            }

        },function (err) {
            mini.unmask();
            mini.alert('事前监控服务调用发生异常，请您稍后重试！','提示',function () {
                wssq.closeWin();
            })
        });
    };

    return wssq;
}();


