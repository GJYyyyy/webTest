$(function() {
    var swjgjc = sessionStorage.getItem("swjgdm");
    var swjgdm = sessionStorage.getItem("SWJGDM"); 
    if ( swjgjc == null || swjgjc.length > 4 ) {
        alert("抱歉...您无访问权限！");
        return;
    }
	init();
});
var grid;
function init() {
	mini.parse();
	$(".searchC").click(function() {
		showsearch();
	});
	initCityInfo("16200000000");
	setStatusValue();
    //设置查询参数
    var params = getParamFromUrl(decodeURI(window.location.href));     
    var status = params.status;
    var startDate = params.startDate;
    var endDate = params.endDate;
    setQueryParam(startDate, endDate, status);
	doSearchCity('0');
}

function onChanged(){
    doSearchCity('0');
}
var grid;
function doSearchCity(flag){
	var city = mini.get("combox_citys").getValue();
	var status = mini.get("combox_status").getValue();
	var cxqxqd = getStartDate();
	var cxqxzd = getEndDate();
    if (!check(cxqxqd, cxqxzd) ){
        return;
    }
	if (flag == '0') {	
	    data = {
	     	"cityCode":city,
	     	"clzt":status,
	     	"dateStart":cxqxqd,
	     	"dateEnd":cxqxzd
	    },
	    grid = mini.get(sjxxGrid);
		grid.load(data);
	} else {
        getExcel("../../../../api/gs/wtgl/fptjgl/export_city?cityCode="+city+"&clzt="+status+"&dateStart="+cxqxqd+"&dateEnd="+cxqxzd);
	}
}
/**
 * 写成工具类不行只能这样写
 * @param url
 */
function getExcel(url){
    var $eleForm = $("<form method='post' ></form>");
    $eleForm.attr("action",encodeURI(url));
    $(document.body).append($eleForm);
    //提交表单，实现下载
    $eleForm.submit();
}
/**
 * 添加城市信息超链接
 */
function onAddCityLink(e) {
	var record = e.record;
	var city = record.city;
	var cityValue = record.cityValue;
	return '<a class="Delete_Button" onclick="showCityDetail(' + cityValue + ')" href="javascript:;">' + city+ '</a>';
}
function showCityDetail(cityValue){
	var hrefStr;
    var extraParams = getExtraParams();
    if (cityValue == '16202000000' || cityValue == '16200950000' ||  cityValue == '16201050000' ||  cityValue == '16295000000' || cityValue == '16298000000' ) {
        hrefStr = "fptjcx_qx.html?areaValue=" + cityValue;
	} else if (cityValue == '16200000000' || cityValue == '16200900000' || cityValue == '16200930000'  ) {
        hrefStr = "fptjcx_jg.html?unitValue=" + cityValue + "&nsrsbh=&nsrdm=";
    }else {
        hrefStr = "fptjcx_sz.html?cityValue=" + cityValue;
	}
    window.location.href = encodeURI(hrefStr + extraParams);
}
/**
 * 打印格式设置
 * @type {Object}
 */
printConfig = {
    direct: 2,           // 打印方向： 1 正向 2 横向，默认 1
    display: 1,         // 显示方向：1 正向显示，0 横向显示
    view: 1,            // 预览方式：0 适高，1 正常，2 适宽
    zoom: 'Auto-Width',
    css: '',             // 额外的css样式 config.css='table tr td{padding:0}'
    cssLink: '',      // 通过link引入的css样式文件
    style:false      // 是否引入页面的 <style></style> 标签
};
/**
 * 打印函数
 * @return {[type]} [description]
 */
function doPrint(){
	var data = mini.get(sjxxGrid).getData();
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
             +'               <td  align="center" >所属市州</td>'  
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
   	if(json.length % 25 == 0){  // 分页打印  
   	 	pagenum = json.length / 25;  
   	}else if(json.length > 25){  
   	 	pagenum =parseInt((json.length / 25).toString().split("."))+1;  
   	}  
   	 //LODOP.ADD_PRINT_HTM(0,10,663,"60mm","<style>  tr{height:50px;} td {font-size:13px;height:20px;} input{border:none; border:1px solid #000;}</style>"+textHtm);       
   	 for(var j = 0; j < pagenum; j++){  
        var textHtml2 = "";  
        for (var i = j * 25; (i < json.length)&&(i < (j * 25 + 25) ); i++){  
             var index=json[i].index;  
             var swjgdm=json[i].swjgdm;  
             var city=json[i].city;  
             var startDate=json[i].startDate;  
             var endDate=json[i].endDate;  
             var status=json[i].status;
             var tradeNum =json[i].tradeNum;    
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