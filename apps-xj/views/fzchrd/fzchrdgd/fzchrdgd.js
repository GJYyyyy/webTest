var wssq={};
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

var fzchrd = {
    checkzllxData: [{ id: 'Y', text: '是' }, { id: 'N', text: '否'}],
    checkjcqkData:[{ id:'01', text: '查无下落' }, { id:'02', text: '已改正，无需认定非正常户'}],
    GridDatas:{
        "data":[
            {
                "zlmc" : "非正常户认定调查巡查",
                "wszg" : "",
                "ys" : "1",
                "yh" : "1",
                "zllx" : "其他资料"
            }
        ],
        "total":0
    },
    initPage: function () {
        fzchrd.fzchrdGrid = mini.get('fzchrd_grid');
        fzchrd.checkSwryWin = mini.get("fzchrdChangeGly-win");
        fzchrd.fzchrdGrid.setData(fzchrd.GridDatas.data);

        this.queryGrid();
    },
    //查询数据
    queryGrid: function () {
        $.ajax({
            url : "/dzgzpt-wsys/api/sh/fzchrd/query/gddata?processInstanceId=" + getQueryString("processInstanceId"),
            type : "get",
            async: false,
            // dataType: "text",
            success : function(obj) {
                fzchrd.DetailDatas = mini.decode(obj);
            },
            error : function() {
                var obj = JSON.parse(data.errorMsg);
                mini.alert(obj.message || "系统异常,请稍后再试。")
            }
        });

        $.ajax({
            url : "/dzgzpt-wsys/api/wtgl/dbsx/getSession",
            type : "get",
            async: false,
            success : function(obj) {
                if (obj.success) {
                    $('#jcbm').html(obj.value.swjgMc);
                    $('#gdry').html(obj.value.username);
                    $('#jcry').html(fzchrd.DetailDatas ? fzchrd.DetailDatas[0].jcry : '');
                }
            },
            error : function() {
                var obj = JSON.parse(data.errorMsg);
                mini.alert(obj.message || "系统异常,请稍后再试。")
            }
        });
    },
    openDetail: function (e) {
        fzchrd.upWin = mini.open({
            url: 'gdlc.html',  //页面地址
            title: '非正常户认定调查巡查',      //标题
            iconCls: '',    //标题图标
            width: "100%",      //宽度
            height: 600,     //高度
            allowResize: true,       //允许尺寸调节
            allowDrag: true,         //允许拖拽位置
            showCloseButton: true,   //显示关闭按钮
            showMaxButton: false,     //显示最大化按钮
            showModal: true,         //显示遮罩
            currentWindow:false,      //是否在本地弹出页面,默认false
            effect:'none',              //打开和关闭时的特果:'none','slow','fast',默认'none'
            onload: function () {
                var iframe = this.getIFrameEl();
                iframe.contentWindow.setDate(getQueryString("processInstanceId"));
            },
            ondestroy: function(action){
            }
        });

    }
};

function zlmcRenderer(e) {
    var record = e.record;
    var rowIndex = e.rowIndex;
    var zlmc = record.zlmc;
    return '<a class="" onclick="fzchrd.openDetail(record)" href ="#">非正常户认定调查巡查</a>';
}

//推送成功后执行清空查询数据操作
function sendResult(){
    fzchrd.fillData(mini.get('fzchrd_grid').getPageIndex(), mini.get('fzchrd_grid').getPageSize(), {data:[],total:0}, fzchrd.fzchrdGrid);
}

var message = new MyMessage.message({
    /*默认参数，下面为默认项*/
    iconFontSize: "20px", //图标大小,默认为20px
    messageFontSize: "12px", //信息字体大小,默认为12px
    showTime: 3000, //消失时间,默认为3000
    align: "center", //显示的位置类型center,right,left
    positions: { //放置信息距离周边的距离,默认为10px
        top: "10px",
        bottom: "10px",
        right: "10px",
        left: "10px"
    },
    message: "这是一条消息", //消息内容,默认为"这是一条消息"
    type: "normal", //消息的类型，还有success,error,warning等，默认为normal
});
//点击保存要调用的方法
function saveData(e){
    var saveData = fzchrd.GridDatas.data;
    if(saveData.length == 0){
        mini.alert('没有需要保存的数据');
        return;
    }
    var saveSuccess = false;
    $.ajax({
        url: '/dzgzpt-wsys/api/sh/sbtc/saveZcfp',
        type: 'POST',
        async: false,
        contentType:'application/json; charset=UTF-8',
        data: mini.encode(saveData),
        success: function (data, textStatus) {
            if(data.success){
                message.add("保存成功，请记得及时推送。", "success");
                saveSuccess = true;
            } else{
                message.add(data.message || '保存失败，请稍后重试', "warning");
            }
        },
        error:function(error){
            mini.alert(error.message || '接口异常，请稍后重试');

        }
    });
    return saveSuccess;
}
function getSplitByForm(){
    var saveData = fzchrd.GridDatas.data;
    var allSh = true;
    var saveSuccess = {};
    if(saveData.length == 0){
        mini.alert('无可推送的数据');
    } else{
        for(var t=0;t<saveData.length;t++){
            if(!saveData[t].sfysysksb || !saveData[t].jcqk || !saveData[t].jcrq){
                mini.alert('存在未录入的数据，不能推送');
                allSh = false;
                break;
            }
            saveData[t].processInstanceId = getQueryString("processInstanceId");
            saveData[t].taskId = getQueryString("taskId");
            saveData[t].formId = getQueryString("formId");
        }
        if(allSh){
            $.ajax({
                url: '/dzgzpt-wsys/api/sh/sbtc/saveTsfp',
                type: 'POST',
                async: false,
                contentType:'application/json; charset=UTF-8',
                data: mini.encode(saveData),
                success: function (data, textStatus) {
                    if(data.success){
                        saveSuccess = data.value;
                        sendResult();
                    }
                },
                error:function(error){
                    saveSuccess = false;
                    mini.alert(error.message || '接口异常，请稍后重试');
                }
            });
        }
        return saveSuccess;
    }
}
function getFormParams(){
    var saveData = fzchrd.GridDatas.data;
    var saveSuccess = {};
    for(var t=0;t<saveData.length;t++){
        if(!saveData[t].sfysysksb || !saveData[t].jcqk || !saveData[t].jcrq){
            mini.alert('存在未录入的数据，不能推送');
            allSh = false;
            break;
        }
        saveData[t].processInstanceId = getQueryString("processInstanceId");
        saveData[t].taskId = getQueryString("taskId");
        saveData[t].formId = getQueryString("formId");
    }
    $.ajax({
        url: '/dzgzpt-wsys/api/sh/sbtc/getFormParams',
        type: 'POST',
        async: false,
        contentType:'application/json; charset=UTF-8',
        data: mini.encode(saveData),
        success: function (data, textStatus) {
            if(data){
                saveSuccess = data;
            }
        },
        error:function(error){
            mini.alert(error.message || '接口异常，请稍后重试');

        }
    });
    return saveSuccess;
}

function getQueryString(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return unescape(r[2]);
    }
    return null;
}

$(function () {
    fzchrd.initPage()
});