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

var dcrydcxc = {
    checkesyjData: [{ id: 'Y', text: '认定非正常户' }, { id: 'N', text: '不认定非正常户'}],
    GridDatas:{
        data:[],
        total:0
    },
    selectMaps: [],
    slswryList:[],
    initPage: function () {
        dcrydcxc.dcrydcxcGrid = mini.get('dcrydcxc_grid');
        dcrydcxc.checkSwryWin = mini.get("dcrydcxcChangeGly-win");

        this.queryGrid();
        dcrydcxc.fillData(0, dcrydcxc.dcrydcxcGrid.getPageSize(), dcrydcxc.GridDatas, dcrydcxc.dcrydcxcGrid);
    },
    // 监听分页前事件，阻止后自行设置当前数据和分页信息
    dataBeforeload: function(e){
        console.log(e)
        e.cancel = true;
        var pageIndex = e.data.pageIndex;
        var pageSize = e.data.pageSize;
        dcrydcxc.fillData(pageIndex, pageSize, dcrydcxc.GridDatas, dcrydcxc.dcrydcxcGrid);
        var rows = dcrydcxc.selectMaps[dcrydcxc.dcrydcxcGrid.getPageIndex()];
        if (rows) {
            for (var i = 0; i < rows.length; i++) {
                dcrydcxc.dcrydcxcGrid.setSelected(rows[i]);
            }
        } else {
            // dcrydcxc.setChose();
        }
    },
    //审核结果选择弹框打开
    openSwryCheck: function(record){
        var rowIndex = record["_number"] % 30;
        record.esyj && mini.get("esyj").select(Number(record.esyj === "Y" ? 1 : 2) - 1);
        record.esyjsm && mini.get("esyjsm").setValue(record.esyjsm);
        dcrydcxc.checkSwryWin.show();
        dcrydcxc.rowIndex = rowIndex;
        dcrydcxc.plfp = false;
    },
    //审核结果选择弹框关闭
    checkSwryCancel: function (e) {
        dcrydcxc.checkSwryForm = new mini.Form("#checkGlyRow-form");
        dcrydcxc.checkSwryForm.reset();
        dcrydcxc.checkSwryWin.hide();
    },
    //审核结果选择--点击确定
    checkSwryOk: function(){
        dcrydcxc.checkSwryForm = new mini.Form("#checkGlyRow-form");
        dcrydcxc.checkSwryForm.validate();
        if (dcrydcxc.checkSwryForm.isValid() == false) return false;
        var formdata = dcrydcxc.checkSwryForm.getDataAndText(true);
        var esyjmc = mini.get('esyj').text;
        var esyjsm = mini.get('esyjsm').getValue();
        if(esyjsm && esyjsm.length > 500){
            mini.alert('意见说明最多可以输入500个字');
            return;
        }
        var dcrydcxcGridData = dcrydcxc.dcrydcxcGrid.getData();
        var pageIndex = dcrydcxc.dcrydcxcGrid.getPageIndex();
        var pageSize = dcrydcxc.dcrydcxcGrid.getPageSize();
        if(!dcrydcxc.plfp){
            var rowIndex = dcrydcxc.rowIndex;
            dcrydcxcGridData[rowIndex].esyj = formdata.esyj;
            dcrydcxcGridData[rowIndex].esyjmc = esyjmc;
            dcrydcxcGridData[rowIndex].esyjsm = formdata.esyjsm;
            dcrydcxc.GridDatas.data[rowIndex+pageIndex*pageSize] = dcrydcxcGridData[rowIndex];
        } else{
            var rows = dcrydcxc.selectMaps;
            for(var i = 0;i < rows.length;i++){
                for(var j=0;j<rows[i].length;j++){
                    dcrydcxc.GridDatas.data[rows[i][j]['_number']].esyj = formdata.esyj;
                    dcrydcxc.GridDatas.data[rows[i][j]['_number']].esyjmc = esyjmc;
                    dcrydcxc.GridDatas.data[rows[i][j]['_number']].esyjsm = formdata.esyjsm;
                }
            }
        }
        dcrydcxc.fillData(dcrydcxc.dcrydcxcGrid.getPageIndex(), dcrydcxc.dcrydcxcGrid.getPageSize(), dcrydcxc.GridDatas, dcrydcxc.dcrydcxcGrid);
        dcrydcxc.checkSwryWin.hide();
        dcrydcxc.checkSwryForm.reset();
        var nowPageRows = dcrydcxc.selectMaps[dcrydcxc.dcrydcxcGrid.getPageIndex()];
        if (nowPageRows) {
            for (var i = 0; i < nowPageRows.length; i++) {
                dcrydcxc.dcrydcxcGrid.setSelected(nowPageRows[i]);
            }
        }
    },
    //点击批量审核
    plsh:function(){
        var rows = dcrydcxc.selectMaps;
        var selectedRowLength = 0;
        for(var d=0;d<rows.length;d++){
            if(rows[d].length > 0){
                selectedRowLength+=rows[d].length;
            }
        }
        if(selectedRowLength < 2){
            mini.alert("选择的纳税人信息必须大于等于两条。");
        } else{
            dcrydcxc.plfp = true;
            dcrydcxc.checkSwryWin.show();
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
    //复选框选中时记录所选数据
    onSelectoinChanged: function(e) {
        // 实现全选所有页面数据
        if (e.selected == null && e.selecteds.length === 30) {
            var alldata = dcrydcxc.GridDatas.data;
            for(var v=0;v<alldata.length;v++){
                alldata[v].selected = 1;
            }
            for (var j=0; j < alldata.length / 30; j++) {
                dcrydcxc.selectMaps[j] = alldata.slice(j*30,j*30 + 30);
            }
            // dcrydcxc.selectMaps = alldata;
        }
        if (e.selected == null && e.selecteds.length === 0) {
            dcrydcxc.selectMaps = [];
        }

        var rows = dcrydcxc.dcrydcxcGrid.getSelecteds();
        for(var t=0;t<rows.length;t++){
            rows[t].selected = 1;
        }
        dcrydcxc.selectMaps[dcrydcxc.dcrydcxcGrid.getPageIndex()] = rows;
    },
    setChose: function() {
        //根据条件获取行数组（selected）
        var rows = dcrydcxc.dcrydcxcGrid.findRows(function (row) {
            if (row.selected == 1) return true;
            else return false;
        });
        dcrydcxc.dcrydcxcGrid.selects(rows);
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
                    for(var g=0;g<dcrydcxc.slswryList.length;g++){
                        if(dcrydcxc.slswryList[g].swryDm == rtnData.userId){
                            mini.get('sygly').setValue(rtnData.userId);
                            break;
                        }
                    }
                } else {
                    mini.alert("查询当前税务人员信息失败");
                }
            }
        });
    },
    //查询数据
    queryGrid: function () {
        $.ajax({
            url: '/dzgzpt-wsys/api/sh/fzchrd/query/esdata?processInstanceId=' + getQueryString("processInstanceId"),
            type: 'get',
            async: false,
            contentType:'application/json; charset=UTF-8',
            success: function (data, textStatus) {
                var data = mini.decode(data);
                if(data.length > 0){
                    for (var i = 0; i < data.length; i++) {
                        data[i]["_number"] = i; //添加编号
                    }

                    dcrydcxc.GridDatas={
                        data:data,
                        total:data.length
                    };
                    for(var z=0; z<data.length/dcrydcxc.dcrydcxcGrid.getPageSize(); z++){
                        dcrydcxc.selectMaps[z] = [];
                    }
                } else{
                    mini.alert('未查询到数据');
                    dcrydcxc.GridDatas = {
                        data:[],
                        total:0
                    };
                }

                dcrydcxc.fillData(0, dcrydcxc.dcrydcxcGrid.getPageSize(), dcrydcxc.GridDatas, dcrydcxc.dcrydcxcGrid);
            },
            error:function(error){
                mini.alert(error.message || '接口异常，请稍后重试');
                dcrydcxc.GridDatas = {
                    data:[],
                    total:0
                };
                dcrydcxc.fillData(0, dcrydcxc.dcrydcxcGrid.getPageSize(), dcrydcxc.GridDatas, dcrydcxc.dcrydcxcGrid);
            }
        });
    }
};
function ysyjRenderer(e) {
    var record = e.record;
    var rowIndex = e.rowIndex;
    var ysyj = record.ysyj;
    return ysyj === "Y" ? "认定非正常户" : "不认定非正常户";
}
function esyjmcRenderer(e){
    var record = e.record;
    var rowIndex = e.rowIndex;
    var esyjmc = record.esyjmc;
    return '<a class="color-blue wh100 inlineblock lineH36" onclick="dcrydcxc.openSwryCheck(record)">' + (esyjmc?(esyjmc):'请选择') + '</a>';
}
function esyjsmRenderer(e){
    var record = e.record;
    var rowIndex = e.rowIndex;
    var esyjsm = record.esyjsm;
    return '<a class="color-blue wh100 inlineblock lineH36" onclick="dcrydcxc.openSwryCheck(record)">' + (esyjsm?(esyjsm):'请选择') + '</a>';
}
function jcqkRenderer(e){
    var record = e.record;
    var rowIndex = e.rowIndex;
    var jcqk = record.jcqk;
    return jcqk == "01" ? "查无下落" : "已改正，无需认定非正常户";
}
//推送成功后执行清空查询数据操作
function sendResult(){
    dcrydcxc.fillData(mini.get('dcrydcxc_grid').getPageIndex(), mini.get('dcrydcxc_grid').getPageSize(), {data:[],total:0}, dcrydcxc.dcrydcxcGrid);
}
function getQueryString(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return unescape(r[2]);
    }
    return null;
}
//点击保存要调用的方法
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
    console.log(e,"保存方法参数");

    var saveData = dcrydcxc.GridDatas.data;
    if(saveData.length == 0){
        mini.alert('没有需要保存的数据');
        return;
    }
    for(var t=0;t<saveData.length;t++) {
        saveData[t].processInstanceId = getQueryString("processInstanceId");
    }
    var saveSuccess = false;

    $.ajax({
        url: '/dzgzpt-wsys/api/sh/fzchrd/save/esdata',
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
    var saveData = dcrydcxc.GridDatas.data;
    var allSh = true;
    var saveSuccess = {};
    if(saveData.length == 0){
        mini.alert('无可推送的数据');
    } else{
        for(var t=0;t<saveData.length;t++){
            if(!saveData[t].esyj){
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
    var saveData = dcrydcxc.GridDatas.data;
    var saveSuccess = {};
    for(var t=0;t<saveData.length;t++){
        if(!saveData[t].esyj){
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

$(function () {
    dcrydcxc.initPage()
});