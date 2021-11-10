var xbnsrzhtcsq  = {};
var xbtcGrid = "";
$(function(){
	 var data = sqzl.getPackViewData(sxsl_store.sqxh);
	 xbnsrzhtcsq.data = data;
	 xbtcGrid = mini.get("xbtc-grid");
	 xbnsrzhtcsq.sldjBlzt = getSldjBlzt();
	 xbnsrzhtcsq.isOnlySldj = isOnlySldj();
	 xbtcGrid.setData(data);
	 
	 mini.get("bzzlBtn").hide();
	 
});

function onShlxRenderer(e) {
	var record = e.record;
	var swsxDm = record.swsxDm;
	if(swsxDm=="110121" || swsxDm=="110101" || swsxDm=="110207"){
		// 设立登记个体、单位、票种核定，显示人工受理
		return "人工受理";
	}else if(swsxDm=="110111" || swsxDm=="110112" || swsxDm=="110701" || swsxDm=="110113"){
		// 存款账户账号报告、财务会计制度备案、三方协议、一般纳税人资格登记
		return "系统自动办理";
	}else if(swsxDm=="110102"){// 税费种认定
		return "人工办理";
	}else{
		return "";
	}
	return "";
}

function onBlztRenderer(e) {
	var record = e.record;
	var swsxDm = record.swsxDm;
	var blztDm = record.blztDm;
	if(swsxDm=="110207"){
		if(blztDm == "00"){
			return "未受理";
		}else if(blztDm == "04"){
			return "受理通过";
		}else if(blztDm == "05"){
			return "受理不通过";
		}else if(blztDm == "03"){
			return "受理中";
		}else{
			return record.blztMc;
		}
	}
	if(blztDm == "00"){
		if(swsxDm=="110121" || swsxDm=="110101"){
			// 设立登记个体、单位，显示人工受理
			return "未受理";
		}else if(swsxDm=="110111" || swsxDm=="110112" || swsxDm=="110701" || swsxDm=="110113"){
			// 存款账户账号报告、财务会计制度备案、三方协议、一般纳税人资格登记
			return "未办理";
		}else if(swsxDm=="110102"){// 税费种认定
			return "未办理";
		}else{
			return "";
		}
	}else if(blztDm == "01"){
		if(swsxDm=="110121" || swsxDm=="110101"){
			// 设立登记个体、单位、票种核定，显示受理通过
			return "受理通过";
		}else if(swsxDm=="110111" || swsxDm=="110112" || swsxDm=="110701" || swsxDm=="110113"){
			// 存款账户账号报告、财务会计制度备案、三方协议、一般纳税人资格登记
			return "办理成功";
		}else if(swsxDm=="110102"){// 税费种认定
			return "办理成功";
		}else{
			return "";
		}
	}else if(blztDm == "02"||blztDm == "99"){
		if(swsxDm=="110121" || swsxDm=="110101"){
			// 设立登记个体、单位，显示不予受理
			return "受理不通过";
		}else if(swsxDm=="110111" || swsxDm=="110112" || swsxDm=="110701" || swsxDm=="110113"){
			// 存款账户账号报告、财务会计制度备案、三方协议、一般纳税人资格登记
			return "办理失败";
		}else if(swsxDm=="110102"){// 税费种认定
			return "";
		}else{
			return "";
		}
	}
	return "";
}

function onActionRenderer(e) {
	var record = e.record;
	var swsxDm = record.swsxDm;
	var blztDm = record.blztDm;
	var lcslId = record.lcslId;
	var sqxh = record.sqxh;
	var rwbh = record.rwbh;
	var viewData = record.viewData;
	// 设立登记在办理中，其他事项暂不能办理
	if(swsxDm != "110121" && swsxDm != "110101") {
		// 设立登记不予受理，其他事项均不予操作
		if(xbnsrzhtcsq.sldjBlzt=="02"){
			mini.get("shbjBtn").hide();
			return "————";
		}else if(xbnsrzhtcsq.sldjBlzt=="01"){
			mini.get("shbjBtn").show();
			mini.get("byslBtn").hide();
		}else if(xbnsrzhtcsq.sldjBlzt=="00"){
			mini.get("shbjBtn").hide();
		}
		if(xbnsrzhtcsq.sldjBlzt=="00") {
			return "————";
		}
		// 未确认过登记信息&&申请不止有设立登记，设立登记后续自动办理事项操作为“————”
		var confirmDjxxFlag = false;// 用于判断是否确认过登记信息，false表示未确认过
		var hasSldjGlyw = false;
		for(var i=0;i<xbnsrzhtcsq.data.length;i++){
			if(xbnsrzhtcsq.data[i].swsxDm == "110111"){
				hasSldjGlyw = true;
				if(xbnsrzhtcsq.data[i].blztDm != "00") {
					confirmDjxxFlag = true;
					break;
				}
			}
		}
		
		if(!confirmDjxxFlag && hasSldjGlyw) {// 设立登记存在关联业务，在确认登记信息前，其他事项操作展示"————"
			return "————";
		}
	}
	
	
	if(blztDm == "00"){
		if(swsxDm=="110121" || swsxDm=="110101"||swsxDm=="110207"){
			// 设立登记个体、单位、票种核定，显示人工受理
			return "<a href='javascript:void(0)' onclick='openSubSxsl(\""+lcslId+"\",\"" +rwbh+"\",\"" +swsxDm+"\")'>受理</a>";
		}else if(swsxDm=="110102"){// 税费种认定
			return "<a href='javascript:void(0)' onclick='getSfzrdxxUpViewData(\""+sqxh+"\")'>办理</a>";
		}else{
			return "————";
		}
	}else if(blztDm == "01"){
		if(swsxDm=="110121" || swsxDm=="110101"){
			// 设立登记个体、单位，显示受理通过
			var returnStr = "<a href='javascript:void(0)' onclick='viewDetails("+mini.encode(record)+")'>查看详情</a>";
			var confirmDjxxFlag = true;// 是否需要展现确认登记信息的按钮，true展现
			var isOnlySldj = true;// 是否只有设立登记，true是
			for(var i=0;i<xbnsrzhtcsq.data.length;i++){
				if(xbnsrzhtcsq.data[i].swsxDm == "110111"){
					isOnlySldj = false;
					if(xbnsrzhtcsq.data[i].blztDm != "00") {
						confirmDjxxFlag = false;
						break;
					}
				}
			}
			if(confirmDjxxFlag && !isOnlySldj){
				returnStr += " <a href='javascript:void(0)' onclick='confirmDjxx("+mini.encode(record)+")'>确认登记信息</a>"
			}
			return returnStr;
		}else if(swsxDm=="110111" || swsxDm=="110112" || swsxDm=="110701"){
			// 存款账户账号报告、财务会计制度备案、三方协议
			return "<a href='javascript:void(0)' onclick='viewDetails("+mini.encode(record)+")'>查看详情</a>";
		}else if(swsxDm=="110102"){// 税费种认定
			returnStr = "<a href='javascript:void(0)' onclick='viewDetails("+mini.encode(record)+")'>查看详情</a>";
			/*var confirmRdxxFlag = true;// 是否需要展现确认登记信息的按钮，true展现
			for(var i=0;i<xbnsrzhtcsq.data.length;i++){
				if(xbnsrzhtcsq.data[i].swsxDm == "110112" || xbnsrzhtcsq.data[i].swsxDm == "110701"){
					if(xbnsrzhtcsq.data[i].blztDm != "00") {
						confirmRdxxFlag = false;
						break;
					}
				}
			}
			if(confirmRdxxFlag){
				returnStr += " <a href='javascript:void(0)' onclick='confirmRdxx("+mini.encode(record)+")'>确认认定信息</a>";
			}*/
			return "————";
		}else{
			return "<a href='javascript:void(0)' onclick='viewDetails("+mini.encode(record)+")'>查看详情</a>";
		}
	}else if(blztDm == "02"||blztDm == "99"){
		if(swsxDm=="110121" || swsxDm=="110101"){
			// 设立登记个体、单位，显示不予受理
			return "<a href='javascript:void(0)' onclick='viewDetails("+mini.encode(record)+")'>查看详情</a>";
		}else if(swsxDm=="110111" || swsxDm=="110112" || swsxDm=="110701" || swsxDm=="110113"){
			// 存款账户账号报告、财务会计制度备案、三方协议、一般纳税人资格登记
			return "<a href='javascript:void(0)' onclick='viewFailMsg("+mini.encode(record)+")'>查看失败原因</a>";
		}else if(swsxDm=="110102"){// 税费种认定
			return "————";
		}else{
			return "";
		}
	}else if(blztDm == "03"||blztDm == "04"||blztDm == "05"){
		return "<a href='javascript:void(0)' onclick='viewDetails("+mini.encode(record)+")'>查看详情</a>";
	}
	return "";
}


/**
 * 重写审核办结事件
 */
sxslbt_shbj.shbjcomFuc=function(storeObj){
	var lcslId = storeObj.lcslId;
	var blzlUrl = storeObj.blzlUrl;
	var sqxh = storeObj.sqxh;
	var swsxDm = storeObj.swsxDm;
	var nsrsbh = storeObj.nsrsbh;
	var rwbh = storeObj.rwbh;
	var swsxWslMcList = "";
	var wclSxNum = 0;
	for(var i=0;i<xbnsrzhtcsq.data.length;i++) {
		if(xbnsrzhtcsq.data[i].blztDm =='00') {
			swsxWslMcList += "{"+xbnsrzhtcsq.data[i].swsxMc+"}";
			wclSxNum++;
		}
	}
	var msg = "确认办结此事项？ ";
	if(wclSxNum > 0){
		msg = swsxWslMcList + "尚未受理完成，是否确定办结此事项？确认办结此事项后，纳税人将收到不予受理的通知！ ";
	}
	mini.confirm(msg, "提示", function (action) {
		if(action == "ok"){
			masterSxBj(lcslId,rwbh)
		}else{
			return;
		}
	})
}

function masterSxBj(lcslId,rwbh) {
	var messageid = mini.loading("提交中, 请稍等 ...", "提交中");
	$.ajax({
		url : "../../../../api/wtgl/dbsx/masterTask/sxsl",
		type : "post",
		data : {
			data : "",
			lcslId : lcslId,
			blztDm : WSYS_BLZT_DM.BLZT_SLTG,
			rwztDm : "01",
			sqxh : lcslId,
			blxxData: "",
			rwbh: rwbh
		},
		success : function(data) {
			mini.hideMessageBox(messageid);
			var resultData = mini.decode(data);
			if(resultData.success){
				mini.alert("受理成功！", '提示信息', function() {
					onCancel('ok');
				});
			}else{
				mini.alert(resultData.message, '提示信息', function() {});
			}
		}
	});
}

/**
 *不予受理通用方法
 * @param storeObj
 */
sxslbt_bysl.byslcomFuc=function(storeObj){
	openPackSxbjSwsxtzs("",WSYS_BLZT_DM.BLZT_SLBTG,storeObj);
}


/**
 * 打开子任务受理窗口
 * @param lcslid
 * @param rwbh
 */
function openSubSxsl(lcslid, rwbh, swsxDm) {
	var sxslUrl = "/dzgzpt-wsys/dzgzpt-wsys/apps/views/dbsx/dbsx_sub_sxsl.html?lcslId=";
	sxslUrl += lcslid;
	sxslUrl += '&rwbh=' + rwbh;
	sxslUrl += '&swsxDm=' + "110002";
	
	mini.open({
	    targetWindow: window,   //页面对象。默认是顶级页面。
	    url: sxslUrl,        //页面地址
	    title: "子事项受理",      //标题
	    width: 1000,      //宽度
	    height: 500,     //高度
	    allowResize: true,       //允许尺寸调节
	    allowDrag: true,         //允许拖拽位置
	    showCloseButton: true,   //显示关闭按钮
	    showMaxButton: true,     //显示最大化按钮
	    showModal: false,         //显示遮罩
	    loadOnRefresh: false,       //true每次刷新都激发onload事件
	    onload: function () {       //弹出页面加载完成
	        /*var iframe = this.getIFrameEl(); 
	        var data = {};
	        //调用弹出页面方法进行初始化
	        iframe.contentWindow.SetData(data); */
	                        
	    },
	    ondestroy: function (action) {  //弹出页面关闭前
	        if (action == "ok") {       //如果点击“确定”
	            /*
	            //获取选中、编辑的结果
	            var data = iframe.contentWindow.GetData();
	            data = mini.clone(data);    //必须。克隆数据。
	            ......*/
	        	resetGrid();
                var iframe = this.getIFrameEl();
	        	var djxh = iframe.contentWindow.sxsl_store.xbtcDjxh;

	       	 	if(!!djxh && (swsxDm=="110101"||swsxDm=="110121")){// 税务登记补录成功则需要更新
	       	 		updateSubWssqDjxh(sxsl_store.sqxh, djxh);
	       	 	}
	       	 	
	        	//autoHandleTrigger(swsxDm);
	        }
	    }
	
	});
}

function updateSubWssqDjxh(parentSqxh, djxh) {
	$.ajax({
		url : "/dzgzpt-wsys/api/wtgl/xbnsrzhtcsq/update/djxh",
		type: 'post',
		async: false,
		data : {
			parentSqxh : parentSqxh,
			djxh : djxh
		},
		success : function(obj) {
			var data = mini.decode(obj);
			if(!data.success){
				mini.alert(data.message);
			}
		},
		error : function() {
		}
	});
}

/**
 * 免受理免审核（自动办理）事项查看详情
 */
function viewDetails(record) {
	var viewPageUrl = "";
    var xbtcSwsx = {};/*子功能的税务事项*/
	var viewData = mini.decode(mini.decode(record.viewData));
	ajax.get('../../data/swsxDmConfig.json',{},
		function (responseJson) {
			responseJson=mini.decode(responseJson);
            xbtcSwsx =  responseJson['110002'].subSwsxList;
			viewPageUrl = xbtcSwsx[record.swsxDm].view;
			if(record.swsxDm === '110113'){
				var obj  = {
                    zzsybnsrdjDiv:viewData
				};
                viewData = mini.clone(obj);
			}
            xbnsrzhtcsq.initPages(viewPageUrl,viewData,record.swsxDm);
        }
	)
}

function viewFailMsg(record) {
	mini.alert(record.blztMs);
}

xbnsrzhtcsq.initPages = function(viewPageUrl,viewData,swsxDm){
    var html;
    if(viewPageUrl){
    	html = gldUtil.loadTemplate(viewPageUrl).replace(/url/g,'data-url');
	}else{
        html = "";
	}
    $('#ylViews').html($('#xbtc-yl-template').html());
    $('#xbtc-yl-win').html(html);
    mini.parse();
    var ylWin = mini.get('xbtc-yl-win');
    if(swsxDm!='110207'){
        xbnsrzhtcsq.initSxslPage(viewData);
	}else{
        xbnsrzhtcsq.setPzhdData(viewData);
	}
	// 税务登记信息补录 单位
	if(swsxDm==='110101'){
        var swdjblSqsj = viewData['djxxbl-yl'];
        if(swdjblSqsj.zfjglxDm == '1') {
            $('#ylfzjgxx').show();
        } else if(swdjblSqsj.zfjglxDm == '2'){
            $('#ylzjgxxForm').show();
        }else {
            $('#ylfzjgxx').hide();
            $('#ylzjgxxForm').hide();
        }
	}
    ylWin.show();
};

/*给页面赋值*/
xbnsrzhtcsq.initSxslPage = function(viewData){
    if (!viewData || $.isEmptyObject(viewData)) {
        mini.alert('未获取到申请资料数据', '提示');
        return false;
    }
    var elements = $("#ylViews").find('div[data-view-type]'),
        targetId = null,
        targetType = null,
        data = {};
    for(var i=0,len =elements.length;i<len;i++ ){
        targetId = elements[i].getAttribute("id");
        targetType = elements[i].getAttribute("data-view-type");
        if(!!targetType){
            targetType = targetType.toLowerCase();
            if(targetType==="form"){
                var form = new mini.Form("#"+targetId);
                data[targetId] = form.setData(viewData[targetId]);

            } else if(targetType==="datagrid"){
                targetId =  elements[i].children[0].getAttribute("id")||$(elements[i]).children(0)._id();
                if(!targetId){
                    throwError("data-view-type=datagrid 第一个子节点的id未获取到，请检查第一个子节点！");
                    return false;
                }
                var grid = mini.get(targetId);
                data[targetId] = grid.setData(viewData[targetId]);
            }
        }
    }
};

/*给票种核定赋值*/
xbnsrzhtcsq.setPzhdData = function(viewData){
	try{
        var data = viewData;
        $('#pzhdYl').html(template('pzhdYl-template',{nsrlxDm: viewData.nsrlxDm}));

        for(var i=1;i<= data.showLpContent.length;i++){
            mini.parse();
            mini.get('gzpz_gridYl'+i).setData([data.showLpContent[i-1]]);
            mini.get('gzpz_gridYl'+i).selectAll();
        }
        mini.get('lpryl_grid').setData(data.showGprList);
        mini.get('sqfwskkpsbyl').setValue(data.sqfwskkpsb);
        $('#gzpz_gridYl2').find('.mini-grid-header').height(2);//隐藏最后一个表格表头
    }catch (e){
        console.log(e);
    }

};


function confirmDjxx(record) {
	// 查询金三登记信息是否存在
	// todo
	mini.confirm("征管中已存在该纳税人登记信息，是否继续自动办理的业务？", "提醒",
        function (action) {
            if (action == "ok") {
            	autoHandleTrigger(record.swsxDm);
            } else {
                return;
            }
        }
    );
	
}

function confirmRdxx() {
	mini.confirm("征管中已存在该纳税人税种认定信息，是否继续自动办理的业务？", "提醒",
        function (action) {
            if (action == "ok") {
            	autoHandleTrigger("110102");
            } else {
                return;
            }
        }
    );
	
}


/**
 * 自动办理的触发器配置
 * 税务登记补录成功：自动办理存款账户账号报告、三方协议签订、一般纳税人资格登记
 * 税费种认定成功：自动办理财务会计制度备案
 * @param swsxDm
 * @param sqxh
 */
function autoHandleTrigger(swsxDm) {
	var resultMsg = "";
	if("110101"===swsxDm || "110121"===swsxDm){// 税务登记补录
		var result = {};
		var yhxxSubmitSuccFlag = false;
		var obj = searchSwsxObj("110111");
		if(!!obj.sqxh){// 存款账户账号报告
			var messageid = mini.loading("存款账户账号报告提交中, 请稍等 ...", "提交中");
			result = autoHandleMslmshSxbj(obj.sqxh);
			if(!result.succ){
				resultMsg += "存款账户账号报告自动办理<font color='red'>失败</font>；";
			}else{
				resultMsg += "存款账户账号报告自动办理成功；";
			}
			mini.hideMessageBox(messageid);
		}
	}else if("110102"===swsxDm){// 税费种认定
		var obj = searchSwsxObj("110112")
		if(!!obj.sqxh){
			var messageid = mini.loading("财务会计制度备案提交中, 请稍等 ...", "提交中");
			result = autoHandleMslmshSxbj(obj.sqxh);
			if(!result.succ){
				resultMsg += "财务会计制度备案自动办理<font color='red'>失败</font>；";
			}else{
				resultMsg += "财务会计制度备案自动办理成功；";
			}
			mini.hideMessageBox(messageid);
		}
		obj = searchSwsxObj("110701");
		ckzhzhbgObj = searchSwsxObj("110111");
		if(ckzhzhbgObj.blztDm=="01" && !!obj.sqxh){// 必须先存款账户账号报告通过，再进行三方协议签订
			var messageid = mini.loading("三方协议签订提交中, 请稍等 ...", "提交中");
			result = autoHandleMslmshSxbj(obj.sqxh);
			if(!result.succ){
				resultMsg += "<br>三方协议签订自动办理<font color='red'>失败</font>；";
			}else{
				resultMsg += "<br>三方协议签订自动办理成功；";
			}
			mini.hideMessageBox(messageid);
		}
		obj = searchSwsxObj("110113");
		if(!!obj.sqxh){
			var messageid = mini.loading("增值税一般纳税人登记提交中, 请稍等 ...", "提交中");
			result = autoHandleMslmshSxbj(obj.sqxh);
			if(!result.succ){
				resultMsg += "<br>增值税一般纳税人登记自动办理<font color='red'>失败</font>；";
			}else{
				resultMsg += "<br>增值税一般纳税人登记自动办理成功；";
			}
			mini.hideMessageBox(messageid);
		}
	}
	if(!!resultMsg){
		mini.alert(resultMsg);
	}
	resetGrid();
}

function autoHandleMslmshSxbj(sqxh) {
	var result = {succ:true,msg:""};
	$.ajax({
		url : sxxlApi.saveSubSwsxBl,
		type : "post",
		async: false,
		data : {
			data : "",
			lcslId : sqxh,
			blztDm : WSYS_BLZT_DM.BLZT_SLTG,
			rwztDm : "",
			blxxData:"",
			rwbh:""
		},
		success : function(data) {
			var resultData = mini.decode(data);
			if(!resultData.success){
				result.succ = false;
				result.msg = resultData.message;
			}
		}
	});
	return result;
}

function searchSwsxObj(swsxDm) {
	var data = mini.clone(xbnsrzhtcsq.data);
	/*var obj = data.find(function (x) {
	    return x.swsxDm === swsxDm
	});*/
	var obj = find_Obj(swsxDm, "swsxDm", data);
	if(!$.isEmptyObject(obj)){
		return obj;
	}
	return obj;
}

function find_Obj(Val, Key, arr) {
    var value = {};
    for (var i = 0; i < arr.length; i++) {
        var item = arr[i];
        if (Val === item[Key]) {
            value = item;
            break;
        }
    }
    return value;
};


/**
 * 查询金三税费种认定信息、更新viewData
 * @param sqxh
 */
function getSfzrdxxUpViewData(sqxh) {
	$.ajax({
		url : "/dzgzpt-wsys/api/wtgl/xbnsrzhtcsq/getAndUpdate/sfzrdxx",
		type: 'post',
		async: false,
		data : {
			sqxh : sqxh
		},
		success : function(obj) {
			var data = mini.decode(obj);
			if(!data.success || (data.success && data.value.length==0)){
				mini.alert("未查询到税费种认定信息，请稍后再试！");
			}else{
				mini.alert("金三已存在税费种认定信息，受理通过！","提示",function(){
					confirmRdxx();
					resetGrid();
				});
			}
		},
		error : function() {
		}
	});
}

function resetGrid() {
	var data = sqzl.getPackViewData(sxsl_store.sqxh);
	xbnsrzhtcsq.data = data;
	xbtcGrid.setData("");
	xbnsrzhtcsq.sldjBlzt = getSldjBlzt();
	xbnsrzhtcsq.isOnlySldj = isOnlySldj();
	xbtcGrid.setData(data);
}

function getSldjBlzt() {
	var dwObj = searchSwsxObj("110101");
	if(!$.isEmptyObject(dwObj)) {
		return dwObj.blztDm;
	}
	var gtObj = searchSwsxObj("110121");
	if(!$.isEmptyObject(gtObj)) {
		return gtObj.blztDm;
	}
	return "";
}

/**
 * 申请中是否只有设立登记
 * 暂未使用
 * @returns {Boolean}
 */
function isOnlySldj() {
	var data = mini.clone(xbnsrzhtcsq.data);
	var isOnlySldj = true;// 是否只有设立登记，true是
	for(var i=0;i<data.length;i++){
		if(data[i].swsxDm != "110121" && data[i].swsxDm != "110101"){
			isOnlySldj = false;
			break;
		}
	}
	return isOnlySldj;
}

function onCancel(action) {
	if (window.CloseOwnerWindow)
		return window.CloseOwnerWindow(action);
	else
		window.close();
}