$(function() {
	// 非负数
	mini.VTypes["fsErrorText"] = "数字不能为负数";
	mini.VTypes["fs"] = function(v) {
		var re = new RegExp("^\-[1-9][0-9]*[\.]?[0-9]*");
		if (!re.test(v))
			return true;
		return false;
	}

	mini.get("bdsl").show();
	mini.get("zgqtysl").hide();

	var params = getParamFromUrl();
	var nsrsbh = params.nsrsbh;
	otherFzData.sqxh = params.sqxh;
	otherFzData.lcslId = params.lcslId;
	otherFzData.rwbh = params.rwbh;
	otherFzData.djxh = params.djxh;

	$("#nsrsbh").html(nsrsbh);
	queryFplyqk(params.djxh, params.sqxh, nsrsbh);
})

function getParamFromUrl() {
	var hrefs = window.location.href.split("?");
	if (hrefs.length <= 1) {
		return null;
	}
	var result = {};
	var params = hrefs[1].split("&");

	for (var i = 0; i < params.length; i++) {
		var param = params[i].split("=");
		if (param.length <= 1) {
			continue;
		}
		result[param[0].trim()] = param[1].trim();
	}
	return result;
}

var otherFzData = new Object();
var jsfpfsxxflay = false ;
var nsrxxJson;

// 判断是否英文+数字
function onEnglishAndNumberValidation(e) {
	if (e.isValid) {
		if (isEnglishAndNumber(e.value) == false) {
			e.errorText = "必须输入英文+数字";
			e.isValid = false;
		}
	}
}
function onValueChanged() {
	var gpr = mini.get("gpr").getValue();
	mini.get("gpr").setValue(gpr);
}
function showRohide() {
	var displayState = $("#lgxx12").css('display');
	if (displayState == "none") {
		$("#lgxx12").css('display', 'block');
		mini.layout();
	}
	if (displayState == "block") {
		$("#lgxx12").css('display', 'none');
	}
}
function showMessage() {
	// mini.alert("" +
	// "<span style='font-size: 18px;font-weight:
	// bold;color:#008000;'>增专、增普发票领用操作说明</span><br>" +
	// "<span style='display:inline-block;width:299px;height:22px;text-align:
	// left;'>1.去金三核心征管系统前台完成发票发售操作</span><br>" +
	// "<span
	// style='display:inline-block;text-indent:1em;width:299px;height:22px;text-align:
	// left;'>" +
	// "<a href='slfplc.html' target='_blank' style='text-decoration:none;
	// '>金三核心征管系统发票发售操作流程</a>" +
	// "</span><br>"+
	// "<span>2.在本系统中点击《查询金三发票发售信息》按钮，选取上一步在金三系统中发售的记录，然后点击保存按钮</span>");
	mini.open({
		url : "fp_ptfplygl_sm.html",
		title : "操作说明",
		width : 530,
		height : 260,
	});

}

function searchFpfsFromGt3() {
	var querydate = mini.get("querydate").getValue();
	var cxrq = mini.formatDate(querydate, "yyyy-MM-dd");
	$.ajax({
		type : "POST",
		url : "../../../../../api/wtgl/fplygl/get/queryZssFpfsxxByDjxh",
		data : {
			djxh : nsrxxJson.djxh,
			cxrq : cxrq,
			fpzldm : fpzldmArray.toString()
		},
		success : function(result) {
			var result = mini.decode(result);
			if (!result.success) {
				mini.alert(result.message);
				return false;
			}
			var data = mini.decode(result.value);
			mini.get("zzsfpfsGrid").setData(data.zzsfpfsxx);
		},
		error : function(e) {
			mini.alert("查询发票发售信息失败");
		}
	});
}
function onCellCommitEdit(e) {

	var fpfsGrid = mini.get("fpfsGrid");

	var editor = e.editor;
	var record = e.record;
	var field = e.field, value = e.value;
	editor.validate();
	if (editor.isValid() == false) {
		alert(editor.getErrorText());
		e.cancel = true;
	}
	if (field == "hfbs") {
		var bs = new Number(record.bs);

		if (value.trim() == '') {
			fpfsGrid.updateRow(e.record, {
				hfbs : '0'
			});
			e.cancel = true;
			return false;
		}
		if (new Number(value) < 0) {

			mini.alert("核发本数不能小于0");

			fpfsGrid.updateRow(e.record, {
				hfbs : '0'
			});
			e.cancel = true;
			return false;
		}
		if (new Number(value) > bs) {

			mini.alert("核发本数不能大于总本数");

			fpfsGrid.updateRow(e.record, {
				hfbs : ""
			});
			e.cancel = true;
			return false;
		}

		var zslbs = new Number(record.zslbs);

		if (new Number(value) > zslbs) {

			mini.alert("核发本数不能大于总申领本数");

			fpfsGrid.updateRow(e.record, {
				hfbs : ""
			});
			e.cancel = true;
			return false;
		}

		var hfbs = new Number(value);
		var mbfs = new Number(record.mbfs);
		var fpqshm = new Number(record.fpqshm);
		var slfs = mbfs * value;
		var fpzzhm = fpqshm + slfs - 1;
		var lengthZero = record.fpqshm.length - (fpzzhm + "").length
		var zeros = "";
		for (var i = 0; i < lengthZero; i++) {
			zeros += "0";
		}

		fpfsGrid.updateRow(e.record, {
			fpzzhm : zeros + fpzzhm + "",
			slfs : slfs + ""
		});

	}

}
var lgfsId;
var data;
var fpzl_dm;
var fpzldmArray = [];
function queryFplyqk(djxh, sqxh, nsrsbh) {

	/*
	 * if (mini.get("nsrsbh").isValid() == false) {
	 * mini.alert("纳税人识别号不符合规范，请重新填写"); return false; }
	 * 
	 * if (nsrsbh == null) { mini.alert("请输入纳税人识别号"); return false; }
	 */

	var messageid = mini.loading("正在查询您的发票领用信息，请稍等", "查询领用信息");

	$
			.ajax({
				type : "POST",
				url : "../../../../../api/wtgl/fplygl/get/queryLyqk",
				data : {
					djxh : djxh,
					sqxh : sqxh
				},
				success : function(result) {

					var result = mini.decode(result);

					if (!result.success) {
						mini.alert(result.message);
						mini.hideMessageBox(messageid);
						return;
					}

					data = mini.decode(result.value);

					if (data.nsrxx != null) {
						nsrxxJson = data.nsrxx;// 存入登记序号
					}

					if (data.fpfsqk == null || data.fpfsqk.length == 0) {
						mini.alert("该纳税人没有未处理的领用信息");
						mini.hideMessageBox(messageid);
						return;
					}
					// 设置领取方式
					lgfsId = (data.fpfsqk)[0].lqfs;
					var lgfsText = "";
					if (lgfsId == "01") {
						lgfsText = "税务机关领取";
					} else if (lgfsId == "03") {
						lgfsText = "邮寄领取";
					} else if (lgfsId == "02" || lgfsId == "04") {
						lgfsText = "自助终端领取";
					}
					$("#fplyfs").html(lgfsText);
					$
							.ajax({
								type : "POST",
								url : "../../../../../api/wtgl/fplygl/get/queryGprByDjxh.do",
								data : {
									djxh : nsrxxJson.djxh
								},
								success : function(result) {

									var result = mini.decode(result);

									if (!result.success) {
										mini.alert(result.message);
										mini.hideMessageBox(messageid);
										return false;
									}
									var data = mini.decode(result.value);
									mini.get("gpr").setData(data);
								},
								error : function(e) {
									mini.alert("获取购票人信息失败");
									mini.hideMessageBox(messageid);
								}
							});

					mini.get("lgxxGrid").setData(data.fpfsqk);

					mini.get("pzhdGrid").setData(data.pzhdxxVoList);
					mini.get("lgxx12Grid").setData(data.lgxx12VoList);

					otherFzData.lqfs = (data.fpfsqk)[0].lqfs;// 将领取方式写进辅助信息内
					// 总申领本数
					var zsbbs = data.fpfsqk[0].mbfs * data.fpfsqk[0].bs;
					$("#nsrmc").html(data.nsrxx.nsrmc);

					// 联系人信息
					$("#nsrssswjg").html(data.lxrxx[0].swjgDm);
					$("#lxrxm").html(data.lxrxx[0].dysjrxm);
					$("#lxdh").html(data.lxrxx[0].dysjrlxdh);

					// var initFpfsGrid = true;

					if (data.fpkfkc.length != 0) {
						if (otherFzData.lqfs == "03") {
							for (var i = 0; i < data.fpkfkc.length; i++) {
								if (Number(data.fpkfkc[i].fpzzhm)
										- Number(data.fpkfkc[i].fpqshm) + 1 >= Number(zsbbs)) {
									break;
								}
								if (data.fpkfkc.length - 1 == i) {
									// mini.get("zgqtysl").show();
									// mini.get("bdsl").hide();
									// initFpfsGrid = false;
									fpfsGridDataZgqt = data.fpkfkc;
									mini.alert("管理员库存不足，请到征管前台进行受理操作。");
								}
							}

						}
						// if (initFpfsGrid) {
						mini.get("fpfsGrid").setData(data.fpkfkc);
						// }
						if (!(lgfsId == "02" || lgfsId == "04")
								&& (data.fpfsqk[0].fpzlDm == "000008101500"
										|| data.fpfsqk[0].fpzlDm == "1160"
										|| data.fpfsqk[0].fpzlDm == "1130" || data.fpfsqk[0].fpzlDm == "000008101200")) {
							$("#fpfsxx").css('display', 'none');
							$("#zzsfpfsxx").css('display', 'inline-block');
							jsfpfsxxflay = true ;
							mini.get("querydate").setValue(
									mini.formatDate(new Date(), "yyyy-MM-dd"));
							mini
									.alert("增专、增普发票领用操作说明<br>1.去金三核心征管系统前台完成发票发售操作<br>2.在本系统中点击《查询金三发票发售信息》按钮，选取上一步在金三系统中发售的记录，然后点击保存按钮");
						} else {
							$("#fpfsxx").css('display', 'block');
							$("#zzsfpfsxx").css('display', 'none');
						}
						for(var i=0;i<data.fpfsqk.length;i++) {
							fpzldmArray[i]=data.fpfsqk[i].fpzlDm;
						}
					} else {
						mini.alert("管理员库存为空");
					}
					mini.hideMessageBox(messageid);
				},
				error : function(e) {
					mini.hideMessageBox(messageid);
					mini.alert("获取普通发票领购信息失败!");
				}
			});
}

function validate(fpfsGrid) {

	var fbzlZsList = new Array();
	var lgxxGridData = mini.get("lgxxGrid").getData();
	var fpfssqGrid = mini.get("lgxxGrid").getData();
	var zzsfpfsGrid = mini.get("zzsfpfsGrid").getData();
	var isTb = false;
	
	for (var i = 0; i < lgxxGridData.length; i++) {
		var zslfs = new Number(lgxxGridData[i].mbfs)
				* new Number(lgxxGridData[i].bs);
		fbzlZsList[i] = {
			fpzlDm : lgxxGridData[i].fpzlDm,
			zslfs : zslfs
		};
	}
	
	// 判断管理端是否分段核发
	var fsts = 0;
	if(jsfpfsxxflay){//金三发票发售信息
		var jsfpfsxxfsts = 0;
		for ( var i = 0; i < zzsfpfsGrid.length; i++) {
			if (Number(zzsfpfsGrid[i].hffs) > 0) {
				jsfpfsxxfsts = jsfpfsxxfsts + 1;
			}
		}
		if (jsfpfsxxfsts == 0) {	// 未核票时增加提示  20160522  xin_liu
			mini.alert("您还没有核发任何发票");
			return false;
		} 
	}else{
		for (var i = 0; i < fpfsGrid.length; i++) {
			if (Number(fpfsGrid[i].hfbs) > 0) {
				fsts = fsts + 1;
			}
		}

		if (fsts == 0) { // 未核票时增加提示 20160522 xin_liu
			mini.alert("您还没有核发任何发票");
			return false;
		} else if (fsts > 1) {
			mini.alert("发票发售核发本数不能分段核发！");
			return false;
		}
		
		for (var i = 0; i < fpfsGrid.length; i++) {

			if (fpfsGrid[i].hfbs != null && fpfsGrid[i].hfbs != "") {
				isTb = true;
			}
			for (var j = 0; j < fbzlZsList.length; j++) {
				if (fpfsGrid[i].fpzlDm == fbzlZsList[j].fpzlDm) {
					fbzlZsList[j].zslfs = fbzlZsList[j].zslfs
							- fpfsGrid[i].slfs;
					if (fbzlZsList[j].zslfs < 0) {
						mini.alert("发票种类代码" + fbzlZsList[j].fpzlDm
								+ "的核发总数已经超出总申领本数");
						return false;
					}
				}
			}

		}
		if (!isTb) {
			mini.alert("您还未进行任何发票领用的核发");
			return false;
		}
		
	}
	
	return true;

}

function bysl() {
	var messageid = mini.loading("正在处理，请稍等", "提示信息");
	$.ajax({
		type : "POST",
		url : "../../../../../api/wtgl/fplygl/submit/fplyBysl",
		data : {
			otherFzData : mini.encode(otherFzData)
		},
		success : function(result) {
			mini.hideMessageBox(messageid);
			var result = mini.decode(result);

			if (!result.success) {
				mini.alert(result.message);
				return false;
			}

			mini.alert("提交处理成功，点击退出当前审核工作", "提示信息", function() {
				window.history.go(-1);
			});

		},
		error : function(e) {
			mini.hideMessageBox(messageid);
			mini.alert("提交发票领用请求失败");
		}
	});
}

function zgqtSubmit() {
	mini.alert("征管已经受理");
}

var fpfsGridDataZgqt;
function zgqtSubmit() {
	var gprXm = mini.get("gpr").getText();
	var gprZjhm = mini.get("gpr").getValue();
	if (gprXm == null || gprXm == "") {
		mini.alert("您还未选择购票人");
		return false;
	}
	var messageid = mini.loading("正在提交发票领用信息，请稍等", "提交领用信息");

	otherFzData.gprXm = gprXm;
	otherFzData.djxh = nsrxxJson.djxh;
	otherFzData.gprZjhm = gprZjhm;

	$.ajax({
		type : "POST",
		url : "../../../../../api/wtgl/fplygl/submit/lyqkZgqtcl",
		data : {
			fpfsGrid : mini.encode(fpfsGridDataZgqt),
			otherFzData : mini.encode(otherFzData)
		},
		success : function(result) {
			mini.hideMessageBox(messageid);
			var result = mini.decode(result);

			if (!result.success) {
				mini.alert(result.message);
				return false;
			}

			mini.alert("提交处理成功，点击退出当前审核工作", "提示信息", function() {
				window.history.go(-1);
			});

		},
		error : function(e) {
			mini.hideMessageBox(messageid);
			mini.alert("提交发票领用请求失败");
		}
	});
}

function submit() {

	var fpfsGrid = mini.get("fpfsGrid").getData();
	var gprXm = mini.get("gpr").getText();
	var gprZjhm = mini.get("gpr").getValue();
	var zzsfpfsGridHideData = new Array();
	if (gprXm == null || gprXm == "") {
		mini.alert("您还未选择购票人");
		return false;
	}
	var jy = true;
	var fpfssqGrid = mini.get("lgxxGrid").getData();
	if (!(lgfsId == "02" || lgfsId == "04")
			&& (fpfssqGrid[0].fpzlDm == "000008101500"
					|| fpfssqGrid[0].fpzlDm == "1160"
					|| fpfssqGrid[0].fpzlDm == "1130" || fpfssqGrid[0].fpzlDm == "000008101200")) {
		jy = false;
		var grid = mini.get("zzsfpfsGrid");
		var gridzzs = mini.get("zzsfpfsGridHide");
		var rows = grid.getSelecteds();
		
		if (rows.length <= 0) {
			mini.alert("请选择发票发售记录。");
			return false;
		}
		
		var row = rows[0];
		gridzzs.addRow(row, 0);
		zzsfpfsGridHideData = gridzzs.getData();
		if (zzsfpfsGridHideData.length <= 0) {
			mini.alert("请选择发票发售记录。");
			return false;
		}
	}

	if (jy) {
		if (!validate(fpfsGrid)) {
			return false;
		}
	}

	var messageid = mini.loading("正在提交发票领用信息，请稍等", "提交领用信息");

	otherFzData.gprXm = gprXm;
	otherFzData.djxh = nsrxxJson.djxh;
	otherFzData.gprZjhm = gprZjhm;

	$.ajax({
		type : "POST",
		url : "../../../../../api/wtgl/fplygl/submit/lyqkRzg",
		data : {
			fpfsGrid : mini.encode(fpfsGrid),
			otherFzData : mini.encode(otherFzData),
			zzsfpfsGrid : mini.encode(zzsfpfsGridHideData),
			fpzldm : fpfssqGrid[0].fpzlDm
		},
		success : function(result) {
			mini.hideMessageBox(messageid);
			var result = mini.decode(result);

			if (!result.success) {
				mini.alert(result.message);
				return false;
			}

			mini.alert("提交处理成功，点击确定退出当前审核工作", "提示信息", function() {
				window.history.go(-1);
			});

		},
		error : function(e) {
			mini.hideMessageBox(messageid);
			mini.alert("提交发票领用请求失败");
		}
	});

}

function doBack() {
	window.history.go(-1);
}

function clearYm() {
	/*
	 * mini.get("lgxxGrid").setData([]); mini.get("fpfsGrid").setData([]);
	 * mini.get("gpr").setData([]); mini.get("nsrsbh").setValue("");
	 * $("nsrmc").html("");
	 */
}
