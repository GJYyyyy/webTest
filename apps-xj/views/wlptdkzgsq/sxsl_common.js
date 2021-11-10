
/**
 * 事项受理公共
 * @type {{urlParams}}
 */
var sxslcommon = {
	urlParams:gldUtil.getParamFromUrl(),
};

/**
 * sxsl初始化后插入的数据，供后续使用
 */
var sxsl_store={
	/*lcslId:"",
	sqxh:"",
	bzzlUrl:"",
	rwbh:"",
	blztDm:"",
	swsxDm:"",
	nsrsbh:"",
	fzxxUrl:"",
	sxshfsDm:"",
	viewData:""*/
};

/**
 * 准予受理事件实现
 */
var sxslbt_zysl={};
var sxslbt_sxbj={};
var sxslbt_shbj={};
var sxslbt_bzzl={};
var sxslbt_bysl={};

/**
 * 申请序号
 */
var fbzlSqxh = "";

/**
 * 请求文书申请基本信息
 */
sxslcommon.swsxsqJbxx = sxslService.queryWssqJbxx(sxslcommon.urlParams.lcslId);

/**
 * 初始化页面
 * @param data 对象
 */
sxslcommon.initSxslPage = function (data) {
	var flag=true;
	if(!!data){
		// 头部加入受理名称
		$("#swsxMc").text(data.swsxMc);
		// 基本信息中加入查出的信息
		$('#nsrjbxx span').each(function (i,v) {
			$(v).text(data[$(v).attr('id')]);
		});

		// 将数据存到对应的对象中
		sxsl_store.lcslId=sxslcommon.urlParams.lcslId;
		sxsl_store.rwbh=sxslcommon.urlParams.rwbh;
		// 补录资料URL地址，为空说明不需要补录：
		sxsl_store.sqxh=data.sqxh;
		sxsl_store.swsxDm=data.swsxDm;
		sxsl_store.nsrsbh=data.sqr;
		sxsl_store.sxshfsDm=data.sxshfsDm;
		//sxsl_store.nsrmc=data.nsrmc;
		fbzlSqxh = data.sqxh;
		sxsl_store.rwztDm = data.rwztDm;
		sxsl_store.djxh = data.djxh;
		// 加载信息特色信息
		ajax.get('../../data/swsxDmConfig.json',{},
			function (responseJson) {
				responseJson=mini.decode(responseJson);
				sxsl_store.ylUrl = responseJson[sxsl_store.swsxDm].ylView;
				sxsl_store.ylJs = responseJson[sxsl_store.swsxDm].ylJs;
				sxsl_store.blzlUrl = responseJson[sxsl_store.swsxDm].blxx;
				sxsl_store.isPack = responseJson[sxsl_store.swsxDm].pack;
				if(typeof(responseJson[sxsl_store.swsxDm].pack)=="undefined" || responseJson[sxsl_store.swsxDm].pack!="Y"){
					sxsl_store.isPack = "N";
				}
			}
		)
		var tabs = mini.get("tabs1");
		// 附报资料Tab页加载
		var fbzlTab = tabs.getTab(1);
		tabs.loadTab("../fbzl/fbzlPage.html", fbzlTab);
		mini.parse($('#tabs1'));

		// 操作按钮显示初始化
		displayButton();

		//初始化 文书申请信息
		sxsl_store.sqsxData=sxslService.queryWssqxxData(sxsl_store.sqxh);
		sxsl_store.sqsxData=mini.decode(sxsl_store.sqsxData);
		if(!sxsl_store.sqsxData.viewData){
			flag=false;
		}else{
			// 加载预览页面js
            if(!!sxsl_store.ylJs){
                gldUtil.loadScript(sxsl_store.ylJs);
            }
			sqzl.initPage(sxsl_store.ylUrl,mini.decode(sxsl_store.sqsxData.viewData),sxsl_store.isPack);
		}
	}
	return flag;
};

//======按钮事件方法接口start==
/**
 * 准予受理入口
 * @param xx
 */
sxslcommon.zysl=function(){
	var storeObj=sxsl_store;
	lcslId=storeObj.lcslId;
	rwbh=storeObj.rwbh;
	var result=sxslbt_zysl.zylscomFuc(lcslId,rwbh);
	if(!!result){
		mini.alert("准予受理成功", '提示信息');
	}
};

/**
 * 事项办结入口
 * @param xx
 */
sxslcommon.sxbj=function(){
	var storeObj=sxsl_store;
	sxslbt_sxbj.sxbjcomFuc(storeObj);
};

/**
 * 审核办结入口
 * @param xx
 */
sxslcommon.shbj=function(){
	var storeObj=sxsl_store;
	sxslbt_shbj.shbjcomFuc(storeObj);
};


/**
 * 补证资料入口
 * @param xx
 */
sxslcommon.bzzl=function(){
	var storeObj=sxsl_store;
	sxslbt_bzzl.bzzlcomFuc(storeObj);
};

/**
 * 不予受理入口
 * @param xx
 */
sxslcommon.bysl=function(){
	var storeObj=sxsl_store;
	sxslbt_bysl.byslcomFuc(storeObj);

};

//=======按钮方法=====


//=======================事项办结方法=================
/**
 *事项办结通用方法
 */
sxslbt_sxbj.sxbjcomFuc=function(storeObj){

	openSxbjSwsxtzs("",WSYS_BLZT_DM.BLZT_DSP,storeObj);
}
//=============================审核办结方法（是否需要补录,要补正则先填写补正信息，然后填写税务事项通知书）=================
/**
 * 审核办结通用方法
 * @param storeObj
 */
sxslbt_shbj.shbjcomFuc=function(storeObj){
	var lcslId = storeObj.lcslId;
	var blzlUrl = storeObj.blzlUrl;
	var sqxh = storeObj.sqxh;
	var swsxDm = storeObj.swsxDm;
	var nsrsbh = storeObj.nsrsbh;
	var rwbh = storeObj.rwbh;

	var isNeedBlzl = true; // 是否需要补录资料， 增加额外控制开关
	// 外出经营证明开具
	if("110801" == swsxDm || "110804" == swsxDm){
		// 当外出地非河北时，无需发起补充资料，直接办结即可
		var wcjydxzqh = mini.decode(storeObj.sqsxData.viewData).step_yl_form.wcjydxzqh;

		if(!("13" == wcjydxzqh.substr(0,2))) {
			isNeedBlzl = false;
		}
	}


	//查看是否需要补录
	if (!!blzlUrl && isNeedBlzl) {
		// 打开补录页面
		mini.open({
			url : blzlUrl,
			title : "补录信息",
			width : 900,
			height : 600,
			onload : function() {
				var iframe = this.getIFrameEl();
				iframe.contentWindow.setData(storeObj);
			},
			ondestroy : function(action) {
				if ("ok" == action) {
					mini.get("backBtn").doClick();
				}
				if ("cancel" != action && "close" != action && "ok" != action) {
					openSxbjSwsxtzs(action,WSYS_BLZT_DM.BLZT_SLTG,storeObj);
				}
			}
		});
		return;
	}
	openSxbjSwsxtzs("",WSYS_BLZT_DM.BLZT_SLTG,storeObj);
}

//=====================补正资料方法==========================
/**
 * 补正资料通用实现方法
 * @param storeObj
 */
sxslbt_bzzl.bzzlcomFuc=function(storeObj) {
	openSxbjSwsxtzs("",WSYS_BLZT_DM.BLZT_BZZL,storeObj);
}
//========================不予受理方法===========================
/**
 *不予受理通用方法
 * @param storeObj
 */
sxslbt_bysl.byslcomFuc=function(storeObj){
	openSxbjSwsxtzs("",WSYS_BLZT_DM.BLZT_SLBTG,storeObj);
}





/**
 * 返回上一层
 */
function doBack() {
	CloseWindow("cancel");
}

/**
 * 打开受理通过处理页面 (税务事项通知书或回执页面)
 */

/**
 *用于打开回执的公用方法
 * @param blxxData(补录信息)
 * @param blztFlag（用来确定到底是什么类型的回执界面）
 * @param storeobj（之前初始化预存数据）
 * @param otherData（备注栏预先填写的事项）
 */
function openSxbjSwsxtzs(blxxData,blztFlag,storeobj,otherData) {
	var lcslId=storeobj.lcslId;
	var rwbh = storeobj.rwbh;
	var swsxDm=storeobj.swsxDm;

    var pageUrl ="swsxtzs.html";
    var blxxDataStr = !blxxData?"":mini.encode(blxxData);
    var title="";
    if(WSYS_BLZT_DM.BLZT_SLTG==blztFlag) {
        title="事项办结";
    }else if(WSYS_BLZT_DM.BLZT_SLBTG==blztFlag){
        title="不予受理";
    }else if(WSYS_BLZT_DM.BLZT_BZZL==blztFlag){
        title="补正资料";
    }else if(WSYS_BLZT_DM.BLZT_DSP==blztFlag){
        title="事项办结";
    }

    var flag = false;
    if(storeobj.swsxDm == "110402"){
        flag = true;
    }
    if(flag){
        mini.confirm("请先根据申请信息在金三前台进行备案，备案成功后进行审核办结。是否确认继续？ ","提示",function (action) {
            if(action == "ok"){
                mini.open({
                    url : pageUrl,
                    title : title,
                    width : 900,
                    height : 600,
                    onload : function() {
                        var iframe = this.getIFrameEl();
                        iframe.contentWindow.querySwsxtzsxx(lcslId,rwbh,blztFlag,swsxDm, blxxDataStr, otherData,sxsl_store.rwztDm,sxsl_store.djxh, sxsl_store);
                    },
                    ondestroy : function(action) {
                        if (typeof(action) == "object") {
                            action = mini.decode(action);
                        }
                        if ("ok" == action || "ok" == action.status) {
							mini.Cookie.set("reflash", "ok");
                            CloseWindow("ok");
                        }
                    }
                });
            }
        })
    }else {
        mini.open({
            url : pageUrl,
            title : title,
            width : 900,
            height : 600,
            onload : function() {
                var iframe = this.getIFrameEl();
                iframe.contentWindow.querySwsxtzsxx(lcslId,rwbh,blztFlag,swsxDm, blxxDataStr, otherData,sxsl_store.rwztDm,sxsl_store.djxh, sxsl_store);
            },
            ondestroy : function(action) {
                if (typeof(action) == "object") {
                    action = mini.decode(action);
                }
                if ("ok" == action || "ok" == action.status) {
                    mini.get("backBtn").doClick();
                }
            }
        });
    }
}

/**
 * 用于套餐事项办结
 * @param blxxData
 * @param blztFlag
 * @param storeobj
 * @param otherData
 */
function openPackSxbjSwsxtzs(blxxData,blztFlag,storeobj,otherData) {
	var lcslId=storeobj.lcslId;
	var rwbh = storeobj.rwbh;
	var swsxDm=storeobj.swsxDm;

    var pageUrl ="swsxtzs.html";
    var blxxDataStr = !blxxData?"":mini.encode(blxxData);
    var title="";
    if(WSYS_BLZT_DM.BLZT_SLTG==blztFlag) {
        title="事项办结";
    }else if(WSYS_BLZT_DM.BLZT_SLBTG==blztFlag){
        title="不予受理";
    }else if(WSYS_BLZT_DM.BLZT_BZZL==blztFlag){
        title="补正资料";
    }else if(WSYS_BLZT_DM.BLZT_DSP==blztFlag){
        title="事项办结";
    }

    mini.open({
        url : pageUrl,
        title : title,
        width : 900,
        height : 600,
        onload : function() {
            var iframe = this.getIFrameEl();
            iframe.contentWindow.querySwsxtzsxx(lcslId,rwbh,blztFlag,swsxDm, blxxDataStr, otherData,sxsl_store.rwztDm);
            // 重新绑定新的事项办理事件（专用于套餐的事件）
            iframe.contentWindow.reBindSxBjBtn();
        },
        ondestroy : function(action) {
            if (typeof(action) == "object") {
                action = mini.decode(action);
            }
            if ("ok" == action || "ok" == action.status) {
                mini.get("backBtn").doClick();
            }
        }
    });
}

function displayButton(swsxDm,sxshfsDm){
	// 初始化按钮为全部隐藏
	mini.get("sxbjBtn").hide();
	mini.get("shbjBtn").hide();
	mini.get("bzzlBtn").hide();
	mini.get("byslBtn").hide();
	mini.get("sqbPrintBtn").hide();



	// 即办事项常规按钮
	if (WSYS_SLSHFS_DM.SLSHFS_JB ==sxsl_store.sxshfsDm) {
		if(sxsl_store.swsxDm=='11010101' || sxsl_store.swsxDm=='11012101') {
			mini.get("sxbjBtn").show();
		}else{
			mini.get("shbjBtn").show();
			mini.get("bzzlBtn").show();
			mini.get("byslBtn").show();
		}
	}

	// 非即办事项常规按钮
	if (WSYS_SLSHFS_DM.SLSHFS_FJB== sxsl_store.sxshfsDm) {
			mini.get("sxbjBtn").show();
			mini.get("bzzlBtn").show();
			mini.get("byslBtn").show();

	}

	//辖区纳税人外出经营情况只有返回按钮
	var isXqnsrWcjy  = gldUtil.getParamFromUrl();
	if(isXqnsrWcjy.ishidden == 'true'){
        mini.get("sxbjBtn").hide();
        mini.get("shbjBtn").hide();
        mini.get("bzzlBtn").hide();
        mini.get("byslBtn").hide();
        mini.get("sqbPrintBtn").hide();
	}
}

function CloseWindow(action) {
    if (window.CloseOwnerWindow)
        return window.CloseOwnerWindow(action);
    else
        window.close();
}

