var defaultSwsx;
$(function() {
	gldUtil.addWaterInPages();
	init();

});
var grid;
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
	
	$(".search").click(function() {
		$(".searchdiv").stop().slideToggle();
	});
}

function formatGrid(sxs){
	 var tj = '<div id="tjdatagrid" class="mini-datagrid" style="width:100%; height:100%;" idField="id" multiSelect="true" showEmptyText="true"  emptyText="没有相应统计数据"><div property="columns">';
	 tj += '<div field="swjg" width="120" headerAlign="center" allowSort="true">税务机关</div>'
	 for(var i=0; i< sxs.length; i++){
		 tj += '<div field="'+sxs[i].swsxdm+'" width="70" >'+sxs[i].swsxmc+'</div>';
     }
	 tj += '<div field="zs" width="70">总计</div>';
	 tj+= '</div>' + '</div>';
	 $("#tjData").append(tj);
	 mini.parse();
	 mini.get("tjdatagrid").showEmptyText = "true";
}
function onDefaultValue(e){
	//var record = e.record;
}

function doSearch() {
	var form = new mini.Form("#ywlForm");
	form.validate();
	if(!form.isValid()){
		return false;
	}
	$("#tjdatagrid").remove();
	var xzSwsx = mini.get("#swsxdm").getValue();
	if(xzSwsx != ''){
		formatGrid(mini.get("#swsxdm").getSelecteds());
	}else{
		formatGrid(defaultSwsx);
	}

	var formData = form.getData(true);
    formData.area = '2';
	var param = mini.encode(formData);
	grid = mini.get("tjdatagrid");
	grid.setUrl("../../../../api/xj/wtgl/cxtj/getAllSxSxtj");
	grid.load({
		data : param,
		pageIndex : "",
		pageSize : ""
	}, function(data) {
		grid.setData(data.result.data);
		mini.alert("查询结果不包含暂存和作废的数据，以提交到电子工作平台的数据为准。");
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
		var countNum = parseInt((rowObject.ybjsl!=null&&rowObject.ybjsl!='')?rowObject.ybjsl:'0')
				+ parseInt((rowObject.blzsl!=null&&rowObject.blzsl!='')?rowObject.blzsl:'0') + parseInt((rowObject.byslsl!=null&&rowObject.byslsl!='')?rowObject.byslsl:'0')
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
	var sl = 0;
	var rows = grid.getData();
	for ( var i = 0, l = rows.length; i < l; i++) {
		sl = rows[i].ybjsl;
		hj+= parseFloat(sl!=null&&sl!=''?sl:'0');
		sl = rows[i].blzsl;
		hj+= parseFloat(sl!=null&&sl!=''?sl:'0');
		sl = rows[i].byslsl;
		hj+= parseFloat(sl!=null&&sl!=''?sl:'0');
	}
	mini.get('hj').setValue(hj)
}