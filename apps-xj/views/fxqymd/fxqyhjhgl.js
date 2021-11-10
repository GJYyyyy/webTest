$(function () {
    gldUtil.addWaterInPages();
    mini.parse();
    fxqyhjhgl.init();
});

var fxqyhjhgl = {
    init: function () {
        this.qymdGrid = mini.get("qymdGrid");
        this.qymdFrom = new mini.Form("#qymdFrom");

        this.ydsj = mini.get("ydsj");
        mini.get("ydfs").setData([{"ID":"1","MC":"提示"},{"ID":"2","MC":"阻断"}]);
        mini.get("fxjb").setData([{"ID":"1","MC":"高"},{"ID":"2","MC":"中"},{"ID":"3","MC":"低"}]);

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
        fxqyhjhgl.qymdFrom.validate();
        if (!fxqyhjhgl.qymdFrom.isValid()) {
            return false;
        }

        var formData = fxqyhjhgl.qymdFrom.getData(true);
        var param = mini.decode(formData);
        fxqyhjhgl.qymdGrid.setUrl("../../../../api/sh/fxqymd/query/hjhgl");
        fxqyhjhgl.qymdGrid.load({
                nsrsbh:formData.nsrsbh,   //对应页面上统一社会信用代码
                qymc:formData.nsrmc,      //企业名称
                zgswjgDm:formData.zgswjg,   //主管税务机关
                sxdl:formData.sssxdl,      //事项大类
                sxxl:formData.sssxxl,      //事项小类
                ydfs:formData.ydfs,  //应对方式
                ydsj:formData.ydsj,   //应对时间
                fxjb:formData.fxjb    //风险级别

        }, function (res) {
            // this.setData(res.data);
        }, function (data) {
            var obj = JSON.parse(data.errorMsg);
            mini.alert(obj.message || "系统异常,请稍后再试。")
        });
    },
    doReset: function () {
        // var form = new mini.Form("#qymdFrom");
        // form.reset();
        mini.get("nsrsbh").setValue("");
        mini.get("nsrmc").setValue("");
        // mini.get("zgswjg").setValue("");
        mini.get("sssxdl").setValue("");
        mini.get("sssxxl").setValue("");
        mini.get("fxjb").setValue("");
        mini.get("ydfs").setValue("");
        mini.get("ydsj").setValue("");
        fxqyhjhgl.qymdGrid.setData('');
    },
    exportFpqd: function () {
        /*var rows = grid.getSelecteds();*/
        if (fxqyhjhgl.qymdGrid == null || fxqyhjhgl.qymdGrid == "") {
            mini.alert("查询结果为空，无需导出文件！");
            return;
        }
        var pageIndex = fxqyhjhgl.qymdGrid.pageIndex;
        var pageSize = fxqyhjhgl.qymdGrid.pageSize;
        var nsrsbh = mini.get("nsrsbh").value;
        var qymc = mini.get("nsrmc").value;
        var zgswjgDm = mini.get("zgswjg").value;
        var sxdl = mini.get("sssxdl").value;
        var sxxl = mini.get("sssxxl").value;
        var ydsj = mini.formatDate(mini.get("ydsj").value, 'yyyy-MM-dd');

        window.open('/dzgzpt-wsys/api/sh/fxqymd/export/hjhgl?nsrsbh=' + nsrsbh + '&sxdl='
            + sxdl + '&sxxl=' + sxxl + '&ydsj=' + ydsj + '&qymc=' + qymc + '&zgswjgDm=' + zgswjgDm
            + '&pageSize=' + pageSize + '&pageIndex=' + pageIndex);
    }
};

function onActionRendererYq(e) {
    var record = e.record;
    return '<a class="Delete_Button" onclick="fxqyhjhgl.openTcxq(record)" href ="#">查看</a>';
}

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