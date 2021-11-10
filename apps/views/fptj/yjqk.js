var yjjk = {};
$(function(){
    var params = getParamFromUrl();
    var sqxh = params.sqxh;
    getYjpsInfo(sqxh);
});

function getYjpsInfo(sqxh) {
	var url = '../../../../api/gs/wtgl/fptjgl/query/yjqk/'+sqxh;
   $.ajax({
        type : "POST",
        url : url,
        "success" : function(result) {
	        if(result.success){
	            var yjFpCxResponseVo = result.value;
	            if (yjFpCxResponseVo){
	            	$(".yjhm").html(yjFpCxResponseVo.yjhm);
	            	var data = yjFpCxResponseVo.tdxx;
	            	showInfo(data);
	            }
	        } else {
				$(".mh-list").append("无物流信息," + result.message);
	        }
        },
        "error" : function(e) {
				$(".mh-list").append("无物流信息," + result.message);
        }
    });
}
function showInfo(dataJson){
	var strHtml = "";
	strHtml = strHtml + "<ul>";
	for (var i = 0; i < dataJson.length; i++ ) {
			if (i != dataJson.length - 1 ){
				strHtml = strHtml + "<li>"
				+	"<p>"+ dataJson[i].clsj +"</p>"
				+   "<p>地点：  " + dataJson[i].clhj + "</p>"
				+   "<p>" + dataJson[i].clms + "</p>"
				+   "<span class=\"before\"></span><span class=\"after\"></span>"
                +   "</li>";
			}else {
				strHtml = strHtml + "<li class=\"first\">"
				+	"<p>"+ dataJson[i].clsj +"</p>"
				+   "<p>" + dataJson[i].clhj + "</p>"
				+   "<p>" + dataJson[i].clms + "</p>"
				+   "<span class=\"before\"></span><span class=\"after\"></span><i class=\"mh-icon mh-icon-new\"></i>"
                +   "</li>";
			}
	}	
	strHtml = strHtml + "</ul>";
	$(".mh-list").append(strHtml);
}
/**
 * 获取URL中的参数，适用于URL（xxx.do?param1=22&para2=ddd）执行后，跳转后的页面获取URL中的参数
 */
function getParamFromUrl(){
    var hrefs = decodeURI(window.location.href).split("?");
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