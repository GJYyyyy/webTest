/**
 * Created by yuepu on 2017/5/25.
 */
var nsrxxData = {};
var fplyxxSession = {};//用于存放纳税人基本信息,票种核定信息，发票领用核定信息、发票发售信息
var nsrxxJson;
var czrxx = "";//操作人信息
var fplyFpkfkc = [];//发票库房信息保存ydh
var mailNum = '';
$(function() {
    var params = getParamFromUrl();
    var nsrsbh = params.nsrsbh;
    nsrxxData.sqxh = params.sqxh;
    nsrxxData.djxh = params.djxh;
    $("#nsrsbh").html(nsrsbh);
    queryFplyqk(nsrxxData.djxh, params.sqxh);
});

/*公共的初始化*/
function initCommon(data){
    var pageInfo = mini.decode(data.value);
    /*获取纳税人信息*/
    var nsrxx  = pageInfo.nsrxx;
    var billxx  = pageInfo.billxx;
    mailNum = nsrxx[0].mailnum;//公共变量
    initNsrxx(nsrxx[0]);
    initFpfsqk(billxx);
    setqdxxData(nsrxx[0]);
}

/*初始化发票发售情况*/
function initFpfsqk(data){
    mini.get("lgxxGrid").setData(data); //发票领购信息
    mini.get("fpfsGrid").setData(data);//发票发售信息
}
/*初始化纳税人信息*/
function initNsrxx(nsrxx){
    /*领购人信息*/
    $("#nsrmc").html(nsrxx.nsrmc);
    $("#swjg_DM").html(nsrxx.swjgmc);
    $("#gprxm").html(nsrxx.gprxm);
    $("#mobile").html(nsrxx.mobile);    
    $("#name").html(nsrxx.name);
    $("#blztdm").html(nsrxx.blztdm);
    // 设置领取方式,多种发票的领取方式一致    
    var lgfsId = nsrxx.lqfs;
    var lgfsText = "";
    if (lgfsId == "01") {
        lgfsText = "税务机关领取";
    } else if (lgfsId == "03") {
        lgfsText = '邮寄领取<a class="Delete_Button" text-decoration:underline onclick=searchPostInfo(\'' + nsrxx.sqxh + '\') style=" margin-left:3px; font-size:12px;"  href="javascript:;">显示物流状态</a>';
    } else if (lgfsId == "02" || lgfsId == "04") {
        lgfsText = "自助终端领取";
    }
    $("#lqfs").html(lgfsText);
}
//查询发票领用情况
function queryFplyqk(djxh, sqxh) {
    //var messageid = mini.loading("正在查询您的发票领用信息，请稍等", "查询领用信息");
    $.ajax({
        type : "POST",
        url : "../../../../api/gs/wtgl/fptjgl/queryGetDetail",
        data : {
            sqxh:sqxh
        },
        success : function(result) {
            var result = mini.decode(result);
            if (!result.success) {
                mini.alert(result.message);
                return;
            }
            initCommon(result);
        },
        error : function(e) {
            mini.hideMessageBox(messageid);
            mini.alert("获取普通发票领购信息失败!");
        }
    });
}

/**
 * 获取URL中的参数，适用于URL（xxx.do?param1=22&para2=ddd）执行后，跳转后的页面获取URL中的参数
 */
function getParamFromUrl(){
    var hrefs = window.location.href.split("?");
    if(hrefs.length<=1){
        return null;
    }
    var result = {};
    var params = hrefs[1].split("&");

    for(var i=0;i<params.length;i++){
        var param = params[i].split("=");
        if(param.length <= 1){
            continue;
        }
        result[param[0].trim()] = param[1].trim();
    }
    return result;
}
var printConfig = {
    direct: 2,           // 打印方向： 1 正向 2 横向，默认 1
    display: 1,         // 显示方向：1 正向显示，0 横向显示
    view: 2,            // 预览方式：0 适高，1 正常，2 适
    zoom: 'Auto-Width',
    css: '',             // 额外的css样式 config.css='table tr td{padding:0}'
    cssLink: 'http://'+ location.host +'/dzgzpt-wsys/apps-gs/views/sqgl/fplygl/fpdy.css',      // 通过link引入的css样式文件
    style: true      // 是否引入页面的 <style></style> 标签
};
//打印发票清单
function fpqdPrint() {
    $("#gply_list").find('tr').filter(':gt(0)').remove();
    $("#yzlc_list").find('tr').filter(':gt(0)').remove();
    $("#nsrlc_list").find('tr').filter(':gt(0)').remove();
    $(".yjh").html(mailNum);
    var fpfsList = mini.get("fpfsGrid").getData();
    var fpfsListHtml = '';
    for (var i=0;i<fpfsList.length;i++){
        var fpzlMc = '',fpDm = '',fpqshm = '', fpzzhm = '',hffs = '';
        if(fpfsList[i].hfbs != '0'){
            fpzlMc = fpfsList[i].fpzlmc;   //发票种类名称
            fpDm = fpfsList[i].fpzldm;       //发票代码
            fpqshm = fpfsList[i].fpqshm || '';   //发票起号
            fpzzhm = fpfsList[i].fpzzhm || '';   //发票止号
            hffs = fpfsList[i].hffs || '';   //核发本数
            fpfsListHtml += '<tr><td colspan="4">'+ fpzlMc+
                '</td><td colspan="2">'+ fpDm +
                '</td><td colspan="2">'+ fpqshm +
                '</td><td colspan="2">'+ fpzzhm +
                '</td><td colspan="2">'+ hffs +
                '</td></tr>';
        }
    }
    $("#gply_list").append(fpfsListHtml);
    $("#yzlc_list").append(fpfsListHtml);
    $("#nsrlc_list").append(fpfsListHtml);
    var printHtml = document.getElementById('fpqdxx').innerHTML;
    var LODOP = getLodop();
    if (!LODOP) {
        return;
    }
    var strBodyStyle = "<style>" + document.getElementById("printStyle").innerHTML + "</style>";
    var strFormHtml = strBodyStyle + "<body>" +  printHtml +"</body>";
    LODOP.PRINT_INIT("发票网上申领邮寄清单");
    LODOP.SET_PRINT_PAGESIZE(1, 0, 0, "A4"); //A4纸张横向打印 第一个参数 1正向，2横向
    LODOP.SET_SHOW_MODE("LANDSCAPE_DEFROTATED", 1);// 1正向显示，0横向显示
    LODOP.SET_PRINT_MODE("PRINT_PAGE_PERCENT","Auto-Width");
    LODOP.ADD_PRINT_HTM("1mm","1mm","RightMargin:1mm","BottomMargin:1mm", strFormHtml);
    LODOP.SET_PREVIEW_WINDOW(2,0,0,0,0,"申请表打印.开始打印"); // 第一个参数 0适高，1正常，2适宽，其他不要改
    LODOP.PREVIEW();
}

function setCurrentDate() {
    var currentDate;
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month > 0 && month < 10) {
        month = "0" + month;
    }
    if (strDate > 0 && strDate < 10) {
        strDate = "0" + strDate;
    }
    currentDate = year + "年" + month + "月" + strDate + "日";
    return currentDate;
}

function doBack() {
    window.history.back();
}

//给清单 填写信息
function setqdxxData(nsrxx){
    var tempData = glYdxx(nsrxx);
    var spans = $("#print-area span");
    $.each(spans,function(i,item){
        if($(item).attr("data-name")){
            $(item).html(tempData[$(item).attr("data-name")]);
        }
    });
}
/*过滤邮寄单号信息*/
function glYdxx(nsrxx){
    var date = setCurrentDate();
    var nsrxx = mini.clone(nsrxx);
    var tempData = {};
    tempData.nsrmc = nsrxx.nsrmc;
    tempData.ddh =   nsrxx.ddh;
    tempData.nsrsbh = nsrxx.nsrsbh;
    tempData.mailnum =  nsrxx.mailNum || '';
    tempData.glrxm = nsrxx.gprxm;
    tempData.cprxm = "";
    tempData.currentDate = date ;
    return tempData;
}
/**
 *显示物流信息
 */
function searchPostInfo(sqxh){
    window.location.href = "yjqk.html?sqxh=" + sqxh;
}