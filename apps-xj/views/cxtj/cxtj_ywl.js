$(function() {
	gldUtil.addWaterInPages();
	init();

});
var grid;
var swjgdmTree;
var swjgbzCombox;
function init() {
	mini.parse();
    $.ajax({
        url : "../../../../api/xj/wtgl/cxtj/getSxtjSwsx",
        type : "post",
        data : {},
        async:false,
        success : function(data) {
            var resultData = mini.decode(data);
            if(resultData.success){
                defaultSwsx = mini.decode(resultData.value);
                mini.get("swsxdm").setData(resultData.value);
            }
        }
    });
	grid = mini.get("ywlGrid");
	swjgdmTree=mini.get("swjgdm")
	swjgbzCombox=mini.get("swjgbz");
	swjgbzCombox.setValue("0");

	grid.setUrl("../../../../api/xj/wtgl/cxtj/getSxtj");
	$(".search").click(function() {
		$(".searchdiv").stop().slideToggle();
	});
}
function doSearch() {
	var form = new mini.Form("#ywlForm");
	form.validate();
	if(!form.isValid()){
		return false;
	}
	var formData = form.getData(true);
    formData.swjgbz = '1';
	var param = mini.encode(formData);
	grid.load({
		data : param,
		pageIndex : "",
		pageSize : ""
	}, function(data) {
		grid.setData(data.result.data);
		setHj();
	});
}
function doReset() {
	var form = new mini.Form("#ywlForm");
	form.reset();
}
function onDrawCell(e) {
	var rowObject = e.record;
	// 绘制总数
	if (e.field == "zs") {
		var countNum = parseInt((rowObject.ybjsl != null && rowObject.ybjsl != '') ? rowObject.ybjsl
				: '0')
				+ parseInt((rowObject.blzsl != null && rowObject.blzsl != '') ? rowObject.blzsl
						: '0')
				+ parseInt((rowObject.byslsl != null && rowObject.byslsl != '') ? rowObject.byslsl
						: '0')
				+ parseInt((rowObject.qt != null && rowObject.qt != '') ? rowObject.qt
						: '0');
		e.cellHtml = countNum + "";
	}

}
function onYbjActionRenderer(e){
	var record = e.record;
	 if(record.ybjsl==null||record.ybjsl==''){
		 return "0";
	 }else{
		 return  record.ybjsl;
	 }
}
function onBlzActionRenderer(e){
	var record = e.record;
	if(record.blzsl==null||record.blzsl==''){
		return "0";
	}else{
		return  record.blzsl;
	}
}
function onBslActionRenderer(e){
	var record = e.record;
	if(record.byslsl==null||record.byslsl==''){
		return "0";
	}else{
		return  record.byslsl;
	}
}
function onQtActionRenderer(e){
	var record = e.record;
	if(record.qt==null||record.qt==''){
		return "0";
	}else{
		return  record.qt;
	}
}
function onAsbjActionRenderer(e){
	var record = e.record;
	 if(record.asbjsl==null||record.asbjsl==''){
		 return "0";
	 }else{
		 return  record.asbjsl;
	 }
}
function setHj(){
	var hj = 0;
	var zs = 0;
	var rows = grid.getData();
	for ( var i = 0, l = rows.length; i < l; i++) {
		zs = rows[i].zs;
		hj+= parseFloat(zs!=null&&zs!=''?zs:'0');
	}
	mini.get('hj').setValue(hj)
}
function swjgbzChanged(e){
	swjgdmTree.setValue("");
	if(e.value!=null && e.value!=""){
		if(e.value=="0"){
			swjgdmTree.setUrl("../../../../api/xj/wtgl/cxtj/getSxtjDzSwjg");
		}else if(e.value=="1"){
			swjgdmTree.setUrl("../../../../api/xj/wtgl/cxtj/");
		}
		swjgdmTree.load();
	}else{
		swjgbzCombox.setValue("0");
	}
}