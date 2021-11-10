$(function() {
	mini.get("bzzlBtn").setVisible(false);
	mini.get("byslBtn").setVisible(false);
});

sxslbt_shbj.shbjcomFuc=function(storeObj){
	$.ajax({
		type : "POST",
		url : "../../../../api/wtgl/gtgshdehd/submit/gtgshdehdsx",
		data : {
			djxh : storeObj.sqsxData.djxh,
			sqxh : storeObj.sqxh,
			lcslId : storeObj.lcslId,
			rwbh : storeObj.rwbh
		},
		success : function(result) {
			var resultData = mini.decode(result);
			if(resultData.success){
				mini.alert("受理成功！", '提示信息', function() {
					mini.get("backBtn").doClick();
				});
			}else{
				mini.alert(resultData.message, '提示信息', function() {
				});
			}
			
		},
		error : function(e) {
			mini.alert("审核办结失败");
		}
	});
}

function onCancel(action) {
	if (window.CloseOwnerWindow)
		return window.CloseOwnerWindow(action);
	else
		window.close();
}