$(function () {
    mini.parse();
    bkfpjbcx.init();
});

var bkfpjbcx = {
    init: function () {
        this.qymdGrid = mini.get("qymdGrid");
        this.qymdFrom = new mini.Form("#qymdFrom");

        // this.swjgInit();
        this.doSearch();
    },
    jssjQChange: function (e) {
        mini.get("jssjZ").setMinDate(e.value);
    },
    jssjZChange: function (e) {
        mini.get("jssjQ").setMaxDate(e.value);
    },
    hfsjQChange: function (e) {
        mini.get("hfsjZ").setMinDate(e.value);
    },
    hfsjZChange: function (e) {
        mini.get("hfsjQ").setMaxDate(e.value);
    },
    wtdlChange: function (e) {
        console.log(e.value);
        var PID = e.value;
        $.ajax({
            url: "/dzgzpt-wsys/api/baseCode/get/wtsx",
            async: false,
            type:"get",
            success: function (data) {
                var data = mini.decode(data),arr = [];
                for (var i = 0; i < data.length; i++) {
                    if (data[i].PID == PID) arr.push(data[i]);
                }
                mini.get("sssxxl").setData(arr);
            },
            error: function (e) {
                mini.alert(data.message || "接口异常，请稍候再试");
            }
        });

    },
    doSearch: function () {
        bkfpjbcx.qymdFrom.validate();
        if (!bkfpjbcx.qymdFrom.isValid()) {
            return false;
        }

        var formData = bkfpjbcx.qymdFrom.getData(true);
        var param = mini.decode(formData);
        bkfpjbcx.qymdGrid.setUrl("/dzgzpt-wsys/api/sh/jbBkfp/queryJbxx");
        bkfpjbcx.qymdGrid.load({
            jbxh :  param.wtbh,//	否	问题编号
            jbrmc : param.jbrmc,//	否	举报人名称
            bjbrNsrmc : param.bjbrmc,//	否	被举报人纳税人名称
            bjbrNsrsbh :  param.bjbrsh,//	否	被举报人纳税人识别号
            jbnr :  param.jbnr,//	否	举报内容
            jssjQ : param.jssjQ,//	否	接收时间起+
            jssjZ : param.jssjZ,//	否	接收时间止
            hfsjQ : param.hfsjQ,//	否	回复时间起
            hfsjZ : param.hfsjZ//	否	回复时间止

        }, function (res) {

        }, function (data) {
            var obj = JSON.parse(data.errorMsg);
            mini.alert(obj.message || "系统异常,请稍后再试。")
        });
    },
    doReset: function () {
        mini.get("wtbh").setValue("");
        mini.get("jbrmc").setValue("");
        mini.get("bjbrmc").setValue("");
        mini.get("bjbrsh").setValue("");
        mini.get("jbnr").setValue("");
        mini.get("jssjQ").setValue("");
        mini.get("jssjZ").setValue("");
        mini.get("hfsjQ").setValue("");
        mini.get("hfsjZ").setValue("");
        bkfpjbcx.qymdGrid.setData('');
    }
};

function onActionRendererYq(e) {
    var record = e.record;
    return '<a class="Delete_Button" onclick="bkfpjbcx.openTcxq(record)" href ="#">查看</a>';
}

// //form展示隐藏
// $(document).ready(function() {
//     $(".search").click(function() {
//         showsearch();
//     });
// });
// function showsearch() {
//     if ($(".searchdiv").is(":hidden")) {
//         $(".searchdiv").slideDown();
//         $('.searchC').html('隐藏查询条件');
//     } else {
//         $(".searchdiv").slideUp();
//         $('.searchC').html('显示查询条件');
//     }
// }

function nsrsbhValidate(e) {
    if (e.value == false) return;
    if (e.isValid) {
        if (!/^[a-zA-Z0-9\-]{15,20}$/.test(e.value)) {
            e.errorText = "社会信用代码必须为15到20位的字母或数字！";
            e.isValid = false;
            return;
        }
    }
}
//form展示隐藏
$(document).ready(function() {
    $(".search").click(function() {
        showsearch();
    });
});
function showsearch() {
    if ($(".searchdiv").is(":hidden")) {
        $(".searchdiv").slideDown();
        $('.searchC').html('隐藏查询条件');
    } else {
        $(".searchdiv").slideUp();
        $('.searchC').html('显示查询条件');
    }
}