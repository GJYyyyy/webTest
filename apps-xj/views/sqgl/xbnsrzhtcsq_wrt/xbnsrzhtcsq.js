var xbnsrzhtcsq  = {};
var xbtcGrid = "";
var subRecord = {};
$(function(){
	 var data = sqzl.getPackViewData(sxsl_store.sqxh);
	 xbnsrzhtcsq.data = data;
	 xbtcGrid = mini.get("xbtc-grid");
	 xbnsrzhtcsq.sldjBlzt = getSldjBlzt();
	 xbnsrzhtcsq.isOnlySldj = isOnlySldj();
	 xbtcGrid.setData(data);

	 // mini.get("bzzlBtn").hide();

	 //新办套餐调整温馨提示信息
	 if(sxsl_store.swsxDm == "11000202"){
		 $(".zhxbtcwc-bottom #wxts").html("1、“自动审核”类事项数据，申请数据已成功提交至金三，需税务人员再次确认数据是否正确，不正确请前往金三前台更正。<br>2、“辅助审核”类事项，需税务人员确认申请数据无误，再办结事项。");
	 }
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
	}else if(swsxDm=="11010201"){// 税费种认定
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
		}else if(swsxDm=="11010201"){// 税费种认定
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
		}else if(swsxDm=="11010201"){// 税费种认定
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
		}else if(swsxDm=="11010201"){// 税费种认定
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
		if(swsxDm=="110121" || swsxDm=="110101"||swsxDm=="110207" || swsxDm=="11010201"){
			// 设立登记个体、单位、票种核定，显示人工受理
			return "<a href='javascript:void(0)' onclick='openSubSxsl(\""+lcslId+"\",\"" +rwbh+"\",\"" +swsxDm+"\")'>受理</a>";
		}/*else if(){// 税费种认定
			return "<a href='javascript:void(0)' onclick='getSfzrdxxUpViewData(\""+sqxh+"\")'>办理</a>";
		}*/else{
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
		}else if(swsxDm=="11010201"){// 税费种认定
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
		}else if(swsxDm=="11010201"){// 税费种认定
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
	sxslUrl += '&swsxDm=' + "11000201";

	mini.open({
	    targetWindow: window,   //页面对象。默认是顶级页面。
	    url: sxslUrl,        //页面地址
	    title: "子事项受理",      //标题
	    width: 1200,      //宽度
	    height: 500,     //高度
	    allowResize: true,       //允许尺寸调节
	    allowDrag: true,         //允许拖拽位置
	    showCloseButton: true,   //显示关闭按钮
	    showMaxButton: false,     //显示最大化按钮
	    showModal: true,         //显示遮罩
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
	subRecord = record;
	var viewPageUrl = "";
    var xbtcSwsx = {};/*子功能的税务事项*/
	var viewData = mini.decode(mini.decode(record.viewData));
	var sqsxData = mini.decode(mini.decode(record.data));
	ajax.get('../../data/swsxDm.json',{},
		function (responseJson) {
			var sfPack = false;//是否是新版新办套餐
			responseJson=mini.decode(responseJson);
            xbtcSwsx =  responseJson['11000201'].subSwsxList;
            // modified by zhangjc 20180628 终端新办套餐税务事项列表
            if(xbtcSwsx[record.swsxDm] == undefined){
            	xbtcSwsx = responseJson['11000202'].subSwsxList;
            	sfPack = true;
            }
        	viewPageUrl = xbtcSwsx[record.swsxDm].view;
			if(record.swsxDm === '110113'){
				var obj  = {
                    zzsybnsrdjDiv:viewData
				};
                viewData = mini.clone(obj);
			}
			if(sfPack){
				xbnsrzhtcsq.initPages(viewPageUrl, sqsxData, record.swsxDm, record);
			}else{
				xbnsrzhtcsq.initPages(viewPageUrl, viewData, record.swsxDm, record);
			}
        }
	)
}

function viewFailMsg(record) {
	mini.alert(record.blztMs);
}

xbnsrzhtcsq.initPages = function(viewPageUrl, viewData, swsxDm, record){
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
    var djxh = record.djxh;
    if(swsxDm!='110207' && swsxDm != '11010102' && swsxDm != '11010202' && swsxDm != '11012301'
    	&& swsxDm != '11020703' && swsxDm != '11014901' &&  swsxDm != '11012102'){
        xbnsrzhtcsq.initSxslPage(viewData);
	} else if(swsxDm == '11010102' || swsxDm == '11012102'){//新办套餐补录
		xbnsrzhtcsq.initBlSxslPage(djxh);
	} else if(swsxDm == '11010202'){//新办套餐税费种认定
		xbnsrzhtcsq.initSfzrdSxslPage(djxh);
	} else if(swsxDm == '11012301'){//新办套餐个体工商户定期定额核定
		xbnsrzhtcsq.initXbtctySxslPage(record);
	} else if(swsxDm == '11020703'){//新办套餐票种核定
		xbnsrzhtcsq.initXbtcPzhdSxslPage(record.sqxh, viewData, record.sxshfsDm);
	} else if(swsxDm == '11014901'){//新办套餐文化事业建设费
		var data = {};
		data.sfjnr = '是';
		data.sfkjr = '否';
		data.zytzbl = '0%';
		data.dftzbl = '0%';
		data.wlsgxtzbl = '100%';
		var form = new mini.Form('#whsyjsf');
		form.setData(data);
		disableCheck('whsyjsf');
		xbnsrzhtcsq.setCheckboxConfirm("whsyjsf", record.blztDm);
	} else{
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


/**
 * 初始化套餐补录页面 added by zhangjc 20180629
 * @param data 对象
 */
xbnsrzhtcsq.initBlSxslPage = function (djxh) {
	var form = new mini.Form('#djxxbl');
	// 将数据存到对应的对象中
	$.ajax({
		type : "POST",
		url : "../../../../api/wtgl/dqrsxWRT/queryDqrNsrxxBlxx/"+djxh,
		async : false,
		success : function(data) {
			var result=mini.decode(data.value);
			if (data.success && !!data.value) {
				form.setData(result.nsrxx);
				xbnsrzhtcsq.setCheckboxConfirm("djxxbl", record.blztDm);
			}else{
				mini.alert(data.message, '提示信息', function() {
					doBackSub();
				});
			}
		},
		error : function(e) {
			//console.error(e);
			mini.alert("加载失败，请重试！");
		}
	});
	disableCheck('bl');
};

/**
 * 初始化套餐详情页面（个体工商户定期定额核定） added by zhangjc 20180630
 * @param data 对象
 */
xbnsrzhtcsq.initXbtctySxslPage = function (record) {
	var data = mini.decode(mini.decode(record.data));
	if(data == undefined){
		mini.alert("新办套餐数据解析异常！");
	}
	data.ssjmscMc = xbnsrzhtcsq.getDebaseCode(data.ssjmscDm, 'DM_DETZXSSX');
	data.djwjqkMc = (data.djwjqkDm == 'Y' ? '是' : '否');
	data.dlqyMc = xbnsrzhtcsq.getDebaseCode(data.dlqyDm,'DM_DETZXSSX');
	data.ssldxsMc = xbnsrzhtcsq.getDebaseCode(data.ssldxsDm,'DM_DETZXSSX');
	data.wxzlMc = xbnsrzhtcsq.getDebaseCode(data.wxzlDm,'DM_DETZXSSX');
	data.dexmMc = xbnsrzhtcsq.getDebaseCode(data.dexmDm,'DM_DEXM');
	var form = new mini.Form('#gtgsh');
	form.setData(data);
	xbnsrzhtcsq.setCheckboxConfirm("gtgsh", record.blztDm);
	disableCheck('gtgsh');
};

/**
 * 获取个体工商户定期定额basecode
 * @param id basecode id
 */
xbnsrzhtcsq.getDebaseCode = function (id, code) {
	var name = '';
	$.ajax({
		type : "GET",
		url : "../../../../api/baseCode/get/baseCode2CombSelect5/" + code + "?param="+id,
		async : false,
		success : function(data) {
			var result = mini.decode(data);
			if (result != null && result != undefined) {
				name = result[0].MC;
			}else{
				mini.alert(data.message, '提示信息', function() {
					doBackSub();
				});
			}
		},
		error : function(e) {
			//console.error(e);
			mini.alert("加载失败，请重试！");
		}
	});
	return name;
};

/**
 * 初始化新办套餐-税费种认定页面 added by zhangjc 20180629
 * @param data 对象
 */
xbnsrzhtcsq.initSfzrdSxslPage = function (djxh) {
	var form = new mini.Form('#sfzrd');
	var zzsGrid = mini.get('zzs-grid');
	var sdsGrid = mini.get('sds-grid');
	var whsyjsfGrid = mini.get('whsyjsf-grid');
	var zzsGridData = [];
	var sdsGridData = [];
	var whsyjsfGridData = [];
	var sdsCount = 0;
	var whsyjsfCount = 0;
	$.ajax({
		type : "POST",
		url : "../../../../api/wtgl/dqrsxWRT/queryDqrNsrxx/"+djxh,
		async : false,
		success : function(data) {
			var result=mini.decode(data.value);
			if (data.success && !!data.value) {
				for(var i = 0; i < result.sfzrdxxList.length; i++){
					if(result.sfzrdxxList[i].zsxmDm == '10101'){
						zzsGridData.push(result.sfzrdxxList[i]);
					}else if(result.sfzrdxxList[i].zsxmDm == '10104'){
						sdsGridData.push(result.sfzrdxxList[i]);
						sdsCount ++;
					}else if(result.sfzrdxxList[i].zsxmDm == '30217'){
						whsyjsfGridData.push(result.sfzrdxxList[i]);
						whsyjsfCount ++;
					}
				}
				zzsGrid.setData(zzsGridData);
				if(sdsCount == 0){
					hideSdsTab();
				}
				sdsGrid.setData(sdsGridData);
				if(whsyjsfCount == 0){
					hideWhsyjsfTab();
				}
				whsyjsfGrid.setData(whsyjsfGridData);
				form.setData(result.nsrxx);
				xbnsrzhtcsq.setCheckboxConfirm("sfzrd", record.blztDm);
			}else{
				mini.alert(data.message, '提示信息', function() {
					doBackSub();
				});
			}
		},
		error : function(e) {
			//console.error(e);
			mini.alert("加载失败，请重试！");
		}
	});
	disableCheck('sfzrd');
};

//隐藏所得税tab
function hideSdsTab(){
	var tabs = mini.get('sfzrdTab');
	var tab = tabs.getTab(1);
	if (tab) {
		tabs.updateTab(tab, {visible: false});
	}
}

function hideWhsyjsfTab(){
	var tabs = mini.get("sfzrdTab");
	var tab = tabs.getTab(2);
	if (tab) {
		tabs.updateTab(tab, {visible: false});
	}
}

/**
 * 返回上一层
 */
function doBack() {
	window.history.go(-1);
}

/**
 * 票种核定信息
 */
xbnsrzhtcsq.initXbtcPzhdSxslPage = function (sqxh, data, sxshfsDm) {
	initPzhd(data);
	initFbzl(sqxh);
	if(sxshfsDm != '01'){
		xbnsrzhtcsq.setDataGridCheckboxConfirm(new mini.Form('#pzhd'));
	}
};

/**
 * 校验新办套餐所有子事项是否都已确认
 */
xbnsrzhtcsq.vilidatorDetailConfirm = function(){
	var data = {};
	data.sqxh = sxsl_store.sqxh;
	var xbtcGrid = mini.get('xbtc-grid');
	var subSwsx = xbtcGrid.getData();
	var msg = '请先确认以下套餐事项：';
	var xbtcSwsx = {};
	ajax.get('../../data/swsxDm.json',{},
		function (responseJson) {
			responseJson=mini.decode(responseJson);
        	xbtcSwsx = responseJson['11000202'].subSwsxList;
        }
	)
	for(var i = 0; i < subSwsx.length; i++){
		if(subSwsx[i].blztDm == '00'){
			data.success = false;
			data.msg = '存在未受理事项，请先受理后再点击事项办结！';
			return data;
		}else if(subSwsx[i].blztDm != '01'){
			continue;
		}
		//在税务事项配置中，新增xsxq（显示详情）和简称字段，个体工商户定期定额受理方式为人工受理
		if(xbtcSwsx[subSwsx[i].swsxDm] != undefined && xbtcSwsx[subSwsx[i].swsxDm].xsxq == 'Y'
			&& (subSwsx[i].sxshfsDm == '01' || (subSwsx[i].swsxDm == '11012301'))){
			if(subSwsx[i].blztDm != '16'){//未确认需要提示
				msg += xbtcSwsx[subSwsx[i].swsxDm].name + '，';
			}
		}
	}
	if(msg == '请先确认以下套餐事项：'){
		data.success = true;
		return data;
	}
	msg = msg + '所有信息无误后再点击确认！';
	data.success = false;
	data.msg = msg;
	return data;
}

/**
 * 详情时设置checkbox和确认按钮不可见
 */
xbnsrzhtcsq.setDataGridCheckboxConfirm = function(formId){
	$("#cofirmBtn").attr({
		'style': 'display: none !important'
	});
	var ylWin = mini.get('xbtc-yl-win');
	ylWin.show();
	$('#lprxxGrid tr').each(function(){
		 $(this).find('td:eq(1)').hide();
	})
	$('#pzhdGrid tr').each(function(){
		 $(this).find('td:eq(1)').hide();
	})
	$('#fbzl-grid tr').each(function(){
		 $(this).find('td:eq(1)').hide();
	})
	$('#checkcolumn tr').each(function(){
		 $(this).find('td:eq(1)').hide();
	})
}

/**
 * 详情时设置checkbox和确认按钮不可见（只有状态是已办理未确认时才显示）
 */
xbnsrzhtcsq.setCheckboxConfirm = function(formId, blztDm){
	if(blztDm != '01'){
		$("#cofirmBtn").attr({
			'style': 'display: none !important'
		});
		var ylWin = mini.get('xbtc-yl-win');
		ylWin.show();

		var fromClass = '.mini-window:visible .' + formId + "Form" + ' [type="checkbox"]';
		$(fromClass).attr({
			'style': 'display: none !important'
		});

		if(formId == 'sfzrd'){
			$('#zzs-grid tr').each(function(){
				 $(this).find('td:eq(1)').hide();
			})
			$('#sds-grid tr').each(function(){
				 $(this).find('td:eq(1)').hide();
			})
			$('#whsyjsf-grid tr').each(function(){
				 $(this).find('td:eq(1)').hide();
			})
		}
	}
}

//查询附报资料
function initFbzl(sqxh){
	$.ajax({
		url: "../../../../api/wtgl/dbsx/fbzllist/"+sqxh,
		type: 'post',
		async: false,
		success: function(res){
			if(res.success){
				//初始化上传数量为0
				var fbzldata = res.value;
				for(var i=0; i<fbzldata.length; i++){
					fbzldata[i].scCount = fbzldata[i].bsmxlist.length;
				}
				var fbzlGrid = mini.get("fbzl-grid");
				fbzlGrid.setData(fbzldata);
			}else{
				mini.alert(res.message);
			}
		},
		error: function(error) {
			doBackSub();
		}
	})
}

function initPzhd(data){
	var pzhdGrid = mini.get('pzhdGrid');
	var lprxxGrid = mini.get('lprxxGrid');
	var sqsj = mini.decode(data);
	var gprGrid = mini.decode(sqsj.gprGrid);
	var showGprList = [];
	for (var i = 0; i < gprGrid.length; i++){
		var gpr = gprGrid[i];
		var viewGpr = {};
		viewGpr.gprxm = gpr.gprxm;
        viewGpr.sfzjhm = gpr.sfzjhm;
        viewGpr.lxdh = gpr.lxdh;
        showGprList.push(viewGpr);
    }
	lprxxGrid.setData(showGprList);

    var pzhdsqGrid = mini.decode(sqsj.pzhdsqGrid);
    var showLpContent = [];
    for (var i = 0; i < pzhdsqGrid.length; i++){
        var pzhd = pzhdsqGrid[i];
        var pzhdsq = {};
        pzhdsq.fpzlmc = pzhd.fpzlmc;
        pzhdsq.myzggpsl = pzhd.sjcpzgsl;
        pzhdsq.dffpzgkpxe = pzhd.sjdffpzgkpxe;
        showLpContent.push(pzhdsq);
    }
    pzhdGrid.setData(showLpContent);
}

/**
 * 返回上一层
 */
function doBackSub() {
	var ylWin = mini.get('xbtc-yl-win');
	ylWin.hide();
	resetGrid();
}

//确定按钮
function doConfirm(formId) {
	if(isAllChecked(formId) && isGridAllChecked(formId)) {
		//提交子事项办理状态为16（已确认）
		$.ajax({
			type : "POST",
			url : "../../../../api/wtgl/dqrsxWRT/submitSubDqrNsrxx/"+subRecord.sqxh,
			async : false,
			success : function(data) {
				if (!data.success) {
					mini.alert('提交失败！请稍后再试');
				}else{
					mini.alert('提交成功！', '提示信息', function() {
						doBackSub();
					});
				}
			},
			error : function(e) {
				mini.alert('提交失败！请稍后再试');
			}
		});
	}else{
		mini.alert("请确认所有信息无误后再点击确定！");
	}
}


//判断是否全选 modified by zhangjc 20180702
function isAllChecked(formId){
	var fromClassSy = '.mini-window:visible .' + formId + "Form" + ' [type="checkbox"]';
	var fromClassYx = '.mini-window:visible .' + formId + "Form" + ' :checked';
	var yx = $(fromClassYx).length;
	var sy = $(fromClassSy).length;
	if(sy == yx){
		return true;
	}
	return false;
}

//判断datagrid里面的条目是否全选
function isGridAllChecked(formId){
	var flag = true;
	if(formId == 'sfzrd'){
		var zzsGrid = mini.get('zzs-grid');
		var sdsGrid = mini.get('sds-grid');
		var whsyjsfGrid = mini.get('whsyjsf-grid');
		var arr1 = zzsGrid.getSelecteds();
		var arr2 = sdsGrid.getSelecteds();
		var arr3 = whsyjsfGrid.getSelecteds();
		if(arr1.length == zzsGrid.getData().length && arr2.length == sdsGrid.getData().length
				&& arr3.length == whsyjsfGrid.getData().length){
			flag = true;
		}else{
			flag = false;
		}
	}else if(formId == 'pzhd'){
		var fbzlGrid = mini.get('fbzl-grid');
		var pzhdGrid = mini.get('pzhdGrid');
		var lprxxGrid = mini.get('lprxxGrid');
		var arr3 = lprxxGrid.getSelecteds();
		var arr4 = pzhdGrid.getSelecteds();
		var arr5 = fbzlGrid.getSelecteds();
		if(arr3.length == lprxxGrid.getData().length &&  arr4.length == pzhdGrid.getData().length
		&& arr5.length == fbzlGrid.getData().length ){
			flag = true;
		}else{
			flag = false;
		}
	}
	return flag;
}

//input没有值时，前面checkox禁止选中
function disableCheck(type){
	if(type == 'bl'){
		var zgswjMc = mini.get('zgswjMc').getValue();
		var zgswskfjMc = mini.get('zgswskfjMc').getValue();
		var jdxzMc = mini.get('jdxzMc').getValue();
		var bzfsMc = mini.get('bzfsMc').getValue();
		var dwlsgxMc = mini.get('dwlsgxMc').getValue();
		var hyMc = mini.get('hyMc').getValue();
		var fshyDm1 = mini.get('fshyDm0').getValue();
		var fshyDm2 = mini.get('fshyDm1').getValue();
		var fshyDm3 = mini.get('fshyDm2').getValue();
		var fshyDm4 = mini.get('fshyDm3').getValue();
		var fshyDm5 = mini.get('fshyDm4').getValue();
		if(!zgswjMc){
			$('#zgswjMcCheck').attr("checked",true);
			$('#zgswjMcCheck').attr("disabled",true);
		}if(!zgswskfjMc){
			$('#zgswskfjMcCheck').attr("checked",true);
			$('#zgswskfjMcCheck').attr("disabled",true);
		}if(!jdxzMc){
			$('#jdxzMcCheck').attr("checked",true);
			$('#jdxzMcCheck').attr("disabled",true);
		}if(!bzfsMc){
			$('#bzfsMcCheck').attr("checked",true);
			$('#bzfsMcCheck').attr("disabled",true);
		}if(!hyMc){
			$('#hyMcCheck').attr("checked",true);
			$('#hyMcCheck').attr("disabled",true);
		}if(!dwlsgxMc){
			$('#dwlsgxMcCheck').attr("checked",true);
			$('#dwlsgxMcCheck').attr("disabled",true);
		}if(!fshyDm1){
			$('#fshyDm1Check').attr("checked",true);
			$('#fshyDm1Check').attr("disabled",true);
		}if(!fshyDm2){
			$('#fshyDm2Check').attr("checked",true);
			$('#fshyDm2Check').attr("disabled",true);
		}if(!fshyDm3){
			$('#fshyDm3Check').attr("checked",true);
			$('#fshyDm3Check').attr("disabled",true);
		}if(!fshyDm4){
			$('#fshyDm4Check').attr("checked",true);
			$('#fshyDm4Check').attr("disabled",true);
		}if(!fshyDm5){
			$('#fshyDm5Check').attr("checked",true);
			$('#fshyDm5Check').attr("disabled",true);
		}
	} else if(type == 'sfzrd'){
		var zzsqylxMc = mini.get('zzsqylxMc').getValue();
		var zzsjylbMc = mini.get('zzsjylbMc').getValue();
		var ygznsrlxMc = mini.get('ygznsrlxMc').getValue();
		var zzsnsrlxMc = mini.get('zzsnsrlxmc').getValue();

		if(!zzsqylxMc){
			$('#zzsqylxMcCheck').attr("checked",true);
			$('#zzsqylxMcCheck').attr("disabled",true);
		}if(!zzsjylbMc){
			$('#zzsjylbMcCheck').attr("checked",true);
			$('#zzsjylbMcCheck').attr("disabled",true);
		}if(!ygznsrlxMc){
			$('#ygznsrlxMcCheck').attr("checked",true);
			$('#ygznsrlxMcCheck').attr("disabled",true);
		}if(!zzsnsrlxMc){
			$('#zzsnsrlxMcCheck').attr("checked",true);
			$('#zzsnsrlxMcCheck').attr("disabled",true);
		}
	} else if(type == 'gtgsh'){
		var ssjmscMc = mini.get('ssjmscMc').getValue();
		var djwjqkMc = mini.get('djwjqkMc').getValue();
		var dlqyMc = mini.get('dlqyMc').getValue();
		var ssldxsMc = mini.get('ssldxsMc').getValue();
		var wxzlMc = mini.get('wxzlMc').getValue();
		var dexmMc = mini.get('dexmMc').getValue();

		if(!ssjmscMc){
			$('#ssjmscMcCheck').attr("checked",true);
			$('#ssjmscMcCheck').attr("disabled",true);
		}if(!djwjqkMc){
			$('#djwjqkMcCheck').attr("checked",true);
			$('#djwjqkMcCheck').attr("disabled",true);
		}if(!dlqyMc){
			$('#dlqyMcCheck').attr("checked",true);
			$('#dlqyMcCheck').attr("disabled",true);
		}if(!ssldxsMc){
			$('#ssldxsMcCheck').attr("checked",true);
			$('#ssldxsMcCheck').attr("disabled",true);
		}if(!wxzlMc){
			$('#wxzlMcCheck').attr("checked",true);
			$('#wxzlMcCheck').attr("disabled",true);
		}if(!dexmMc){
			$('#dexmMcCheck').attr("checked",true);
			$('#dexmMcCheck').attr("disabled",true);
		}
	} else if(type == 'pzhd'){

	} else if(type == 'whsyjsf'){
		var sfjnr = mini.get('sfjnr').getValue();
		var sfkjr = mini.get('sfkjr').getValue();
		var zytzbl = mini.get('zytzbl').getValue();
		var dftzbl = mini.get('dftzbl').getValue();
		var wlsgxtzbl = mini.get('wlsgxtzbl').getValue();

		if(!sfjnr){
			$('#sfjnrCheck').attr("checked",true);
			$('#sfjnrCheck').attr("disabled",true);
		}if(!sfkjr){
			$('#sfkjrCheck').attr("checked",true);
			$('#sfkjrCheck').attr("disabled",true);
		}if(!zytzbl){
			$('#zytzblCheck').attr("checked",true);
			$('#zytzblCheck').attr("disabled",true);
		}if(!dftzbl){
			$('#dftzblCheck').attr("checked",true);
			$('#dftzblCheck').attr("disabled",true);
		}if(!wlsgxtzbl){
			$('#wlsgxtzblCheck').attr("checked",true);
			$('#wlsgxtzblCheck').attr("disabled",true);
		}
	}
}


/*给票种核定赋值*/
xbnsrzhtcsq.setPzhdData = function(viewData){
  try{
    mini.get('gzpz_grid_yl').setData(viewData.showLpContent);
    mini.get('lpryl_grid').setData(viewData.showGprList);
    mini.get('gzpz_grid_yl').allowCellEdit = false;
    $(mini.get('gzpz_grid_yl').el).find('.enable').removeClass('enable');
  }catch (e) {
    //console.log(e);
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
            	autoHandleTrigger("11010201");
            } else {
                onCancel('close');
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
	}else if("11010201"===swsxDm){// 税费种认定
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
		mini.alert(resultMsg, '提示', function () {
		  if("11010201"===swsxDm){
        onCancel('close');
      }
    });
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
