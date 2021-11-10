$(function () {
    mini.parse();
});

var zzsjmBl = {};
var zzsjzjtDjxh="";

function nextShowSwsxtzs() {
    //1.取补录信息数据
    var blxxForm = new mini.Form("#step_blxx_form");
    blxxForm.validate();
    if (!blxxForm.isValid()) {
        return;
    }
    var isExistSsyh=checkExist();
    if(!isExistSsyh){
    	return;
    }
    var blxxObj = blxxForm.getData();
    var blxxData = {},
        blnr = [];
    blxxObj=getGt3Data(blxxObj);
    blnr.push(blxxObj);
    blxxData["blnr"] = blnr;
    CloseWindow(blxxData);
}

function setData(rwbh) {
    var sqxh = rwbh.sqxh;
    var lcslId = rwbh.lcslId;
    var swsxDm = rwbh.swsxDm;
    var rwbh1 = rwbh.rwbh;
    zzsjzjtDjxh=rwbh.djxh;
    mini.get("sqxh").setValue(sqxh);
    mini.get("lcslId").setValue(lcslId);
    mini.get("rwbh").setValue(rwbh1);
    mini.get("swsxDm").setValue(swsxDm);

    var sqsjForm =  new mini.Form("sqsj");
    sqsjForm.setData(mini.decode(rwbh.sqsxData.viewData).step_yl_form);

    zzsjmBl.txxx=mini.decode(rwbh.sqsxData.data).zzsjzjtsqxx.zzsjzjtGrid.zzsjzjtGridlb[0];
    zzsjmBl.YHSXDM =zzsjmBl.txxx.jmsspsxDm;
    var jmxmCombo = mini.get("#ssjmxzhz");
    var jmxmUrl = "/dzgzpt-wsys/api/baseCode/CombSelect/common/moreFilter?codeName=SSJMXZ&filterVals=" +zzsjmBl.txxx.jmsspsxDm+";10101";
    if (!!zzsjmBl.YHSXDM) {
        $.ajax({
            async: false,
            type: "GET",
            url: jmxmUrl,
            success: function (data) {
                zzsjmBl.ssjmzcMcData=data;
                jmxmCombo.setData(data);
            },
            error: function (err) {
                mini.alert("请求异常，稍后再试！", '提示', function () {
                    window.close();
                });
            }
        });
    }
    jmxmCombo.select(0);
}
function changeZcmc(e){
    var jmxzdlCombo = mini.get("#jmxzdl");
    var jmxzxlCombo = mini.get("#jmxzxl");
    var jmxzdlUrl = "/dzgzpt-wsys/api/baseCode/CombSelect/common/moreFilter?codeName=SSJMXZDL&filterVals="+zzsjmBl.ssjmzcMcData[0].ID+";"+zzsjmBl.YHSXDM+";10101";
    ajax.get(jmxzdlUrl, "", function (data) {
        var ssjmxzData = data;
        jmxzdlCombo.setData(ssjmxzData);
        jmxzdlCombo.select(0);
    }, function () {
        mini.alert("请求异常，稍后再试！", '提示', function () {
            window.close();
        });
    });
    var jmxzxlUrl = "/dzgzpt-wsys/api/baseCode/CombSelect/common/moreFilter?codeName=SSJMXZXL&filterVals="+zzsjmBl.ssjmzcMcData[0].ID+";"+zzsjmBl.YHSXDM+";10101";
    ajax.get(jmxzxlUrl, "", function (data) {
        var ssjmxzData = data;
        jmxzxlCombo.setData(ssjmxzData);
        jmxzxlCombo.select(0);
    }, function () {
        mini.alert("请求异常，稍后再试！", '提示', function () {
            window.close();
        });
    });
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

var onDateChanged = function (e) {
    var yhqxzValue = mini.get("jmqxz").getValue();
    var yhqxqValue = mini.get("jmqxq").getValue();
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
        "jmfsDm":"",
        "jmlxDm":"",
        "jmqxq":"",
        "jmqxz":"",
        "ssjmxzhzDm":""
    };
    gt3Data.ssjmxzdlDm=blxxObj.jmxzdl;
    gt3Data.ssjmxzxlDm=blxxObj.jmxzxl;
    gt3Data.jmfsDm=blxxObj.jmfs;
    gt3Data.jmlxDm=blxxObj.jmlx;
    gt3Data.jmqxq=blxxObj.jmqxq.format("yyyy-MM-dd");
    gt3Data.jmqxz=blxxObj.jmqxz.format("yyyy-MM-dd");
    gt3Data.ssjmxzhzDm=blxxObj.ssjmxzhz;
    return gt3Data;
}


function checkExist(){
	var isExist = false;
	var cxInfo = {
		ssyhsx: zzsjmBl.YHSXDM,
		jmqxq: mini.get("jmqxq").getValue().format('yyyy-MM-dd'),
		jmqxz: mini.get("jmqxz").getValue().format('yyyy-MM-dd'),
		zsxmDm: "10101"
	};
	var isExistUrl = "/dzgzpt-wsys/api/xj/yh/ssyh/checkYhsxExist/";
	$.ajax({
		url: isExistUrl+zzsjzjtDjxh,
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