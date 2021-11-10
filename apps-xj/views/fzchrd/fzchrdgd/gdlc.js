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

var processInstanceId;
function setDate(e) {
    processInstanceId = e;
    fzchrd.queryGrid();
}

var fzchrd = {
    checksfysysksbData: [{ id: 'Y', text: '是' }, { id: 'N', text: '否'}],
    checkjcqkData:[{ id:'01', text: '查无下落' }, { id:'02', text: '已改正，无需认定非正常户'}],
    GridDatas:{
        data:[],
        total:0
    },
    selectMaps: [],
    initPage: function () {
        fzchrd.fzchrdGrid = mini.get('fzchrd_grid');
        fzchrd.checkSwryWin = mini.get("fzchrdChangeGly-win");

        // this.queryGrid();
    },
    //查询数据
    queryGrid: function () {

        $.ajax({
            url : "/dzgzpt-wsys/api/sh/fzchrd/query/gddata?processInstanceId=" + processInstanceId,
            type : "get",
            async: false,
            // dataType: "text",
            success : function(obj) {
                var datas = mini.decode(obj);
                fzchrd.fzchrdGrid.setData(datas);
            },
            error : function() {
                var obj = JSON.parse(data.errorMsg);
                mini.alert(obj.message || "系统异常,请稍后再试。")
            }
        });
    },
    //当前登录的税务人员
    loginUser: function(){
        $.ajax({
            type: "POST",
            url: "/dzgzpt-wsys/api/wtgl/public/login/session",
            data: {},
            async: false,
            success: function (data) {
                var returnData = mini.decode(data);
                if (returnData.success) {
                    var rtnData= mini.decode(returnData.value);
                    for(var g=0; g<fzchrd.slswryList.length; g++){
                        if(fzchrd.slswryList[g].swryDm == rtnData.userId){
                            mini.get('sygly').setValue(rtnData.userId);
                            break;
                        }
                    }
                } else {
                    mini.alert("查询当前税务人员信息失败");
                }
            }
        });
    }
};

function getQueryString(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return unescape(r[2]);
    }
    return null;
}

function sfqsRenderer(e) {
    var record = e.record;
    var rowIndex = e.rowIndex;
    var sfQs = record.sfqs;
    return sfQs === "Y" ? "是" : "否";
}
function ysyjRenderer(e) {
    var record = e.record;
    var rowIndex = e.rowIndex;
    var ysyj = record.ysyj;
    return ysyj === "Y" ? "认定非正常户" : "不认定非正常户";
}
function esyjRenderer(e) {
    var record = e.record;
    var rowIndex = e.rowIndex;
    var esyj = record.esyj;
    return esyj === "Y" ? "认定非正常户" : "不认定非正常户";
}
function sfysysksbRenderer(e){
    var record = e.record;
    var rowIndex = e.rowIndex;
    var sfysysksb = record.sfysysksb;
    return sfysysksb == "Y" ? "是" : "否";
}
function jcqkRenderer(e){
    var record = e.record;
    var rowIndex = e.rowIndex;
    var jcqk = record.jcqk;
    return jcqk == "01" ? "查无下落" : "已改正，无需认定非正常户";
}

$(function () {
    fzchrd.initPage()
});