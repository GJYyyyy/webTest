/**
 * Created with JetBrains WebStorm
 * Author：lizm
 * Date：2017/1/11
 * Time：18:43
 *
 */

/*
 *  jquery steps 个性化定制
 *
 * */


// stepNav 命名空间 对 jquery.steps 的初始化做了封装
window.stepNav = function () {

    var step = {};

    step.config=[];

    step.submitConfirmMsg='经办人系本人，此项业务真实。我（单位）愿承担由此产生的一切法律责任。是否确认提交？'; // 提交时的确认信息做成可配置

    step.wizard = null; // 默认steps 容器

    step.head = true; // 是否加载页头

    step.foot = false; // 是否加载页脚

    step.yltjStep = null; // 指定预览提交步骤是第几步，number

    step.confirmSubmit = false; // 再次确认是否提交

    step.isLoggedIn = true;  // 是否已经登录

    // steps 插件的默认绑定函数
    step.onInit = function (event, currentIndex) { };

    step.onContentLoaded = function (event, currentIndex) { };

    step.onStepChanging = function (event, currentIndex, newIndex) { return true  };

    step.onStepChanged = function (event, currentIndex, priorIndex) { };

    step.onCanceled = function (event) { window.close() };

    step.onFinishing = function (event, currentIndex) { return true };

    step.onFinished = function (event, currentIndex) { };

    /**
     * mini datagrid 点击保存按钮的回调事件
     */
    step.onStepDataSaved = function (event, currentIndex, newIndex) {

    };
    /**
     * steps 插件初始化入口
     */
    step.run = function () {

    };


    /**
     * steps 初始化所有步骤，循环加载html模版以及js ， 私有方法
     * @param steps 步骤配置 [
     {id:'ckzhzhxx-grid',title:'账户信息',url:'xxwhTemplate.html'},
     {id:'ckzhzhxx-grid2',title:'预览',url:'xxwhTemplate.html'},
     {id:'ckzhzhxx-grid2',title:'选择领取方式',url:'lqfsTemplate.html'},
     {id:'ckzhzhxx-grid3',title:'提交',url:'xxwhTemplate.html'}
     ]
     * @returns {*|jQuery}
     */
    function loadTemplate(steps) {
        var tempDiv = document.createElement('div'),
            currentStep = {};
        for (var i = 0; i < steps.length; i++) {
            currentStep = steps[i];
            $.ajax({
                url: currentStep.url,
                type: 'GET',
                async: false,
                dataType: 'html',
                success: function (data, textStatus) {
                    $(tempDiv).append(data);
                    $(tempDiv).children('h2').eq(i).text(currentStep.title);
                    /*
                     * 是否加载js，currentStep.js == true 则加载同名js
                     * 若为js 路径，则按路径加载js
                     * */
                    if(typeof currentStep.js ==='boolean' && currentStep.js===true){

                        wssqUtil.loadScript(currentStep.url);

                    }else if(typeof currentStep.js ==='string' && currentStep.js.indexOf('.js')!==-1){

                        wssqUtil.loadScript(currentStep.js);
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    console.log('加载html出错');
                }
            });
        }

        return $(tempDiv).html();
    }

    /**
     * 查找“预览提交”步骤
     * @param steps
     * @returns {undefined}
     */
    function findYltjStep(steps) {
        var index = undefined;
        for (var i = 0; i < steps.length; i++) {
            var yltjStep = steps[i].yltj;
            if (!!yltjStep) {
                index = i;
                break;
            }
        }
        return index;
    }

    /**
     * 初始化步骤框架
     * @param steps
     * @param stepContainer
     */
    step.initSteps = function (steps, stepContainer) {

        var wizard; // 默认容器
        if(!step.wizard){
            wizard = step.wizard = $('#wizard');
        }else{
            wizard = step.wizard;
        }
        // 如果指定了 step 容器，则使用指定的
        if (!!stepContainer) {
            wizard = stepContainer;
        }
        //step.wizard = wizard;
        // 加载初始化步骤中的所有模版html
        var tplHtml = loadTemplate(steps);
        wizard.append(tplHtml);
        // 只有一步的时候 上一步下一步按钮不显示

        if(steps.length===1){
            wizard.steps({enablePagination:false});
        }else{
            step.yltjStep = findYltjStep(steps);
            // 模版插入后开始初始化 jquery.steps
            wizard.steps();

        }

        step.config=mini.clone(steps); // 去除多余的属性url和js，用于显示我的申请资料用
        for(var i=0;i<step.config.length;i++){
            delete step.config[i].url;
            delete step.config[i].js;
        }

        // steps 初始化完成后，再初始化 miniui
        mini.parse();

        // miniui 初始化完成后，为miniui控件绑定事件
        wssqUtil.initGridToolBar();

        // 获取税务事项代码
        wssqUtil.currentSwsxDm = Tools.getUrlParamByName('code');
    };

    // 对外暴露接口
    return step;

}();

(function ($, undefined) {

    // 更新导航条颜色
    function updateNavBar(event, currentIndex, newIndex) {
        var stepsContainer = $('.steps'),
            liCollection = stepsContainer.find('ul > li'),
            spanHead = $(stepsContainer.find('span.step-patch-head')),
            spanTail = $(stepsContainer.find('span.step-patch-tail'));

        if (currentIndex < newIndex) { // 点击下一步
            spanHead.hasClass('currentBg') && spanHead.removeClass('currentBg').addClass('doneBg');
            if (newIndex === liCollection.length - 1) {
                spanTail.hasClass('disabledBg') && spanTail.removeClass('disabledBg').addClass('currentBg');
                spanTail.hasClass('doneBg') && spanTail.removeClass('doneBg').addClass('currentBg');
            }
        } else { // 点击上一步

            newIndex === 0 && spanHead.removeClass('doneBg').addClass('currentBg');

            if (currentIndex === liCollection.length - 1) {
                spanTail.hasClass('currentBg') && spanTail.removeClass('currentBg').addClass('doneBg');
            }
        }

        if(stepNav.yltjStep === currentIndex && currentIndex < newIndex && currentIndex==liCollection.length-1){
            $(stepsContainer).find('li.last').removeClass('current').addClass('done');
            spanTail.hasClass('currentBg') && spanTail.removeClass('currentBg').addClass('doneBg');
            spanTail.hasClass('disabledBg') && spanTail.removeClass('disabledBg').addClass('doneBg');
        }
        if(stepNav.yltjStep < currentIndex && currentIndex ==liCollection.length-1){
            $(stepsContainer).find('li.last').removeClass('current').addClass('done');
            spanTail.hasClass('currentBg') && spanTail.removeClass('currentBg').addClass('doneBg');
        }
    }

    // 插入步骤模版
    function insertTemplate() {

        var args = arguments[0];
        var insertStep = args[1];
        var content = insertStep.content;
        var js = insertStep.js;
        var html = '.html';

        if (content.slice(-html.length) === html) { // 如果是以 ".html" 结尾，则是以模版形式加载的
            $.ajax({
                url: content,
                type: 'GET',
                async: false,
                dataType: 'html',
                success: function (data, textStatus) {
                    args[1].content = data;
                    if(!!js){
                        wssqUtil.loadScript(js);
                    }

                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    console.log('加载html出错');
                }
            });
        }

        return args;
    }

    // 动态调整steps 内容显示区的高度
    function adaptHeight(index) {

        var wizard_p = $('#wizard-p-' + index),
            datagrid = $(wizard_p).find('.mini-grid.mini-datagrid'),
            miniTabs = $(wizard_p).find('.mini-tabs');
        var bodyH = wizard_p.height() + 40;
        if(!!datagrid &&　datagrid.length!=0 && miniTabs.length==0){
            if(datagrid.length > 1){
                $(datagrid).each(function () {
                    $(this).find('.mini-grid-body').height($(this).height() - 46);
                    if($(this).is(':visible')){
                        bodyH +=$(this).height();
                    }
                });
            }else if(datagrid.length == 1){
                $(datagrid).find('.mini-grid-body').height($(datagrid).height() - 46);
                if($(datagrid).is(':visible')) {
                    bodyH += $(datagrid).height();
                }
            }

        }
        stepNav.wizard.find('.content').height(bodyH)
        // 滚动到页面底部
        //scrollTo(0,9999999);
    }
    // 修改 $.fn.steps.defaults 默认配置
    $.extend($.fn.steps.defaults, {

        onStepChanging: function (event, currentIndex, newIndex) {

            var actions = $('.actions >ul >li');
            if (currentIndex < newIndex && !!stepNav.yltjStep && stepNav.yltjStep === currentIndex) {

                if(!stepNav.confirmSubmit){
                    scrollTo(0,0);
                    mini.confirm(stepNav.submitConfirmMsg,'提示',function (action) {
                        if(action==='ok'){
                            stepNav.confirmSubmit = true;
                            mini.mask('正在提交，请稍候...');
                            var delay = setTimeout(function(){
                                delay = null;
                                stepNav.wizard.steps('next');
                            },500);
                        }else{
                            stepNav.confirmSubmit = false;
                            return false;
                        }
                    });
                    return false;
                }
            }

            if(!wssqUtil.isValid){
                wssqUtil.showTips('失败','数据保存失败','danger');
                return false;

            } else if(!wssqUtil.isSaved){
                //$('.grid-save:visible').length!==0 && $('.grid-save:visible').trigger('click');
                wssqUtil.showTips('提示','请先保存数据','warning');
                return false;
            }

            // 上一步

            // 每一步跳转前 ，计算下一步内容的高度，动态调整
            if (currentIndex > newIndex) {

                var bodyH = $('#wizard-p-' + newIndex).height() + 40 + 'px';
                stepNav.wizard.find('.content').css('height', bodyH);

                updateNavBar(event, currentIndex, newIndex);

                //
                if(!!stepNav.yltjStep && stepNav.yltjStep === currentIndex){
                    actions.eq(1).find('a').text('下一步');
                }

                return true;  // 上一步 不做校验，直接跳转
            }

            // 下一步

            var result = stepNav.onStepChanging(event, currentIndex, newIndex);

            if (result) {

                // 如果当前这步骤是‘预览提交’，将 下一步 文字设置为 提交
                if (!!stepNav.yltjStep && stepNav.yltjStep === newIndex) {
                    actions.eq(1).find('a').text('提交');
                }

                if(newIndex>stepNav.yltjStep){
                    // 移除上下一步
                    $('ul[aria-label="Pagination"]').parent().remove();
                }
                updateNavBar(event, currentIndex, newIndex);
                adaptHeight(newIndex);
                $('.mini-tips') && $('.mini-tips').remove(); // 下一步校验通过，隐藏提示条
                stepNav.onStepDataSaved(event, currentIndex, newIndex);
            }
            return result;

        },

        onStepChanged: function (event, currentIndex, priorIndex) {
            updateNavBar(event, currentIndex);
            stepNav.onStepChanged(event, currentIndex, priorIndex);
            // 当前步骤 index 大于 预览提交步骤index，要么有审核中步骤，要么直接是完成
            if(currentIndex > stepNav.yltjStep) {
                // 若 当前步的 index = 步骤总数 -1 ，说明已经是完成了，解除导航条点击跳转事件
                if (currentIndex === stepNav.config.length - 1) {
                    stepNav.wizard.find("li[role='tab']>a").unbind('.wizard').removeAttr('href');
                }else{
                    // 审核中步骤，提交之后，后台返回的 审核方式代码为 01 ，说明是免受理免审核的，跳到下一步
                    if(wssqUtil.tjsqResponse && wssqUtil.tjsqResponse.shfsDm === '01'){
                        stepNav.wizard.steps('next');
                    }else{ //  审核方式代码不是 01的，在审核中步骤，解除导航条点击跳转事件
                        stepNav.wizard.find("li[role='tab']>a").unbind('.wizard').removeAttr('href');
                    }
                }
            }
        },

        onCanceled: function (event) {

            stepNav.onCanceled(event);

        },

        onFinishing: function (event, currentIndex) {
            // 提交前再次确认
            return true;

        },

        onFinished: function (event, currentIndex) {
            // 结束后，解绑导航条的点击事件
            stepNav.wizard.find("li[role='tab']>a").unbind('.wizard').removeAttr('href');

            updateNavBar(event, currentIndex);
            stepNav.onFinished(event, currentIndex);

        },

        onContentLoaded: function (event, currentIndex) {

            stepNav.onContentLoaded(event, currentIndex);

        },

        onInit: function (event, currentIndex) {

            stepNav.onInit(event, currentIndex);

        },

        headerTag: "h2",

        bodyTag: "section",

        titleTemplate: "<span class=\"connect-line\"></span><span class=\"number\">#index#</span> <div>#title#</div>",

        enableStepNavClick: true,

        transitionEffect: 'slideLeft',

        labels: {
            cancel: "取消",
            current: "current step:",
            pagination: "Pagination",
            finish: "提交",
            next: "下一步",
            previous: "上一步",
            loading: "加载中..."
        }
    });

    // 扩展 $.fn.steps 插件的 方法

    var customSteps = $.fn.steps,
        _add = $.fn.steps.add,
        _destroy = $.fn.steps.destroy,
        _finish = $.fn.steps.finish,
        _getCurrentIndex = $.fn.steps.getCurrentIndex,
        _getCurrentStep = $.fn.steps.getCurrentStep,
        _getStep = $.fn.steps.getStep,
        _insert = $.fn.steps.insert,
        _next = $.fn.steps.next,
        _previous = $.fn.steps.previous,
        _remove = $.fn.steps.remove,
        _setStep = $.fn.steps.setStep,
        _skip = $.fn.steps.skip;

    // 开始扩展
    $.fn.steps = function () {

        // 监听 init 方法
        $(this).on("init", function (event, currentIndex) {
            var stepsCollection = stepNav.wizard.find('.steps'),
                liCollection = stepsCollection.find('ul > li'),
                stepCount = liCollection.length,
                width = (10 - stepCount) / 2 * 10 + '%',
                patchHead = '<span class="step-patch-head currentBg" style="width:' + width + '"></span>',
                patchTail = '<span class="step-patch-tail disabledBg" style="width:' + width + '"></span>';
            stepsCollection.prepend(patchHead).append(patchTail);

            if(liCollection.length===1){
                // 只有一步的时候，导航条不显示
                stepsCollection.remove();
            }
            var actions = $('.actions >ul >li');
            if (stepNav.yltjStep === currentIndex) {
                actions.eq(1).find('a').text('提交');
            }
            // 内容加载完成再显示
            stepNav.wizard.show();
            // 第一步内容自动增加 40px
            var bodyH = $('#wizard-p-0').height() + 40 + 'px';
            stepNav.wizard.find('.content').css('height', bodyH);


        });


        $.fn.steps.add = function (step) {
            return _add.apply(this,arguments);
        };


        $.fn.steps.destroy = function () {
            return _destroy.apply(this,arguments);
        };


        $.fn.steps.finish = function () {
            _finish.apply(this,arguments);
        };


        $.fn.steps.getCurrentIndex = function () {
            return _getCurrentIndex.apply(this,arguments);
        };

        $.fn.steps.getCurrentStep = function () {
            return _getCurrentStep.apply(this,arguments);
        };


        $.fn.steps.getStep = function (index) {
            return _getStep.apply(this,arguments);
        };


        $.fn.steps.insert = function (index, step) {
            var args = insertTemplate(arguments);
            return _insert.apply(this, args);
        };


        $.fn.steps.next = function () {
            return _next.apply(this,arguments);
        };


        $.fn.steps.previous = function () {
            return _previous.apply(this,arguments);
        };


        $.fn.steps.remove = function (index) {
            _remove.apply(this,arguments);
        };

        $.fn.steps.setStep = function (index, step) {
            _setStep.apply(this,arguments);
        };

        $.fn.steps.skip = function (count) {
            _skip.apply(this,arguments);
        };

        return customSteps.apply(this, arguments);

    };


})(jQuery);

// 入口
$(function () {
    // 添加页面head

    // 新疆客户端嵌入的时候 不加载header
    if(!store.getLocal('client') && Tools.getUrlParamByName('client')==='Y'){
        store.setLocal('client','Y');
    }
    if(!!stepNav.head && !(store.getLocal('client')==='Y')){
        wssqUtil.initPageHdFt('head');
    }
    // 添加页面 foot
    if(!!stepNav.foot){
        wssqUtil.initPageHdFt('foot');
    }

    // 如果已经登录，那就把纳税人基本信息存起来
    if (!!stepNav.isLoggedIn) {
        // 获取纳税人基本信息
        wssqUtil.nsrjbxx = nsrxxUtil.getNsrxxVO() || {};
        // 获取纳税人登记序号
        var grDjxh = new Date().getTime(); // 个人模式没有登记序号，给时间戳
        !wssqUtil.nsrjbxx.djxh && store.setSession('grDjxh', grDjxh);
        wssqUtil.djxh = wssqUtil.nsrjbxx.djxh || grDjxh;


        // 前端埋点
        var _xa = _xa || [];
        window._xa = _xa;
        //下面是全局需要采集的参数
        _xa.push(["url", "/slp.log"]); //数据接收端
        _xa.push(['appname', 'dzswj']); //应用名
        _xa.push(['systemname', location.pathname.split('/')[1]]); //子系统名称

        if(nsrxxUtil.getAccountInfo()){
            _xa.push(['user_id', nsrxxUtil.getAccountInfo().id]); //用户id
        }else{
            _xa.push(['user_id', '']); //用户id
        }

        if(nsrxxUtil.getNsrInfo()){
            _xa.push(['nsr_id', nsrxxUtil.getNsrInfo().djxh]); //登记序号
        }else{
            _xa.push(['nsr_id', '']); //登记序号
        }

        var gnid = Tools.getUrlParamByName('id')||'';
        var name = document.title;
        var body = document.getElementsByTagName('body')[0];
        body.setAttribute('gndm',gnid);
        body.setAttribute('gncd',name);

        (function () {
            var collect = document.createElement('script');
            collect.type = 'text/javascript';
            collect.async = true;
            collect.src = '/src/scripts/warden-analytic.js';
            var s = document.getElementsByTagName('script')[0];
            // 暂时去除埋点
            // s.parentNode.insertBefore(collect, s);
        })();
        // 埋点结束
    }

    // 事前监控，异步
    wssqUtil.prepareValidate();

    // 步骤初始化
    stepNav.run();

    // 步骤初始化完成后生成纳税人信息
    if(!!stepNav.isLoggedIn && !!wssqUtil.nsrjbxx ){
        var arr = ['nsrsbh','nsrmc','scjydz','scjydlxdh'];
        $(arr).each(function (i,v) {
            $('span.'+v).each(function () {
                var nrskzxx = wssqUtil.nsrjbxx.nsrxxKzVO||{};
                var userInfo = nsrxxUtil.getNsrInfo()||{};
                var text = wssqUtil.nsrjbxx[v] || nrskzxx[v] || userInfo[v] || '';
                $(this).text(text);
            })
        });
    }
});
