/**
 * 设置起始结束时间
 */
function setQueryParam(startDate, endDate, status){
    var cxqxZ = mini.get("cxqxZ");
    if (isExist(endDate)) {
        cxqxZ.setValue(new Date());
    } else {
        cxqxZ.setValue(endDate);
    }
    var cxqxQ = mini.get("cxqxQ");
    if (isExist(startDate)) {
        cxqxQ.setValue(new Date().getFullYear()+'-1-1');
    } else {
        cxqxQ.setValue(startDate);
    }
    if (!isExist(status)) {
        mini.get("combox_status").setValue(status);
    } else {
        mini.get("combox_status").setValue('%');
    }
    return;
}
/**
 * 设置查询状态
 */
function setStatusValue() {
    var status = [
        { "id": "%", "text": "全部" },
        { "id": "0", "text": "待处理" },
        { "id": "1", "text": "处理成功" },
        { "id": "9", "text": "处理失败" },        
        { "id": "2", "text": "不予受理" },
        { "id": "3", "text": "撤销" },
    ]
    var obj = mini.get("combox_status");
    if (obj != null) {
       obj.setData(status);
    }
}
/**
 * 初始化 选项卡信息
 * @param  {[type]} cityCode [description]
 * @return {[type]}          [description]
 */
function initCityInfo(cityCode){
    $.ajax({  
        type:"post",
        url:"../../../../api/gs/wtgl/fptjgl/list_district", 
        data:{
            code:cityCode
        },
        dataType:'json',  
        success:function(data) {  
            var obj = mini.get("combox_citys");
            obj.setData(data);
        },  
        error:function() {   
          alert("信息加载失败，请重试！");  
        }
    });
}
//验证日期（判断结束日期是否大于开始日期）日期格式为YY—MM—DD  
function check(startTime,endTime){              
    if(startTime.length>0 && endTime.length>0){     
        var startTmp=startTime.split("-");  
        var endTmp=endTime.split("-");  
        var sd=new Date(startTmp[0],startTmp[1],startTmp[2]);  
        var ed=new Date(endTmp[0],endTmp[1],endTmp[2]);  
        if(sd.getTime() > ed.getTime()){   
            alert("开始日期不能大于结束日期");     
            return false;     
        }     
    }                        
    return true;     
}    
/**
 * 滑动框显示滑动效果
 * @return {[type]} [description]
 */
function showsearch() {
    if ($(".searchN").is(":hidden")) {
        $(".searchN").slideDown();
        $('.searchC').html('隐藏查询条件');
    } else {
        $(".searchN").slideUp();
        $('.searchC').html('显示查询条件');
    }
}
/**
 * 获取查询期限起止信息
 */
function getStartDate(){
    var cxqxq = mini.get("cxqxQ").getValue();    
    if ("" == cxqxq ) {
        var yearFirst = new Date().getFullYear()+'.1.1'
        return yearFirst;
    }    
    var dateq = new Date(cxqxq);
    var monthq = dateq.getMonth() + 1;
    var cxqxqd = dateq.getFullYear() + '-' + monthq + '-' + dateq.getDate();
    return cxqxqd;
}
/**
 * 得到截止时间
 * @return {[type]} [description]
 */
function getEndDate(){
    var cxqxz = mini.get("cxqxZ").getValue();

    if (isExist(cxqxz)){
        return getTodayDate();
    } 
    var datez = new Date(cxqxz);
    var monthz = datez.getMonth() + 1;
    var cxqxzd = datez.getFullYear() + '-' + monthz + '-' + datez.getDate();
    return cxqxzd;
}
/**
 * 返回今天时间
 * @return {[type]} [description]
 */
function getTodayDate(){
    var date = new Date();
    var month = date.getMonth() + 1;
    var today = date.getFullYear() + '-' + month + '-' + date.getDate();
    return today;    
}
/**
 * 显示纳税人详情信息
 * @param  {[type]} unitValue [description]
 * @return {[type]}           [description]
 */
function showUnitDetail(unitValue, nsrsbh, nsrmc){
    window.location.href = encodeURI("fptjcx_jg.html?unitValue=TY" + unitValue + "&nsrsbh=" + nsrsbh + "&nsrmc=" + nsrmc);
}
/**
 * 返回上一级
 * @return {[type]} [description]
 */
function goBack(){
    history.back();
}
/**
 * 合计字体加粗
 */
function onDrawCell(e) {
    var record = e.record,
        column = e.column,
        field = e.field,
        value = e.value;
        //合计显示黑体字
       if (field == "rwmc" && value == "合计") {
            e.cellStyle = "font-family:微软雅黑;font-weight:bold;";
    }
}
/**
 * 获取URL中的参数，适用于URL（xxx.do?param1=22&para2=ddd）执行后，跳转后的页面获取URL中的参数
 */
function getParamFromUrl(herf){
    var hrefs = herf.split("?");
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
/**
 * 打印公共函数
 */
function print(LODOP, strHTML){
    LODOP.PRINT_INIT("发票领用信息表打印"); // 打印初始化  
    LODOP.SET_PRINT_PAGESIZE(2,0,0,"A4"); // 设置纸张大小  
    LODOP.ADD_PRINT_TABLE(0,0,'98%','90%',strHTML);// 增加表格打印项（超文本模式）  
    LODOP.SET_PRINT_STYLEA(0,"Vorient",3);  
    LODOP.SET_PRINT_STYLEA(0,"Horient",3);  
    LODOP.ADD_PRINT_TEXT('95%','45%',133,20,"第#页/共&页"); // 加纯文本打印项   
    LODOP.SET_PRINT_STYLEA(0,"ItemType",2); // 设置打印项风格  
    LODOP.SET_SHOW_MODE("LANDSCAPE_DEFROTATED", 1);// 1正向显示，0横向显示
    LODOP.SET_PRINT_MODE("PRINT_PAGE_PERCENT", 'Auto-Width'); // Auto-Width 整宽不变形
    LODOP.PREVIEW();  
}
/**
 * 得到打印表头
 * @return {[type]} [description]
 */
function getStrHtml() {
    return "<table border='0' width='100%' style =\"text-align: center;\"  >";   
}
/**
 * 得到公用打印格式内容
 * @return {[type]} [description]
 */
function getTextHtm() {
    return '<style>.biangeng_9{ background:none; border:0px; border-bottom:1px solid #000;text-align:center} '  
            +'</style>'  
            +'<table width="1000" border="0" cellspacing="0" cellpadding="0" class="biangeng_5">'  
             +'<tr>'  
             +'<td colspan="2" style="font-size:20px; font-weight:bold; text-align:center; height:49px;">发票领用信息表</td>'  
             +'</tr>'  
             +' </table>';  
}
/**
 * 添加返回上一级按钮
 */
function addReturnLabel(){
    var aLabel = '<a id="uppage" class="mini-button" onclick="goBack()" style="width:80px; margin:0px; text-align:center; padding: 5px;">上一级</a>';
    $("#Bottom-button").prepend(aLabel);
}
/**
 * 时间控件控制
 */
function onDrawStartDate(e) {
   var cxqxq = mini.get("cxqxQ").getValue();
   var dateq = new Date(cxqxq);

   var cxqxq = mini.get("cxqxZ").getValue();
   var datez = new Date(cxqxq);

   var date = e.date;
   var d = new Date();
   if (date.getTime() > datez.getTime()) 
   {
     e.allowSelect = false;
   }
   if (date.getTime() > d.getTime()) 
   {
     e.allowSelect = false;
   }
 }
/**
 * datapicker 截止时间控制
 * @param  {[type]} e [description]
 * @return {[type]}   [description]
 */
function onDrawEndDate(e) {
   var cxqxq = mini.get("cxqxQ").getValue();
   var dateq = new Date(cxqxq);

   var cxqxq = mini.get("cxqxZ").getValue();
   var datez = new Date(cxqxq);

   var date = e.date;
   var d = new Date();
   if (date.getTime() < dateq.getTime()) 
   {
     e.allowSelect = false;
   }
   if (date.getTime() > d.getTime()) 
   {
     e.allowSelect = false;
   }
 }
 /**
 * 查询纳税人详情代码
 * @return {[type]} [description]
 */
function doSearchOrderDetail(){
    var swjgDm = sessionStorage.getItem("swjgdm");
    var nsrmc = mini.get("nsrmc_s").getValue();
    var nsrsbh = mini.get("nsrsbh_s").getValue();
    if (nsrsbh == "" && nsrmc == "") {
        alert("请填写纳税人识别号或者纳税人名称");
        return;
    }
    showUnitDetail(swjgDm, nsrsbh, nsrmc);  
}
/**
 * 判断值
 */
function isExist(variable){
    return variable == null || variable == "" || variable == "undefined";
}
/**
 * 得到时间状态传递  额外传递参数表
 */
function getExtraParams(){
    var startDate = getStartDate();
    var endDate = getEndDate();
    var status = mini.get("combox_status").getValue();
    return "&startDate=" + startDate + "&endDate=" + endDate + "&status=" + status;
}
/**
 * 导出Excel通用方法
 */
function getExcel(url){
    var $eleForm = $("<form method='post' ></form>");
    $eleForm.attr("action",encodeURI(url));
    $(document.body).append($eleForm);
    //提交表单，实现下载
    $eleForm.submit();
}
