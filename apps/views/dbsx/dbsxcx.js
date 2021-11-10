$(function() {
	init();
});

var grid;
function init() {
	mini.parse();
	grid = mini.get("dbsxGrid");
	grid.setUrl("../../../../api/wtgl/dbsx/queryDbsx");
	$.extend({
		id : 'sydb'
	});
	doSearch($);
}

$(document).ready(function() {
	$(".search").click(function() {
		showsearch();
	});
});

function showsearch() {
	if ($(".searchdiv").is(":hidden")) {
		$(".searchdiv").slideDown();
        $('.searchC').html('隐藏查询条件');
	} else {
		$(".searchdiv").slideUp();
        $('.searchC').html('显示查询条件');
	}
}

function doSearch(th) {
	var tabid = th.id;
	if (tabid != 'search') {
		$(".tab-bar .active").removeClass("active");
		document.getElementById(tabid).className = 'active';
	}
	var tabid = $(".tab-bar .active")[0].id;
	var swsx = '';
	if (tabid == 'wcjyzmkj') {
		swsx = '外出经营证明开具';
	}
	if (tabid == 'swdjxxbldb') {
		swsx = '税务登记信息补录';
	}
	if (tabid == 'fplyldb') {
		swsx = '领用';
	}
	if (tabid == 'zzszpdkldb') {
		swsx = '增值税专用发票代开';
	}
	if (tabid == 'swxzxk') {
		swsx = '税务行政许可';
	}
	if (tabid == 'xbnsrzhtcsq') {
		swsx = '新办纳税人综合套餐申请';
	}

//	if (tabid == 'gtgshdehd') {
//		swsx = '个体工商户定额核定';
//	}
	var form = new mini.Form("#cxtjForm");
	var formData = form.getData(true);
	var param = mini.encode(formData);
	grid.load({
		rwlxDm : '01',
		data : param,
		swsxmc : swsx
	}, function(data) {
		$(".searchdiv").slideUp();
	});
}

var sllx3 = {
	"110209" : "/dzgzpt-wsys/dzgzpt-wsys/apps/views/sqgl/fplygl/fp_ptfplygl.html"
};
var  sllx4= {
	"110214" : "/dzgzpt-wsys/dzgzpt-wsys/apps/views/sqgl/fpkj/"
};

/**
 * 操作按钮渲染
 * @param e
 * @returns {String}
 */
function onActionRenderer(e) {
	var record = e.record;
	var lcslId = record.lcslid;
	var rwztDm = record.rwztDm;
	var swsxDm = record.swsxdm;
	var rwbh = record.rwbh;
	var blztDm = record.blztDm;

	if (sllx3.hasOwnProperty(swsxDm)) {
		return '<a class="Delete_Button" onclick="showSllx3(\'' + swsxDm
				+ '\',\'' + lcslId + '\',\'' + rwbh + '\',\'' + record.djxh
				+ '\',\'' + record.nsrsbh + '\',\'' + record.sqxh
				+ '\')" href="#">受理</a>';
	}
	if (sllx4.hasOwnProperty(swsxDm)) {
		if(blztDm=='44'){
			return '<a class="Delete_Button" onclick="showSllx4(\'' + swsxDm
			+ '\',\'' + lcslId + '\',\'' + rwbh + '\',\'' + record.djxh
			+ '\',\'' + record.nsrsbh + '\',\'' + record.sqxh+ '\',\'' +blztDm
			+ '\')" href="#">受理</a>';
		}else if(blztDm=='45'){
			return '<a class="Delete_Button" onclick="showSllx4(\'' + swsxDm
			+ '\',\'' + lcslId + '\',\'' + rwbh + '\',\'' + record.djxh
			+ '\',\'' + record.nsrsbh + '\',\'' + record.sqxh+ '\',\'' +blztDm
			+ '\')" href="#">受理</a>';
		}else if(blztDm=='46'){
			return '<a class="Delete_Button" onclick="showSllx4(\'' + swsxDm
			+ '\',\'' + lcslId + '\',\'' + rwbh + '\',\'' + record.djxh
			+ '\',\'' + record.nsrsbh + '\',\'' + record.sqxh+ '\',\'' +blztDm
			+ '\')" href="#">受理</a>';
		}
		
	}
	if ("00" == rwztDm) {
		return '<a class="Delete_Button" onclick="showSwsxSqxx(\'' + lcslId
				+ '\',\'' + rwbh + '\')" href="#">受理</a>';
	}
	if ("02" == rwztDm) {
		return '<a class="Delete_Button" onclick="showSwsxSqxx(\'' + lcslId
				+ '\',\'' + rwbh
				+ '\')" onclick="" href="#">税种登记</a>';
	}
}

/** 目前只有发票领用用到此方法，受理跳到第三方页面 */
function showSllx3(swsxDm, lcslId, rwbh, djxh, nsrsbh, sqxh) {
	window.location.href = sllx3[swsxDm] + "?swsxDm=" + swsxDm + "&djxh="
			+ djxh + "&sqxh=" + sqxh + "&lcslId=" + lcslId + "&rwbh=" + rwbh
			+ "&nsrsbh=" + nsrsbh;
}

/** 发票开具代办事项，点击跳转到发票开具页面 */
function showSllx4(swsxDm, lcslId, rwbh, djxh, nsrsbh, sqxh, blztDm) {
	if(blztDm=='44'){
		window.location.href = sllx4[swsxDm] + "zzsptfpdk_fp_kj.html?swsxDm=" + swsxDm + "&djxh="
		+ djxh + "&sqxh=" + sqxh + "&lcslId=" + lcslId + "&rwbh=" + rwbh
		+ "&nsrsbh=" + nsrsbh+"&blztDm="+ blztDm;
	}else if(blztDm=='45'){
		window.location.href = sllx4[swsxDm] + "zzsptfpdk_fp_kj.html?swsxDm=" + swsxDm + "&djxh="
		+ djxh + "&sqxh=" + sqxh + "&lcslId=" + lcslId + "&rwbh=" + rwbh
		+ "&nsrsbh=" + nsrsbh+"&blztDm="+ blztDm;
	}else if(blztDm=='46'){
		window.location.href = sllx4[swsxDm] + "sjrxxwh.html?swsxDm=" + swsxDm + "&djxh="
		+ djxh + "&sqxh=" + sqxh + "&lcslId=" + lcslId + "&rwbh=" + rwbh
		+ "&nsrsbh=" + nsrsbh+"&blztDm="+ blztDm;
	}
	
}
/**
 * Go to 事项受理页面
 * @param lcslId
 * @param blztDm
 * @param rwbh
 */
function showSwsxSqxx(lcslId, rwbh) {
	window.location.href = "dbsx_sxsl.html?lcslId=" + lcslId + "&rwbh=" + rwbh;
}

/**
 * 任务状态渲染
 * @param e
 * @returns {String}
 */
function rwztRenderer(e) {
	var record = e.record;
	var rwztDm = record.rwztDm;
	if ("00" == rwztDm) {
		return "未受理";
	}
	if ("01" == rwztDm) {
		return "已受理";
	}
	if ("02" == rwztDm) {
		return "待税种认定";
	}
	return "";
}

/**
 * 重置查询条件
 */
function doReset() {
	var form = new mini.Form("#cxtjForm");
	form.reset();
}