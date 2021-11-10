/**
 * Created by ywy on 2017/5/11.
 */
$.ajaxSetup(
	{ContentType: 'application/x-www-form-urlencoded'}
);
mini.parse();
var syjlgl = {};
	syjlgl.cxGrid = mini.get("syjlgl-grid");
	syjlgl.zt = mini.get("zt");
	syjlgl.yysjq = mini.get("yysjq");
	syjlgl.yysjz = mini.get("yysjz");
	syjlgl.zjswjg = mini.get("zjswjg");
	syjlgl.nsrsbh = mini.get("nsrsbh");
syjlgl.init = function(){
    $(".hide-btn").bind('click',function(){
        $('.cx-main').slideToggle();
    });
    var times = new Date().getTime()-30*24*60*60*1000
    mini.get("#yysjq").setValue(new Date(times));
    mini.get("#yysjz").setValue(new Date());
	//syjlgl.blztCx();
	syjlgl.zt.setText("全部");
	syjlgl.zjswjg.setValue("");
	syjlgl.nsrsbh.setValue("");
	syjlgl.cxGrid.setUrl("/dzgzpt-wsys/api/yybs/syxxcx");
	syjlgl.bsdtCx();
	syjlgl.cxGrid.load({
		bsdtdm: "",
		yysjq: "",
		yysjz: "",
		nsrsbh: "",
		zt: ""
	});
};
syjlgl.bsdtCx = function(){
	$.ajax({
		url: '/dzgzpt-wsys/api/yybs/dtxx',
		type: 'post',
		data:mini.encode({}),
		success: function(data){
			if(data.success){
				var resultData = mini.decode(data.value);
				syjlgl.zjswjg.setData(resultData);
			}else{
				alert(data.message);
			}
		},
		error: function(data){
			alert(data.message);
		}
	})
};
//syjlgl.blztCx = function(){
//	$.ajax({
//		url: '/dzgzpt-wsys/api/baseCode/get/baseCode2CombSelect/DM_YYBLZT',
//		type: 'get',
//		success: function(data){
//			data.splice(1,3);
//			data.unshift({
//				ID:"",
//				MC:"全部"
//			});
//			syjlgl.zt.setData(data);
//		},
//		error: function(error){
//
//		}
//
//	})
//}
syjlgl.init();

syjlgl.cx = function(){
	syjlgl.cxGrid.setUrl("/dzgzpt-wsys/api/yybs/syxxcx");
	syjlgl.cxGrid.load({
		bsdtdm: syjlgl.zjswjg.getValue(),
		yysjq: syjlgl.yysjq.getText(),
		yysjz: syjlgl.yysjz.getText(),
		nsrsbh: syjlgl.nsrsbh.getValue(),
		zt: syjlgl.zt.getValue()
	});
};
syjlgl.dateChanged = function(e){
	if(syjlgl.yysjq.getValue()&&syjlgl.yysjz.getValue()){
		if(syjlgl.yysjq.getValue() > syjlgl.yysjz.getValue())
			syjlgl.yysjq.setValue("")
	}
};
syjlgl.onRenderTime = function(e){
	var value = e.value;
	var year = value.substring(0,4);
	var month = value.substring(4,6);
	var day = value.substring(6,8);
	return year+'-'+month+'-'+day;
}
syjlgl.onRenderXgsj = function(e){
	if(e.record.yyztdm != "05"){
		return "";
	}else{
		return e.value.format("yyyy-MM-dd");
	}
}
syjlgl.onRenderOperation = function(e){
	if(e.record.yyztdm != "05"){
		return '<a href="javascript:syjlgl.zf(\''+ e.rowIndex+'\')">作废</a>'
	}
};
syjlgl.zf = function(index){
	syjlgl.cxData = syjlgl.cxGrid.getData();
	$.ajax({
		url: '/dzgzpt-wsys/api/yybs/syqxsz',
		type: 'post',
		data: mini.encode({
			uuid: syjlgl.cxData[index].yyuuid
		}),
		success: function(data){
			if(data.success){
				alert(data.value);
				syjlgl.cxGrid.reload();
				/*syjlgl.cxGrid.updateRow(parseInt(index),'xgrq',new Date().format('yyyy-MM-dd'));
				syjlgl.cxGrid.updateRow(parseInt(index),'yyztdm', '05');*/
			}else{
				alert(data.message);
			}

		}
	})
}
syjlgl.beforeLoad = function(e){
	e.contentType='application/json;charset=utf-8';
	e.data=mini.encode(e.data);
}