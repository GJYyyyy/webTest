var wssdqkzs = {
    cxtjgrid : null,
    cxtjForm : null,
    init : function () {
        this.cxtjgrid = mini.get('cxtjgrid');
        this.cxtjForm = new mini.Form("cxtjForm");

        this.djrqDom = mini.get('djrq');
        this.djrqChange();

        var wslxSelectData = [{
            ID:'01',
            MC:'责令限改通知书'
        },{
            ID:'02',
            MC:'简易处罚决定书'
        },{
            ID:'03',
            MC:'全部'
        }];
        mini.get('wslx').setData(wslxSelectData);
        var sdqkSelectData = [{
            ID:'01',
            MC:'未送达'
        },{
            ID:'02',
            MC:'线上送达'
        },{
            ID:'03',
            MC:'线下送达'
        }];
        mini.get('sdqk').setData(sdqkSelectData);
    },
    djrqChange: function () {
        var date = new Date();
        this.djrqDom.setValue(mini.formatDate(date, "yyyy-MM"));
        //演示暂时注释
        // this.djrqDom.setMinDate('2019-05');
        // this.djrqDom.setMaxDate(date);
    },
    nsrsbhValidate: function(e){
        if(e.value == false) return;
        if (e.isValid) {
            if(!/^[a-zA-Z0-9\-]{15,20}$/.test(e.value)){
                e.errorText = "社会信用代码必须为15到20位的字母或数字！";
                e.isValid = false;
                return;
            }
        }
    },
    doSearch: function (str) {
        wssdqkzs.cxtjForm.validate();
        if(!wssdqkzs.cxtjForm.isValid()){
            return false;
        }
        var formData = wssdqkzs.cxtjForm.getData(true);

        var searchData = {
            pageIndex:wssdqkzs.cxtjgrid.pageIndex,  //分页参数
            pageSize:wssdqkzs.cxtjgrid.pageSize,   //分页参数
            djrq:formData.djrq,  //登记日期，精确月
            wslx:formData.wslx,   //文书类型
            sdqk:formData.sdqk,   //送达情况
            shxydm:formData.shxydm //社会信用代码
        };
        wssdqkzs.cxtjgrid.setUrl("/dzgzpt-wsys/api/sh/sbtc/query/wssdqk");
        wssdqkzs.cxtjgrid.load(searchData,function(res){

        },function(data){
            var obj=JSON.parse(data.errorMsg);
            mini.alert(obj.message||"系统异常,请稍后再试。")
        });
    },
    doReset: function () {
        wssdqkzs.cxtjForm.reset();
        wssdqkzs.cxtjgrid.setData("");
        wssdqkzs.djrqChange();
    },
    exportFpqd: function(){
        var rows = wssdqkzs.cxtjgrid.getSelecteds();

        //前置校验
        if (!wssdqkzs.cxtjgrid.data) {
            mini.alert("请先查询");
            return;
        }

        if(wssdqkzs.cxtjgrid == null || wssdqkzs.cxtjgrid == ""){
            mini.alert("查询结果为空，无需导出文件！");
            return ;
        }
        var djrq =  mini.formatDate(mini.get("djrq").value,"yyyy-MM");
        var wslx = mini.get("wslx").value;
        var sdqk = mini.get("sdqk").value;
        var shxydm = mini.get("shxydm").value;
        var pageIndex = wssdqkzs.cxtjgrid.pageIndex;
        var pageSize = wssdqkzs.cxtjgrid.pageSize;

        if (rows.length == 0 || rows.length == pageSize) {
            window.open('/dzgzpt-wsys/api/sh/sbtc/export/wssdqk?djrq='+ djrq +'&wslx=' +wslx+'&sdqk='+sdqk + '&shxydm='+shxydm
                 + '&pageIndex=' + wssdqkzs.cxtjgrid.getPageIndex() + '&pageSize=' + wssdqkzs.cxtjgrid.getPageSize());
        } else {
            openPostWindow('/dzgzpt-wsys/api/sh/sbtc/export/wssdqk', Base64.encode(mini.encode(rows)),'name');
        }
    },
    openShow: function(str){
        var sbtcsjqlGridData = sbtcsjql.sbtcsjqlGrid.getData();
        if (sbtcsjqlGridData[rowIndex].wfss) {
            var wfssStr = sbtcsjqlGridData[rowIndex].wfss;
            wfssStr = wfssStr.replace(/(\r\n)|(\n)/g, ';</br>');
            mini.alert(wfssStr);
        }
        mini.alert(str);
    },
    wfssShow: function(rowIndex){
        var sbtcsjqlGridData = wssdqkzs.cxtjgrid.getData();
        if (sbtcsjqlGridData[rowIndex].wfss) {
            var wfssStr = sbtcsjqlGridData[rowIndex].wfss;
            wfssStr = wfssStr.replace(/(\r\n)|(\n)/g, ';</br>');
            mini.alert(wfssStr);
        }
    },
};

function wfssRenderer(e){
    var recordWfss = e.record;
    var rowIndex = e.rowIndex;
    var wfss = recordWfss.wfss;
    return wfss?'<a class="color-blue wh100 inlineblock lineH36" onclick="wssdqkzs.wfssShow(' + '\'' + rowIndex + '\'' + ')"' + '>详情</a>':'';
}
function lyRenderer(e) {
    var field = e.field;
    var record = e.record;
    var str = record[field];
    return str?'<a class="color-blue wh100 inlineblock lineH36" onclick="wssdqkzs.openShow(' + '\'' + str + '\'' + ')"' + '>查看</a>':'';
}

function openPostWindow(url, data, name) {
    var tempForm = document.createElement('form');
    tempForm.id = 'tempForm1';
    tempForm.method = 'post';
    tempForm.action = url;
    tempForm.target = name;

    var hideInput = document.createElement('input');
    hideInput.type = 'hidden';
    hideInput.name = 'content';

    hideInput.value = data;
    tempForm.appendChild(hideInput);
    $(tempForm).bind('onsubmit', function() {
        openWindow(name);
    });
    document.body.appendChild(tempForm);

    //tempForm.fireEvent('onsubmit');
    $(tempForm).submit();
    document.body.removeChild(tempForm);
}

function openWindow(name) {
    window.open(
        'about:blank',
        name,
        'height=400, width=400, top=0, left=0, toolbar=yes, menubar=yes, scrollbars=yes, resizable=yes,location=yes, status=yes'
    );
}

$(function () {
    mini.parse();
    wssdqkzs.init();
});