var myChart1;
var myChart2;
var myChart3;
var months = ["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月"];

$(function() {
    var month = new Date().getMonth();
    $(".now-month").text(months[month]);
    initBox1();
    initBox2();
    initBox3();
    totalNum();
});
//查询当月数据  圆圈图初始化
function totalNum(){
    var result = getQueryParams();
    var data = result.data;
    var method = result.method;
    $.post("../../../../api/gs/wtgl/fptjgl/" + method, data, function (datee) {
        var data = datee.data;
        var total = data[data.length - 1];
        var tradeNum = total.tradeNum;
        var getNum = total.getNum;
        var onNum = total.onNum;
        var postNum = total.postNum;
        $("#tradeNum").text(tradeNum);
        $("#getNum").text(getNum);
        $("#onNum").text(onNum);
        $("#postNum").text(postNum);
    });
}

//初始化表格一表格， 按月统计初始化
function initBox3(){
    var swjgdm = sessionStorage.getItem("swjgdm");
    var data = {'swjgdm':swjgdm}
    $.post("../../../../api/gs/wtgl/fptjgl/queryMonthByYear",data,function(datee) {
        // 基于准备好的dom，初始化echarts实例
        var data = datee.value;
        var tradeNum = [];
        var getNum = [];
        var onNum = [];
        var postNum = [];

        for (var i = 0; i < data.length ; i++ ){
            var month = parseInt(data[i].month);
            var month_name = months[month - 1];
            tradeNum.push([month_name,data[i].tradeNum]);
            getNum.push([month_name,data[i].getNum]);
            onNum.push([month_name,data[i].onNum]);
            postNum.push([month_name,data[i].postNum]);
        }
        myChart3 = echarts.init(document.getElementById('box1'));
        // 指定图表的配置项和数据
        option = {
            legend: {
                data: ['领取户数', '领取总数', '大厅领取', '邮递领取'],
                selected: {  // 自定义的4个标签并没有曲线对应，加载后是没有选中的（灰色），设置为选中
                    '领取户数': true,
                    '领取总数': true,
                    '大厅领取': false,
                    '邮递领取': false
                }
            },
            tooltip: {
                trigger: 'axis',
                formatter: function (params) {
                    var returnStr = params[0].value[0]+ '</br>';
                    for ( var i = 0; i < params.length; i++) {
                        if (params[i].seriesName == '领取户数') {
                            returnStr = returnStr + " " + params[i].seriesName + ':' + params[i].value[1] + "户" + '</br>';
                        } else {
                            returnStr = returnStr + " " + params[i].seriesName + ':' + params[i].value[1] + "份" + '</br>';
                        }
                    }
                    return returnStr;
                }
            },
            toolbox: {
                show:true,
                feature:{
                    magicType:{type:['line', 'bar']},
                    restore:{},
                    saveAsImage:{}
                }
            },
            grid: {
                left: '10%',
                right: '10%',
                bottom: '10%',
                containLabel: true
            },
            xAxis: {
                name: '日期 ( 月 )',
                nameLocation: 'middle',
                nameGap:'30',
                type: 'category',
                data: months
            },
            yAxis: {
                name: '发票领用情况按月统计',
                nameLocation: 'middle',
                nameGap:'70',
                type: 'value'
            },
            series: [
                {
                    name: '领取户数',
                    type: 'line',
                    itemStyle: {normal: {label: {show: true,  formatter: function(params) { return params.value[1];}}}},
                    data: tradeNum
                },
                {
                    name: '领取总数',
                    type: 'line',
                    itemStyle: {normal: {label: {show: true, formatter: function(params) { return params.value[1];}}}},
                    data: getNum
                },
                {
                    name: '大厅领取',
                    type: 'line',
                    itemStyle: {normal: {label: {show: true, formatter: function(params) {  return params.value[1];}}}},
                    data: onNum
                },
                {
                    name: '邮递领取',
                    type: 'line',
                    itemStyle: {normal: {label: {show: true, formatter: function(params) {  return params.value[1];}}}},
                    data: postNum
                }
            ]
        };
        // 使用刚指定的配置项和数据显示图表。
        myChart3.setOption(option);
    });
}

//初始化表格一表格， 按天统计初始化
function initBox1(){
    var swjgdm = sessionStorage.getItem("swjgdm");
    var days = [];
    var date_ = new Date();
    var year = date_.getYear();
    var month = date_.getMonth() + 1;
    var day = new Date(year,month,0);
    var lastdate = day.getDate();
    for (var i = 1; i <= lastdate; i++) {
        days.push(i);
    }
    var data = {'swjgdm':swjgdm}
    $.post("../../../../api/gs/wtgl/fptjgl/queryDayByMonth",data,function(datee) {
        // 基于准备好的dom，初始化echarts实例
        myChart1 = echarts.init(document.getElementById('box2'));
        // 指定图表的配置项和数据
        // 基于准备好的dom，初始化echarts实例
        var data = datee.value;
        var tradeNum = [];
        var getNum = [];
        var onNum = [];
        var postNum = [];

        for (var i = 0; i < data.length; i++ ){
            var day = data[i].day;
            var day_day = day.split('-')[2];
            if ('0' == day_day.charAt(0)) {
                day_day = day_day.substr(1,1);
            }
            tradeNum.push([day_day , data[i].tradeNum]);
            getNum.push([day_day , data[i].getNum]);
            onNum.push([day_day, data[i].onNum]);
            postNum.push([day_day, data[i].postNum]);
        }
        option = {
            legend: {
                data: ['领取户数', '领取总数', '大厅领取', '邮递领取'],
                selected: {  // 自定义的4个标签并没有曲线对应，加载后是没有选中的（灰色），设置为选中
                    '领取户数': true,
                    '领取总数': true,
                    '大厅领取': false,
                    '邮递领取': false
                }
            },
            tooltip: {
                trigger: 'axis',
                formatter: function (params) {
                    var returnStr = params[0].value[0]+ '日</br>';
                    for ( var i = 0; i < params.length; i++) {
                        if (params[i].seriesName == '领取户数') {
                            returnStr = returnStr + " " + params[i].seriesName + ':' + params[i].value[1] + "户" + '</br>';
                        } else {
                            returnStr = returnStr + " " + params[i].seriesName + ':' + params[i].value[1] + "份" + '</br>';
                        }
                    }
                    return returnStr;
                }
            },
            toolbox: {
                show:true,
                feature:{
                    magicType:{type:['line', 'bar']},
                    restore:{},
                    saveAsImage:{}
                }
            },
            grid: {
                left: '7%',
                right: '7%',
                bottom: '10%',
                containLabel: true
            },
            xAxis: {
                name: '日期 （天）',
                nameLocation: 'middle',
                type: 'category',
                nameGap:'30',
                data: days
            },
            yAxis: {
                name: '发票领用情况按天统计',
                nameLocation: 'middle',
                nameGap:'50',
                type: 'value'
            },
            series: [
                {
                    name: '领取户数',
                    type: 'line',
                    itemStyle: {normal: {label: {show: true, formatter: function(params) { return params.value[1];}}}},
                    data: tradeNum
                },
                {
                    name: '领取总数',
                    type: 'line',
                    itemStyle: {normal: {label: {show: true, formatter: function(params) { return params.value[1];}}}},
                    data: getNum
                },
                {
                    name: '大厅领取',
                    type: 'line',
                    itemStyle: {normal: {label: {show: true, formatter: function(params) { return params.value[1];}}}},
                    data: onNum
                },
                {
                    name: '邮递领取',
                    type: 'line',
                    itemStyle: {normal: {label: {show: true, formatter: function(params) { return params.value[1];}}}},
                    data: postNum
                }
            ]
        }
        // 使用刚指定的配置项和数据显示图表。
        myChart1.setOption(option);
    });
}

//初始化表格二表格,园球标签
function initBox2(){
    //得到查询参数
    var result = getQueryParams();
    var data = result.data;
    var method = result.method;

    var onnumdatas = [];
    var postnumdatas = [];
    var getnumdatas = [];
    var tradenumdatas = [];
    $.post("../../../../api/gs/wtgl/fptjgl/" + method, data, function(datee) {
        var data = datee.data;
        for (var i = 0; i < data.length - 1; i ++ ){
            var object1 = { "name" : data[i].city,"value" : data[i].getNum}
            var object2 = { "name" : data[i].city,"value" : data[i].onNum}
            var object3 = { "name" : data[i].city,"value" : data[i].postNum}
            var object4 = { "name" : data[i].city,"value" : data[i].tradeNum}
            getnumdatas.push(object1);
            tradenumdatas.push(object4);
            onnumdatas.push(object2);
            postnumdatas.push(object3);
        }
        // 基于准备好的dom，初始化echarts实例
        myChart2 = echarts.init(document.getElementById('box3'));
        option = {
            legend: {
                data:
                    [
                        {
                            name: '领用户数',
                            icon: 'circle',
                            textStyle: { color: 'green'}
                        },
                        {
                            name: '领用总数',
                            icon: 'circle',
                            textStyle: {color: 'gray'}
                        },
                        {
                            name: '邮递领用',
                            icon: 'circle',
                            textStyle: {color: 'blue'}
                        },
                        {
                            name: '大厅领用',
                            icon: 'circle',
                            textStyle: {color: 'red'}
                        }
                    ],
                selected: {  // 自定义的4个标签并没有曲线对应，加载后是没有选中的（灰色），设置为选中
                    '领用总数': true,
                    '领用户数': false,
                    '邮递领用': false,
                    '大厅领用': false
                },
                selectedMode: 'single'
            },
            series: [
                {
                    name: '领用户数',
                    type: 'pie',
                    selectedMode: 'single',
                    itemStyle:{
                        normal:{
                            label:{
                                show: true,
                                formatter: '{b} : {c} ({d}%)'
                            },
                            labelLine :{show:true}
                        }
                    },
                    radius: [0, '60%'],
                    center: ['50%', '50%'],
                    data: tradenumdatas
                },
                {
                    name: '领用总数',
                    type: 'pie',
                    selectedMode: 'single',
                    itemStyle:{
                        normal:{
                            label:{
                                show: true,
                                formatter: '{b} : {c} ({d}%)'
                            },
                            labelLine :{show:true}
                        }
                    },
                    radius: [0, '60%'],
                    center: ['50%', '50%'],
                    data: getnumdatas
                },
                {
                    name: '邮递领用',
                    type: 'pie',
                    selectedMode: 'single',
                    itemStyle:{
                        normal:{
                            label:{
                                show: true,
                                formatter: '{b} : {c} ({d}%)'
                            },
                            labelLine :{show:true}
                        }
                    },
                    radius: [0, '60%'],
                    center: ['50%', '50%'],
                    data: postnumdatas
                },
                {
                    name: '大厅领用',
                    type: 'pie',
                    selectedMode: 'single',
                    itemStyle:{
                        normal:{
                            label:{
                                show: true,
                                formatter: '{b} : {c} ({d}%)'
                            },
                            labelLine :{show:true}
                        }
                    },
                    radius: [0, '60%'],
                    center: ['50%', '50%'],
                    data: onnumdatas
                }
            ],
            color: ['#ecce43','#96cc51', '#68ccef', '#b0a4e1', '#2ddfa3','#bc8076', '#ffd565', '#619cff','#aa8078', '#ff5349','#ff7ef4', '#88d382',
                '#ff658d','#ffb03e','#67df47','#46b3ff','#c8c8c8','#a08ded','#2ddfa3','#96cc51','#68ccef']
        }
        myChart2.setOption(option);
    });
}

//让 onresize 事件只执行一次，默认两次，稍作修改。。。
var resizeTimer = null;
window.onresize = function(){
    resizeTimer = resizeTimer ? null : setTimeout(resize,0);
}
resize = function () {
    if(myChart1 && myChart2 && myChart3) {
        myChart1.resize();
        myChart2.resize();
        myChart3.resize();
    }
};

/**
 * 查看详情按钮事件定义
 */
$('#detailButton').click(function(){
    var departid = sessionStorage.getItem("departid");
    var swjgdm = sessionStorage.getItem("swjgdm");
    var date = new Date();
    var month = date.getMonth() + 1;
    var endDate = date.getFullYear() + '-' + month + '-' + date.getDate();
    var startDate = date.getFullYear()+'-1-1';
    var status = '%';
    var extraParams = "&startDate=" + startDate + "&endDate=" + endDate + "&status=" + status;
    var hrefStr;
    if (swjgdm.length < 5) {
        hrefStr = 'fptjcx_sj.html?'  + extraParams ;
    } else {
        hrefStr = "fptjcx_sz.html?cityValue=" + departid + extraParams;
    }
    window.location.href = encodeURI(hrefStr);
});

/**
 * 工具方法用于匹配区别省级和市级的差异化信息
 * @return 返回查询参数 data对象和查询路径 query_*  { 'data': .. , 'method': query_* }
 */
function getQueryParams(){
    //初始化日期信息
    var date = new Date();
    var month = date.getMonth();
    var monthName = month + 1;
    var cxqq = date.getFullYear() + '-' + monthName + '-1';
    var cxqz = date.getFullYear() + '-' + monthName + '-' + date.getDate();
    // 当前登录税务机关信息
    var departid = sessionStorage.getItem("departid");
    var jc = sessionStorage.getItem("jc");
    //当前查询路径匹配
    var method;
    var data;
    if (jc == 'sj') {
        data = {
            "cityCode": '%',
            "clzt": '1',
            "dateStart": cxqq,
            "dateEnd": cxqz
        }
        method = "query_city";
    } else if (jc == 'sz') {
        data = {
            "cityCode": departid,
            "areaCode" : '%',
            "clzt": '1',
            "dateStart": cxqq,
            "dateEnd": cxqz
        };
        method = "query_area";
    }
    return {"data": data, "method":method};
}