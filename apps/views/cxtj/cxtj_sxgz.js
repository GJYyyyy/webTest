$(function() {
	init();
});

var grid;
function init() {
	mini.parse();
	grid = mini.get("sxgzGrid");
	grid.setUrl("../../../../api/wtgl/cxtj/sxgz/cxtjQuerySxgz");
	initCxtj();
	//doSearch();
}

/**
 * 初始化查询条件
 */
function initCxtj() {

	// 税务机关下拉
	var $swjgdm = mini.get("swjgDm");
	$.ajax({
		url : "/dzgzpt-wsys/api/baseCode/getUserSwjgAndAllSubSwjgWithCode",
		data : "",
		type : "post",
		success : function(obj) {
			var datas = mini.decode(obj);
			$swjgdm.loadList(datas, "YXW", "PID");
			$swjgdm.setValue(datas[0].YXW);
		},
		error : function() {
		}
	});

	// 获取办理状态
	$.ajax({
		type : "GET",
		url : "../../../../api/wtgl/cxtj/sxgz/queryBlzt",
		success : function(data) {
			mini.get("blztDm").setData(mini.decode(data.value.value));
		},
		error : function() {
			mini.alert("获取办理状态出现异常！");
		}
	})
	var myDate = new Date();
	var thisyear = myDate.getFullYear();
	var thismonth = myDate.getMonth()+1;
	// 申请时间
	var $sqrqKs = mini.get("sqrqKs");
	$sqrqKs.setValue(thisyear+"-"+thismonth+"-01");
	$sqrqKs.setRequired(true);
	var $sqrqJs = mini.get("sqrqJs");
	$sqrqJs.setValue(myDate);
}

$(document).ready(function() {
	$(".search").click(function() {
		showsearch();
	});
});

function showsearch() {
	if ($(".searchdiv").is(":hidden")) {
		$(".searchdiv").slideDown();
	} else {
		$(".searchdiv").slideUp();
	}
}

function doSearch() {
	
	var form = new mini.Form("#cxtjForm");
	var formData = form.getData(true);
	
	var param = mini.encode(formData);
	grid.load({
		data : param
	}, function(data) {
		if (data.result.total == 0) {
			//mini.alert(data.result.message);
			return;
		}
		showsearch();
	}); 
}

function onActionRenderer(e) {
	var record = e.record;
	var lcslId = record.lcslid;
	var blztDm = record.blztDm;
	var rwbh = record.rwbh;
	if(rwbh && record.sxmc!='外出经营证明开具'){
		return '<a class="Delete_Button" onclick="showSwsxSqxx(\'' + lcslId
		+ '\',\'' + blztDm + '\',\'' + rwbh + '\')" href="#">查看详情</a>';
	}
	return
}

function showSwsxSqxx(lcslId, blztDm, rwbh) {
	window.location.href = "cxtj_dbsx_sxsl.html?lcslId=" + lcslId
			+ "&blztDm=" + blztDm + "&rwbh=" + rwbh;
}

function doReset() {
	var form = new mini.Form("#cxtjForm");
	form.reset();
}
