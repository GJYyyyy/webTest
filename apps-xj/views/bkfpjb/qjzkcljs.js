var qjzkcljs = {
    init: function () {
        // $(".searchdiv").slideUp();
        $(".search-qy").click(function () {
            qjzkcljs.showsearch();
        });
        this.queryGrid();
    },
     showsearch: function() {
        if ($(".searchdiv").is(":hidden")) {
            $(".searchdiv").slideDown();
            // $('.searchC').html('隐藏查询条件');
        } else {
            $(".searchdiv").slideUp();
            // $('.searchC').html('显示查询条件');
        }
    },
    doSearch: function () {
        var shxydm = mini.get("shxydm").getValue();
        var nsrmc = mini.get("nsrmc").getValue();
        var zcdz = mini.get("zcdz").getValue();
        var fddbrxm = mini.get("fddbrxm").getValue();
        var cwfzrxm = mini.get("cwfzrxm").getValue();
        $.ajax({
            url: '/workflow/web/workflow/form/gddj/queryNsrxx?shxydm=' + shxydm + "&nsrmc=" + nsrmc
            + "&zcdz=" + zcdz + "&fddbrxm=" + fddbrxm + "&cwfzrxm=" + cwfzrxm,
            type: 'get',
            async: false,
            success: function (data, textStatus) {
                if (data.code == "SUCCESS") {
                    mini.get("qymdGrid").setData(data.data);
                } else {
                    mini.alert(error.message || '查询失败，请重试。');
                }
            },
            error:function(error){
                mini.alert(error.message || '接口异常，请稍后重试');
            }
        });
    },
    queryGrid: function () {
        $.ajax({
            url: '/dzgzpt-wsys/api/sh/jbBkfp/queryJbxxByProcessInsId',
            type: 'POST',
            async: false,
            contentType:'application/json;charset=UTF-8',
            data: mini.encode({'processInsId':getQueryString("processInstanceId")}),
            success: function (data, textStatus) {
                if(data.success){
                    $("#jbrxm").html(data.value.jbrmc);
                    $("#jbrsjhm").html(data.value.jbrSjhm);
                    $("#bjbrsh").html(data.value.bjbrNsrsbh);
                    $("#bjbrmc").html(data.value.bjbrNsrmc);
                    $("#bjbrzgswjg").html(data.value.bjbrZgswjgmc ? data.value.bjbrZgswjgmc:'');
                    $("#qrdzcdzxzqhszDm").html(data.value.bjbrXxdz ? data.value.bjbrXxdz :'');
                    $("#jbnr").html(data.value.jbnr ? data.value.jbnr : '');
                    $("#fjxx").html((data.value.fileDto.length != 0) ? data.value.fileDto[0].fileName : '');
                    $("#fjxx").bind("click",function (e) {
                        window.open("/dzgzpt-wsys/api/sh/jbBkfp/download/jbzl?fileName="
                            + data.value.fileDto[0].fileName + "&filePath=" + data.value.fileDto[0].filePath
                            + "&fileKey=" + data.value.fileDto[0].fileKey);
                    })
                    // $("#fjxx").attr("href",data.value.fileDto[0].filePath);
                }
            },
            error:function(error){
                mini.alert(error.message || '接口异常，请稍后重试');
            }
        });
    }
};

$(function () {
    mini.parse();
    qjzkcljs.init();
});

function getQueryString(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return unescape(r[2]);
    }
    return null;
}

// function getFormParams(){
//     var processInstanceId = getQueryString("processInstanceId");
//     var taskId = getQueryString("taskId");
//     var formId = getQueryString("formId");
//     var saveSuccess = {};
//     $.ajax({
//         url: '/dzgzpt-wsys/api/sh/jbBkfp/getFormParams',
//         type: 'POST',
//         async: false,
//         contentType:'application/json; charset=UTF-8',
//         data: {'formId':formId},
//         success: function (data, textStatus) {
//             if(data){
//                 saveSuccess = data;
//             }
//         },
//         error:function(error){
//             mini.alert(error.message || '接口异常，请稍后重试');
//         }
//     });
//     return saveSuccess;
// }
var message = new MyMessage.message({
    /*默认参数，下面为默认项*/
    iconFontSize: "20px", //图标大小,默认为20px
    messageFontSize: "12px", //信息字体大小,默认为12px
    showTime: 3000, //消失时间,默认为3000
    align: "center", //显示的位置类型center,right,left
    positions: { //放置信息距离周边的距离,默认为10px
        top: "450px",
        bottom: "10px",
        right: "10px",
        left: "10px"
    },
    message: "这是一条消息", //消息内容,默认为"这是一条消息"
    type: "normal", //消息的类型，还有success,error,warning等，默认为normal
});

function saveData(e){
    message.add("保存成功。", "success");
    return true;
}

function getFormParams(){
    var formId = getQueryString("formId");
    var saveSuccess = {};
    var a = {};
    var sfjs;
    $('input:radio:checked').each(function(){
        sfjs = $(this).attr('id') === "red" ? '1' : '0';　　// 选中框中的值
    });
    a[formId] = {
        'sfjs': sfjs  //接收传1 ， 不接收传 0
    };
    return a;
}

function sendResult(flag) {
    // console.log(flag);
    // window.open('/dzgzpt-wsys/dzgzpt-wsys/apps/views/bkfpjb/bkfpjbcx.html');
}

// mini.get("#sfjsyj").setData([{"id": "01","text": "接收"}, {"id": "02","text": "不接收"}]);
