var defaultSwsx;
$(function() {
	gldUtil.addWaterInPages();
	init();

});
var grid;
function init() {
	mini.parse();
    //初始化查询日期 进入默认查询
	mini.get('sqrqq').setValue(new Date().getFirstDateOfMonth());
	mini.get('sqrqz').setValue(new Date());
    doSearch();
	$(".search").click(function() {
		$(".searchdiv").stop().slideToggle();
	});
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
	var sqrqq=mini.get('sqrqq').getValue();
	var sqrqz=mini.get('sqrqz').getValue();
	//查询日期起止不能跨年
	if(sqrqq.getFullYear()-sqrqz.getFullYear()>=1){
		mini.alert('申请日期查询条件不能跨年！');
		return false;
	}
	var formData = form.getData(true);
	var param = mini.encode(formData);
	grid = mini.get("tjdatagrid");
	grid.setUrl("../../../../api/sh/ywtb/ext/qyery/sqxxlb/yxzl");
	grid.load({
		data : param
	}, function(res) {
		grid.setData(res.data);
	});
}
function doReset() {
	var form = new mini.Form("#ywlForm");
	form.reset();
}
function viewFbzl(sqxh,nsrsbh,swsxmc,lrrq){
    mini.open({
        url: './FbzlView.html',
        title: "附报资料查看",
        width: 900,
        height: 600,
        onload: function () {
            var iframe = this.getIFrameEl();
            iframe.contentWindow.fbzlAjax(sqxh,nsrsbh,swsxmc,lrrq);
        },
        ondestroy: function (action) {
            doSearch();
        }
    });
    return ;
}
function onActionRenderer(e){
    var record = e.record;
    return '<a class="Delete_Button" onclick="viewFbzl(\'' + record.sqxh
        + '\',\'' + record.nsrsbh + '\',\'' + record.swsxmc  + '\',\'' + record.lrrq + '\')" href="#">查看</a>';
}


