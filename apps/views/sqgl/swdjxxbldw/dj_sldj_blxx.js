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
    // doSldjInCtais(blxxData);
    //2.提示是否需要做税种登记
    /*mini.showMessageBox({
        title: "提示信息",
        iconCls: "mini-messagebox-question",
        buttons: ["yes"],
        message: "请前往金三系统做税种认定",
        callback: function (action) {
            if (action == "yes") {
                //设立登记如果需要做税种登记则先将设立登记信息写入ctais
                //doSldjInCtais(blxxData);
                CloseWindow(blxxData);
                return;
            }
            //3.关闭补录资料页面
            //CloseWindow(blxxData);
        }
    });*/
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
    $.ajax({
        type: "POST",
        url: "/dzgzpt-wsys/api/wssqcx/getSqxxBySqxh/" + sqxh,
        success: function (data) {
            var resurnData = mini.decode(data);
            if (resurnData.success) {
                var formData = mini.decode(resurnData.value.data);

                for (var e in formData) {
                    if (!!$('#nsrtxxx-table').find('#'+e).length) {
						if(!!formData[e]){
							$('#' + e).text(formData[e]);
						}                       
                    }
                }
                var blxxForm = new mini.Form('#blxxForm');
                blxxForm.setData(formData);
                // mini.decode(rwbh.sqsxData.data).nsrxx
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
            } else {
                mini.hideMessageBox(messageid);
                mini.alert(resurnData.message);
            }
        }
    });
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

function doSldjInCtais(blxxData) {
    var messageid = mini.loading("提交中, 请稍等 ...", "提交中");
    $.ajax({
        url: "/wtgl/dbsx/saveSwsxBl.do",
        contentType: "application/x-www-form-urlencoded; charset=GBK",
        type: "post",
        data: {
            lcslId: mini.get("lcslId").getValue(),
            blztDm: WSLZ_BLZT_DM.BLZT_DSZRD,
            sqxh: mini.get("sqxh").getValue(),
            blxxData: mini.encode(blxxData),
            rwbh: mini.get("rwbh").getValue(),
            swsxDm: mini.get("swsxDm").getValue()
        },
        success: function (data) {
            mini.hideMessageBox(messageid);
            var resultData = mini.decode(data);
            if (resultData.success) {
                mini.alert("请到核心征管前台给纳税人做税种登记。", '提示信息', function () {
                    CloseWindow("ok");
                });
            } else {
                mini.alert(resultData.message, '提示信息');
            }
        },
        error: function () {
            mini.hideMessageBox(messageid);
            mini.alert("在核心征管写入设立登记信息失败。", '提示信息');
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

