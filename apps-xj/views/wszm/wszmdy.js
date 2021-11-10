var csgWszmObject = {};
var fphmInput;
var fpdmInput;
var savePrintBtn;
var zfBtn;
var fpxx=[];
var searchWszmXxObject={};
var isOnlyZf=true;
var searchForm;
var wszmxxForm;
var showTip=[1,2,3,4,5,6,7,8,9,10,20,30,40,50];
csgWszmObject.urlObject = {
    Api:function () {
        return function () {
            var baseUrl = '/dzgzpt-wsys/api',
                realUrl = {
            		queryWszmXx:'/wtgl/cgs/wszm/queryWszmXx',
            		zfWszmXx:'/wtgl/cgs/wszm/zfClgzsWszmXx',
            		saveWszmXx:'/wtgl/cgs/wszm/bcClgzsWszmXx',
            		getTxm:'/wtgl/cgs/wszm/getTxm'
                }
            for (var url in realUrl) {
                realUrl[url] = baseUrl + realUrl[url];
            }
            return realUrl;
        }();
    }()
}
$(function () {
    mini.parse();
    init();
});

function init(){
    fphmInput = mini.get("fphm");
    fpdmInput = mini.get("fpdm");
    savePrintBtn=mini.get("savePrint");
    zfBtn=mini.get("zf");
    searchForm = new mini.Form("#searchdiv");
    wszmxxForm = new mini.Form("#wszmxxdiv"); 
}

csgWszmObject.searchValue=function(){
	var fpdm=fpdmInput.getValue();
	var fphm=fphmInput.getValue();
	if(fpdm.indexOf(",")>=0){
		fpxx=fpdm.split(",");
	}else if(fphm.indexOf(",")>=0){
		fpxx=fphm.split(",");
	}else{
		return;
	}
	fpdmInput.setValue(fpxx[2]);
	fphmInput.setValue(fpxx[3]);
}
function search(){
	var fphmVar=fphmInput.getValue();
	var fpdmVar=fpdmInput.getValue();
	if(!searchForm.validate()){
		return;
	}
	var messageid = mini.loading("数据处理中，请稍等 ...","提交中");
	var requestParam={
			"fphm":fphmInput.getValue(),
			"fpdm":fpdmInput.getValue()
	}
  	$.ajax({
		type:"post",
		url:csgWszmObject.urlObject.Api.queryWszmXx,
		data :mini.encode(requestParam),
		contentType : "application/json;charset=utf-8", // 默认为
		async:true,
		success : function(result){
			if(result.success){
				mini.hideMessageBox(messageid);
				isOnlyZf=false;
				searchWszmXxObject=result.value.response;
				if(searchWszmXxObject.sbcgsWszmffResVO.sbcgswszmvo.wspzhm=="" || searchWszmXxObject.sbcgsWszmffResVO.sbcgswszmvo.wspzhm==null || "0"==searchWszmXxObject.sbcgsWszmffResVO.reCode){
					mini.alert("您没有票证结存，请确认后重试。");
					return;
				}
				if( "3"==searchWszmXxObject.sbcgsWszmffResVO.reCode){
					isOnlyZf=true;
				}
				var gt3Wszmhm=searchWszmXxObject.sbcgsWszmffResVO.sbcgswszmvo.wspzhm;
				var gt3clsbh=searchWszmXxObject.sbcgsWszmffResVO.sbcgswszmvo.clsbdh;
				var gt3nsrmc=searchWszmXxObject.sbcgsWszmffResVO.sbcgswszmvo.nsrmc;
				var gt3Cphm=searchWszmXxObject.sbcgsWszmffResVO.sbCgsSbbxblsbJHVO.clcpxh;
				var gt3Fdjh=searchWszmXxObject.sbcgsWszmffResVO.sbCgsSbbxblsbJHVO.fdjhm;
				var gt3Jbr=result.value.slrMc;
				var gt3Zsswjg=result.value.zsjgMc;
				setFpxxData(gt3clsbh,gt3Wszmhm,gt3nsrmc,gt3Cphm,gt3Fdjh,gt3Jbr,gt3Zsswjg);
				if(isOnlyZf){
					mini.alert("此车辆已发放完税证明，完税证明号码:"+gt3Wszmhm);
					savePrintBtn.enabled=false;
					zfBtn.enabled=true;
					savePrintBtn.addCls("noClick");
					zfBtn.removeCls("noClick");
				}else{
					savePrintBtn.enabled=true;
					zfBtn.enabled=false;
					savePrintBtn.removeCls("noClick");
					zfBtn.addCls("noClick");
				}
			}else{
				mini.hideMessageBox(messageid);
				mini.alert(result.message);
			}
		},
		error : function(){
			mini.hideMessageBox(messageid);
			mini.alert("异常错误，稍后再试！");
		}
	});
}

function zf(){
	if(!wszmxxForm.validate()){
		return;
	}
	var messageid = mini.loading("数据处理中，请稍等 ...","提交中");
	mini.confirm("确定作废完税证明吗？","确定",
			function(action) {
		if (action == "ok") {
			var requestParam={
					"sbCgsWszmPzxxVO":mini.encode(searchWszmXxObject.sbcgsWszmffResVO.sbCgsWszmPzxxVO),
					"SbCgsSbbxblsbJHVO":mini.encode(searchWszmXxObject.sbcgsWszmffResVO.sbCgsSbbxblsbJHVO),
					"SBCgsWszmJHVO":mini.encode(searchWszmXxObject.sbcgsWszmffResVO.sbcgswszmvo)
			}
			$.ajax({
				type:"post",
				url:csgWszmObject.urlObject.Api.zfWszmXx,
				data :mini.encode(requestParam),
				contentType : "application/json;charset=utf-8", // 默认为
				async:true,
				success : function(result){
					if(result.success){
						mini.hideMessageBox(messageid);
						mini.alert("作废成功!","提示",function(){
							reset();
						});
					}else{
						mini.hideMessageBox(messageid);
						mini.alert(result.message);
					}
				},
				error : function(){
					mini.hideMessageBox(messageid);
					mini.alert("异常错误，稍后再试！");
				}
			});
		} else {
			return;
		}
	});
}

function savePrint(){
	if(!wszmxxForm.validate()){
		return;
	}
	var messageid = mini.loading("数据处理中，请稍等 ...","提交中");
	var requestParam={
			"sbCgsWszmPzxxVO":mini.encode(searchWszmXxObject.sbcgsWszmffResVO.sbCgsWszmPzxxVO),
			"SBCgsWszmJHVO":mini.encode(searchWszmXxObject.sbcgsWszmffResVO.sbcgswszmvo),
			"SbCgsSbbxblsbJHVO":mini.encode(searchWszmXxObject.sbcgsWszmffResVO.sbCgsSbbxblsbJHVO)
	}
	$.ajax({
		type:"post",
		url:csgWszmObject.urlObject.Api.saveWszmXx,
		data :mini.encode(requestParam),
		contentType : "application/json;charset=utf-8", // 默认为
		async:true,
		success : function(result){
			if(result.success){
				var ewtmc=result.value.response.sbcgsWszmffSaveResVO.ewtmc;
				var ewtmt=result.value.response.sbcgsWszmffSaveResVO.ewtmt;
				var dysj=result.value.dysj;
				mini.hideMessageBox(messageid);
				var kdyLength=searchWszmXxObject.sbcgsWszmffResVO.wszmhmSelGrid.wszmhmSelGridlb.length;
				var tipMessageBegin="您当前的空白完税证明结存"+(kdyLength-1)+"张";
				var tipMessageEnd="请将完税证明:"+mini.get("wszmhm").getValue()+"放入打印机进行打印";
				var tipMessageMiddle="";
				$.each(showTip,function(i,val){
					if(val==kdyLength){
						tipMessageMiddle="请及时补充空白完税证明!";
						return false;
					}
				});
				mini.alert("保存成功!"+tipMessageBegin+","+tipMessageMiddle+tipMessageEnd,"提示",function(){
				openDy(ewtmt,ewtmc,dysj);
				});
			}else{
				mini.hideMessageBox(messageid);
				mini.alert(result.message);
			}
		},
		error : function(){
			mini.hideMessageBox(messageid);
			mini.alert("异常错误，稍后再试！");
		}
	});
}

function reset(){
	wszmxxForm.reset();
	searchForm.reset();
	savePrintBtn.enabled=true;
	zfBtn.enabled=true;
	savePrintBtn.removeCls("noClick");
	zfBtn.removeCls("noClick");
	
}

function setFpxxData(tempClsbh,tempWszmhm,tempNsrmc,tempCphm,tempFdjh,tempJbr,tempZsswjg){
	mini.get("clsbh").setValue(tempClsbh);
	mini.get("wszmhm").setValue(tempWszmhm);
	mini.get("nsrmc").setValue(tempNsrmc);
	mini.get("cphm").setValue(tempCphm);
	mini.get("fdjh").setValue(tempFdjh);
	mini.get("jbr").setValue(tempJbr);
	mini.get("zsswjg").setValue(tempZsswjg);
}

function openDy(ewtmt,ewtmc,dysj){
	var dyData=wszmxxForm.getDataAndText(true);
	mini.open({
        url: 'dy.html',
        title: '车购税完税证明打印',
        width: 1200,
        height: 600,
        allowResize: true,
        allowDrag: true,
        onload: function () {
            var iframe = this.getIFrameEl();
            iframe.contentWindow.initData(dyData,ewtmt,ewtmc,dysj);
        },
        ondestroy: function (action) {
        	var requestParam={
        			"clsbh":dyData.clsbh
        	}
        	$.ajax({
        		type:"post",
        		url:'/dzgzpt-wsys/api/wtgl/cgs/wszm/deleteTxm',
        		data :mini.encode(requestParam),
        		contentType : "application/json;charset=utf-8", // 默认为
        		async:true,
        		success : function(result){
        		},
        		error : function(){
        		}
        	});
        	reset();
        }
    });
}
/* 下载操作手册 */
function downloadWord () {
	window.open(location.protocol + '//' + location.host + '/dzgzpt-wsys/api/wtgl/cgs/wszm/download/cgsdyjsz');
}