var grid;
var form;
var fromdatas;

$(function () {
	gldUtil.addWaterInPages();
	mini.parse();
	$("#dqycxGrid").removeAttr("tabindex");
	init();
});

function init() {
	grid = mini.get("dqycxGrid");
	form = new mini.Form("#cxtjForm");
	grid.setUrl("/workflow/web/workflow/form/dqyjnsr/queryByMoreCondition"); // 查询接口
	var szxzList = [{ SZLXS: 'all', MC: '全部' }], ztlxList = [{ ZTLXS: 'all', MC: '全部' }], xzList = [{ XZ: 'all', MC: '全部' }], lyList = [{ LY: 'all', MC: '全部' }];
	// 税种类型
	$.ajax({
		url: '/workflow/web/workflow/form/dqyjnsr/querySzlx',
		type: 'GET',
		contentType: 'application/json;charset=UTF-8',
		async: false,
		success: function (res) {
			mini.unmask();
			szxzList = szxzList.concat(res);
		},
		error: function (res) {
			mini.unmask();
			mini.alert(res.message || '系统出现故障，请稍后重试');
		}
	});
	mini.get('szlxs').setData(szxzList);
	// 专题类型
	$.ajax({
		url: '/workflow/web/workflow/form/dqyjnsr/queryZtlx',
		type: 'GET',
		contentType: 'application/json;charset=UTF-8',
		async: false,
		success: function (res) {
			mini.unmask();
			ztlxList = ztlxList.concat(res);
		},
		error: function (res) {
			mini.unmask();
			mini.alert(res.message || '系统出现故障，请稍后重试');
		}
	});
	mini.get('ztlxs').setData(ztlxList);
	// 性质
	$.ajax({
		url: '/workflow/web/workflow/form/dqyjnsr/queryXz',
		type: 'GET',
		contentType: 'application/json;charset=UTF-8',
		async: false,
		success: function (res) {
			mini.unmask();
			xzList = xzList.concat(res);
		},
		error: function (res) {
			mini.unmask();
			mini.alert(res.message || '系统出现故障，请稍后重试');
		}
	});
	mini.get('xz').setData(xzList);
	// 来源
	$.ajax({
		url: '/workflow/web/workflow/form/dqyjnsr/queryLy',
		type: 'GET',
		contentType: 'application/json;charset=UTF-8',
		async: false,
		success: function (res) {
			mini.unmask();
			lyList = lyList.concat(res);
		},
		error: function (res) {
			mini.unmask();
			mini.alert(res.message || '系统出现故障，请稍后重试');
		}
	});
	mini.get('ly').setData(lyList);
};

/**
 * 查询
 */
function search() {
	form.validate();
	if (form.isValid() == false) {
		return;
	}
	fromdatas = form.getData(true);
	if (fromdatas.ztlxs === 'all') {
		fromdatas.ztlxs = '';
	}
	if (fromdatas.szlxs === 'all') {
		fromdatas.szlxs = '';
	}
	if (fromdatas.xz === 'all') {
		fromdatas.xz = '';
	}
	if (fromdatas.ly === 'all') {
		fromdatas.ly = '';
	}
	if (fromdatas.blzt === 'all') {
		fromdatas.blzt = '';
	}
	var param = mini.encode(fromdatas);
	grid.showEmptyText = "true";
	grid.load({
		data: param
	}, function (data) {
		grid.unmask();
	});
};
// 日期校验
function jssjQChange(e) {
	mini.get("jssjZ").setMinDate(e.value);
};
function jssjZChange(e) {
	mini.get("jssjQ").setMaxDate(e.value);
};
function djsjQChange(e) {
	mini.get("djsjZ").setMinDate(e.value);
};
function djsjZChange(e) {
	mini.get("djsjQ").setMaxDate(e.value);
};
/**
 * 重置
 */
function reset() {
	var form = new mini.Form("#cxtjForm");
	form.reset();
};

/**
 * 导出EXCEL文件
 */
function exportFpqd() {
	var cxtjForm = new mini.Form("cxtjForm"),
		gridData = new mini.Form("dqycxGrid").getData();
	var formData = cxtjForm.getData(true);
	if (gridData == null || gridData == "") {
		mini.alert("查询结果为空，无需导出文件！");
		return;
	}
	formData = JSON.stringify(formData).replace(/\"/g, '"');
	window.open(encodeURI('/workflow/web/workflow/form/dqyjnsr/exportExcel' + "?requestJson=" + formData));
};