
var grid,query,swjgMap={};

function showsearch() {
	if ($(".searchdiv").is(":hidden")) {
		$(".searchdiv").slideDown();
        $('.searchC').html('隐藏查询条件');
	} else {
		$(".searchdiv").slideUp();
        $('.searchC').html('显示查询条件');
	}
}


function tzztRenderer(e){
    var shzt=e.value;
    if(!shzt){
        return ''
    }

    if(shzt==='00'){
        return '待审批';
    }
    if(shzt==='01'){
        return '审核通过';
    }

    if(shzt==='02'){
        return '审核不通过';
    }
}

function onActionRenderer(e){
    var record = e.record;
    if(record.xzzt==='02'){
        return '————'
    }
    var tz_url = "tz.html?taskid="+record.taskid;
    var html=""
    if(record.shzt==='00'){
        if(query.spbz==='Y'){
            html+=('<a href="'+tz_url+'&sp=Y'+'" onclick="sp(record);">审批</a>&nbsp;&nbsp;');
        }
        html+=('<a onclick="cktzxx(record);">查看调整信息</a>&nbsp;&nbsp;');
    }else if(record.shzt==='01'||record.shzt==='02'){
        html+=('<a onclick="cktzxx(record);">查看调整信息</a>&nbsp;&nbsp;');
        if(query.spbz!=='Y'){
            html+=('<a href="'+tz_url+'" onclick="tz(record);">调整</a>&nbsp;&nbsp;');
        }
    }else{
        if(query.spbz!=='Y'){
            html+=('<a href="'+tz_url+'" onclick="tz(record);">调整</a>&nbsp;&nbsp;');
        }
    }

    return '<span>'+html+'</html>';
}

// function xzlxRenderer(e){
//     var fxhcxzcsDm=e.value;
//     if(fxhcxzcsDm==='01'){
//         return '限制发票升版增量'
//     }
//     if(fxhcxzcsDm==='02'){
//         return '限制网上申报'
//     }
// }


function xgrRenderer(e){
    var tznr=e.record.tznr;
    if(tznr){
        return mini.decode(tznr).tzrMc||'';
    }else{
        return ''
    }
}



function init() {
    mini.parse();
    grid = mini.get("dbsxGrid");
    grid.setUrl("/sxsq-wsys/api/fxhc/xzcs/list");
    grid.on('beforeload', function (e) {
        e.contentType = 'application/json;charset=utf-8';
        // e.data.pageNum=e.data.pageIndex+1;
        // e.data.pageIndex=e.data.pageIndex+1;
        delete e.data['value.pageNum'];
        delete e.data['value.pageSize'];
        e.data['spbz']=query.spbz?'Y':'';
        e.data['fxhcxzcsDmList']=!e.data['fxhcxzcsDm']?null:e.data['fxhcxzcsDm'].split(",");
        e.data = mini.encode(e.data);
    });
    doSearch($);
}

function doSearch(th) {

    var form = new mini.Form("#cxtjForm");
    var formData = form.getData(true);

    if( formData.fxhcxzcsDm==='00'){
        formData.fxhcxzcsDm='';
    }

    grid.load(formData, function () {
        // $(".searchdiv").slideUp();
    }, function (data) {
        var obj = JSON.parse(data.errorMsg);
        mini.alert(obj.message || "系统异常,请稍后再试。")
    });

}
function onvaluechangedXzcs(e){
    if(e.value.indexOf("00")>-1&&e.value.indexOf(",")>-1){
        mini.get("fxhcxzcsDm").setValue(e.value.substr(3));
    }
}
function sp(){
    store.setSession('tzData',mini.encode(record));
}

function tz(record){
    store.setSession('tzData',mini.encode(record));
}
function cktzxx(record){
    $.get("/sxsq-wsys/api/fxhc/xzcs/"+record.taskid+"/history","",function(res){
        if(res.success){
            data=res.value||[];
            renderLsxx(data);
        }else{
            mini.alert("查询调整信息失败！");
        }
    });
    mini.get("history-win").show();
}
function renderLsxx(array){
    $(".lsxx").empty();
    var html="";

    $.each(array,function(i,v){
        var fxhcxzcsTzmxList=mini.decode(v.tznr).fxhcxzcsTzmxList||[];
        var strVar = "";
        strVar += "<div class=\"lsxx\">\n";
        strVar += "	<div class=\"lsxxDiv\">\n";
        strVar += "		<p>\n";
        strVar += "			<b>调整时间：<\/b>"+new Date(v.tzsj).format('yyyy年MM月dd日')+"<span class=\"sxz "+(v.shzt==='01'?'sptg':'')+"\">生效中<\/span>\n";
        strVar += "		<\/p>\n";
        strVar += "		<p class=\"xzcs\">\n";
        strVar += "			<span><b>措施<\/b><\/span>\n";
        strVar += "			<span><b>调整后时间<\/b><\/span>\n";
        strVar += "		<\/p>\n";

        $.each(fxhcxzcsTzmxList,function(ii,vv){
            if(vv.fxhcxzcsDm==='02'){
                strVar += "		<p class=\"xzcs\">\n";
                strVar += "			<span>&nbsp;限制网上申报<\/span>\n";
                strVar += "			<span>"+vv.xzqz+"<\/span>\n";
                strVar += "		<\/p>\n";
            }

            if(vv.fxhcxzcsDm==='01'){
                strVar += "		<p class=\"xzcs\">\n";
                strVar += "			<span>&nbsp;限制网上升版增量<\/span>\n";
                strVar += "			<span>"+vv.xzqz+"<\/span>\n";
                strVar += "		<\/p>\n";
            }
        });

        strVar += "		<p>\n";
        strVar += "			<b>调整原因：<\/b>"+v.tzyy+"\n";
        strVar += "		<\/p>\n";
        strVar += "		<p>\n";
        strVar += "			<span><b>调整人：</b>"+(mini.decode(v.tznr).tzrMc||'')+"<\/span>&nbsp;&nbsp;\n";
        strVar += "			<span><b>审批结果：</b>"+(v.shzt==='00'?'待审批':(v.shzt==='01'?'通过':'不通过'))+"<\/span>&nbsp;&nbsp;\n";
        strVar += "			<span><b>审批人：</b>"+(v.shbz?v.shbz.split("【审核人】:")[1]:'无')+"<\/span>&nbsp;&nbsp;\n";
        strVar += "			<span><b>审批时间：</b>"+(v.shsj?new Date(v.shsj).format('yyyy年MM月dd日'):'')+"<\/span>\n";
        strVar += "		<\/p>\n";
        strVar += "	<\/div>\n";
        strVar += "<\/div>\n";

        html+=strVar;
    
    });

    $(".lsxx").append(html);
    $(".sptg").first().show();//显示最后一个审批通过的
  
}

/**
 * 重置查询条件
 */
function doReset() {
    var form = new mini.Form("#cxtjForm");
    form.reset();
}




$(function () {
    query=gldUtil.getParamFromUrl()||{};
    init();
    $(".search").click(function() {
		showsearch();
	});
});