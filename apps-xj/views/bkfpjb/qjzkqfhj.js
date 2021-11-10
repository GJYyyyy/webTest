var clcl = {
    yjlxData: '',   //处理意见类型数据
    clyj: '',   //处理意见
    yjmb: '',   //处理意见类型代码
    init: function () {
        // $(".searchdiv").slideUp();
        $(".search-qy").click(function () {
            clcl.showsearch();
        });
        clcl.fristInit = true;
        this.queryGrid();
        this.queryYjlx();
        this.checkclyj();
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
                    $("#fjxx").html(data.value.fileDto ? data.value.fileDto[0].fileName : '');
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

    },
    queryYjlx: function () {
        $.ajax({
            url: "/workflow/web/workflow/form/gddj/queryClyj",
            async: false,
            type:"get",
            success: function (data) {
                clcl.yjlxData = data.data;
                mini.get("sssxdl").setData(data.data);
            },
            error: function (e) {
                mini.alert(data.message || "接口异常，请稍候再试");
            }
        });
    },
    openmbwh: function () {
        mini.open({
            url: "./mbwh.html",        //页面地址
            title: '模板维护',      //标题
            iconCls: '',    //标题图标
            width: 800,      //宽度
            height: 1000,     //高度
            allowResize: true,       //允许尺寸调节
            allowDrag: true,         //允许拖拽位置
            showCloseButton: true,   //显示关闭按钮
            showMaxButton: true,     //显示最大化按钮
            showModal: true,         //显示遮罩
            currentWindow:false,      //是否在本地弹出页面,默认false
            effect:'none',              //打开和关闭时的特果:'none','slow','fast',默认'none'
            onload: function () {       //弹出页面加载完成

                // $("body").parent().css("overflow-y","hidden");
                // $(document).scroll(function() {
                //     $(document).scrollTop(0);
                // });
                var iframe = this.getIFrameEl();
                //调用弹出页面方法进行初始化
                // iframe.contentWindow.setData(url);
            },
            ondestroy: function (action) {  //弹出页面关闭前
                clcl.queryYjlx();
            }
        });
    },
    wtdlChange: function (record) {
        mini.get("bjbrxxdz").setValue(record.selected.clyjMb);
    },
    yjmbChange: function (record) {
        if (!mini.get("sssxdl").getValue()) {
            mini.alert("请先选择处理意见类型。");
        }
    },
    checkclyj: function () {
        $.ajax({
            url: '/dzgzpt-wsys/api/sh/jbBkfp/queryClyjByProcessInsId',
            type: 'POST',
            async: false,
            contentType:'application/json;charset=UTF-8',
            data: mini.encode({'processInsId':getQueryString("processInstanceId")}),
            success: function (data) {
                if (data.success) {
                    clcl.yjmb = data.value.yjmb;
                    clcl.clyj = data.value.clyj;
                    //处理意见有值不可修改意见类型
                    if (clcl.clyj) {
                        for (var i = 0; i < clcl.yjlxData.length; i++) {
                           if (clcl.yjlxData[i].clyjId === clcl.yjmb) {
                               mini.get("sssxdl").select(i); //处理意见类型代码
                               mini.get("sssxdl").enabled = false;
                           }
                        }
                        if (!clcl.yjmb) {
                            mini.get("sssxdl").select(0); //有处理意见但没有意见类型代码则选择其他
                            mini.get("sssxdl").enabled = false;
                        }
                        mini.get("bjbrxxdz").setValue(clcl.clyj);
                    }
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
    clcl.init();
});

function getQueryString(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return unescape(r[2]);
    }
    return null;
}

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
    var processInstanceId = getQueryString("processInstanceId");
    var taskId = getQueryString("taskId");
    var formId = getQueryString("formId");
    var saveData = {
        "processInsId": processInstanceId,
        "taskId": taskId,
        "sfjs": mini.get("sssxdl").getValue(),  //处理意见类型代码
        "spyj": mini.get("bjbrxxdz").getValue() //处理意见
    };
    var saveSuccess = false;
    if (!mini.get("bjbrxxdz").getValue()) {
        mini.alert("请填写处理意见。");
        return saveSuccess;
    }
    $.ajax({
        url: '/dzgzpt-wsys/api/sh/jbBkfp/saveData',
        type: 'POST',
        async: false,
        contentType:'application/json; charset=UTF-8',
        data: mini.encode(saveData),
        success: function (data, textStatus) {
            if(data.success){
                message.add("保存成功。", "success");
                saveSuccess = true;
            } else{
                message.add(data.message || '保存失败，请稍后重试', "warning");
            }
        },
        error:function(error){
            mini.alert(error.message || '接口异常，请稍后重试');

        }
    });
    return saveSuccess;
}

function getFormParams(){
    var processInstanceId = getQueryString("processInstanceId");
    var taskId = getQueryString("taskId");
    var formId = getQueryString("formId");
    var saveSuccess = {};
    $.ajax({
        url: '/dzgzpt-wsys/api/sh/jbBkfp/getFormParams',
        type: 'POST',
        async: false,
        contentType:'application/json; charset=UTF-8',
        data: mini.encode({'formId':formId}),
        success: function (data, textStatus) {
            if(data){
                saveSuccess = data;
            }
        },
        error:function(error){
            mini.alert(error.message || '接口异常，请稍后重试');
        }
    });
    return saveSuccess;
}

function sendResult(flag){
    if(flag){
        //调用发送短信接口
        $.ajax({
            url: '/dzgzpt-wsys/api/sh/jbBkfp/fsdx',
            type: 'POST',
            async: false,
            contentType:'application/json; charset=UTF-8',
            data: mini.encode({
                "mobile": $("#jbrsjhm").value,
                "msg": mini.get("bjbrxxdz").getValue(),
                "processInsId": getQueryString("processInstanceId")
            }),
            success: function (data, textStatus) {
                if(data){
                    mini.alert("发送成功");
                }
            },
            error:function(error){
                mini.alert(error.message || '接口异常，请稍后重试');
            }
        });
    }
}
// mini.get("#sfjsyj").setData([{"id": "01","text": "接收"}, {"id": "02","text": "不接收"}]);
