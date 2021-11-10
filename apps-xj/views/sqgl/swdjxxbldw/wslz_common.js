var WSLZ_BLZT_DM={};
/** 待受理 */
WSLZ_BLZT_DM.BLZT_DSL ="00";
/** 受理通过 */
WSLZ_BLZT_DM.BLZT_SLTG ="01";
/** 不予受理 */
WSLZ_BLZT_DM.BLZT_SLBTG ="02";
/** 待审批 */
WSLZ_BLZT_DM.BLZT_DSP ="03";
/** 审批通过 */
WSLZ_BLZT_DM.BLZT_SPTG ="04";
/** 审批不通过 */
WSLZ_BLZT_DM.BLZT_SPBTG ="05";
/** 补正资料 */
WSLZ_BLZT_DM.BLZT_BZZL ="06";
/** 待缴税 */
WSLZ_BLZT_DM.BLZT_DJS ="07";
/** 待税种认定 */
WSLZ_BLZT_DM.BLZT_DSZRD = "08";
/** 税费种认定完成后给文书处理平台发送的状态，税种认定完结，更新状态仍然为BLZT_SPTG */
WSLZ_BLZT_DM.BLZT_SZRDBJ = "09";
/** 以保存ctais'待开票* */
WSLZ_BLZT_DM.BLZT_YBCDKP = "20";

/** 以保存ctais'普通发票代开完结* */
WSLZ_BLZT_DM.BLZT_PPDK_YJSWJ = "21";// blzt

/** 以保存ctais'普通发票代开免税打代开完结* */
WSLZ_BLZT_DM.BLZT_PPDK_MSDKWJ = "22";//

// 新增的网厅管理的类型，目前有发票领用
var sllx3 = {"110209":"/XjWslz/pages/wtgl/fpgl/fp_ptfplygl.html"};

function getParamFromUrl(){
	var hrefs = window.location.href.split("?");
	if(hrefs.length<=1){
		return null;
	}
	var result = {};
	var params = hrefs[1].split("&");
	
	for(var i=0;i<params.length;i++){
		var param = params[i].split("=");
		if(param.length<=1){
			continue;
		}
		result[param[0].trim()] = param[1].trim();
	}
	return result;
}


$(document).ajaxComplete(function (evt, request, settings) {
	 var text = request.responseText;
    if (text == "'notlogin'") {
        mini.alert("登录超时，请重新登录。","提示信息",function (){
        	window.parent.location.href("/");
        });
    }
})

