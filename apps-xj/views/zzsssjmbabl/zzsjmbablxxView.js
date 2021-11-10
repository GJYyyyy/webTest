var zzsjmbaDjxh="";
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

    zzsjmBl.ssjmForm.validate();
    if (!zzsjmBl.ssjmForm.isValid()) {
        return;
    }
    zzsjmBl.blxxChgForm.validate();
    if (!zzsjmBl.blxxChgForm.isValid()) {
        return;
    }
    var isExistSsyh=checkExist();
    if(!isExistSsyh){
    	return;
    }
    var sjObj = {
        "jmqxq":mini.get("yhqxq").getText(),
        "jmqxz":mini.get("yhqxz").getText()
    }
    var blxxObj = $.extend({},zzsjmBl.ssjmForm.getDataAndText(),sjObj);
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
    zzsjmbaDjxh=rwbh.djxh;
    mini.get("sqxh").setValue(sqxh);
    mini.get("lcslId").setValue(lcslId);
    mini.get("rwbh").setValue(rwbh1);
    mini.get("swsxDm").setValue(swsxDm);

    zzsjmBl.txxx = mini.decode(rwbh.sqsxData.viewData).jmsbadjyhylForm;
    zzsjmBl.readData = {};
    zzsjmBl.readData.ssjmxzhzText = zzsjmBl.txxx.ssjmxzmc;
    zzsjmBl.readData.jmsspsxText = zzsjmBl.txxx.ssyhsxmc;
    zzsjmBl.readData.jmqxq = zzsjmBl.txxx.jmqxq;
    zzsjmBl.readData.jmqxz = zzsjmBl.txxx.jmqxz;
    zzsjmBl.readData.sfz = "增值税";

    zzsjmBl.sqxxData = mini.decode(rwbh.sqsxData.data);
    zzsjmBl.txxx.ssyhsx = zzsjmBl.sqxxData.ssjmbaVO.YHJmssqspbMxGrid.YHJmssqspbMxGridlb[0].ssjmxzhzDm;
    zzsjmBl.YHSXDM = zzsjmBl.sqxxData.ssjmbaVO.YHJmssqspbMxGrid.YHJmssqspbMxGridlb[0].jmsspsxDm;

    var jmxzdlCombo = mini.get("#jmxzdl");
    var jmxzxlCombo = mini.get("#jmxzxl");
    var jmzlxCombo = mini.get("#jmzlx");
    var jmlxCombo = mini.get("#jmlx");
    zzsjmBl.jzedText =mini.get("jzed");
    zzsjmBl.jzfdText =mini.get("jzfd");
    zzsjmBl.jzslText =mini.get("jzsl");

    var jmxzdlUrl = "/dzgzpt-wsys/api/baseCode/CombSelect/common/moreFilter?codeName=SSJMXZDL&filterVals="+zzsjmBl.txxx.ssyhsx+";"+zzsjmBl.YHSXDM+";10101";
    var jmxzxlUrl = "/dzgzpt-wsys/api/baseCode/CombSelect/common/moreFilter?codeName=SSJMXZXL&filterVals="+zzsjmBl.txxx.ssyhsx+";"+zzsjmBl.YHSXDM+";10101";
    var jmzlxUrl = "/dzgzpt-wsys/api/baseCode/CombSelect/common/moreFilter?codeName=SSJMXZJMZLX&filterVals="+zzsjmBl.sqxxData.ssjmbaVO.YHJmssqspbMxGrid.YHJmssqspbMxGridlb[0].ssjmxzhzDm+";10101";
    var jmlxUrl = "/dzgzpt-wsys/api/baseCode/CombSelect/common?codeName=SWSXJMLX&filterVal="+zzsjmBl.sqxxData.ssjmbaVO.YHJmssqspbMxGrid.YHJmssqspbMxGridlb[0].jmsspsxDm;

    var jmxzdlComboData = loadBasecode(jmxzdlUrl);
    jmxzdlCombo.setData(jmxzdlComboData);
    if(jmxzdlComboData.length == 1){
        jmxzdlCombo.setValue(jmxzdlComboData[0].ID);
    }

    var jmxzxlComboData = loadBasecode(jmxzxlUrl);
    jmxzxlCombo.setData(jmxzxlComboData);
    if(jmxzxlComboData.length == 1){
        jmxzxlCombo.setValue(jmxzxlComboData[0].ID);
    }

    var jmzlxComboData = loadBasecode(jmzlxUrl);
    jmzlxCombo.setData(jmzlxComboData);

    if(zzsjmBl.YHSXDM === "SXA031900586" || zzsjmBl.YHSXDM === "SXA031900132"){
        zzsjmBl.jzedText.setValue();
        zzsjmBl.jzfdText.setValue();
        zzsjmBl.jzslText.setValue();
        $(".row-jz").hide();
    }else{
        $(".row-jz").show();
    }

    if(jmzlxComboData.length == 1){
        jmzlxCombo.setValue(jmzlxComboData[0].ID);
        if(jmzlxComboData[0].ID == "02"){
            zzsjmBl.jzedText.setValue();
            zzsjmBl.jzfdText.setValue();
            zzsjmBl.jzslText.setValue();
            $(".row-jz").hide();
        }else{
            $(".row-jz").show();
        }
    }

    var jmlxComboData = loadBasecode(jmlxUrl);
    if(jmlxComboData.length == 0){
        jmlxComboData = [{ID:"9",MC:"其他"}];
    }
    jmlxCombo.setData(jmlxComboData);
    if(jmlxComboData.length == 1){
        jmlxCombo.setValue(jmlxComboData[0].ID);
    }

    mini.get("yhsx").setValue(zzsjmBl.txxx.jmsspsxDmText);
    mini.get("yhqxq").setValue(zzsjmBl.txxx.jmqxq);
    mini.get("yhqxz").setValue(zzsjmBl.txxx.jmqxz);

    zzsjmBl.ssjmForm = new mini.Form("ssjmForm");
    zzsjmBl.blxxChgForm = new mini.Form("blxxChgForm");

}

function changeDataByJmzlx(e) {
    if(e.value == "02"){
        zzsjmBl.jzedText.setValue();
        zzsjmBl.jzfdText.setValue();
        zzsjmBl.jzslText.setValue();
        $(".row-jz").hide();
    }else{
        $(".row-jz").show();
    }
};

function CloseWindow(action) {
    if (window.CloseOwnerWindow)
        return window.CloseOwnerWindow(action);
    else
        window.close();
}

function onCancel(e) {
    CloseWindow("cancel");
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
        "jmzlxDm":"",
        "jmlxDm":"",
        "jmqxq":"",
        "jmqxz":"",
        "jzed":"",
        "jzfd":"",
        "jzsl":""
    };
    gt3Data.ssjmxzdlDm=blxxObj.jmxzdl;
    gt3Data.ssjmxzxlDm=blxxObj.jmxzxl;
    //gt3Data.jmfsDm=blxxObj.jmfsDm;
    gt3Data.jmzlxDm = blxxObj.jmzlx;
    gt3Data.jmlxDm=blxxObj.jmlx;
    gt3Data.jmqxq=blxxObj.jmqxq;
    gt3Data.jmqxz=blxxObj.jmqxz;
    gt3Data.jzed=blxxObj.jzed;
    gt3Data.jzfd=blxxObj.jzfd;
    gt3Data.jzsl=blxxObj.jzsl;
    return gt3Data;
}

function loadBasecode(url) {
    var data = null;
    $.ajax({
        url : url,
        data : "",
        type : "get",
        async : false,
        success : function(obj) {
            data = obj;
        },
        error : function() {
        }
    });
    return mini.decode(data);
}

function checkExist(){
	var isExist = false;
	var cxInfo = {
		ssyhsx: zzsjmBl.YHSXDM,
		jmqxq: mini.get("yhqxq").getValue().format('yyyy-MM-dd'),
		jmqxz: mini.get("yhqxz").getValue().format('yyyy-MM-dd'),
		zsxmDm: "10101"
	};
	var isExistUrl = "/dzgzpt-wsys/api/xj/yh/ssyh/checkYhsxExist/";
	$.ajax({
		url: isExistUrl+zzsjmbaDjxh,
		type: "POST",
		contentType : "application/json;charset=utf-8",
		data: mini.encode(cxInfo),
		success: function(data){
			if(data.success && !data.value){
				isExist = true;
			}else{
				var str;
				data.success ? str = "该纳税人已进行过该减免期限内的优惠申请，不允许重复录入！" : str =data.message;
				mini.alert(str);
			}
		}
	});
	return isExist;
};