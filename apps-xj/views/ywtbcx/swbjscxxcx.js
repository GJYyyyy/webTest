var grid;
var form;
var fromdatas;

$(function () {
	gldUtil.addWaterInPages();
	mini.parse();
	$("#swbjscxxGrid").removeAttr("tabindex");
	init();
});

function init() {
	grid = mini.get("swbjscxxGrid");
	form = new mini.Form("#cxtjForm");
	grid.setUrl("/dzgzpt-wsys/api/ywtb/swbjscxxcx"); // 查询接口
	//申请日期
	var sqrqQ = mini.get("sqrqQ");
	var sqrqZ = mini.get("sqrqZ");
	var now = new Date(), delay = new Date();
	delay.setMonth(delay.getMonth() - 1);
	sqrqQ.setValue(mini.formatDate(delay, 'yyyy-MM-dd'));
	sqrqZ.setValue(mini.formatDate(now, 'yyyy-MM-dd'));
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
}
// 日期校验
function onDateValidate(e) {
	if (e.value) {
		if (e.sender.id === 'sqrqQ' || e.sender.id === 'sqrqZ') {
			mini.get('sqslrqQ').setValue(""); // 清空其他起止的日期
			mini.get('sqslrqZ').setValue("");
			mini.get('bzscrqQ').setValue("");
			mini.get('bzscrqZ').setValue("");
			var dateTarget = e.sender.id;
			var sqrqQ = mini.get("sqrqQ").getValue();
			var sqrqZ = mini.get("sqrqZ").getValue();
			sqrqQ = sqrqQ && sqrqQ.getTime();
			sqrqZ = sqrqZ && sqrqZ.getTime();
			if (dateTarget === "sqrqQ" || dateTarget === "sqrqZ") {
				if (sqrqQ && sqrqZ && sqrqQ > sqrqZ) {
					mini.alert("申请日期起应小于申请日期止");
					mini.get(dateTarget).setValue("");
				}
			}
		}
		if (e.sender.id === 'sqslrqQ' || e.sender.id === 'sqslrqZ') {
			mini.get('sqrqQ').setValue("");// 清空其他起止的日期
			mini.get('sqrqZ').setValue("");
			mini.get('bzscrqQ').setValue("");
			mini.get('bzscrqZ').setValue("");
			var dateTarget = e.sender.id;
			var sqslrqQ = mini.get("sqslrqQ").getValue();
			var sqslrqZ = mini.get("sqslrqZ").getValue();
			sqslrqQ = sqslrqQ && sqslrqQ.getTime();
			sqslrqZ = sqslrqZ && sqslrqZ.getTime();
			if (dateTarget === "sqslrqQ" || dateTarget === "sqslrqZ") {
				if (sqslrqQ && sqslrqZ && sqslrqQ > sqslrqZ) {
					mini.alert("税务受理日期起应小于税务受理日期止");
					mini.get(dateTarget).setValue("");
				}
			}
		}
		if (e.sender.id === 'bzscrqQ' || e.sender.id === 'bzscrqZ') {
			mini.get('sqrqQ').setValue("");// 清空其他起止的日期
			mini.get('sqrqZ').setValue("");
			mini.get('sqslrqQ').setValue("");
			mini.get('sqslrqZ').setValue("");
			var dateTarget = e.sender.id;
			var bzscrqQ = mini.get("bzscrqQ").getValue();
			var bzscrqZ = mini.get("bzscrqZ").getValue();
			bzscrqQ = bzscrqQ && bzscrqQ.getTime();
			bzscrqZ = bzscrqZ && bzscrqZ.getTime();
			if (dateTarget === "bzscrqQ" || dateTarget === "bzscrqZ") {
				if (bzscrqQ && bzscrqZ && bzscrqQ > bzscrqZ) {
					mini.alert("办件上传日期起应小于办件上传日期止");
					mini.get(dateTarget).setValue("");
				}
			}
		}
	}
};
/**
 * 重置
 */
function reset() {
	var form = new mini.Form("#cxtjForm");
	form.reset();
	//申请日期
	var sqrqQ = mini.get("sqrqQ");
	var sqrqZ = mini.get("sqrqZ");
	var now = new Date(), delay = new Date();
	delay.setMonth(delay.getMonth() - 1);
	sqrqQ.setValue(mini.formatDate(delay, 'yyyy-MM-dd'));
	sqrqZ.setValue(mini.formatDate(now, 'yyyy-MM-dd'));
}

/**
 * 导出EXCEL文件
 */
function exportFpqd() {
	var cxtjForm = new mini.Form("cxtjForm"),
		gridData = new mini.Form("swbjscxxGrid").getData();
	var formData = cxtjForm.getData(true);
	if (gridData == null || gridData == "") {
		mini.alert("查询结果为空，无需导出文件！");
		return;
	}
	formData = JSON.stringify(formData).replace(/\"/g, '"');
	window.open('/dzgzpt-wsys/api/ywtb/exportExcel' + "?requestJson=" + formData);
}