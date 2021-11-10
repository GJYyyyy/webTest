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
        fzchrd.jcrqWin = mini.get("jcrq");

        this.queryGrid();
        fzchrd.fillData(0, fzchrd.fzchrdGrid.getPageSize(), fzchrd.GridDatas, fzchrd.fzchrdGrid);
    },
    //查询数据
    queryGrid: function () {
        $.ajax({
            url: '/dzgzpt-wsys/api/sh/fzchrd/query/dcxc?processInstanceId=' + getQueryString("processInstanceId"),
            type: 'get',
            async: false,
            contentType:'application/json; charset=UTF-8',
            success: function (data, textStatus) {
                var data = mini.decode(data);
                if(data.length > 0){
                    var day = mini.formatDate(new Date(),"yyyy-MM-dd");
                    for (var i = 0; i < data.length; i++) {
                        data[i].jcrq = day; //默认当天
                        data[i]["_number"] = i; //添加编号
                    }

                    fzchrd.GridDatas={
                        data:data,
                        total:data.length
                    };
                    for(var z=0; z<data.length/fzchrd.fzchrdGrid.getPageSize(); z++){
                        fzchrd.selectMaps[z] = [];
                    }
                } else{
                    mini.alert('未查询到数据');
                    fzchrd.GridDatas = {
                        data:[],
                        total:0
                    };
                }

                fzchrd.fillData(0, fzchrd.fzchrdGrid.getPageSize(), fzchrd.GridDatas, fzchrd.fzchrdGrid);
            },
            error: function(error){
                mini.alert(error.message || '接口异常，请稍后重试');
                fzchrd.GridDatas = {
                    data:[],
                    total:0
                };
                fzchrd.fillData(0, fzchrd.fzchrdGrid.getPageSize(), fzchrd.GridDatas, fzchrd.fzchrdGrid);
            }
        });
    },
    // 监听分页前事件，阻止后自行设置当前数据和分页信息
    dataBeforeload: function(e){
        e.cancel = true;
        var pageIndex = e.data.pageIndex;
        var pageSize = e.data.pageSize;
        fzchrd.fillData(pageIndex, pageSize, fzchrd.GridDatas, fzchrd.fzchrdGrid);
        var rows = fzchrd.selectMaps[fzchrd.fzchrdGrid.getPageIndex()];
        if (rows) {
            for (var i = 0; i < rows.length; i++) {
                fzchrd.fzchrdGrid.setSelected(rows[i]);
            }
        } else {
            // fzchrd.setChose();
        }
    },
    //审核结果选择弹框打开
    openSwryCheck: function(record){
        var rowIndex = record["_number"] % 30;
        //检查时间设置
        mini.get("jcrq").setValue(record.jcrq);
        record.sfysysksb && mini.get("sfysysksb").select(Number(record.sfysysksb === "Y" ? 1 : 2) - 1);
        record.jcqk && mini.get("jcqk").select(Number(record.jcqk) - 1);
        fzchrd.checkSwryWin.show();
        fzchrd.rowIndex = rowIndex;
        fzchrd.plfp = false;
    },
    //审核结果选择弹框关闭
    checkSwryCancel: function (e) {

        fzchrd.checkSwryForm = new mini.Form("#checkGlyRow-form");
        fzchrd.checkSwryForm.reset();
        fzchrd.checkSwryWin.hide();
    },
    //审核结果选择--点击确定
    checkSwryOk: function(){
        fzchrd.checkSwryForm = new mini.Form("#checkGlyRow-form");
        fzchrd.checkSwryForm.validate();
        if (fzchrd.checkSwryForm.isValid() == false) return false;
        var formdata = fzchrd.checkSwryForm.getDataAndText(true);
        var jcrq = mini.get('jcrq').getValue();
        var sfysysksbtext = mini.get('sfysysksb').text;
        var jcqktext = mini.get('jcqk').text;
        var fzchrdGridData = fzchrd.fzchrdGrid.getData();
        var pageIndex = fzchrd.fzchrdGrid.getPageIndex();
        var pageSize = fzchrd.fzchrdGrid.getPageSize();
        if(!fzchrd.plfp){
            var rowIndex = fzchrd.rowIndex;
            fzchrdGridData[rowIndex].jcrq = formdata.jcrq;
            fzchrdGridData[rowIndex].sfysysksb = formdata.sfysysksb;
            fzchrdGridData[rowIndex].jcqk = formdata.jcqk;
            fzchrdGridData[rowIndex].sfysysksbmc = sfysysksbtext;
            fzchrdGridData[rowIndex].jcqkmc = jcqktext;
            fzchrd.GridDatas.data[rowIndex+pageIndex*pageSize] = fzchrdGridData[rowIndex];
        } else {
            var rows = fzchrd.selectMaps;
            for(var i = 0;i < rows.length;i++){
                for(var j=0;j<rows[i].length;j++){
                    fzchrd.GridDatas.data[rows[i][j]['_number']].jcrq = formdata.jcrq;
                    fzchrd.GridDatas.data[rows[i][j]['_number']].sfysysksb = formdata.sfysysksb;
                    fzchrd.GridDatas.data[rows[i][j]['_number']].jcqk = formdata.jcqk;
                    fzchrd.GridDatas.data[rows[i][j]['_number']].sfysysksbmc = sfysysksbtext;
                    fzchrd.GridDatas.data[rows[i][j]['_number']].jcqkmc = jcqktext;
                }
            }
        }
        fzchrd.fillData(fzchrd.fzchrdGrid.getPageIndex(), fzchrd.fzchrdGrid.getPageSize(), fzchrd.GridDatas, fzchrd.fzchrdGrid);
        fzchrd.checkSwryWin.hide();
        fzchrd.checkSwryForm.reset();
        var nowPageRows = fzchrd.selectMaps[fzchrd.fzchrdGrid.getPageIndex()];
        if (nowPageRows) {
            for (var i = 0; i < nowPageRows.length; i++) {
                fzchrd.fzchrdGrid.setSelected(nowPageRows[i]);
            }
        }
    },
    //点击批量审核
    plsh:function(){
        var rows = fzchrd.selectMaps;
        var selectedRowLength = 0;
        for(var d=0;d<rows.length;d++){
            if(rows[d].length > 0){
                selectedRowLength+=rows[d].length;
            }
        }
        if(selectedRowLength < 2){
            mini.alert("选择的信息必须大于等于两条。");
        } else{
            fzchrd.plfp = true;
            fzchrd.checkSwryWin.show();
        }
    },
    //校验纳税人识别号格式
    nsrsbhValidate: function(e){
        if (e.isValid && e.value) {
            if(!/^[a-zA-Z0-9\-]{15,20}$/.test(e.value)){
                e.errorText = "社会信用代码必须为15到20位的字母或数字！";
                e.isValid = false;
                return;
            }
        }
    },
    //假分页显示当前页数据
    fillData: function(pageIndex, pageSize, dataResult, grid) {
        var data = dataResult.data;
        var totalCount = dataResult.total;
        var arr = [];
        var start = pageIndex * pageSize,
            end = start + pageSize;
        for (var i = start, l = end; i < l; i++) {
            var record = data[i];
            if (!record) continue;
            arr.push(record);
        }
        grid.setTotalCount(totalCount);
        grid.setPageIndex(pageIndex);
        grid.setPageSize(pageSize);
        grid.setData(arr);
    },
    onGridLoad: function(e) {
        console.log('onGridLoad',e)
    },
    //复选框选中时记录所选数据
    onSelectoinChanged: function(e) {
        // 实现全选所有页面数据
        var pageSize = fzchrd.fzchrdGrid.getPageSize();
        if (e.selected == null && e.selecteds.length === 30) {
            var alldata = fzchrd.GridDatas.data;
            for(var v=0;v<alldata.length;v++){
                alldata[v].selected = 1;
            }
            for (var j=0; j < alldata.length / 30; j++) {
                fzchrd.selectMaps[j] = alldata.slice(j*30,j*30 + 30);
            }
            // fzchrd.selectMaps = alldata;
        }
        if (e.selected == null && e.selecteds.length === 0) {
            fzchrd.selectMaps = [];
        }

        var rows = fzchrd.fzchrdGrid.getSelecteds();
        for(var t=0;t<rows.length;t++){
            rows[t].selected = 1;
        }
        fzchrd.selectMaps[fzchrd.fzchrdGrid.getPageIndex()] = rows;
    },
    setChose: function() {
        //根据条件获取行数组（selected）
        var rows = fzchrd.fzchrdGrid.findRows(function (row) {
            if (row.selected == 1) return true;
            else return false;
        });
        fzchrd.fzchrdGrid.selects(rows);
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
//推送成功后执行清空查询数据操作
function sendResult(){
    fzchrd.fillData(mini.get('fzchrd_grid').getPageIndex(), mini.get('fzchrd_grid').getPageSize(), {data:[],total:0}, fzchrd.fzchrdGrid);
}
//点击保存要调用的方法
var saveState = true;
function saveData(e){
    var saveData = fzchrd.GridDatas.data;
    if(saveData.length == 0){
        mini.alert('没有需要保存的数据');
        return;
    }
    for(var t=0;t<saveData.length;t++) {
        saveData[t].processInstanceId = getQueryString("processInstanceId");
    }
    var saveSuccess = false;
    $.ajax({
        url: '/dzgzpt-wsys/api/sh/fzchrd/save/dcxc',
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


function sfqsRenderer(e) {
    var record = e.record;
    var rowIndex = e.rowIndex;
    var sfQs = record.sfQs;
    return sfQs === "Y" ? "是" : "否";
}
function jcrqRenderer(e){
    var record = e.record;
    var rowIndex = e.rowIndex;
    var jcrq = record.jcrq;
    return '<a class="color-blue wh100 inlineblock lineH36" onclick="fzchrd.openSwryCheck(record)">' + (jcrq?(jcrq):'') + '</a>';
}
function sfysysksbRenderer(e){
    var record = e.record;
    var rowIndex = e.rowIndex;
    var sfysysksbmc = record.sfysysksbmc;
    return '<a class="color-blue wh100 inlineblock lineH36" onclick="fzchrd.openSwryCheck(record)">' + (sfysysksbmc?(sfysysksbmc):'请选择') + '</a>';
}
function jcqkRenderer(e){
    var record = e.record;
    var rowIndex = e.rowIndex;
    var jcqkmc = record.jcqkmc;
    return '<a class="color-blue wh100 inlineblock lineH36" onclick="fzchrd.openSwryCheck(record)">' + (jcqkmc?(jcqkmc):'请选择') + '</a>';
}

$(function () {
    fzchrd.initPage()
});