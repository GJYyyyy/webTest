var grid;
var form;
var formdatas;

$(function () {
	mini.parse();
	//初始化查询日期 进入默认查询
	mini.get('cssjq').setValue(new Date().getFirstDateOfMonth());
	$("#dataGrid").removeAttr("tabindex");
	init();
});

function init() {
	grid = mini.get("dataGrid");
	form = new mini.Form("#cxtjForm");
};

/**
 * 查询
 */
function search() {
	formdatas = form.getData(true);
	var formdatas = form.getData(true);
	if (formdatas.sjlx === 'A') {
		formdatas.sjlx = ''
	}
	if (formdatas.sjfhzt === 'A') {
		formdatas.sjfhzt = ''
	}
	var params = $.extend({}, {
		pageIndex: dataGrid.pageIndex || grid.getPageIndex(),
		pageSize: dataGrid.pageSize || grid.getPageSize()
	}, formdatas);
	grid.emptyText =
		"<span style='float: left;padding-right: 2%;color: #f00'>暂无数据</span>";
	ajax.get('/dzgzpt-wsys/api/tdcrj/queryTdcrjZsxx', params, function (res) {
		if (res.success && res.value) {
			grid.setData(res.value.data);
			grid.setTotalCount(res.value.total);
		} else {
			grid.setData([]);
			mini.alert((res && res.message) || "暂无数据", "提示");
		}
	});
};
// 点击分页
function onpagechanged(e) {
	dataGrid.pageIndex = e.pageIndex;
	dataGrid.pageSize = e.pageSize;
	this.search();
}
function onbeforeload(e) {
	e.cancel = true;
}
function onActionRenderer(e) {
	var record = e.record;
	return '<a href="#" onclick="openCxxq(record)" class="check-info">查看详情</a>'
}

// 查看详情页
function openCxxq(e) {
	window.open('/dzgzpt-wsys/dzgzpt-wsys/apps/views/gytdsyqcrzsfhcx/gytdsyqcrzsfhcx_xqy.html?zsuuid=' + e.zsuuid + '&ywlsh=' + e.ywlsh);
}
