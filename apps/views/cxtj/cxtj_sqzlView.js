/**
 * Created by ywy on 2017/2/27.
 */
var cxtj_sqzl={};
var lxdh="";
cxtj_sqzl.blzt = window.sxsl_store;
cxtj_sqzl.content = $('#dbsx_content');
cxtj_sqzl.setViewData=function(viewData) {
	
	if (!viewData || $.isEmptyObject(viewData)) {
		mini.alert('未获取到申请资料数据', '提示');
		return false;
	} else {
		cxtj_sqzl.content.show();
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
cxtj_sqzl.initPage = function (url,data) {
	var html = gldUtil.loadTemplate(url).replace(/url/g,'data-url');
	$('#dbsx_content').eq(0).append(html);
	mini.parse();
	
    // 执行个性化操作
	cxtj_sqzl.customOptions(data);
	cxtj_sqzl.setViewData(data);
	//还原联系电话
	cxtj_sqzl.wcjyzmKjLxdh(data);
	$("#dbsxbutton").hide();
	/*if(!!data && !!data['fbzl-yl-grid'] ){
		fbzlCkUrl = '../fbzl/Fbzlck.html';
		fbzldata = data['fbzl-yl-grid'];
	}*/
};
// 个性化操作都写在这个方法里面，根据税务事项代码区分
cxtj_sqzl.customOptions=function (data) {
    // 个体工商户定额核定
    if(cxtj_sqzl.blzt.swsxDm=='110123'){
        var Tab = mini.get('tabsYlForm');
        var tabs = Tab.tabs;
        for (var i=0;i<tabs.length;i++){
            var dataName = tabs[i].name+'ViewForm';
            if(!data.hasOwnProperty(dataName)){
                Tab.removeTab(tabs[i].name);
                i--;
            }
        }
    }else if(cxtj_sqzl.blzt.swsxDm == '110801'){//外出经营证明显示联系电话
     	//var lxdh = $("#input[name=lxdh]").val();
    	var obj = JSON.parse(cxtj_sqzl.blzt.sqsxData.data);
    	//lxdh.val(obj.wjcyzmsqb.zmWcjyhdssglzmxxVO.lxdh);
    	lxdh = data["step_yl_form"].lxdh;
    	data["step_yl_form"].lxdh=obj.wjcyzmsqb.zmWcjyhdssglzmxxVO.lxdh;
    }
};
cxtj_sqzl.wcjyzmKjLxdh=function (data) {//还原联系电话数据
   if(cxtj_sqzl.blzt.swsxDm == '110801'){
    	data["step_yl_form"].lxdh=lxdh;
    }
};
