/**
 * Created by ywy on 2017/2/27.
 */
var sqzl={};
var ZGMC_ZZSSSJM_SX_LIST =["SXA031900396","SXA031900394","SXA031900831","SXA031900798","SXA031900830","SXA031900832","SXA031900448",
    "SXA031900850","SXA031900395","SXA031900849","SXA031900847","SXA031900049"];
var ZGMC_ZZSJZJT_SX_LIST = ["SXA031900011"];
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
				data[targetId] = form.setData(viewData[targetId]||{});

			} else if(targetType==="datagrid"){
                targetId =  elements[i].children[0].getAttribute("id")||$(elements[i]).children(0)._id();
                if(!targetId){
                    throwError("data-view-type=datagrid 第一个子节点的id未获取到，请检查第一个子节点！");
                    return false;
                }
				var grid = mini.get(targetId);
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
sqzl.initPage = function (url,data,sxsl_store) {
    sqzl.blzt =sxsl_store ;
	var html = gldUtil.loadTemplate(url).replace(/url/g,'data-url');
	$('#dbsx_content').eq(0).append(html);
	mini.parse();

    // 执行个性化操作
    sqzl.customOptions(data);
	sqzl.setViewData(data);
	/*if(!!data && !!data['fbzl-yl-grid'] ){
		fbzlCkUrl = '../fbzl/Fbzlck.html';
		fbzldata = data['fbzl-yl-grid'];
	}*/
};
// 个性化操作都写在这个方法里面，根据税务事项代码区分
sqzl.customOptions=function (data) {
	urlParams = {urlParams : gldUtil.getParamFromUrl()};
	//287457显示申请人及手机号
	if (sqzl.blzt&&sqzl.blzt.sqsxData&&sqzl.blzt.sqsxData.sjhm) {
		$('#sjhm').text('（' + sqzl.blzt.sqsxData.sjhm + ')');
	}
    if(sqzl.blzt.swsxDm === '110809') {
        mini.get("bzzlBtn").show();
    }
	if(!!sqzl.blzt){
		 if (sqzl.blzt.swsxDm === '110209' || sqzl.blzt.swsxDm === '110221') {
	       sqzl.fply = {};
	       sqzl.fply.onmbfsRender = function (e) {
	           return "<span>" + e.value + "份/本</span>";
	       };
	       sqzl.fply.colorRender = function (e) {
	           return "<span class='text-blue'>" + e.value + e.record.jldwmc + "</span>";
	       };
	       sqzl.fply.onbs = function (e) {
	           return e.record.mbfs;
	       };
		}
        if(sqzl.blzt.swsxDm === '110401'){
            var ssyhsx = mini.decode(sxsl_store.sqsxData.data).ssjmbaVO.YHJmssqspbMxGrid.YHJmssqspbMxGridlb[0].jmsspsxDm;
            if(ssyhsx === "SXA031900226" || ssyhsx === "SXA031900244" || ssyhsx === "SXA031900297"){
                $(".hidden").show();
            }
        	if($.inArray(ssyhsx,ZGMC_ZZSSSJM_SX_LIST)>-1){
                var tabs = mini.get("tabs1");
                var tab = { title: "职工名册信息", url: '../zgmccj/zgmccjTabView.html', showCloseButton: false };
    		    tab.onload=function(e,obj){
    		    	var tabs=e.sender;
    		    	var iframe = tabs.getTabIFrameEl(e.tab);
    		    	iframe.contentWindow.initZgmccjTab(sxsl_store.djxh);
                };
                tabs.addTab(tab);
            }
        }

		if (sqzl.blzt.swsxDm === '110107') {
			//注销登录代办
			//var previewTable = new mini.Form('#previewTable');
			var zxdjxx = mini.decode(sxsl_store.sqsxData.viewData);
			//previewTable.setData(zxdjxx.step_yl_form);
			mini.get('#sjsqzjqkDataView').setData(zxdjxx.sjsqzjqkDataView);
			mini.get('#sjqtswzlqkDataView').setData(zxdjxx.sjqtswzlqkDataView);
			ajax.post("../../../../api/wtgl/public/login/session", '', function(result) {
				if (result.success && result.value) {
					data = mini.decode(result.value);
					$('#nsrjbxx').html('<tr><th>申请日期：</th><td>'+new Date().format('yyyy-MM-dd')+'</td><th>受理人：</th><td>'+data.username+'</td><th>受理日期：</th><td>'+new Date().format('yyyy-MM-dd')+'</td></tr><tr><th>受理税务机关：</th><td>'+data.swjgDm+'</td></tr>')
				} else {
					mini.alert(result.message);
				}
			});
		}
/*		if(sqzl.blzt.swsxDm === '110401'){
			var ssyhsx = mini.decode(sxsl_store.sqsxData.data).ssjmbaVO.YHJmssqspbMxGrid.YHJmssqspbMxGridlb[0].ssjmxzhzDm;
			if(ssyhsx === "SXA031900226" || ssyhsx === "SXA031900244" || ssyhsx === "SXA031900297"){
                $(".hidden").hide();
			}
		}
		if(sqzl.blzt.swsxDm === '110401' || sqzl.blzt.swsxDm === '110407' || sqzl.blzt.swsxDm === '110410' || sqzl.blzt.swsxDm === '110409'){
			if(mini.decode(sxsl_store.sqsxData.viewData)['step_yl_form'].jyfw.length < 74){
				$("#step_yl_form .mini-textarea .mini-textbox-input").css("padding-top","11px");
			}
		}*/
		/*事项跟踪里面票种核定调整*/

	}


    var pz_store = window.sxsl_store || window.sxgz_store
    /*票种核定调整*/
    if(pz_store.swsxDm === '110208'){
        // mini.get("bzzlBtn").show();

        //不存在不可调整的票种核定信息时隐藏
        var viewObj = JSON.parse(pz_store.sqsxData.viewData);
        if (viewObj['readOnlyPzhdxxGrid-show'].length === 0) {
            $('.readOnlyPzhdxxGridArea').hide();
        }
        pzhd.isHasZgkpxesp(pz_store.sqsxData);
        var nowDate = new Date().format('yyyy-MM-dd'),
            dateArr = nowDate.split('-'),
            str,agoDate;
        if(dateArr[1]*1 < 4){
            //str = dateArr[1]-3+12+" "+dateArr[2]+","+(dateArr[0]-1);
            str = (dateArr[0]-1)+"/"+(dateArr[1]-3+12)+"/"+(dateArr[2]);
        }else{
            str = (dateArr[0])+"/"+(dateArr[1]-3)+"/"+(dateArr[2]);
            //str = dateArr[1]-3+" "+dateArr[2]+","+dateArr[0];
        }
        agoDate = new Date(str);
        mini.get("tzrqq").setValue(agoDate);
        mini.get("tzrqz").setValue(nowDate);
    }
    /*票种核定首次*/
    if(pz_store.swsxDm === '110207'){
        pzhd.isHasZgkpxespSc(pz_store.sqsxData);
    }
    if(sqzl.blzt.swsxDm === '30090105'||sqzl.blzt.swsxDm === '60090105'){
        var fpxx = data['fp-yl-grid'];
        if(fpxx){
            var $yxqxTr = $(".yxqxTr");
            $.each(fpxx,function (i,v) {
                if(parseInt(v.zgkpxeDm) < 4){
                    $yxqxTr.show();
                    return false;
                }
            })
        }
    }

};

function onDrawSummaryCell(e) {
    var data = e.sender.getData();
    //客户端汇总计算
    if (e.field == "se") {
        var ybs = 0;
        $.each(data, function(i, obj){
            ybs += parseFloat( obj.se||0 );
        })
        ybs = ybs.toFixed( 2 ) ;
        e.cellHtml = "税额合计: " + ybs;
    }
}

/*票种核定调整特殊操作*/

var pzhd = {};
pzhd.isHasZgkpxesp = function(sqsxData){
    var isZgkpxesq = !!mini.decode(sqsxData.viewData)['zgkpxesp-yl-form'].sqrq;
    if(isZgkpxesq){
        mini.get("tabsPzhd").updateTab(mini.get("tabsPzhd").getTab("zgkpxesq"),{visible: true});
        mini.get("tabsPzhd").updateTab(mini.get("tabsPzhd").getTab("zgkpxesqd"),{visible: true});
    }
};
pzhd.getPzhdTz = function(qsrq, zzrq,djxh){
    $.ajax({
        url: "/dzgzpt-wsys/api/xj/pzhd/queryPzhdxx",
        type: "POST",
        data: mini.encode({
            djxh: djxh,
            qsrq: qsrq,
            zzrq: zzrq
        }),
        success: function(data){
            if(data.success){
                mini.get("jqtz-grid").setData(data.value);
            }else{
                mini.alert(data.message);
            }
        },
        error: function(error){
            mini.alert("请求错误！");
        }
    })
};
pzhd.onCzRenderer=function(e){
    var value = e.value;
    if (value=="0"){
        return "未修改";
    }else if(value=="1"){
        return "新增";
    }else if(value=="2"){
        return "修改";
    }else if(value=="3"){
        return "删除";
    }

}
pzhd.doSearch = function(){
    var pz_store = window.sxsl_store || window.sxgz_store
    pzhd.getPzhdTz(mini.get("tzrqq").getText(),mini.get("tzrqz").getText(),pz_store.sqsxData.djxh);
};
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
