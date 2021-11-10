$(function () {
    mini.parse();
    fzchrdcx.init();
});

var fzchrdcx = {
    init: function () {
        this.qymdGrid = mini.get("qymdGrid");
        this.qymdFrom = new mini.Form("#qymdFrom");

        this.swjg = mini.get("zgswjg");
        this.sqrqQ = mini.get("rdrqQ");
        this.sqrqZ = mini.get("rdrqZ");

        this.swjgxl();
        this.doSearch();
    },
    swjgxl: function () {
        // 税务机关下拉
        $.ajax({
            url : "../../../../api/baseCode/getUserSwjgAndAllXsSwjgWithCode",
            data : "",
            type : "POST",
            success : function(obj) {
                var datas = mini.decode(obj);
                fzchrdcx.swjg.loadList(datas, "jgDm", "PID");
                fzchrdcx.swjg.setValue(datas[0].jgDm);
                /*swjgDm = datas[0].YXW;
                $swjgdm.setValue(swjgDm);*/
            },
            error : function() {
            }
        });
    },
    sqrqQChange: function (e) {
        mini.get("rdrqZ").setMinDate(e.value);
    },
    sqrqZChange: function (e) {
        mini.get("rdrqQ").setMaxDate(e.value);
    },
    doSearch: function () {
        fzchrdcx.qymdFrom.validate();
        if (!fzchrdcx.qymdFrom.isValid()) {
            return false;
        }
        var formData = fzchrdcx.qymdFrom.getData(true);
        var param = mini.decode(formData);
        fzchrdcx.qymdGrid.setUrl("../../../../api/sh/fzchrd/query/rdqk");
        fzchrdcx.qymdGrid.load({
            nsrsbh:param.nsrsbh,   //对应页面上统一社会信用代码
            swjgdm:param.zgswjg,   //主管税务机关
            jcrydm:param.jcrydm,      //事项小类
            rdrqQ:param.rdrqQ,  //应对有效期起
            rdrqZ:param.rdrqZ   //应对有效期止

        }, function (res) {
            // this.setData(res.data);
        }, function (data) {
            var obj = JSON.parse(data.errorMsg);
            mini.alert(obj.message || "系统异常,请稍后再试。")
        });
    },
    doReset: function () {
        mini.get("nsrsbh").setValue("");
        // mini.get("zgswjg").setValue("");
        mini.get("jcrydm").setValue("");
        mini.get("rdrqQ").setValue("");
        mini.get("rdrqZ").setValue("");
        fzchrdcx.qymdGrid.setData('');
    }
};

function onActionRendererYq(e) {
    var record = e.record;
    return '<a class="Delete_Button" onclick="fzchrdcx.openTcxq(record)" href ="#">查看</a>';
}
function sfqsRenderer(e) {
    var record = e.record;
    var rowIndex = e.rowIndex;
    var sfQs = record.sfqs;
    return sfQs === "Y" ? "是" : "否";
}
function ysyjRenderer(e) {
    var record = e.record;
    var rowIndex = e.rowIndex;
    var ysyj = record.ysyj;
    return ysyj === "Y" ? "认定非正常户" : "不认定非正常户";
}
function esyjRenderer(e) {
    var record = e.record;
    var rowIndex = e.rowIndex;
    var esyj = record.esyj;
    return esyj === "Y" ? "认定非正常户" : "不认定非正常户";
}
function sfysysksbRenderer(e){
    var record = e.record;
    var rowIndex = e.rowIndex;
    var sfysysksb = record.sfysysksb;
    return sfysysksb == "Y" ? "是" : "否";
}
function jcqkRenderer(e){
    var record = e.record;
    var rowIndex = e.rowIndex;
    var jcqk = record.jcqk;
    return jcqk == "01" ? "查无下落" : "已改正，无需认定非正常户";
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
            e.errorText = "纳税人识别号必须为15到20位的字母或数字！";
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