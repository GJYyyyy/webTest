$(function() {
	var swdjblSqsj = mini.decode(sxsl_store.sqsxData.data);
	if(swdjblSqsj.zfjglxDm == '1') {
		$('#ylfzjgxx').show();
	} else if(swdjblSqsj.zfjglxDm == '2'){
		$('#ylzjgxxForm').show();
	}else {
		$('#ylfzjgxx').hide();
		$('#ylzjgxxForm').hide();
	}

	// 税务登记信息补录没有补正资料，隐藏补正资料按钮
	mini.get("bzzlBtn").hide();
	/**
	 * 审核办结入口
	 * @param
	 */
	mini.get("shbjBtn").un('click',sxslcommon.shbj);
	sxslcommon.shbj=function(){
		var storeObj=sxsl_store;
		//针对税务登记信息补录，做特殊业务处理
			var url = "../../../../api/wtgl/djxxbl/check/djxxblCancel/"+storeObj.nsrsbh;
		    ajax.post(url,{},function (result) {
		    	if(!result.success){
		    		mini.alert("审核办结失败！");
		        	return false;
		        }
		        if(result.success&&result.value==null){
		        	//mini.alert("请依据云厅采集的信息，到核心征管前台补录该企业的税务登记信息!");
		        	sxslbt_shbj.shbjcomFuc(storeObj);
		        }
		        if(result.success&&result.value!=null){
		        	storeObj.djxh = result.value.djxh;
		        	sxslbt_shbj.shbjcomFucCheckSfzrd(storeObj);
		        }
		    },function () {
		        mini.alert('审核办结失败！');
		        return false;
		    });
	};
	mini.get("shbjBtn").on('click',sxslcommon.shbj);


	//=============================审核办结方法（是否需要补录,要补正则先填写补正信息，然后填写税务事项通知书）=================
	/**
	 * 审核办结通用方法
	 * @param storeObj
	 */
	sxslbt_shbj.shbjcomFucCheckSfzrd=function(storeObj){
		var blzt = WSYS_BLZT_DM.BLZT_SLZ;
		var rwzt = "02";
		//查询是否做过税费种认定，如果没有做过税费种认定，则提示：要做税费种认定
		var url = "../../../../api/wtgl/djxxbl/check/sfzrdxx/"+storeObj.djxh;
	    ajax.post(url,{},function (result) {
	    	if(!result.success){
	    		mini.alert("该纳税人无税种登记信息，如需要进行税费种认定，请到核心征管前台为纳税人做税种登记！", '提示信息', function() {
	    			gxzt();
				});
	        }else{
	        	blzt = WSYS_BLZT_DM.BLZT_SLTG;
	        	rwzt = "01";
	        	gxzt();
	        }
	    },function () {
	        mini.alert('审核办结失败！');
	        return false;
	    });
	    function gxzt(){
	    	storeObj.blzt = blzt;
	 	    storeObj.rwzt = rwzt;
	 	    swdjxxblGxzt(storeObj);
	    }
	}
});


function swdjxxblGxzt(storeObj){
	//更新税务登记信息补录的办理状态
	var url = "../../../../api/wtgl/djxxbl/update/blzt";
	$.ajax({
		url : url,
		type : "post",
		data : {
			lcslId : storeObj.lcslId,
			blztDm : storeObj.blzt,
			rwztDm : storeObj.rwzt
		},
		success : function(data) {
			var resultData = mini.decode(data);
			if(resultData.success){
				mini.alert("受理成功！", '提示信息', function() {
					CloseWindow("ok");
				});
			}else{
				mini.alert(resultData.message);
			}
		},
		error : function() {
			mini.alert("税务登记信息补录受理失败！");
		}
	});
	
}
function CloseWindow(action) {
	if (window.CloseOwnerWindow)
		return window.CloseOwnerWindow(action);
	else
		window.close();
}
