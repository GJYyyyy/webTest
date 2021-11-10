var clcl = {
    rcjclcfqzt: false, //是否已发起日常检查简易流程
    rcjclczt: "0",  //日常检查简易流程状态码 1已发起未完成，2完成
    init: function () {
        // $(".searchdiv").slideUp();
        $(".search-qy").click(function () {
            clcl.showsearch();
        });
        this.queryGrid();
        this.queryYjlx();
        this.checkjclc();

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
                    if (data.value.fileDto.length != 0) {
                        $("#fjxx").html((data.value.fileDto.length != 0) ? data.value.fileDto[0].fileName : '');
                        $("#fjxx").bind("click",function (e) {
                            window.open("/dzgzpt-wsys/api/sh/jbBkfp/download/jbzl?fileName="
                                + data.value.fileDto[0].fileName + "&filePath=" + data.value.fileDto[0].filePath
                                + "&fileKey=" + data.value.fileDto[0].fileKey);
                        });
                    }
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
    //简易流程
    rcjclc: function () {
        $.ajax({
            url: '/dzgzpt-wsys/api/sh/jbBkfp/checkRcjclc',
            type: 'POST',
            async: false,
            contentType:'application/json;charset=UTF-8',
            data: mini.encode({'processInsId':getQueryString("processInstanceId")}),
            success: function (data, textStatus) {
                if (data.success) {
                    mini.alert("已发起过日常检查简易流程。");
                    clcl.fristInit = false;
                } else {
                    $.ajax({
                        url: '/dzgzpt-wsys/api/sh/jbBkfp/rcjclc',
                        type: 'POST',
                        async: false,
                        contentType:'application/json;charset=UTF-8',
                        data: mini.encode({'processInsId':getQueryString("processInstanceId")}),
                        success: function (data, textStatus) {
                            if (data.success) {
                                mini.alert("发起日常检查简易流程成功，请去我的待办查看。");
                                clcl.checkjclc();
                            } else {
                                mini.alert(data.message || '接口异常，请稍后重试');
                            }
                        },
                        error:function(error){
                            mini.alert(error.message || '接口异常，请稍后重试');
                        }
                    });
                }
            },
            error:function(error){
                mini.alert(error.message || '接口异常，请稍后重试');
            }
        });

        // $.ajax({
        //     url: '/dzgzpt-wsys/api/sh/jbBkfp/rcjclc',
        //     type: 'POST',
        //     async: false,
        //     contentType:'application/json;charset=UTF-8',
        //     data: mini.encode({'processInsId':getQueryString("processInstanceId")}),
        //     success: function (data, textStatus) {
        //         if (data.success) {
        //             mini.alert("发起日常检查简易流程成功");
        //         } else {
        //             mini.alert(data.message || '接口异常，请稍后重试');
        //         }
        //     },
        //     error:function(error){
        //         mini.alert(error.message || '接口异常，请稍后重试');
        //     }
        // });
    },
    ckjyrw: function () {
        if (clcl.rcjclcfqzt === true) {
            clcl.Lcwin = mini.open({
                url: "/workflow/web/workflow/lcdy/canvas?process_id=" + clcl.processId
                + "&status=edit&activityId=" + clcl.activityid,        //页面地址
                title: '流程详细',      //标题
                width: "900px",      //宽度
                height: "600px",     //高度
                allowResize: false,       //允许尺寸调节
                allowDrag: true,         //允许拖拽位置
                showCloseButton: true,   //显示关闭按钮
                showMaxButton: false,     //显示最大化按钮
                showModal: true,         //显示遮罩
                currentWindow: false,      //是否在本地弹出页面,默认false
                onload: function () {       //弹出页面加载完成
                    var iframe = this.getIFrameEl();
                    //调用弹出页面方法进行初始化
                    // iframe.contentWindow.setData(record);
                },
                ondestroy:function (e) {

                }
            });
        } else {
            return false;
        }
    },
    hqjyrwyj: function () {
        if (clcl.rcjclczt === '2'){
            if (clcl.clyj) {
                mini.alert(clcl.clyj);
                mini.get("bjbrxxdz").setValue(clcl.clyj);
            } else {
                mini.alert("暂无简易流程意见！");
            }
        } else {
            mini.alert("暂无简易流程意见！");
            return false;
        }
    },
    wtdlChange: function (record) {
        var clyjMb = record.selected.clyjMb;
        mini.get("bjbrxxdz").setValue(clyjMb);
        // if (clcl.rcjclcfqzt) {
        //     mini.get("bjbrxxdz").setValue(clyjMb);
        // } else {
        //     mini.alert("尚未发起日常检查简易流程。");
        // }
    },
    yjmbChange: function (record) {
        if (!mini.get("sssxdl").getValue()) {
            mini.alert("请先选择处理意见类型。");
        }
    },
    checkjclc: function () {
        $.ajax({
            url: '/dzgzpt-wsys/api/sh/jbBkfp/checkRcjclc',
            type: 'POST',
            async: false,
            contentType:'application/json;charset=UTF-8',
            data: mini.encode({'processInsId':getQueryString("processInstanceId")}),
            success: function (data, textStatus) {
                if (data.success) {
                    // mini.alert("发起日常检查简易流程成功");
                    clcl.rcjclcfqzt = true;
                    clcl.rcjclczt = data.value.state;
                    clcl.rcjclcprocessinsid = data.value.rcjclcprocessinsid;
                    clcl.activityid = data.value.activityid;
                    clcl.activityid = data.value.activityid;
                    clcl.processId = data.value.processid;
                    clcl.clyj = data.value.clyj;
                }
            },

            error:function(error){
                mini.alert(error.message || '接口异常，请稍后重试');
            }
        });
        if (clcl.rcjclcfqzt) {
            mini.get("rcjcButton").enabled = false;
            $("#rcjcButton").css("color","#ddd");
            $("#rcjcButton").css("cursor","default");
        }
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
    //简易流程走完才可推送

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
                if (clcl.rcjclczt != "2" && clcl.rcjclcfqzt) {
                    message.add("请在日程检查简易流程完成后推送。", "warning");
                    return saveSuccess;
                }
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
        data: {'formId':formId},
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
        // $.ajax({
        //     url: '/dzgzpt-wsys/api/sh/jbBkfp/fsdx',
        //     type: 'POST',
        //     async: false,
        //     contentType:'application/json; charset=UTF-8',
        //     data: {
        //         "mobile": $("#jbrsjhm").value,
        //         "msg": "你好！",
        //         "processInsId": getQueryString("processInstanceId")
        //     },
        //     success: function (data, textStatus) {
        //         if(data){
        //             mini.alert("发送成功");
        //         }
        //     },
        //     error:function(error){
        //         mini.alert(error.message || '接口异常，请稍后重试');
        //     }
        // });
    }
}
// mini.get("#sfjsyj").setData([{"id": "01","text": "接收"}, {"id": "02","text": "不接收"}]);
