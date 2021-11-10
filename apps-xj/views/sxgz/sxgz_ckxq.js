var sxgz ;
var sxgz_store;
var sxgzFlag=false;
function querySwsxsqJbxx(lcslId) {
	var params = {
		rwlxDm : '01',
		lcslId : lcslId
	};
	var data = null;
	ajax.get("../../../../api/wtgl/dbsx/queryWssqJbxx", params, function(result) {
		if (result.success && result.value) {
			data = result.value;
		} else {
			mini.alert(result.message);
			return false;
		}
	});
	return data;
};
function queryWssqxxData(sqxh) {
	var params = {
		sqxh : sqxh
	};
	var data = null;
	ajax.post("../../../../api/wtgl/dbsx/queryWssqViewData", params, function(result) {
		if (result.success && result.value) {
			data = mini.decode(result.value);
		} else {
			mini.alert(result.message);
			return false;
		}
	});
	return data;
};
function initSxslPage(data) {
	var flag = true;
	if (!!data) {
		// 头部加入受理名称
		$("#swsxMc").text(data.swsxMc);
		// 基本信息中加入查出的信息
		$('#nsrjbxx span').each(function(i, v) {
			$(v).text(data[$(v).attr('id')]);
		});
		//事项跟踪标志
		sxgzFlag = sxgz.urlParams.sxgzFlag;
		// 将数据存到对应的对象中
		sxgz_store.lcslId = sxgz.urlParams.lcslId;
		sxgz_store.rwbh = sxgz.urlParams.rwbh;
		// 补录资料URL地址，为空说明不需要补录：
		sxgz_store.sqxh = data.sqxh;
		sxgz_store.swsxDm = data.swsxDm;
		sxgz_store.nsrsbh = data.sqr;
		sxgz_store.sxshfsDm = data.sxshfsDm;
		//sxgz_store.nsrmc=data.nsrmc;
		fbzlSqxh = data.sqxh;
		sxgz_store.rwztDm = data.rwztDm;
		sxgz_store.djxh = data.djxh;
		// 加载信息特色信息
		ajax.get('../../data/swsxDm.json', {}, function(responseJson) {
			responseJson = mini.decode(responseJson);
			sxgz_store.ylUrl = responseJson[sxgz_store.swsxDm].ylView;
			sxgz_store.ylJs = responseJson[sxgz_store.swsxDm].ylJs;
			sxgz_store.blzlUrl = responseJson[sxgz_store.swsxDm].blxx;
		})
		var tabs = mini.get("tabs-sxgz");
		// 附报资料Tab页加载
		var fbzlTab = tabs.getTab(1);
		tabs.loadTab("../fbzl/fbzlPage.html", fbzlTab);
		//加载受理信息页面
		var html = loadTabTemplate("slxx.html");
		mini.parse($('#tabs-sxgz'));

		//初始化 文书申请信息
		sxgz_store.sqsxData = queryWssqxxData(sxgz_store.sqxh);
		sxgz_store.sqsxData = mini.decode(sxgz_store.sqsxData);

		var tab = {title: "受理信息",name:"2"};
        tab = tabs.addTab(tab);
        var el = tabs.getTabBodyEl(tab);
        el.innerHTML = html;
        initSlxxPage(sxgz_store);
		if (!sxgz_store.sqsxData.viewData) {
			flag = false;
		} else {
			// 加载预览页面js
			if (!!sxgz_store.ylJs) {
				gldUtil.loadScript(sxgz_store.ylJs);
			}
			sqzl.initPage(sxgz_store.ylUrl+"?sxgzFlag="+sxgzFlag, mini
					.decode(sxgz_store.sqsxData.viewData),sxgz_store);
		}
		/**
         * 50292 【全国】【增值税即征即退备案】增加【备案通知书】
         */
        if (swsxdm === '110407' && ['01', '03', '04', '05', '09'].indexOf(sxgz_store.sqsxData.blztDm) > -1) {
			$('#download').after('<a href="javascript:void(0)" id="downloadBatzs" class="mini-button" style="padding:1px 10px;margin-left:20px">备案通知书</a>')
			$('body').on('click', '#downloadBatzs', function(){
				window.open('/hgzx-gld/api/yh/zzsjzjt/getBatzsPdf/' + sqxh)
			});
        }
	}
	return flag;
};
$(function() {
	mini.parse();
	sxgz = {urlParams : gldUtil.getParamFromUrl()};
	sxgz_store = {tmp:""};
	var data = querySwsxsqJbxx(sxgz.urlParams.lcslId);
	var result = initSxslPage(data);
	if (!result) {
		mini.alert("初始化页面失败，申请信息为空！");
	}
	sxgzCustomOptions();
});

//受理信息部分单独处理了
/**
 * 加载html模板
 * */
function loadTabTemplate(url) {
    var html='';
    $.ajax({
        url: url,
        type: 'GET',
        async: false,
        dataType: 'html',
        success: function (response) {
            html = response;
        },
        error: function () {
            console.log('加载html出错');
        }
    });
    return html;
}
function getSwjgmc(swjgdm) {
	var swjgmc = "";
	ajax.get("/dzgzpt-wsys/api/baseCode/get/baseCode2CombSelect2/DM_GY_SWJG_GT3", {}, function(result) {
			if(!!result){
				for(var i=0;i<result.length;i++){
					if(result[i].ID===swjgdm){
						swjgmc=result[i].MC;
					}
				}
			}
	});
	return swjgmc;
}

function getSwsxtzsNr(sqxh) {
	var swsxtzs="";
	ajax.get("../../../../api/xj/wtgl/sxgz/getSwsxtzs/"+sqxh, {}, function(result) {
			if(result.success){
				if(result.value.length>0 && !!result.value[0]){
					swsxtzs= result.value[0].swsxtzsnr;
				}
			}
	});
	return swsxtzs;
}

var sqxh="";
var swsxdm="";
var blztDm="";
function initSlxxPage(sxgz_store) {
	mini.parse();
	sqxh=sxgz_store.sqxh;
	swsxdm=sxgz_store.swsxDm;
	blztDm = sxgz_store.sqsxData.blztDm;
  var slxx =mini.decode(sxgz_store.sqsxData.data);
  var blxx=mini.decode(slxx.blxx);
  $("#slswjg").text(getSwjgmc(blxx==undefined ? "":blxx.slswjgDm));
  $("#slr").text(blxx==undefined ? "":blxx.slrDm);
//需求让改成是通知数据中的内容，不是状态名称 根据流程实例id和办理状态代码获取通知书内容
  $("#sljg").text(getSwsxtzsNr(sxgz_store.sqxh));
  //$("#sljg").text(sxgz_store.sqsxData.blztMc);
  $("#slrq").text(blxx==undefined ? "":blxx.slrq);
  if(isShowButton(blztDm,swsxdm)){//如果是受理中，受理通过和一照一码不显示下载通知书按钮。因为没有通知书
	 $('#download').hide();
  }
  if( swsxdm !== '110407' || (swsxdm === '110407' && blztDm !== '01')){
	  mini.get('#zzsjzjtDownLoadBtn').hide()
  }
  
};
function isShowButton(blztDm,swsxDm){
	var arr = new Array('00', '01', '03','04','05','07','08','10','30','31','32','99','12','11','15','33','34');  //没有通知书的状态
	if(contains(arr,blztDm)||swsxDm=="110101"||swsxDm=="110121"||swsxDm =='110207'){
		return true
	}
	return false;
}
function contains(arr, obj) {
    var i = arr.length;
    while (i--) {
        if (arr[i] === obj) {
            return true;
        }
    }
    return false;
}
function doBack() {
	// window.history.go(-1);
    if (window.CloseOwnerWindow)
        return window.CloseOwnerWindow('ok');
    else
        window.close();
}
// $('body').on('click', '#download', function(){
// 		window.open('/dzgzpt-wsys/api/xj/wtgl/sxgz/tzspdf/download/' + sqxh+'/'+swsxdm+'/'+blztDm);
// });
function sxgzCustomOptions(){
	if(!!sxgz_store){
		if(sxgz_store.swsxDm === '110401'){
            var ssyhsx = mini.decode(sxgz_store.sqsxData.data).ssjmbaVO.YHJmssqspbMxGrid.YHJmssqspbMxGridlb[0].jmsspsxDm;
            if(ssyhsx === "SXA031900226" || ssyhsx === "SXA031900244" || ssyhsx === "SXA031900297"){
                $(".hidden").show();
            }
		}
	}

}



function download(){
	window.open('/hgzx-gld/api/yh/zzsjzjt/getBatzsPdf/' + sxgz_store.sqxh);
}