
/**
 * 事项受理公共
 * @type {{urlParams}}
 */
var cxtjcommon = {
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
cxtjcommon.swsxsqJbxx = cxtjService.queryWssqJbxx(cxtjcommon.urlParams.lcslId);

/**
 * 初始化页面
 * @param data 对象
 */
cxtjcommon.initSxslPage = function (data) {
	var flag=true;
	if(!!data){
		// 头部加入受理名称
		$("#swsxMc").text(data.swsxMc);
		// 基本信息中加入查出的信息
		$('#nsrjbxx span').each(function (i,v) {
			$(v).text(data[$(v).attr('id')]);
		});

		// 将数据存到对应的对象中
		sxsl_store.lcslId=cxtjcommon.urlParams.lcslId;
		sxsl_store.rwbh=cxtjcommon.urlParams.rwbh;
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
			}
		)
		var tabs = mini.get("tabs1");
		// 附报资料Tab页加载
		var fbzlTab = tabs.getTab(1);
		tabs.loadTab("../fbzl/fbzlPage.html", fbzlTab);
		mini.parse($('#tabs1'));
		
		//初始化 文书申请信息
		sxsl_store.sqsxData=cxtjService.queryWssqxxData(sxsl_store.sqxh);
		sxsl_store.sqsxData=mini.decode(sxsl_store.sqsxData);
		if(!sxsl_store.sqsxData.viewData){
			flag=false;
		}else{
			// 加载预览页面js
            if(!!sxsl_store.ylJs){
                gldUtil.loadScript(sxsl_store.ylJs);
            }
			cxtj_sqzl.initPage(sxsl_store.ylUrl,mini.decode(sxsl_store.sqsxData.viewData));
		}
	}
	return flag;
};

/**
 * 返回上一层
 */
function doBack() {
	window.history.go(-1);
}


