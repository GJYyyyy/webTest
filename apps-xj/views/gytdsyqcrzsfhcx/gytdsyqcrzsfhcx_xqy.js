var grid;
var form;
var formdatas;

$(function () {
	mini.parse();
	init();
});

function init() {
	grid = mini.get("dataGrid");
	zsuuid = Tools.getUrlParamByName('zsuuid');
	ywlsh = Tools.getUrlParamByName('ywlsh');
	$.ajax({
		url: "/dzgzpt-wsys/api/tdcrj/queryTdcrjZsxxDetail/" + zsuuid + "/" + ywlsh,
		type: "post",
		// data: mini.encode(formdatas),
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

