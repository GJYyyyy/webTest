$(function(){
	mini.parse();
	var result = sxslcommon.initSxslPage(sxslcommon.swsxsqJbxx);
    if(!result){
    	mini.alert("初始化页面失败，申请信息为空！");
    	return;
	}
	mini.get("sxbjBtn").on('click',sxslcommon.sxbj);
	mini.get("shbjBtn").on('click',sxslcommon.shbj);
	mini.get("bzzlBtn").on('click',sxslcommon.bzzl);
	mini.get("byslBtn").on('click',sxslcommon.bysl);
});