$(document).ready(function() {
    mini.parse();
    doCustomizeInit();
});

// 初始化 页面
function doCustomizeInit(){
   
}
function setData(storeObj){
	//查询征收品目
	$.ajax({
			type : "GET",
			url : "/dzgzpt-wsys/api/xjzzszyfp/cxsfzrdzspm/cxsfzrdzspms?djxh="+storeObj.djxh,
			data : {"djxh":storeObj.djxh},
			async : false,
			success : function(data) {
				var resultData = mini.decode(data);
				mini.get("zspmDm").setData(data.value);
			},
			error : function(e) {
				mini.alert("查询征管税费种认定信息表中征收品目出错！");
				console.error(e);
			}
		});
}



function nextShowSwsxtzs() {
    //1.取补录信息数据
    var blxxForm = new mini.Form("#blxxForm");
    blxxForm.validate();
    if(!blxxForm.isValid()){
        return;
    }
    var blxxData = blxxForm.getDataAndText(true);
    CloseWindow(blxxData);
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

/**
 * 自定义提示框，可根据页面滚动，自动定位居中
 * @param message
 */
function showMessageAtMiddle(message) {
    var win = mini.get("win1");
    var el = win.getBodyEl();
    el.innerHTML = message;
    // 当前页面居中显示，居中根据弹出框大小和当前位置计算(问题：Tab键切换下一单元格遮罩未起作用)
    win.show($(window).width()/2-180+"px", $(window).scrollTop()+($(window).height()-220)/2+"px");
}



