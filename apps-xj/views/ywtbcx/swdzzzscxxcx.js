var grid;
var form;
var fromdatas;

$(function () {
	gldUtil.addWaterInPages();
	mini.parse();
	$("#swdzzzscGrid").removeAttr("tabindex");
	init();
});

function init() {
	grid = mini.get("swdzzzscGrid");
	form = new mini.Form("#cxtjForm");
	grid.setUrl("/dzgzpt-wsys/api/ywtb/swdzzzscxxcx"); // 查询接口
	//制证日期
	var zzrqQ = mini.get("zzrqQ");
	var zzrqZ = mini.get("zzrqZ");
	var now = new Date(), delay = new Date();
	delay.setMonth(delay.getMonth() - 1);
	zzrqQ.setValue(mini.formatDate(delay, 'yyyy-MM-dd'));
	zzrqZ.setValue(mini.formatDate(now, 'yyyy-MM-dd'));
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
		var zzrqQ = mini.get("zzrqQ").getValue();
		var zzrqZ = mini.get("zzrqZ").getValue();
		zzrqQ = zzrqQ && zzrqQ.getTime();
		zzrqZ = zzrqZ && zzrqZ.getTime();
		if (dateTarget === "zzrqQ" || dateTarget === "zzrqZ") {
			if (zzrqQ && zzrqZ && zzrqQ > zzrqZ) {
				mini.alert("制证日期起应小于制证日期止");
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
	//制证日期
	var zzrqQ = mini.get("zzrqQ");
	var zzrqZ = mini.get("zzrqZ");
	var now = new Date(), delay = new Date();
	delay.setMonth(delay.getMonth() - 1);
	zzrqQ.setValue(mini.formatDate(delay, 'yyyy-MM-dd'));
	zzrqZ.setValue(mini.formatDate(now, 'yyyy-MM-dd'));
}
// 操作列
function onActionRenderer(e) {
	var record = e.record;
	var certcode = record.certcode;
	return '<a class="mini-button" style="width: 51%; border-radius: 4px;" onclick="showZz(\'' + certcode
		+ '\')" href="#">查看证照</a>';
}

function showZz(certcode,) {
	window.open('/dzgzpt-wsys/api/ywtb/queryZzPdf?fileKey=' + certcode);
}