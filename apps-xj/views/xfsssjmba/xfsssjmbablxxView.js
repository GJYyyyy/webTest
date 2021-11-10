$(function () {
    mini.parse();
});

var zzsjmBl={
    jmzlxChanged: function(e){
        var grid = mini.get("jms1_grid");
        if(e.value == '01'){
            grid.updateRow(0,"jzed","");
            grid.updateRow(0,"jzfd","");
            grid.updateRow(0,"jzsl","");
        }else if(e.value == '02'){
            grid.updateRow(0,"jzsl","");
            grid.updateRow(0,"jzed","");
            grid.updateRow(0,"jzfd","");
        }
    }
};


function nextShowSwsxtzs() {
    //1.取补录信息数据
    var blxxForm = new mini.Form("#blxxChgForm");
    blxxForm.validate();
    if (!blxxForm.isValid()) {
        return;
    }
    zzsjmBl.grid.validate();
    if (!zzsjmBl.grid.isValid()) {
        return;
    }
    var sjObj = {
        "jmqxq":mini.get("yhqxq").getText(),
        "jmqxz":mini.get("yhqxz").getText()
    }
    var blxxObj = $.extend({},zzsjmBl.grid.getData()[0],sjObj);
    var blxxData = {},
        blnr = [];
    blxxObj=getGt3Data(blxxObj);
    blnr.push(blxxObj);
    blxxData["blnr"]=blnr;
    CloseWindow(blxxData);
}

function setData(rwbh) {
    var sqxh = rwbh.sqxh;
    var lcslId = rwbh.lcslId;
    var swsxDm = rwbh.swsxDm;
    var rwbh1 = rwbh.rwbh;
    mini.get("sqxh").setValue(sqxh);
    mini.get("lcslId").setValue(lcslId);
    mini.get("rwbh").setValue(rwbh1);
    mini.get("swsxDm").setValue(swsxDm);
    zzsjmBl.sqxxData = mini.decode(rwbh.sqsxData.data);

    // var gridReadOnly = mini.get("jms0_grid");
    zzsjmBl.txxx = mini.decode(rwbh.sqsxData.viewData).step_yl_form;
    zzsjmBl.readData = {};
    zzsjmBl.readData.ssjmxzhzText = zzsjmBl.txxx.ssjmxzText;
    zzsjmBl.readData.jmsspsxText = zzsjmBl.txxx.ssyhsxText;
    zzsjmBl.readData.jmqxq = zzsjmBl.txxx.jmqxq;
    zzsjmBl.readData.jmqxz = zzsjmBl.txxx.jmqxz;
    zzsjmBl.readData.sfz = "消费税";
    zzsjmBl.YHSXDM = zzsjmBl.txxx.ssjmxzDm;
    // var loadReadText=[];
    // loadReadText[0]=zzsjmBl.readData;
    // gridReadOnly.setData(loadReadText);
    zzsjmBl.grid = mini.get("jms1_grid");


    mini.get("yhsx").setValue(zzsjmBl.readData.jmsspsxText);
    mini.get("yhqxq").setValue(zzsjmBl.readData.jmqxq);
    mini.get("yhqxz").setValue(zzsjmBl.readData.jmqxz);

    var jmsInitArray = [{
        "jmxzdl":"",
        "jmxzxl":"",
        "ssyhlx":"",
        "jmqlx":"",
        "jmqfs":"",
        "jzed":"",
        "jzfd":"",
        "jzsl":""
    }];

    mini.get("jms1_grid").setData(jmsInitArray);
    var dlEditor = zzsjmBl.grid.getCellEditor(0);
    var xlEditor = zzsjmBl.grid.getCellEditor(1);
    if (dlEditor.getData().length > 0) {
        zzsjmBl.grid.updateRow(0,"jmxzdl",dlEditor.getData()[0].ID);
        zzsjmBl.grid.updateRow(0,"ssjmxzdlDm",dlEditor.getData()[0].ID);
        zzsjmBl.grid.updateRow(0,"ssjmxzdlText",dlEditor.getData()[0].MC);
    }
    if (xlEditor.getData().length > 0) {
        zzsjmBl.grid.updateRow(0,"jmxzxl",xlEditor.getData()[0].ID);
        zzsjmBl.grid.updateRow(0,"ssjmxzxlText",xlEditor.getData()[0].MC);
        zzsjmBl.grid.updateRow(0,"ssjmxzxlDm",xlEditor.getData()[0].ID);
    }
}

function CloseWindow(action) {
    if (window.CloseOwnerWindow)
        return window.CloseOwnerWindow(action);
    else
        window.close();
}

function onCancel(e) {
    CloseWindow("cancel");
}

function cellbeginedit(e) {
        var grid = mini.get("jms1_grid");
        var jmlx = e.record.jmlx;
        var jmzlx = e.record.jmzlx;
        var oldValue = e.value;
        var field = e.field;
        var row = e.row;
        var editor = e.editor;
        var combo =e.column.editor;
    if(e.field === 'jzed'){
        editor.enable();
        if(jmzlx === '02'){
            grid.updateRow(e.rowIndex,"jzed","");
            editor.disable();
        }
    }
    if(field === 'jzfd'){
        editor.enable();
        if(jmzlx === '02'){
            grid.updateRow(e.rowIndex,"jzfd","");
            editor.disable();
        }
    }
    if(field === 'jzsl'){
        editor.enable();
        if(jmzlx === '02'){
            grid.updateRow(e.rowIndex,"jzsl","");
            editor.disable();
        }
    }
        /*if (field === "jmxzdl") {
            var urldl = "/dzgzpt-wsys/api/baseCode/CombSelect/common?codeName=SSJMXZDL&filterVal="+ zzsjmBl.YHSXDM;
            ajax.get(urldl, "", function (data) {
                var ssjmxzData = data;
                combo.setData(ssjmxzData);
            }, function () {
                mini.alert("请求异常，稍后再试！", '提示', function () {
                    window.close();
                });
            })
            zzsjmBl.grid.unFrozenColumns();
        }else if(field === "jmxzxl"){
            var urlxl = "/dzgzpt-wsys/api/baseCode/CombSelect/common?codeName=SSJMXZXL&filterVal="+ zzsjmBl.YHSXDM;
            ajax.get(urlxl, "", function (data) {
                var ssjmxzData = data;
                combo.setData(ssjmxzData);
            }, function () {
                mini.alert("请求异常，稍后再试！", '提示', function () {
                    window.close();
                });
            })
            zzsjmBl.grid.unFrozenColumns();
        }else */
        if(field === "jmzlx"){
            //var urlxl = "/dzgzpt-wsys/api/baseCode/CombSelect/common/DM_YH_JMLX";
            var urlxl = "/dzgzpt-wsys/api/baseCode/CombSelect/common/moreFilter?codeName=SSJMXZJMZLX&filterVals="+zzsjmBl.YHSXDM+";10102";
            ajax.get(urlxl, "", function (data) {
                var ssjmxzData = data;
                combo.setData(ssjmxzData);
            }, function () {
                mini.alert("请求异常，稍后再试！", '提示', function () {
                    window.close();
                });
            })
            zzsjmBl.grid.unFrozenColumns();
        }else if(field === "jmlx"){
            //var urlxl = "/dzgzpt-wsys/api/baseCode/CombSelect/common/DM_YH_JMFS";
            var urlxl = "/dzgzpt-wsys/api/baseCode/CombSelect/common?codeName=SWSXJMLX&filterVal="+zzsjmBl.sqxxData.ssjmbaVO.YHJmssqspbMxGrid.YHJmssqspbMxGridlb[0].jmsspsxDm;
            ajax.get(urlxl, "", function (data) {
                var ssjmxzData = data;
                combo.setData(ssjmxzData);
            }, function () {
                mini.alert("请求异常，稍后再试！", '提示', function () {
                    window.close();
                });
            });
            zzsjmBl.grid.unFrozenColumns();
        }
}

function cellendedit(e) {
    var value = e.value;
    var index = e.rowIndex;
    var field = e.field;
    var record = e.record;
    var editor = e.editor;
    var row = e.row;
    if(field=="jmxzdl"){
        for(var n = 0,len = editor.data.length ; n < len ; n++ ){
            if(value==editor.data[n].ID){
                zzsjmBl.grid.updateRow(index,"ssjmxzdlDm",editor.data[n].ID);
                zzsjmBl.grid.updateRow(index,"ssjmxzdlText",editor.data[n].MC);
                zzsjmBl.grid.updateRow(index,"jmxzdl",editor.data[n].ID);
            }
        }
        zzsjmBl.grid.unFrozenColumns();
    }else if(field=="jmxzxl"){
        for(var n = 0,len = editor.data.length ; n < len ; n++ ){
            if(value==editor.data[n].ID){
                zzsjmBl.grid.updateRow(index,"ssjmxzxlText",editor.data[n].MC);
                zzsjmBl.grid.updateRow(index,"ssjmxzxlDm",editor.data[n].ID);
                zzsjmBl.grid.updateRow(index,"jmxzxl",editor.data[n].ID);
            }
        }
        zzsjmBl.grid.unFrozenColumns();
    }else if(field=="jmlx"){
        for(var n = 0,len = editor.data.length ; n < len ; n++ ){
            if(value==editor.data[n].ID){
                zzsjmBl.grid.updateRow(index,"jmlxText",editor.data[n].MC);
                zzsjmBl.grid.updateRow(index,"jmlx",editor.data[n].ID);
                zzsjmBl.grid.updateRow(index,"jmlxDm",editor.data[n].ID);
            }
        }
        zzsjmBl.grid.unFrozenColumns();
    }else if(field=="jmfs"){
        for(var n = 0,len = editor.data.length ; n < len ; n++ ){
            if(value==editor.data[n].ID){
                zzsjmBl.grid.updateRow(index,"jmfsText",editor.data[n].MC);
                zzsjmBl.grid.updateRow(index,"jmfs",editor.data[n].ID);
                zzsjmBl.grid.updateRow(index,"jmfsDm",editor.data[n].ID);
            }
        }
        zzsjmBl.grid.unFrozenColumns();
    }
    zzsjmBl.grid.validate();
}

var onDateChanged = function (e) {
    var yhqxzValue = mini.get("yhqxz").getValue();
    var yhqxqValue = mini.get("yhqxq").getValue();
    if (!yhqxzValue || !yhqxqValue) {
        return;
    }
    if (this.name == "jmqxq") {
        if (this.value > yhqxzValue) {
            this.setValue("");
            mini.alert("减免有效期起不能晚于减免有效期止");
        }
    } else if (this.name == "jmqxz") {
        var theEndOfThisMonth = new Date(this.value.getFullYear(), this.value.getMonth() + 1, 0);
        if (theEndOfThisMonth < yhqxqValue) {
            this.setValue("");
            mini.alert("减免有效期止不能早于减免有效期起");
            return;
        }
        this.setValue(theEndOfThisMonth);
    } else {
    }
};

function getGt3Data(blxxObj){
    var gt3Data ={
        "ssjmxzdlDm":"",
        "ssjmxzxlDm":"",
        //"jmfsDm":"",
        "jmzlxDm":"",
        "jmlxDm":"",
        "jmqxq":"",
        "jmqxz":"",
        "jzed":"",
        "jzfd":"",
        "jzsl":""
    };
    gt3Data.ssjmxzdlDm=blxxObj.ssjmxzdlDm;
    gt3Data.ssjmxzxlDm=blxxObj.ssjmxzxlDm;
    //gt3Data.jmfsDm=blxxObj.jmfsDm;
    gt3Data.jmzlxDm=blxxObj.jmzlx;
    gt3Data.jmlxDm=blxxObj.jmlxDm;
    gt3Data.jmqxq=blxxObj.jmqxq;
    gt3Data.jmqxz=blxxObj.jmqxz;
    gt3Data.jzed=blxxObj.jzed;
    gt3Data.jzfd=blxxObj.jzfd;
    gt3Data.jzsl=blxxObj.jzsl;
    return gt3Data;
}