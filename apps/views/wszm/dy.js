function initData(dyData,ewtmt,ewtmc,dysj){
	var requestParam={
			"ewtmt":ewtmt,
			"clsbh":dyData.clsbh
	}
	$.ajax({
		type:"post",
		url:'/dzgzpt-wsys/api/wtgl/cgs/wszm/getTxm',
		data :mini.encode(requestParam),
		contentType : "application/json;charset=utf-8", // 默认为
		async:true,
		success : function(result){
			if(result.success){
				$("#txm").attr("src",dyData.clsbh+".jpg");
				$("#txm2").attr("src",dyData.clsbh+".jpg");
				doResult(dyData,dysj);
			}else{
				mini.alert(result.message);
			}
		},
		error : function(){
			mini.alert("异常错误，稍后再试！");
		}
	});
}
function doResult(dyData,dysj){
	$("#nsrmc").html(dyData.nsrmc);
 	$("#cphm").html(dyData.cphm);
 	$("#fdjh").html(dyData.fdjh);
 	$("#clsbh").html(dyData.clsbh);
 	$("#jbr").html(dyData.jbr);
 	$("#zsswjg").html(dyData.zsswjg);
 	$("#wszmhm").html(dyData.wszmhm);
 	$("#nsrmc2").html(dyData.nsrmc);
 	$("#cphm2").html(dyData.cphm);
 	$("#fdjh2").html(dyData.fdjh);
 	$("#clsbh2").html(dyData.clsbh);
 	$("#jbr2").html(dyData.jbr);
 	$("#zsswjg2").html(dyData.zsswjg);
 	$("#rq").html(dysj);
 	$("#rq2").html(dysj);
    $("#mainTable").jqprint({//这里要加入兼容性JS
    	importCSS : true,
    	printContainer : true
    });
}

function printZm(){
	  $("#mainTable").jqprint({//这里要加入兼容性JS
	    	importCSS : true,
	    	printContainer : true
	    });
}

function onCancel(action){
	if (window.CloseOwnerWindow){
		return window.CloseOwnerWindow(action);
	}else{
		window.close();
	}
}