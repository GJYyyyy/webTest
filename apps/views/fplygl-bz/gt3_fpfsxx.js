var tempDjxh;
var tempFpzlArray;
function setData(djxh,FpzlArray){
	tempDjxh=djxh;
	tempFpzlArray=FpzlArray;
}
function CloseWindow(action) {
        if (window.CloseOwnerWindow)
            return window.CloseOwnerWindow(action);
        else
            window.close();
}

function onOK() {
	var zzsfpfsGrid = mini.get("zzsfpfsGrid");
	var rows =zzsfpfsGrid.getData();
	if(rows.length==0){
		mini.alert("请选择发票发售记录");
		return false;
	}
    CloseWindow("ok");
}
function onBack(){
	CloseWindow("close");
}

/**
 * 从征管查询发票发售信息
 */
function searchFpfsFromGt3(){
	var querydate = mini.get("querydate").getValue();
	var cxrq = mini.formatDate(querydate,"yyyy-MM-dd");
	$.ajax({
		type : "POST",
		url : "/dzgzpt-wsys/api/wtgl/fplyglbz/get/queryZssFpfsxxByDjxh",
        contentType: 'application/json;charset=utf-8',
		data : mini.encode({
			djxh : tempDjxh,
			cxrq : cxrq,
			fpzldm : mini.encode(tempFpzlArray)
		}),
		success : function(result) {
			var result = mini.decode(result);
			if (!result.success) {
				if(result.message==null || result.message==""){
					mini.alert("查询发票发售信息失败");
				}else{
					mini.alert(result.message);
				}
				return false;
			}
			var data = mini.decode(result.value);
			mini.get("zzsfpfsGrid").setData(data);
		},
		error : function(e) {
			mini.alert("查询发票发售信息失败");
		}
	});
}

function getData(){
	var grid=mini.get("zzsfpfsGrid");
	var data=grid.getSelecteds();
	return data;
}

function onRenderLgrq(e){
	return new Date(e.value.replace(/-/g,"/")).format("yyyy-MM-dd");
}