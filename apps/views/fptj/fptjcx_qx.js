$(function() {
    var swjgjc = sessionStorage.getItem("swjgdm");
    if ( swjgjc == null || swjgjc.length > 8 ) {
        alert("抱歉...您无访问权限！");
        return;
    }
    if ( swjgjc.length < 8 ) {
        addReturnLabel();
    }
	init();
});
var areaCode;
function init() {
	areaCode = window.location.href.split("=")[1];
	mini.parse();
	$(".searchC").click(function() {
		showsearch();
	});
    var params = getParamFromUrl(decodeURI(window.location.href));     
    areaCode = params.areaValue;
    initCityInfo(areaCode);
    setStatusValue();
    var status = params.status;
    var startDate = params.startDate;
    var endDate = params.endDate;
    setQueryParam(startDate, endDate, status);  
	doSearchUnit('0');
}
function onChanged(){
    doSearchUnit('0');
}

/**
 * 查找并设置各个区县下的税务机关机构信息
 */
function initUnitInfo(areaCode){
    $.ajax({  
        type:"get",  
        url:"../../../../api/gs/wtgl/fptjgl/list_units", 
        data:{
            areaCode:areaCode,
        },
        dataType:'json',  
        success:function(data) {  
            var obj = mini.get("combox_units");
            obj.setData(data);
        },  
        error:function() {   
          alert("信息加载失败，请重试！");  
        }
    });
}
var grid;
function doSearchUnit(flag){
	var unit = mini.get("combox_citys").getValue();
	var status = mini.get("combox_status").getValue();
	var cxqxqd = getStartDate();
	var cxqxzd = getEndDate();
    if ( !check(cxqxqd, cxqxzd) ){
        return;
    }
	var url = "../../../../api/gs/wtgl/fptjgl/query_unit";
	
	if ( flag == '0'){
        grid = mini.get(qxxxGrid);
        data = {
            "unitCode":unit,
            "areaCode":areaCode,
            "clzt":status,
            "dateStart":cxqxqd,
            "dateEnd":cxqxzd
        },
        grid.load(data);
	} else {
	    getExcel("../../../../api/gs/wtgl/fptjgl/export_unit?unitCode="+unit+ "&areaCode="+ areaCode+"&clzt="+status+"&dateStart="+cxqxqd+"&dateEnd="+cxqxzd);
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
 * 添加税局单位信息超链接
 */
function onAddUnitLink(e) {
	var record = e.record;
	var city = record.city;
	var unitValue = record.cityValue;
    var unit_dm = unitValue.toString();
	return '<a class="Detail_Button" onclick="showUnitAllDetail(\''+unit_dm+'\')" href="javascript:;">' + city+ '</a>';
}
/**
 * 显示机关内纳税人领取
 * @param  {[type]} unitValue [description]
 * @param  {[type]} nsrsbh    [description]
 * @param  {[type]} nsrmc     [description]
 * @return {[type]}           [description]
 */
function showUnitAllDetail(unitValue, nsrsbh, nsrmc){
    var extraParams = getExtraParams();
    window.location.href = encodeURI("fptjcx_jg.html?unitValue=" + unitValue + "&nsrsbh=" + nsrsbh + "&nsrmc=" + nsrmc + extraParams);
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
	var data = mini.get(qxxxGrid).getData();
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
             +'               <td  align="center" >起始日期</td>'  
             +'               <td  align="center" >结束日期</td>'  
             +'               <td  align="center" >办理状态</td>'
             +'               <td  align="center" >领取户数</td>'
             +'               <td  align="center" >领取份数</td>'  
             +'               <td  align="center" >大厅领取份数</td>'  
             +'               <td  align="center" >邮递领取份数</td>'  
             +'       </tr>'  

	json = data;
   	var pagenum = 1;  
   	if(json.length % 28 == 0){  // 分页打印  
   	 	pagenum = json.length / 28;  
   	}else if(json.length > 28){  
   	 	pagenum =parseInt((json.length / 28).toString().split("."))+1;  
   	}  
   	 //LODOP.ADD_PRINT_HTM(0,10,663,"60mm","<style>  tr{height:50px;} td {font-size:13px;height:20px;} input{border:none; border:1px solid #000;}</style>"+textHtm);       
   	 for(var j = 0; j < pagenum; j++){  
        var textHtml2 = "";  
        for (var i = j * 28; (i < json.length)&&(i < (j * 28 + 28) ); i++){  
             var index=json[i].index;  
             var swjgdm=json[i].swjgdm;  
             var city=json[i].city;  
             var startDate=json[i].startDate;  
             var endDate=json[i].endDate;  
             var status=json[i].status;
             var tradeNum=json[i].tradeNum;
             var getNum=json[i].getNum;  
             var onNum=json[i].onNum;  
             var postNum=json[i].postNum;  
               
            textHtml2+='<tr bgcolor="#FFFFFF" align="center">'  
            +'<td >'+index+'</td>'  
            +'<td >'+swjgdm+'</td>'  
            +'<td >'+city+'</td>'  
            +'<td >'+startDate+'</td>'  
            +'<td >'+endDate+'</td>'  
            +'<td >'+status+'</td>' 
            +'<td >'+tradeNum+'</td>'  
            +'<td >'+getNum+'</td>'  
            +'<td >'+onNum+'</td>'  
            +'<td >'+postNum+'</td>'  
            +'</tr>'  
           }  
        strHTML = strHTML + "<tr><td>";  
        var string1="<style>  tr{height:50px;} td {font-size:13px;height:20px;} input{border:none; border:1px solid #000;}</style>"+textHtm  
        var string2="<style>  tr{height:50px;} td {font-size:13px;height:20px;} input{border:none; border:1px solid #000;}</style>"+textHtml+textHtml2;  
        strHTML=strHTML+string1+string2+"</table>";  
        strHTML=strHTML+"</td></tr>";         
    }          
        print(LODOP, strHTML);
	}         
