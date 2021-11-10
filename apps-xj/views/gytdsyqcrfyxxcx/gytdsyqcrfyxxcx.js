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
	// form.validate();
	// if (form.isValid() == false) {
	// 	return;
	// }
	formdatas = form.getData(true);

	$.ajax({
		url: "/dzgzpt-wsys/api/tdcrj/queryTdcrj",
		type: "post",
		data: mini.encode(formdatas),
		contentType: "application/json",
		async: false,
		success: function (data) {
			if (data.success) {
				grid.setData(data.value || [])
			} else {
				mini.alert(data.message || '系统开小差啦，请重试～')
			}
		}
	});

};

/**
 * 
 */
function queryTdcrjLl() {
	if (!mini.get('cxrq').getValue()) {
		return
	}
	$.ajax({
		url: "/dzgzpt-wsys/api/tdcrj/queryTdcrjLl?cxrq=" + mini.formatDate(mini.get('cxrq').getValue(), 'yyyy-MM-dd'),
		type: "post",
		async: false,
		success: function (data) {
			if (data.success) {
				mini.get('llNum').setValue(data.value || '')
			} else {
				mini.alert(data.message || '系统开小差啦，请重试～')
			}
		}
	});
}
/**
 * 导出EXCEL文件
 */
function exportFpqd() {
	var grid = mini.get("dataGrid").data;
	/*var rows = grid.getSelecteds();*/
	if (grid == null || grid == "") {
		mini.alert("查询结果为空，无需导出文件！");
		return;
	}
	var tyshxydm = mini.get("tyshxydm").value;
	var jfrmc = mini.get("jfrmc").value;
	var zhtbh = mini.get("zhtbh").value;
	var cssjq = mini.formatDate(mini.get("cssjq").value, 'yyyy-MM-dd');
	var cssjz = mini.formatDate(mini.get("cssjz").value, 'yyyy-MM-dd');
	var htqdrq = mini.formatDate(mini.get("htqdrq").value, 'yyyy-MM-dd');
	var swjgdm = mini.get("swjgdm").value;
	var yxbz = mini.get("yxbz").value;
	window.open('/dzgzpt-wsys/api/tdcrj/export/tdcrjExcel?tyshxydm=' + tyshxydm + '&jfrmc=' + jfrmc + '&zhtbh=' +
		zhtbh + '&cssjq=' + cssjq + '&cssjz=' + cssjz + '&htqdrq=' + htqdrq + '&swjgdm=' + swjgdm + '&yxbz=' + yxbz);
}