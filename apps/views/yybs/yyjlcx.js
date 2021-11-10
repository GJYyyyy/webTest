/**
 * Created by ywy on 2017/5/12.
 */
mini.parse();
/*$.ajaxSetup({content})*/
var yyjlcx = {};
	yyjlcx.cxGrid = mini.get("yyjlcx-grid");
	yyjlcx.zt = mini.get("zt");
	yyjlcx.yysjq = mini.get("yysjq");
	yyjlcx.yysjz = mini.get("yysjz");
	yyjlcx.zjswjg = mini.get("zjswjg");
	yyjlcx.nsrsbh = mini.get("nsrsbh");
	yyjlcx.nsrmc = mini.get("nsrmc");

yyjlcx.init = function(){
    var times = new Date().getTime()-30*24*60*60*1000
    mini.get("#yysjq").setValue(new Date(times));
    mini.get("#yysjz").setValue(new Date());
	yyjlcx.bsdtCx();
	yyjlcx.blztCx();
	yyjlcx.zt.setText("全部");
	yyjlcx.zjswjg.setValue("");
	yyjlcx.nsrsbh.setValue("");
	yyjlcx.nsrmc.setValue("");
	yyjlcx.cxGrid.setUrl('/dzgzpt-wsys/api/yybs/yyxx');
	yyjlcx.cxGrid.load({
		"bsdtdm": "",
		"yysjq": "",
		"yysjz": "",
		"nsrsbh": "",
		"nsrmc": "",
		"zt": ""
	});
};
yyjlcx.bsdtCx = function(){
	$.ajax({
		url: '/dzgzpt-wsys/api/yybs/dtxx',
		type: 'post',
		data: mini.encode({}),
		success: function(data){
			if(data.success){
				var resultData = mini.decode(data.value);
				yyjlcx.zjswjg.setData(resultData);
			}else{
				alert(data.message);
			}

		},
		error: function(data){
			alert(data.message);
		}
	})
};
yyjlcx.blztCx = function(){
	$.ajax({
		url: '/dzgzpt-wsys/api/baseCode/get/baseCode2CombSelect/DM_YYBLZT',
		type: 'get',
		data: mini.encode({}),
		success: function(data){
			data.splice(3,1);
			data.unshift({
				ID:"",
				MC:"全部"
			});
			yyjlcx.zt.setData(data);
		},
		error: function(error){
			alert(data.message);
		}

	})
}
yyjlcx.init();
$(".hide-btn").bind('click',function(){
	$('.cx-main').slideToggle();
});
yyjlcx.cx = function() {
	yyjlcx.cxGrid.setUrl("/dzgzpt-wsys/api/yybs/yyxx");
	yyjlcx.cxGrid.load({
		bsdtdm: yyjlcx.zjswjg.getValue(),
		yysjq: yyjlcx.yysjq.getText(),
		yysjz: yyjlcx.yysjz.getText(),
		nsrsbh: yyjlcx.nsrsbh.getValue(),
		nsrmc: yyjlcx.nsrmc.getValue(),
		zt: yyjlcx.zt.getValue()
	});
};
yyjlcx.onRenderTime = function(e){
	return yyjlcx.timeUpdate(e.value,false);
};
yyjlcx.timeUpdate = function(sth,status){
	var value = sth;
	var year = value.substring(0,4);
	var month = value.substring(4,6);
	var day = value.substring(6,8);
	var hour = value.substring(9,20);
	if(status)
		return year+'-'+month+'-'+day+' '+hour;
	else
		return year+'-'+month+'-'+day;
}
yyjlcx.onRenderOperation = function(e){
	return '<a href="javascript:yyjlcx.ckXq(\''+ e.record.yyuuid+'\')">查看详情</a>'
};
yyjlcx.dateChanged = function(e){
	if(yyjlcx.yysjq.getValue()&&yyjlcx.yysjz.getValue()){
		if(yyjlcx.yysjq.getValue() > yyjlcx.yysjz.getValue())
			yyjlcx.yysjq.setValue("")
	}
};
yyjlcx.ckXq = function(sth){
	var data = yyjlcx.cxGrid.getData();
	var index;
	for(var i = 0, len = data.length; i < len; i++){
		if(data[i].yyuuid == sth){
			index = i;
			break;
		}
	}
	mini.get("win1").show();
	$(".bsdt").html(data[index].dtmc);
	$(".bsdz").html(data[index].addr);
	$(".bssxmc").html(data[index].ywmc);
	$(".yysj").html(yyjlcx.timeUpdate(data[index].yysj,true));
	if(data[index].qhsj =="" || data[index].qhsj==undefined){
		$(".qhsj").html("");
	}else{
		$(".qhsj").html(data[index].qhsj);
	}
	
	//window.location.href="yyjlxq.html?"+sth;
	/*window.location.href = "yyjlxq.html?"+data[index].dtmc+'&'+data[index].addr+'&'+data[index].ywmc+'&'+data[index].yysj+'&'+data[index].qhsj;*/
}
yyjlcx.winClose = function(){
	mini.get("win1").hide();
}
yyjlcx.beforeLoad = function(e){
	e.contentType='application/json;charset=utf-8';
	e.data=mini.encode(e.data);
}