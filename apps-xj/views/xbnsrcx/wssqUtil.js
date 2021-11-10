/**
 * Created with JetBrains WebStorm
 * Author：lizm
 * Date：2017/1/25
 * Time：18:03
 *
 */

/*前置条件，检查是否有资格做相关备案和申请*/

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

        script.src = url.indexOf('.html')!==-1 ? url.replace('.html', '.js') : url;
        body.appendChild(script);
    };
    /**
     * 在 <head> 中加载js
     * @param url
     */
    wssq.loadHeadScript=function (url) {
        var script = document.createElement("script"),
            head = document.getElementsByTagName('head')[0];

        script.src = url.indexOf('.html')!==-1 ? url.replace('.html', '.js') : url;
        head.appendChild(script);
    };
    /**
     * 加载 css
     */
    wssq.loadCss =function (url) {
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
        for(var prop in propObj){
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
    wssq.initPrePage=function (reason,pre,url) {

        // 加载模版
        var data = {reason:reason,pre:pre,url:url},
            html = wssq.loadTemplate('../../../apps/views/public/prepare/PrepareView.html',data);
        $(stepNav.wizard).before(html);

        // 设置跳转倒计时
        var preTime=4,
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
                var nsrxx = nsrxxUtil.getNsrxxVO()||{};
                nsrxx.title = $('title').get(0).innerText;
                tplUrl = '../../../apps/views/public/head/HeadView.html';
                var html= wssq.loadTemplate(tplUrl,nsrxx);
                $('body').prepend(html);
                return 'Page Header Initialized';
            }else if(HdFt=='foot'){
                return 'Page Footer Initialized';
            }

        }else{ // 若没有参数，则页头页脚都初始化

            return 'Page Header And Footer Initialized';
        }

    };

    wssq.tjsq = function (url,content,success,err,viewData) {

        // 校验缓存的登记序号是否和当前记录的登记序号一致
        if(!_validateDjxh()){
            return false;
        }

        var temp = mini.decode(content),
            lqfs ='',
            fbzl = '[]';
        // 组织领取方式代码
        if(!!temp.lqfsDm){
            lqfs = temp.lqfsDm;
        }
        // 组织附报资料数据
        if(!!window.fbzldata){
            fbzl = mini.encode(fbzldata);
        }
        var data={
            data:content,
            lqfsDm: lqfs,
            fbzlList:fbzl,
            stepConfig:mini.encode(stepNav.config),
            viewData:viewData?mini.encode(_getViewData(viewData)) : mini.encode(_getViewData())
        };
        ajax.post(url,mini.encode(data),success,err);
    };

    // 检查登记序号是否一致
    function _validateDjxh() {
        var curNsrxx = nsrxxUtil.getNsrxxVO() || {};
        var curDjxh = curNsrxx.djxh || store.getSession('grDjxh') ||'';
        if(curDjxh != wssqUtil.djxh){
            mini.alert('会话已经过期，请重新打开页面','提示',function () {
                window.close();
            });
            return false;
        }
        return true;
    }

    // 获取查看我的附报资料的数据
    function _getViewData(viewData) {
        var elements = document.querySelectorAll("[data-view-type]"),
            targetId = null,
            targetType = null;
        if(viewData){
            var data = viewData;
        } else{
            var data = {};
        }
        for(var i=0,len =elements.length;i<len;i++ ){
            targetId = elements[i].getAttribute("id");
            targetType = elements[i].getAttribute("data-view-type");
            if(!!targetType){
                targetType = targetType.toLowerCase();
                if(targetType==="form"){
                    var form = new mini.Form("#"+targetId);
                    var dataAndText = form.getDataAndText(true);
                    if(targetId == 'yltj' && blzt.swsxDm == '110112'){
                        var date = new Date();
                        var year = date.getFullYear();
                        var month = date.getMonth() + 1;
                        var day = date.getDate();
                        if (month < 10) {
                            month = "0" + month;
                        }
                        if (day < 10) {
                            day = "0" + day;
                        }
                        dataAndText.sqrq = year + "年" + month + "月" + day + '日';
                    }
                    data[targetId] = dataAndText; // form 获取下拉框和树数据的text

                } else if(targetType==="datagrid"){
                    targetId =  elements[i].children[0].getAttribute("id")||$(elements[i]).children(0)._id();
                    if(!targetId){
                        throwError("data-view-type=datagrid 第一个子节点的id未获取到，请检查第一个子节点！");
                        return false;
                    }
                    var grid = mini.get(targetId);
                    data[targetId] = grid.getData();
                    if(data[targetId].length>0){
                        if(data[targetId][0].hasOwnProperty('kjfpjedk')) data[targetId][0].kjfpjedk = data[targetId][0].kjfpjedk.toString();
                        if(data[targetId][0].hasOwnProperty('kjfpjezk')) data[targetId][0].kjfpjezk = data[targetId][0].kjfpjezk.toString();
                        if(data[targetId][0].hasOwnProperty('sjhtje')) data[targetId][0].sjhtje = data[targetId][0].sjhtje.toString();
                        if(data[targetId][0].hasOwnProperty('ybyjskje')) data[targetId][0].ybyjskje = data[targetId][0].ybyjskje.toString();
                        if(data[targetId][0].hasOwnProperty('yyjskje')) data[targetId][0].yyjskje = data[targetId][0].yyjskje.toString();
                        if(data[targetId][0].hasOwnProperty('wcjyhwzz')) data[targetId][0].wcjyhwzz = data[targetId][0].wcjyhwzz.toString();
                    }
                }
            }else{
                // 报错
                throwError("预览提交模版页面上某个标签的属性[data-view-type]没有被赋值，请检查！")
            }
        }
        return data;
    }

    /**
     * mini-datagrid 去除 tabindex 属性，否则会在focus事件触发是位置发生改变 ,私有静态方法
     */
    /* wssq.removeTabIndex=function () {
     $('div.mini-grid.mini-datagrid').removeAttr('tabindex');
     return 'GridTabIndexRemoved';
     }();*/

    wssq.autoInclude = function () {
        var title = document.getElementsByTagName('title')[0];
        var metas = '<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">' +
            '<meta http-equiv="content-type" content="text/html; charset=UTF-8"/>' +
            '<meta name="renderer" content="webkit">' +
            '<meta name="description" content='+ title.innerText +'>' +
            '<meta name="keywords" content="上海市网上税务局'+ title.innerText +'">' +
            '<meta name="viewport" content="width=device-width, initial-scale=1">'+
            '<link href="../../images/public/favicon.ico" rel="icon" type="image/x-icon" />';
        $(title).before(metas);
        if(isIE8 || isIE9){
            wssq.loadCss('../../../apps/styles/ie-fix.css'),
                // 在 head 内加载 scripts
                wssq.loadHeadScript('../../../lib/html5shiv/html5shiv.min.js'),
                wssq.loadHeadScript('../../../lib/respond/respond.min.js');
        }

        return 'autoInclude css and js successfully';
    }();

    return wssq;
}();


