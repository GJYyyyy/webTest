$(function() {
	var swdjblSqsj = mini.decode(sxsl_store.sqsxData.data);
	if(swdjblSqsj.zfjglxDm == '1') {
		$('#ylfzjgxx').show();
	} else if(swdjblSqsj.zfjglxDm == '2'){
		$('#ylzjgxxForm').show();
	}else if(swdjblSqsj.zfjglxDm == '3'){
		$('#ylfzjgxx').show();
		$('#ylzjgxxForm').show();
	}else{
		$('#ylfzjgxx').hide();
		$('#ylzjgxxForm').hide();
	}

	// 税务登记信息补录没有补正资料，隐藏补正资料按钮
	// mini.get("bzzlBtn").hide();
	mini.get("byslBtn").show();
	// 隐藏父页面附报资料tab
	mini.get("tabs").updateTab(mini.get("tabs").getTab(1), { visible: false });
	/**
	 * 审核办结入口
	 * @param
	 */
	mini.get("shbjBtn").un('click',sxslcommon.shbj);
	sxslcommon.shbj=function(){
		var storeObj=sxsl_store;
		//针对税务登记信息补录，做特殊业务处理
			var url = "../../../../api/wtgl/djxxbl/check/sldjQk/"+storeObj.nsrsbh;
		    ajax.post(url,{},function (result) {
		    	if(!result.success){
		    		mini.alert(result.message);
		        	return false;
		        }
		        if(result.success && (result.value==0||result.value==1)){
		        	sxslbt_shbj.shbjcomFuc(storeObj);
		        }
		        if(result.success && result.value==2){
		        	//storeObj.djxh = result.value.djxh;
		        	mini.alert("该纳税人已通过其他渠道办理登记，请将此套餐任务不予受理！");
		        	return false;
		        }
		    },function () {
		        mini.alert('审核办结失败,请稍后再试！');
		        return false;
		    });
	};
	mini.get("shbjBtn").on('click',sxslcommon.shbj);

});

function CloseWindow(action) {
	if (window.CloseOwnerWindow)
		return window.CloseOwnerWindow(action);
	else
		window.close();
}
