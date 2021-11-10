$(function(){
	mini.parse();
	var result = cxtjcommon.initSxslPage(cxtjcommon.swsxsqJbxx);
    if(!result){
    	mini.alert("初始化页面失败，申请信息为空！");
    	return;
	}
});