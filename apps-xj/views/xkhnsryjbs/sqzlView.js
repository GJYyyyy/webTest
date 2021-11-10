/**
 * Created by ywy on 2017/2/27.
 */
var sqzl={};
var lxdh="";
sqzl.blzt = window.sxsl_store;
sqzl.content = $('#dbsx_content');
sqzl.setViewData=function(viewData) {

	if (!viewData || $.isEmptyObject(viewData)) {
		mini.alert('未获取到申请资料数据', '提示');
		return false;
	} else {
		sqzl.content.show();
	}

	var elements = document.querySelectorAll("[data-view-type]"),
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
                if(!!viewData["xkh-yl-cwkj"]&& targetId == "yltj" && sqzl.blzt.swsxDm === '110112'){
                    data[targetId] = form.setData(viewData["xkh-yl-cwkj"]);
                }else{
                    data[targetId] = form.setData(viewData[targetId]);
                }
                form.setEnabled(false);
            } else if(targetType==="datagrid"){
                targetId =  elements[i].children[0].getAttribute("id")||$(elements[i]).children(0)._id();
                if(!targetId){
                    throwError("data-view-type=datagrid 第一个子节点的id未获取到，请检查第一个子节点！");
                    return false;
                }
                var grid = mini.get(targetId);
                if(!!viewData["nsrjbxx-form"]&& targetId == "nsrjbxx-form"){ //票种核定特殊处理
                    data[targetId] = grid.setData(viewData["nsrjbxx-form"]);
                }else if(!!viewData["xkh-yl-ckzhzhbgGrid"]&&targetId == "yltj"){  //存款账户特殊处理
                    data[targetId] = grid.setData(viewData["xkh-yl-ckzhzhbgGrid"]);
                }else{
                    data[targetId] = grid.setData(viewData[targetId]);
                }
                if(targetId === "yhdpz-grid-now"){

                }else{
                    grid.setEnabled(false);
                }

            }
        }
	}
};
sqzl.initPage = function (url,data) {
	var html = gldUtil.loadTemplate(url).replace(/url/g,'data-url');
	$('#dbsx_content').eq(0).append(html);
	mini.parse();

    // 执行个性化操作
	sqzl.customOptions(data);
	sqzl.setViewData(data);
	//还原联系电话
	sqzl.wcjyzmKjLxdh(data);
	/*if(!!data && !!data['fbzl-yl-grid'] ){
		fbzlCkUrl = '../fbzl/Fbzlck.html';
		fbzldata = data['fbzl-yl-grid'];
    }*/
};
// 个性化操作都写在这个方法里面，根据税务事项代码区分
sqzl.customOptions=function (data) {
    // 个体工商户定额核定
    if(sqzl.blzt.swsxDm=='110123'){
        var Tab = mini.get('tabsYlForm');
        var tabs = Tab.tabs;
        for (var i=0;i<tabs.length;i++){
            var dataName = tabs[i].name+'ViewForm';
            if(!data.hasOwnProperty(dataName)){
                Tab.removeTab(tabs[i].name);
                i--;
            }
        }
    }else if(sqzl.blzt.swsxDm == '110801' || sqzl.blzt.swsxDm == '110804'){//外出经营证明显示联系电话
     	//var lxdh = $("#input[name=lxdh]").val();
    	var obj = JSON.parse(sqzl.blzt.sqsxData.data);
    	//lxdh.val(obj.wjcyzmsqb.zmWcjyhdssglzmxxVO.lxdh);
    	lxdh = data["step_yl_form"].lxdh;
    	data["step_yl_form"].lxdh=obj.wjcyzmsqb.zmWcjyhdssglzmxxVO.lxdh;
    }
    if(sqzl.blzt.swsxDm === '110207'){
        pzhd.isHasZgkpxespSc(sqzl.blzt.sqsxData)
    }
};
sqzl.wcjyzmKjLxdh=function (data) {//还原联系电话数据
   if(sqzl.blzt.swsxDm == '110801' || sqzl.blzt.swsxDm == '110804'){
    	data["step_yl_form"].lxdh=lxdh;
    }
};

var pzhd = {};
pzhd.isHasZgkpxespSc = function(sqsxData){
    var fpList = mini.decode(sqsxData.viewData)['yhdpz-grid-now'],
        isZgkpxesq = false;
    $.each(fpList,function(i,value){
        if(value.fpzlDm === '1130' || value.fpzlDm === '1160'){
            isZgkpxesq = true;
        }
    });
    if(isZgkpxesq){
        mini.get("tabsPzhd").updateTab(mini.get("tabsPzhd").getTab("zgkpxesq"),{visible: true});
        mini.get("tabsPzhd").updateTab(mini.get("tabsPzhd").getTab("zgkpxesqd"),{visible: true});
    }
};
