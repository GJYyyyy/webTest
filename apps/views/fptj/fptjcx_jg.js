$(function() {
    var swjgjc = sessionStorage.getItem("swjgdm");
    if ( swjgjc.length < 10 ) {
        addReturnLabel();
    }
	init();
});
var swjgDm;
var nsrsbh;
var nsrmc;
function init() {
    mini.parse();
    setStatusValue();
    var params = getParamFromUrl(decodeURI(window.location.href));     
	swjgDm = params.unitValue;
	nsrsbh = params.nsrsbh;
	nsrmc =  params.nsrmc;
	var status = params.status;
    var startDate = params.startDate;
    var endDate = params.endDate;
    setQueryParam(startDate, endDate, status);  
    if ( !isExist(nsrsbh)) {
		mini.get("nsrsbh_s").setValue(nsrsbh);
	} 
	if ( !isExist(nsrmc)) {
		mini.get("nsrmc_s").setValue(nsrmc);
	}
	doSearchOrder('0');
}
function onChanged(){
    doSearchOrder('0');
}

/**
 * 添加税局单位信息超链接
 */
function onAddDetailLink(e) {
	var record = e.record;
	var nsrsbh = record.nsrsbh;
    var djxh = record.djxh;
    var sqxh = record.sqxh;
	return '<a class="Delete_Button" onclick="showOrderDetail(\'' + nsrsbh + '\',\'' + djxh + '\',\'' + sqxh + '\')" href="javascript:;">详情</a>';
}

function showOrderDetail(nsrsbh, djxh, sqxh){
	window.location.href = "fp_ptfplygl.html?nsrsbh=" + nsrsbh + "&djxh=" + djxh + "&sqxh=" + sqxh;
}
/**
 * 税务机关查询
 */
var grid;
function doSearchOrder(flag){
    var nsrsbh = mini.get("nsrsbh_s").getValue();
    if (nsrsbh.toLowerCase() == "") {
        nsrsbh = "%";
    }
    var nsrmc = mini.get("nsrmc_s").getValue(); 
    if (nsrmc == "") {
        nsrmc = "%";
    } else {
        nsrmc = "%" + nsrmc + "%";
    }
    var status = mini.get("combox_status").getValue();
    var cxqxqd = getStartDate();
    var cxqxzd = getEndDate();
    if ( !check(cxqxqd, cxqxzd) ){
        return;
    }
    var url = "../../../../api/gs/wtgl/fptjgl/query_detail";
    if (flag == '0') {
        grid = mini.get(jgxxGrid);
        data = {
            'nsrsbh':nsrsbh,
            'nsrmc':nsrmc,
            'swjgdm':swjgDm,
            'clzt':status,
            'startDate':cxqxqd,
            'endDate':cxqxzd
        },
        grid.load(data);
    } else {
            getExcel("../../../../api/gs/wtgl/fptjgl/export_detail?nsrsbh=" + nsrsbh + "&nsrmc="+nsrmc+"&swjgdm="+swjgDm+"&clzt="+status+"&startDate="+cxqxqd+"&endDate="+cxqxzd+"&pageIndex=0&pageSize=0");
    }
}
function getExcel(url){
    var $eleForm = $("<form method='post' ></form>");
    $eleForm.attr("action",encodeURI(url));
    $(document.body).append($eleForm);
    //提交表单，实现下载
    $eleForm.submit();
}

/**
 * 打印格式设置
 * @type {Object}
 */
var printConfig = {
    direct: 2,           // 打印方向： 1 正向 2 横向，默认 1
    display: 1,         // 显示方向：1 正向显示，0 横向显示
    view: 1,            // 预览方式：0 适高，1 正常，2 适宽
    zoom: 'Auto-Width',
    css: '',             // 额外的css样式 config.css='table tr td{padding:0}'
    cssLink: '',      // 通过link引入的css样式文件
    style:false      // 是否引入页面的 <style></style> 标签
};

function doPrint(){
	var data = mini.get(jgxxGrid).getData();
	startPrint(data);
}

function startPrint(data) {
	LODOP = getLodop(); 
    if (!LODOP) {
        return;
    }
    var strHTML = getStrHtml();
    var textHtm = getTextHtm();
     var textHtml='<table width="1000" border="1" width="100%" cellspacing="0" cellpadding="0" bgcolor="#000000" class="mar3" style="font-size:14px;">'  
             +'         <tr bgcolor="#FFFFFF" align="center">'  
             +'               <td  align="center" >序号</td>'  
             +'               <td  align="center" >税务机关代码</td>'  
             +'               <td  align="center" >所属税务机关</td>'  
             +'               <td  align="center" >纳税人识别号</td>'  
             +'               <td  align="center" >纳税人名称</td>'  
             +'               <td  align="center" >申请时间</td>'  
             +'               <td  align="center" >受理时间</td>'  
             +'               <td  align="center" >办理状态</td>'  
             +'               <td  align="center" >受理人</td>'  
             +'               <td  align="center" >领取份数</td>'  
             +'               <td  align="center" >领用发票种类</td>'  
             +'               <td  align="center" >领取方式</td>' 
             +'       </tr>'  

	json = data;
   	var pagenum = 1;  
   	if(json.length % 15 == 0){  // 分页打印  
   	 	pagenum = json.length / 15;  
   	}else if(json.length > 15){  
   	 	pagenum =parseInt((json.length / 15).toString().split(".")) + 1;  
   	}  
   	 //LODOP.ADD_PRINT_HTM(0,10,663,"60mm","<style>  tr{height:50px;} td {font-size:13px;height:20px;} input{border:none; border:1px solid #000;}</style>"+textHtm);       
   	 for(var j = 0; j < pagenum; j++){  
        var textHtml2 = "";  
        for (var i = j * 15; (i < json.length)&&(i < (j * 15 + 15) ); i++){  
             var index = json[i].index || "";  
             var rwmc = json[i].rwmc || "";  
             var swjgdm = json[i].swjgdm || "";   
             var swjgmc = json[i].swjgmc || "";   
             var nsrsbh = json[i].nsrsbh || "";  
             var nsrmc = json[i].nsrmc || "";  
             var sqsj = json[i].sqsj || "";  
             var slsj = json[i].slsj || "";  
             var clzt = json[i].clzt || "";  
             var slrmc = json[i].slrmc || "";  
             var lqfs = json[i].lqfs || "";  
             var fpzlmc = json[i].fpzlmc || "";  
             var fs = json[i].fs || "";  


             
             //获取领用方式名称
            textHtml2 += '<tr bgcolor="#FFFFFF" align="center">'  
            +'<td >' + index + '</td>'  
            +'<td >' + swjgdm + '</td>'  
            +'<td >' + swjgmc + '</td>'
            +'<td >' + nsrsbh + '</td>'
            +'<td >' + nsrmc + '</td>'  
            +'<td >' + sqsj + '</td>'  
            +'<td >' + slsj + '</td>'  
            +'<td >' + clzt + '</td>'  
            +'<td >'+slrmc+'</td>'  
            +'<td >'+fs+'</td>'  
            +'<td >'+fpzlmc+'</td>'  
            +'<td >'+lqfs+'</td>'  
            +'</tr>'  
           }  
        strHTML = strHTML + "<tr><td>"; 
        var string1="<style>  tr{height:50px;} td {font-size:13px;height:40px;} input{border:none; border:1px solid #000;}</style>"+textHtm;  
        var string2="<style>  tr{height:50px;} td {font-size:13px;height:40px;} input{border:none; border:1px solid #000;}</style>"+textHtml+textHtml2;  
        strHTML=strHTML+string1+string2+"</table>";  
        strHTML=strHTML+"</td></tr>"; 
    }  
     print(LODOP, strHTML);
}       