/**
 * Created by ywy on 2017/9/20.
 */
mini.parse();
var qysdsyhsxbabl = {};
function nextShowSwsxtzs() {
	//1.取补录信息数据
	var blxxForm = new mini.Form("#Form"),
		grid = mini.get("qysdsyhsxba_grid");
	blxxForm.validate();
	if (!blxxForm.isValid()) {
		return;
	}
	grid.validate();
	if (!grid.isValid()) {
		return;
	}
	if(!qysdsyhsxbabl.jmlxValid()){
		return;
	}
	if(qysdsyhsxbabl.isExist()){
		return;
	}
	var blxxObj = $.extend({},grid.getData()[0],blxxForm.getData());
	var blxxData = {},
		blnr = [];
	blxxObj.yhyxqq = mini.get("yhyxqq").getText();
	blxxObj.yhyxqz = mini.get("yhyxqz").getText();
	blnr.push(blxxObj);
	blxxData["blnr"]=blnr;
	CloseWindow(blxxData);
}
function CloseWindow(action) {
	if (window.CloseOwnerWindow)
		return window.CloseOwnerWindow(action);
	else
		window.close();
}
function onCancel(e) {
	CloseWindow("cancel");
}
function setData(rwbh){
	qysdsyhsxbabl.djxh = rwbh.djxh;
	var form = new mini.Form("Form");
	var data = mini.decode(rwbh.sqsxData.viewData);
	form.setData(data.step_yl_form);
	qysdsyhsxbabl.sqxxData = mini.decode(rwbh.sqsxData.data);
	qysdsyhsxbabl.yhsxDm = data.step_yl_form.yhsxDm;
	if(!!qysdsyhsxbabl.yhsxDm){
		qysdsyhsxbabl.getJmxz();
	}
	if(!!qysdsyhsxbabl.jmxz.length){
		var jmxzDl = qysdsyhsxbabl.getJmxzDl(qysdsyhsxbabl.jmxz[0].ssjmxzDm);
		var jmxzXl = qysdsyhsxbabl.getJmxzXl(qysdsyhsxbabl.jmxz[0].ssjmxzDm);
	}else{
		return;
	}
	//var jmlx = qysdsyhsxbabl.getJmlx();
	//var jmfs = qysdsyhsxbabl.getJmfs();
	var row = {
		ssjmxzDm: qysdsyhsxbabl.jmxz[0].ssjmxzDm,
		ssjmxzmc: qysdsyhsxbabl.jmxz[0].ssjmxzmc,
		jmxzDl: jmxzDl[0].ID,
		jmxzDlText: jmxzDl[0].MC,
		jmxzXl: jmxzXl[0].ID,
		jmxzXlText: jmxzXl[0].MC,
		jmlx: "",
		jmfs: "",
		jzed: "",
		jzfd: "",
		jzsl: ""
	};
	mini.get("qysdsyhsxba_grid").addRow(row,0);
}
qysdsyhsxbabl.getJmxz = function(){ //获取减免性质
	var cxInfo = {
		ssyhsx: qysdsyhsxbabl.yhsxDm,
		jmqxq: mini.get("yhyxqq").getText(),
		jmqxz: mini.get("yhyxqz").getText(),
		zsxmDm: "10104"
	};
	var jmxzUrl = "/dzgzpt-wsys/api/xj/yh/qysdsyhsx/getQysdsZcyj";
	$.ajax({
		url: jmxzUrl,
		type: "POST",
		contentType : "application/json;charset=utf-8",
		data: mini.encode(cxInfo),
		success: function(data){
			if(data.success){
				qysdsyhsxbabl.jmxz = data.value;
			}else{
				mini.alert(data.message);
			}
		}
	});
};
qysdsyhsxbabl.getJmxzDl = function(jmxzdm){
	var dlUrl = "/dzgzpt-wsys/api/baseCode/CombSelect/common/moreFilter?codeName=SSJMXZDL&filterVals=" + jmxzdm+";"+ qysdsyhsxbabl.yhsxDm+";10104";
	var jmxzDl;
	ajax.get(dlUrl, "", function (data) {
		jmxzDl = data;
	});
	return jmxzDl;
};
qysdsyhsxbabl.getJmxzXl = function(jmxzdm){
	var xlUrl = "/dzgzpt-wsys/api/baseCode/CombSelect/common/moreFilter?codeName=SSJMXZXL&filterVals=" + jmxzdm+";"+ qysdsyhsxbabl.yhsxDm+";10104";
	var jmxzXl;
	ajax.get(xlUrl, "", function (data) {
		jmxzXl = data;
	});
	return jmxzXl;
};
qysdsyhsxbabl.beginEdit = function(e){
	var field = e.field;
	var editor = e.editor;
	var jmlx = e.record.jmlx;
	var jmzlx = e.record.jmzlx;
	var grid = mini.get("qysdsyhsxba_grid");
    var combo =e.column.editor;
    var row = e.row;
    if(e.field === 'jzed'){
		editor.enable();
		if(jmzlx === '02'){
			grid.updateRow(e.rowIndex,"jzed","");
			editor.disable();
		}
	}else if(field === 'jzfd'){
		editor.enable();
		if(jmzlx === '02'){
			grid.updateRow(e.rowIndex,"jzfd","");
			editor.disable();
		}
	}else if(field === 'jzsl'){
		editor.enable();
		if(jmzlx === '02'){
			grid.updateRow(e.rowIndex,"jzsl","");
			editor.disable();
		}
	}else if(field === 'ssjmxzDm'){
		mini.get("jmxz").setData(qysdsyhsxbabl.jmxz);
	}
    if(field === "jmzlx"){
        editor.enable();
		if(!row.ssjmxzDm){
            grid.updateRow(e.rowIndex,"jmzlx","");
            editor.disable();
			return;
		}
        var urlxl = "/dzgzpt-wsys/api/baseCode/CombSelect/common/moreFilter?codeName=SSJMXZJMZLX&filterVals="+row.ssjmxzDm+";10104";
        ajax.get(urlxl, "", function (data) {
        	if(data.length==0){
        		   var urljmzlx = "/dzgzpt-wsys/api/baseCode/CombSelect/common/DM_YH_JMZLX";
        	        ajax.get(urljmzlx, "", function (data) {
        	            var ssjmxzData = data;
        	            combo.setData(ssjmxzData);
        	        }, function () {
        	            mini.alert("请求异常，稍后再试！", '提示', function () {
        	                window.close();
        	            });
        	        });
        	}else{
        		var ssjmxzData = data;
                combo.setData(ssjmxzData);
        	}
        }, function () {
            mini.alert("请求异常，稍后再试！", '提示', function () {
                window.close();
            });
        });
        grid.unFrozenColumns();
    }else if(field === "jmlx"){
        var urlxl = "/dzgzpt-wsys/api/baseCode/CombSelect/common?codeName=SWSXJMLX&filterVal="+qysdsyhsxbabl.sqxxData.qysdsjmbaVO.YHJmsspjgGrid.YHJmsspjgGridlb[0].jmsspsxDm;
        ajax.get(urlxl, "", function (data) {
            var ssjmxzData = data;
            combo.setData(ssjmxzData);
        }, function () {
            mini.alert("请求异常，稍后再试！", '提示', function () {
                window.close();
            });
        });
        grid.unFrozenColumns();
    }
};
qysdsyhsxbabl.endEdit = function(e){
	var field = e.field;
	var editor = e.editor;
	var jmlx = e.record.jmlx;
	var jmzlx = e.record.jmzlx;
	var grid = mini.get("qysdsyhsxba_grid");
	var combo =e.column.editor;
	var row = e.row;
	if(field === 'jzsl'){
		grid.updateRow(0,"jzed","");
		grid.updateRow(0,"jzfd","");
	}
	if(field === 'jzed'){
		grid.updateRow(0,"jzsl","");
		grid.updateRow(0,"jzfd","");
	}
	if(field === 'jzfd'){
		grid.updateRow(0,"jzsl","");
		grid.updateRow(0,"jzed","");
	}
}
qysdsyhsxbabl.jmzlxChanged = function(e){
	var grid = mini.get("qysdsyhsxba_grid");
	grid.updateRow(0,"jzsl","");
	grid.updateRow(0,"jzed","");
	grid.updateRow(0,"jzfd","");

}
qysdsyhsxbabl.jmlxChanged = function(e){
	var grid = mini.get("qysdsyhsxba_grid");
	grid.updateRow(0,"jzed","");
	grid.updateRow(0,"jzfd","");
	grid.updateRow(0,"jzsl","");

};
qysdsyhsxbabl.jmlxValid = function(){
	var grid = mini.get("qysdsyhsxba_grid");
	var row = grid.getData();
	var jmlx = row[0].jmlx,
		jmzlx = row[0].jmzlx,
		jzed = row[0].jzed,
		jzfd = row[0].jzfd,
		jzsl = row[0].jzsl;
	if(jmzlx === '01' && jmlx === '1' && !jzsl){
		mini.alert("你选择的减免类型为“税率式减免”，减征税率为必填项！");
		return false;
	}else if(jmzlx === '01' && jmlx === '2' && !jzed){
		mini.alert("你选择的减免类型为“税额式减免”，减征额度为必填项！");
		return false;
	}else if(jmzlx === '01' && jmlx === '3' && !jzfd){
		mini.alert("你选择的减免类型为“税基式减免”，减征幅度为必填项！");
		return false;
	}
	return true;
};
qysdsyhsxbabl.isSecond = 1; //用来判断时间的改变情况
qysdsyhsxbabl.dateChanged = function(e){
	if(qysdsyhsxbabl.isSecond === 2){
		qysdsyhsxbabl.isSecond = 1;
		return;
	}
	var Yxqq=mini.get("yhyxqq").getText();
	var yxqqValue=mini.get("yhyxqq").getValue();
	var Yxqz=mini.get("yhyxqz").getText();
	var yxqzValue=mini.get("yhyxqz").getValue();

	var lastYear = new Date().format("yyyy")*1+1+"";
	if((qysdsyhsxbabl.yhsxDm === 'SXA031900056'|| qysdsyhsxbabl.yhsxDm === 'SXA031900749') && e.value.format("yyyy-MM-dd") > lastYear){
		mini.alert("备案期限不得跨公立年度，请重新录入备案期限！","提示信息",function(){
			e.sender.setValue("");
			e.isValid=false;
			e.sender.focus();
		})
	}
	if(!Yxqq||!Yxqz){
		if(yxqqValue && yxqqValue.format("yyyy-MM-dd") !== yxqqValue.getFirstDateOfMonth("yyyy-MM-dd")){
			qysdsyhsxbabl.isSecond = 2;
			mini.get("yhyxqq").setValue(yxqqValue.getFirstDateOfMonth());
		}
		if(yxqzValue && yxqzValue.format("yyyy-MM-dd") !== yxqzValue.getLastDateOfMonth("yyyy-MM-dd")){
			qysdsyhsxbabl.isSecond = 2;
			mini.get("yhyxqz").setValue(yxqzValue.getLastDateOfMonth());
		}
		return;
	}
	if(Yxqq> Yxqz){
		mini.alert("有效期止不能小于有效期起，请重新填写有效期起！","提示信息",function(){
			e.sender.setValue("");
			e.isValid=false;
			e.sender.focus();
		});
		return;
	}
	if(yxqqValue && yxqqValue.format("yyyy-MM-dd") !== yxqqValue.getFirstDateOfMonth("yyyy-MM-dd")){
		qysdsyhsxbabl.isSecond = 2;
		mini.get("yhyxqq").setValue(yxqqValue.getFirstDateOfMonth());
	}
	if(yxqzValue && yxqzValue.format("yyyy-MM-dd") !== yxqzValue.getLastDateOfMonth("yyyy-MM-dd")){
		qysdsyhsxbabl.isSecond = 2;
		mini.get("yhyxqz").setValue(yxqzValue.getLastDateOfMonth());
	}
	qysdsyhsxbabl.getJmxz();
	if(!!qysdsyhsxbabl.jmxz.length){
		var jmxzDl = qysdsyhsxbabl.getJmxzDl(qysdsyhsxbabl.jmxz[0].ssjmxzDm);
		var jmxzXl = qysdsyhsxbabl.getJmxzXl(qysdsyhsxbabl.jmxz[0].ssjmxzDm);
	}else{
		return;
	}
	//var jmlx = qysdsyhsxbabl.getJmlx();
	//var jmfs = qysdsyhsxbabl.getJmfs();
	var row = {
		ssjmxzDm: qysdsyhsxbabl.jmxz[0].ssjmxzDm,
		ssjmxzmc: qysdsyhsxbabl.jmxz[0].ssjmxzmc,
		jmxzDl: jmxzDl[0].ID,
		jmxzDlText: jmxzDl[0].MC,
		jmxzXl: jmxzXl[0].ID,
		jmxzXlText: jmxzXl[0].MC,
		jmlx: "",
		jmfs: "",
		jzed: "",
		jzfd: "",
		jzsl: ""
	};
	mini.get("qysdsyhsxba_grid").updateRow(0,row);
};
qysdsyhsxbabl.isExist = function(){
	var isExist = true;
	var cxInfo = {
		ssyhsx: qysdsyhsxbabl.yhsxDm,
		jmqxq: mini.get("yhyxqq").getText(),
		jmqxz: mini.get("yhyxqz").getText(),
		zsxmDm: "10104"
	};
	var isExistUrl = "/dzgzpt-wsys/api/xj/yh/ssyh/checkYhsxExist/";
	$.ajax({
		url: isExistUrl+qysdsyhsxbabl.djxh,
		type: "POST",
		contentType : "application/json;charset=utf-8",
		data: mini.encode(cxInfo),
		success: function(data){
			if(data.success && !data.value){
				isExist = false;
			}else{
				var str;
				data.success ? str = "该纳税人已进行过减免税申请，不允许重复录入！" : str =data.message;
				mini.alert(str);
			}
		}
	});
	return isExist;
};