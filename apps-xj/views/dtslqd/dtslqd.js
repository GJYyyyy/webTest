var grid;
var exportIFrame;
var win;
var form;
var fromdatas;
var ddh;
var yjhm;
var _swjgmc;
var dysjrlxdh;

$(function() {
	mini.parse();
	$("#fpqdGrid").removeAttr("tabindex");
	init();
});

function init(){
	grid = mini.get("fpqdGrid");
	form = new mini.Form("#searchdiv");
	win = mini.get("editWindow");
	grid.setUrl("/dzgzpt-wsys/api/wssqcx/getDtlyqd");

	//税务机关下拉
	var $swjgdm = mini.get("swjgdm");
	$.ajax({
		url : "/dzgzpt-wsys/api/baseCode/getUserSwjgAndAllXsSwjgWithCode",
		data : "",
		type : "post",
		async : false,
		success : function(obj) {
			var datas = mini.decode(obj);
			$swjgdm.loadList(datas, "jgDm", "PID");
			$swjgdm.setValue(datas[0].jgDm);
		},
		error : function() {
		}
	});
	search();
}

/**
 * 查询
 */
function search() { 
	form.validate();
	if (form.isValid() == false){
		return;
	}
	/*var swjgdm = mini.get("swjgdm").value;
	if(swjgdm == null || swjgdm == ""){
		mini.alert("税务机关不能为空！");
		return;
	}*/
	
	fromdatas = form.getData(true);
	var param = mini.encode(fromdatas);
	grid.showEmptyText = "true";
	grid.load({
		data : param
	}, function(data) {
		grid.unmask();
	});
}

/**
 * 重置
 */
function reset() {
	var fpnsrsbh = mini.get("nsrsbh");
	fpnsrsbh.setValue("");
	var slrq = mini.get("slrq");
	slrq.setValue(new Date());
   //税务机关下拉
	var $swjgdm = mini.get("swjgdm");
	$.ajax({
		url : "/dzgzpt-wsys/api/baseCode/getUserSwjgAndAllXsSwjgWithCode",
		data : "",
		type : "post",
		async : false,
		success : function(obj) {
			var datas = mini.decode(obj);
			$swjgdm.loadList (datas, "jgDm", "PID");
			$swjgdm.setValue(datas[0].jgDm);
		},
		error : function() {
		}
	});
}

/**
 * 导出EXCEL文件
 */
function exportFpqd(){
	var grid= mini.get("fpqdGrid").data;
	/*var rows = grid.getSelecteds();*/
	if(grid == null || grid == ""){
		mini.alert("查询结果为空，无需导出文件！");
		return ;
	}
	var nsrsbh =  mini.get("nsrsbh").value;
	var swjgdm = mini.get("swjgdm").value;
	var slrq = mini.get("slrq").text;
	if(nsrsbh==""){
		nsrsbh="111";
	}
	window.open('/dzgzpt-wsys/api/xj/export/fpxx/'+ nsrsbh +'/' +swjgdm+'/'+slrq);
}