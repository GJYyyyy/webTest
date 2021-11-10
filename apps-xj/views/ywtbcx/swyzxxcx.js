var grid;
var form;
var fromdatas;

$(function () {
	gldUtil.addWaterInPages();
	mini.parse();
	$("#swyzxxcxGrid").removeAttr("tabindex");
	init();
});

function init() {
	grid = mini.get("swyzxxcxGrid");
	form = new mini.Form("#cxtjForm");
	grid.setUrl("/dzgzpt-wsys/api/ywtbswyz/querySwyzxx"); // 查询接口
	//用证日期
	var slsjQ = mini.get("slsjQ");
	var slsjZ = mini.get("slsjZ");
	var now = new Date(), delay = new Date();
	delay.setMonth(delay.getMonth() - 1);
	slsjQ.setValue(mini.formatDate(delay, 'yyyy-MM-dd'));
	slsjZ.setValue(mini.formatDate(now, 'yyyy-MM-dd'));
	search();
}

/**
 * 查询
 */
function search() {
	form.validate();
	if (form.isValid() == false) {
		return;
	}
	fromdatas = form.getData(true);
	var param = mini.encode(fromdatas);
	grid.showEmptyText = "true";
	grid.load({
		data: param
	}, function (data) {
		grid.unmask();
	});
}// 日期校验
function onDateValidate(e) {
	if (e.value) {
		var dateTarget = e.sender.id;
		var slsjQ = mini.get("slsjQ").getValue();
		var slsjZ = mini.get("slsjZ").getValue();
		slsjQ = slsjQ && slsjQ.getTime();
		slsjZ = slsjZ && slsjZ.getTime();
		if (dateTarget === "slsjQ" || dateTarget === "slsjZ") {
			if (slsjQ && slsjZ && slsjQ > slsjZ) {
				mini.alert("用证日期起应小于用证日期止");
				mini.get(dateTarget).setValue("");
			}
		}
	}
}

/**
 * 重置
 */
function reset() {
	var form = new mini.Form("#cxtjForm");
	form.reset();
	//用证日期
	var slsjQ = mini.get("slsjQ");
	var slsjZ = mini.get("slsjZ");
	var now = new Date(), delay = new Date();
	delay.setMonth(delay.getMonth() - 1);
	slsjQ.setValue(mini.formatDate(delay, 'yyyy-MM-dd'));
	slsjZ.setValue(mini.formatDate(now, 'yyyy-MM-dd'));
}

// 操作列
function onActionRenderer(e) {
	var record = e.record;
	var filekey = record.filekey;
	return '<a onclick="showZz(\'' + filekey
		+ '\')" href="#">查看证件信息</a>';
}

function showZz(filekey,) {
	window.open('/dzgzpt-wsys/api/ywtb/queryZzPdf?fileKey=' + filekey);
}