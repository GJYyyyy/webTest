$(function () {
    mini.parse();
});

function nextShowSwsxtzs() {
    //1.取补录信息数据
    var blxxForm = new mini.Form("#blxxForm");
    blxxForm.validate();
    if (!blxxForm.isValid()) {
        return;
    }
    var blxxData = blxxForm.getData(true);
    blxxData.zgswjDm = mini.get("zgswskfjDm").getValue().substr(0,7)+'0000';
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

    var messageid = mini.loading("查询中, 请稍等 ...", "查询中");
    var wssqData = querySubWssqViewData(sqxh);
    var formData = mini.decode(wssqData);

    for (var e in formData) {
        if (!!$("#" + e)) {
			if(!!formData[e]){
				$("#" + e).text(formData[e]);
			}                       
        }
    }
    
    getSwjg();
    doZgswjSelected();
    var zclxDmTree = mini.get("djzclxDm");
    var TreeUrl = "/dzgzpt-wsys/api/baseCode/get/baseCodeTree/DM_DJ_DJZCLX_GT3";
    var djzclxDmStr = mini.decode(rwbh.sqsxData.data).djzclxdm;
    zclxDmTree.setValue(djzclxDmStr);
    zclxDmTree.load(TreeUrl, "ID", "PID");
    if ("110121" == swsxDm) {       //个体
        $("#lsnsrBlxx").hide();
        $("#gsdjlxDmDiv").hide();
        $("#gsdjlxDmText").hide();
        $("#djzclxdmText").hide();
        $("#zzxsDmDiv").show();
        $("#zzxsDmText").show();
		                 
    } else if("110101" == swsxDm){  //单位
        $("#lsnsrBlxx").hide();
        $("#gsdjlxDmDiv").show();
        $("#gsdjlxDmText").show();
        $("#zzxsDmDiv").hide();
        $("#zzxsDmText").hide();
    }
	$.ajax({
			type: "GET",
			url: "/dzgzpt-wsys/api/baseCode/get/baseCodeTree/DM_DJ_DJZCLX_GT3",  
			data: {},
			async: false,
			success: function (data) {
				var returnData = mini.decode(data);
				var MC = null;
				if (!!returnData) {
					for (var i = 0; i < returnData.length; i++) {
						var obj = returnData[i];
						if (obj.ID == djzclxDmStr) {
							MC = obj.MC;
							break;
						}
					}
				}
				$("#zzxsDmText").text(MC);
				$("#djzclxdmText").text(MC);
			}
		});  
    mini.hideMessageBox(messageid);
    
}
var SwjgDm;
function getSwjg() {
	$.ajax({
	    type: "POST",
	    url: "/dzgzpt-wsys/api/wtgl/public/login/session",  
	    data: {},
	    async: false,
	    success: function (data) {
	        var returnData = mini.decode(data);
	        if (returnData.success) {
	         var rtnData= mini.decode(returnData.value);
	          mini.get("zgswjDm").setValue(rtnData.swjgDm);//当前税务人员主管税务局
	          //mini.get("slswjgDm").setValue(rtnData.swjgDm);//当前税务人员主管税务局
	          //mini.get("slrDm").setValue("");//当前税务人员主管税务局
	          
	        } else {
	            mini.alert("查询当前税务人员主管税务局失败!!!");
	        }
	    }
	});
}


function doZgswjSelected(e) {
    var gszgswjgJDm = mini.get("zgswjDm").getValue();
    if (!gszgswjgJDm) {
        return;
    }

    var nsrSwjgDm = mini.get("zgswskfjDm");
    nsrSwjgDm.setValue("");
    //nsrSwjgDm.setUrl("/dzgzpt-wsys/api/baseCode/get/SwjgKs/" + gszgswjgJDm);
    nsrSwjgDm.setUrl("/dzgzpt-wsys/api/baseCode/get/HbSwjgKs/" + gszgswjgJDm);
}
function doZgswjkfjSelected(e) {
    var gszgswjgJDm = mini.get("zgswskfjDm").getValue();
    if (!gszgswjgJDm) {
        return;
    }

    var jdxzDm = mini.get("jdxzDm");
    jdxzDm.setValue("");
    jdxzDm.setUrl("/dzgzpt-wsys/api/baseCode/get/dmJdxz/" + gszgswjgJDm);
}
function beforenodeselect(e) {
    //禁止选中父节点
    if (e.isLeaf == false) e.cancel = true;
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

function beforeZgswjgSelect(e) {
    if (e.isLeaf == false) e.cancel = true;
}

function beforeGbyhSelect(e) {
    if (e.isLeaf == false) e.cancel = true;
}

function beforenodeselect(e) {
    //禁止选中父节点
    if (e.isLeaf == false) e.cancel = true;
}

function querySubWssqViewData(sqxh){
    var params={
        sqxh:sqxh
    };
    var data=null;
    $.ajax({
	    type: "POST",
	    url: sxxlApi.querySubWssqViewData,  
	    data: params,
	    async: false,
	    success: function (data) {
	        var result = mini.decode(data);
	        if (result.success && result.value) {
	        	data = mini.decode(result.value);
	        } else {
	        	mini.alert(result.message);
	            return false;
	        }
	    }
	});
    return data;
}