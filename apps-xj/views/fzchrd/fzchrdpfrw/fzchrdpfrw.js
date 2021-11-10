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

$(function () {
    mini.parse();
    fzchrdpfrw.init();
});

var fzchrdpfrw = {
    init: function () {
        this.qymdGrid = mini.get("szpfrw_grid");

        this.rwmcInner = mini.get("rwmc_inner");
        this.rwpchInner = mini.get("rwpch_inner");

        $.ajax({
            url : "/dzgzpt-wsys/api/sh/fzchrd/query/szpf",
            type : "get",
            async: false,
            success : function(obj) {
                var datas = mini.decode(obj);
                fzchrdpfrw.qymdGrid.setData(datas);
            },
            error : function() {
                var obj = JSON.parse(data.errorMsg);
                mini.alert(obj.message || "系统异常,请稍后再试。")
            }
        });
    }
};

function nsrsbhValidate(e) {
    if (e.value == false) return;
    if (e.isValid) {
        if (!/^[a-zA-Z0-9\-]{15,20}$/.test(e.value)) {
            e.errorText = "纳税人识别号必须为15到20位的字母或数字！";
            e.isValid = false;
            return;
        }
    }
}

function sendResult(){
    fzchrdpfrw.init();
}

//保存
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

function saveData(e){
    var saveData = fzchrdpfrw.qymdGrid.getData();
    if(saveData.length == 0){
        mini.alert('没有需要保存的数据');
        return;
    }
    for(var t=0;t<saveData.length;t++){
        saveData[t].processInstanceId = getQueryString("processInstanceId");
    }
    var saveSuccess = false;
    $.ajax({
        url: '/dzgzpt-wsys/api/sh/fzchrd/save/szpfxx',
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
//拆分表单
function getSplitByForm(e){
    var saveData = fzchrdpfrw.qymdGrid.getData();
    var allSh = true;
    var saveSuccess = {};
    if(saveData.length == 0){
        mini.alert('无可推送的数据');
    } else{
        for(var t=0;t<saveData.length;t++){
            if(!saveData[t].jcryDm){
                mini.alert('存在未录入的数据，不能推送');
                allSh = false;
                return false;
            }
            saveData[t].processInstanceId = getQueryString("processInstanceId");
            saveData[t].taskId = getQueryString("taskId");
            saveData[t].formId = getQueryString("formId");
        }
        if(allSh){
            $.ajax({
                url: '/dzgzpt-wsys/api/sh/fzchrd/get/formdata',
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
    var saveData = fzchrdpfrw.qymdGrid.getData();
    var saveSuccess = {};
    for(var t=0;t<saveData.length;t++){
        if(!saveData[t].jcryDm){
            mini.alert('存在未录入的数据，不能推送');
            allSh = false;
            return false;
        }
        saveData[t].processInstanceId = getQueryString("processInstanceId");
        saveData[t].taskId = getQueryString("taskId");
        saveData[t].formId = getQueryString("formId");
    }
    $.ajax({
        url: '/dzgzpt-wsys/api/sh/fzchrd/getFormParams',
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
