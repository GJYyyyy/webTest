$(function () {
    gldUtil.addWaterInPages();
    mini.parse();
    fxqymdcx.init();
});

var fxqymdcx = {
    init: function () {
        this.qymdGrid = mini.get("qymdGrid");
        this.qymdFrom = new mini.Form("#qymdFrom");

        this.sqrqQ = mini.get("sqrqQ");
        this.sqrqZ = mini.get("sqrqZ");

        this.swjgInit();
        this.doSearch();
    },
    swjgInit: function () {
        // 税务机关下拉
        var $swjgdm = mini.get("zgswjg");
        $.ajax({
            url : "../../../../api/baseCode/getUserSwjgAndAllXsSwjgWithCode",
            data : "",
            type : "POST",
            success : function(obj) {
                var datas = mini.decode(obj);
                $swjgdm.loadList(datas, "jgDm", "PID");
                $swjgdm.setValue(datas[0].jgDm);
                /*swjgDm = datas[0].YXW;
                $swjgdm.setValue(swjgDm);*/
            },
            error : function() {
            }
        });
    },
    sqrqQChange: function (e) {
        mini.get("sqrqZ").setMinDate(e.value);
    },
    sqrqZChange: function (e) {
        mini.get("sqrqQ").setMaxDate(e.value);
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
        fxqymdcx.qymdFrom.validate();
        if (!fxqymdcx.qymdFrom.isValid()) {
            return false;
        }
        //日期跨度最大一年，超过一年提示"日期起止跨度不能大于1年。"
        //空值判定
        var start = mini.formatDate(fxqymdcx.sqrqQ.getValue(), 'yyyy-MM-dd');
        var end = mini.formatDate(fxqymdcx.sqrqZ.getValue(), 'yyyy-MM-dd');
        if (oneYearCheck(start, end)) {
            mini.alert("日期起止跨度不能大于1年。", "范围提示");
        }

        var formData = fxqymdcx.qymdFrom.getData(true);
        var param = mini.decode(formData);
        fxqymdcx.qymdGrid.setUrl("../../../../api/sh/fxqymd/query/fxqymd");
        fxqymdcx.qymdGrid.load({
                nsrsbh:param.nsrsbh,   //对应页面上统一社会信用代码
                qymc:param.nsrmc,      //企业名称
                zgswjgDm:param.zgswjg,   //主管税务机关
                sxdl:param.sssxdl,      //事项大类
                sxxl:param.sssxxl,      //事项小类
                ydyxqQ:param.sqrqQ,  //应对有效期起
                ydyxqZ:param.sqrqZ   //应对有效期止

        }, function (res) {
            // this.setData(res.data);
        }, function (data) {
            var obj = JSON.parse(data.errorMsg);
            mini.alert(obj.message || "系统异常,请稍后再试。")
        });
    },
    doReset: function () {
        mini.get("nsrsbh").setValue("");
        mini.get("nsrmc").setValue("");
        // mini.get("zgswjg").setValue("");
        mini.get("sssxdl").setValue("");
        mini.get("sssxxl").setValue("");
        mini.get("sqrqQ").setValue("");
        mini.get("sqrqZ").setValue("");
        fxqymdcx.qymdGrid.setData('');
    },
    exportFpqd: function () {
        /*var rows = grid.getSelecteds();*/
        if (fxqymdcx.qymdGrid == null || fxqymdcx.qymdGrid == "") {
            mini.alert("查询结果为空，无需导出文件！");
            return;
        }
        var pageIndex = fxqymdcx.qymdGrid.pageIndex;
        var pageSize = fxqymdcx.qymdGrid.pageSize;
        var nsrsbh = mini.get("nsrsbh").value;
        var qymc = mini.get("nsrmc").value;
        var zgswjgDm = mini.get("zgswjg").value;
        var sxdl = mini.get("sssxdl").value;
        var sxxl = mini.get("sssxxl").value;
        var sqrqQ = mini.formatDate(mini.get("sqrqQ").value, 'yyyy-MM-dd');
        var sqrqZ = mini.formatDate(mini.get("sqrqZ").value, 'yyyy-MM-dd');

        window.open('/dzgzpt-wsys/api/sh/fxqymd/export/fxqymd?nsrsbh=' + nsrsbh + '&sxdl='
            + sxdl + '&sxxl=' + sxxl + '&sqrqQ=' + sqrqQ + '&qymc=' + qymc + '&zgswjgDm=' + zgswjgDm +
            '&sqrqZ=' + sqrqZ + '&pageSize=' + pageSize + '&pageIndex=' + pageIndex);
    }
};

function onActionRendererYq(e) {
    var record = e.record;
    return '<a class="Delete_Button" onclick="fxqymdcx.openTcxq(record)" href ="#">查看</a>';
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

function oneYearCheck(start, end) {
    if (!start || !end) return;
    var diff = new Date(end) * 1 - new Date(start) * 1;
    if (diff > 31536000000) {
        return true;
    }
    return false;
}

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