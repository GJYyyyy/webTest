//----------------------------------------------------------------------------
//---------------------------  同时受理并发控制  --------------------------------
//----------------------------------------------------------------------------
/**
* 判断是否存在并发受理审核 
*/
function checkDbsxslzt(lcslId, callback) {
	mini.Cookie.set("lcslId", lcslId);
	$.ajax({
		url: "/dzgzpt-wsys/api/wtgl/dbsx/checkDbsxslzt",
		data: {
			lcslId: lcslId
		},
		success: function (data) {
			var resultData = mini.decode(data);
			if (resultData.success) {
				if ("true" != resultData.value.toString()) {
					mini.alert(resultData.value + "正在受理此任务，请不要重复受理。", "提示信息");
				} else {
					callback();
				}
			} else {
				mini.alert(resultData.message, '提示信息', function () { });
			}
		},
		error: function () {
			mini.alert("判断是否存在并发受理失败。", '提示信息');
		}
	});
}

/**
* 解锁待办事项受理状态
*/
function unlockDbsxslzt() {
	$.ajax({
		url: "/dzgzpt-wsys/api/wtgl/dbsx/unlockDbsxslzt",
		data: {
			lcslId: mini.Cookie.get("lcslId")
		},
		success: function (data) {
			if (data.success) {
				mini.Cookie.del("lcslId")
			}
		},
		error: function () {
			mini.alert("解锁待办事项受理状态失败。", '提示信息');
		}
	});
}

/**
* 页面关闭时，解锁待办事项受理状态
*/
window.onload = function () {
	//  获取当前页面名称
	var url = window.location.pathname;
	var lastIndex = url.lastIndexOf("/");
	url = url.substr(lastIndex + 1, url.length - lastIndex);
	url = url.substr(0, url.indexOf("."));
	// 如果为待办详细页面，设置解锁标志。
	if (isDbxxPage(url)) {
		mini.Cookie.set("unlockFlg", "true");
	}
}

/**
* 页面关闭时，解锁待办事项受理状态
*/
$(window).unload(function () {
	// if (mini.Cookie.get("unlockFlg") == "true") {
	// 	unlockDbsxslzt();
	// 	mini.Cookie.set("unlockFlg", "false");
	// }
});

/**
* 判断是否为待办详细页面
*/
function isDbxxPage(pageName) {
	switch (pageName) {
		case "dbsx_sxsl":   // 待办事项详细页面
			return true;
			break;
		//		case "fp_ptfplygl": // 发票领用待办页面
		//			return true;
		//			break;
		case "dbsx_sxsl_yjbs":   // 新办户一键办税详细页面
			return true;
			break;
		default:
			return false;
	}
}