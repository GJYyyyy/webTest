/**
 * Created by ywy on 2017/2/27.
 */
var sqzl={};
var lxdh="";
sqzl.blzt = window.sxsl_store;
sqzl.content = $('#dbsx_content');
// 抛出错误
sqzl.throwError =  function (message) {
    if (arguments.length > 1) {
        message = message.format(Array.prototype.slice.call(arguments, 1));
    }
    throw new Error(message);
};

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
				data[targetId] = form.setData(viewData[targetId]||{});

			} else if(targetType==="datagrid"){
				targetId =  elements[i].children[0].getAttribute("id")||$(elements[i]).children(0)._id();
				if(!targetId){
                    sqzl.throwError("data-view-type=datagrid 第一个子节点的id未获取到，请检查第一个子节点！");
					return false;
				}
				var grid = mini.get(targetId);
				if(!grid){
                    sqzl.throwError('获取' + targetId + 'grid 失败，检查预览页面上是否有这个grid');
                }
				data[targetId] = grid.setData(viewData[targetId]||[]);
			}
		}
	}
};
/**
 * 套餐式预览数据，业务页面调用此方法获取预览数据，因renderer各业务差异化，
 * 故由业务页面进行renderer操作，所以把grid.setData放在业务页面
 */
sqzl.getPackViewData=function(sqxh) {
	var data=[];
	ajax.post(sxxlApi.querysubWssqMxList, {parentSqxh:sqxh}, function(result) {
        if(result.success && result.value){
            data = result.value;
        }else{
            mini.alert(result.message);
        }
    });
	return data;
};


sqzl.initPage = function (url,data,isPack) {
	var html = gldUtil.loadTemplate(url).replace(/url/g,'data-url');
	$('#dbsx_content').eq(0).append(html);
	mini.parse();

	// 执行个性化操作
	sqzl.customOptions(data);
	if(isPack=='Y'){
		// 由子页面自己渲染页面
	}else{
		sqzl.setViewData(data);
	}
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
	}else if(sqzl.blzt.swsxDm == '110801' ){//外出经营证明显示联系电话
		//var lxdh = $("#input[name=lxdh]").val();
		var obj = JSON.parse(sqzl.blzt.sqsxData.data);
		//lxdh.val(obj.wjcyzmsqb.zmWcjyhdssglzmxxVO.lxdh);
		lxdh = data["step_yl_form"].lxdh;
		data["step_yl_form"].lxdh=obj.wjcyzmsqb.zmWcjyhdssglzmxxVO.lxdh;
	}
};
sqzl.wcjyzmKjLxdh=function (data) {//还原联系电话数据
	if(sqzl.blzt.swsxDm == '110801' || sqzl.blzt.swsxDm == '110804'){
		data["step_yl_form"].lxdh=lxdh;
	}
};
