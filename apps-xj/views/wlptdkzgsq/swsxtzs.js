$(function() {
	init();
});

var SWSX_STORE={
	blxxData:"",
    rwbh:"",
	swsxdm:'',
	rwztdm:''
}


function init() {
	mini.parse();
}

/**
 * 查询税务事项通知书信息
 *
 * @param lcslId
 *            流程实例ID
 * @param blztDm
 *            办理状态代码
 *            ll补录信息
 */
/**
 * 查询税务事项通知书
 * @param lcslId 流程实例ID
 * @param rwbh 任务编号
 * @param blztDm 任务状态代码
 * @param swsxDm 税务事项代码
 * @param blxxData 补录信息
 */
function querySwsxtzsxx(lcslId, rwbh,blztDm,swsxDm,blxxData,otherData, rwztDm, djxh, sxslStoreObj) {
	var messageid = mini.loading("查询中, 请稍等 ...", "查询中");
	SWSX_STORE.blxxData = blxxData;
	SWSX_STORE.rwbh = rwbh;
	SWSX_STORE.swsxdm = swsxDm;
	SWSX_STORE.rwztdm = rwztDm;
	$.ajax({
		url : "../../../../api/wtgl/dbsx/querySwsxtzsxx.do",
		data : {
			lcslId : lcslId,
			blztDm : blztDm
		},
		success : function(data) {
			var resultData = mini.decode(data);
			var result = mini.decode(resultData);
			if (!result.success) {
				mini.alert(result.message, '提示信息');
				return;
			}
			$("#title_swjgMc").text(result.value.swjgmc);
			$("#foot_swjgMc").text(result.value.swjgmc);
			$("#content_jg").text(result.value.jg);
			$("#content_zg").text(result.value.zg);
			$("#content_nsrmc").text(result.value.nsrmc);
			$("#content_nsrsbh").text(result.value.nsrsbh);
			$("#content_swsxMc").text(result.value.swsxmc);
			$("#content_swsxMc2").text(result.value.swsxmc);
			$("#content_sqrq").text(mini.formatDate(mini.parseDate(result.value.sqrq),"yyyy年MM月dd日"));
			$("#content_bjrq").text(mini.formatDate(mini.parseDate(result.value.bjrq),"yyyy年MM月dd日"));
			$("#content_flyj").html(result.value.flyj);

			mini.get("flyj").setValue(result.value.flyj);
			mini.get("sqxh").setValue(result.value.sqxh);
			mini.get("swjgDm").setValue(result.value.swjgdm);
			mini.get("jg").setValue(result.value.jg);
			mini.get("zg").setValue(result.value.zg);
			mini.get("lcslId").setValue(lcslId);
            //通用需求展示文书号，不再展示字轨局轨
            $('#swsxTzsDiv').show();
            if (swsxDm === "11041502") {
                $('#oldWsh').show();
                $('#kqqyWsh').hide();
            } else {
                $('#oldWsh').hide();
                $('#kqqyWsh').show();
                $('#kqqyWsh').html("文书号：" + sxslStoreObj.sqsxData.wsh);
            }

			//备注栏预先填写
			var tzsnr = "";
			//外出经营证明开具
			if("110801" == swsxDm && WSYS_BLZT_DM.BLZT_SLTG == blztDm){
                if (!!mini.decode(blxxData).zgswjDm){
					tzsnr = "您的外出经营证明开具事项已审核办结，请查看已办事项，若未生成报验登记已办事项，请前往外出地大厅继续办理报验登记。";
                }else{
					tzsnr = "您的外出经营证明开具事项已审核办结！";
                }
			}

			var form = new mini.Form("#swsxtzsForm");
			form.setData(mini.decode(result.value));
			mini.get("swsxtzsNr").setValue(tzsnr);
			mini.get("blztDm").setValue(blztDm);

			// 不予受理
			if (WSYS_BLZT_DM.BLZT_SLBTG == blztDm) {
				mini.get("swsxtzsNr").setRequired(true) ;
				$("#content_blzt").text("不予受理");
				$("#content_blzt_sm").text("不予受理原因：");
			}

			//补正资料
			if(WSYS_BLZT_DM.BLZT_BZZL==blztDm){
				mini.get("swsxtzsNr").setRequired(true) ;
				$("#content_blzt").text("补正资料");
				$("#content_blzt_sm").text("需要重新上传的资料列表如下：");
			}

			//受理审核办结
			if(WSYS_BLZT_DM.BLZT_SLTG==blztDm){
				$("#content_blzt").text("审核通过");
				$("#content_blzt_sm").text("相关说明如下：");
			}

			// 待审批
			if (WSYS_BLZT_DM.BLZT_DSP == blztDm) {
				$("#content_blzt").text("受理通过，待审批");
				$("#content_blzt_sm").text("相关说明如下：");
			}

			mini.hideMessageBox(messageid);
		},
		error : function() {
			mini.hideMessageBox(messageid);
			mini.alert("查询税务事项通知书信息失败。", '提示信息');
		}
	});
}

function saveSwsxBj() {
	var form = new mini.Form("#swsxtzsForm");
	form.validate();
	var isValid = form.isValid();
	if(!isValid){
		return;
	}
	var messageid = mini.loading("提交中, 请稍等 ...", "提交中");
	var submitData = mini.encode(form.getData(true));
	$.ajax({
		url : "../../../../api/wtgl/dbsx/saveSwsxBl",
		type : "post",
		data : {
			data : submitData,
			lcslId : mini.get("lcslId").getValue(),
			blztDm : mini.get("blztDm").getValue(),
			rwztDm : "01",
			sqxh : mini.get("sqxh").getValue(),
			blxxData:SWSX_STORE.blxxData,
			rwbh:SWSX_STORE.rwbh
		},
		success : function(data) {
			mini.hideMessageBox(messageid);
			var resultData = mini.decode(data);
			if(resultData.success){
				if(WSYS_BLZT_DM.BLZT_DSP==mini.get("blztDm").getValue()){
					var gwMc = resultData.resultMap.gwMc;
					var jgMc = resultData.resultMap.jgMc;
					mini.alert("受理成功！<br>下一环节的办理信息：<br>办理机关：【"+jgMc+"】<br>办理岗位：【"+gwMc+"】", '提示信息', function() {
						onCancel('ok');
					});
				}else{
					mini.alert("受理成功！", '提示信息', function() {
						onCancel('ok');
					});
				}
			}else{
				mini.alert(resultData.message, '提示信息', function() {});
			}
		}
	});
}


/**
 * 套餐事项的办结（审核办结+不予受理）
 */
function savePackMasterBj() {
	var form = new mini.Form("#swsxtzsForm");
	form.validate();
	var isValid = form.isValid();
	if(!isValid){
		return;
	}
	var messageId = mini.loading("提交中, 请稍等 ...", "提交中");
	var submitData = mini.encode(form.getData(true));
	$.ajax({
		url : sxxlApi.saveMasterSwsxBl,
		type : "post",
		data : {
			data : submitData,
			lcslId : mini.get("lcslId").getValue(),
			blztDm : mini.get("blztDm").getValue(),
			rwztDm : "01",
			sqxh : mini.get("sqxh").getValue(),
			blxxData:SWSX_STORE.blxxData,
			rwbh:SWSX_STORE.rwbh
		},
		success : function(data) {
			mini.hideMessageBox(messageId);
			var resultData = mini.decode(data);
			if(resultData.success){
				if(!!resultData.resultMap.djxh){// 税务登记补录成功，返回djxh用于更新ws_sqqk_mx表的djxh字段
					//top["win"].djxh = resultData.resultMap.djxh;
				}
				if(WSYS_BLZT_DM.BLZT_DSP==mini.get("blztDm").getValue()){
					var gwMc = resultData.resultMap.gwMc;
					var jgMc = resultData.resultMap.jgMc;
					mini.alert("受理成功！<br>下一环节的办理信息：<br>办理机关：【"+jgMc+"】<br>办理岗位：【"+gwMc+"】", '提示信息', function() {
						onCancel('ok');
					});
				}else{
					mini.alert("受理成功！", '提示信息', function() {
						onCancel('ok');
					});
				}
			}else{
				mini.alert(resultData.message, '提示信息', function() {});
			}
		}
	});
}

function reBindSxBjBtn() {
	$("#sxBjBtn").attr("onclick","javascript:void();");
    $("#sxBjBtn").attr("onclick","savePackMasterBj();");
}

function onCancel(action) {
	if (window.CloseOwnerWindow)
		return window.CloseOwnerWindow(action);
	else
		window.close();
}
