/**
 * Created by ywy on 2017/5/25.
 */
mini.parse();
var swdjxxbl = {};
swdjxxbl.swdjxxblGrid = mini.get("swdjxxblGrid");
$(".searchC").bind('click',function(){
	$(".searchdiv").slideToggle();
});
swdjxxbl.doSearch = function(){
	swdjxxbl.swdjxxblGrid.setUrl("/dzgzpt-wsys/api/wtgl/sldjxxbl/querySldjxxblDbsx");
	swdjxxbl.blqxQ = mini.get("blqxQ").getValue();
	swdjxxbl.blqxZ = mini.get("blqxZ").getValue();
	if(swdjxxbl.blqxQ){
		swdjxxbl.blqxQ = mini.get("blqxQ").getValue().format('yyyy-MM-dd')
	}
	if(swdjxxbl.blqxZ){
		swdjxxbl.blqxZ = mini.get("blqxZ").getValue().format('yyyy-MM-dd')
	}
	swdjxxbl.swdjxxblGrid.load(
		{
			"nsrsbh":mini.get("nsrsbh").getValue(),
			"blqxQ":swdjxxbl.blqxQ,
			"blqxZ":swdjxxbl.blqxZ
		}
	);
};
swdjxxbl.init = function(){
	swdjxxbl.doSearch();
}();

swdjxxbl.beforeLoad = function(e){
	e.contentType='application/json;charset=utf-8';
	e.data=mini.encode(e.data);
};
function rwztRenderer(e){
	var record = e.record;
}
function czRenderer(e) {
	var record = e.record;
	var dbsxblzt = record.blztDm;
	//待审批 //待税种认定 //税费种认定完成
	if ("00" == dbsxblzt) {
		return '<a class="Delete_Button" onclick="view(\'' + record.lcslid
			+ '\',\'' + record.rwbh + '\')" href="#">受理</a>';
	}
	if ("02" == dbsxblzt) {
		return '<a class="Delete_Button" onclick="view(\'' + record.lcslid
			+ '\',\'' + record.rwbh
			+ '\')" onclick="" href="#">税种登记</a>';
	}
}
function view(lcslId,rwbh){
	window.location.href = "../dbsx/dbsx_sxsl.html?lcslId=" + lcslId + "&rwbh=" + rwbh;
}