$(function () {
    mini.parse();
    tshzdqymddr.init();
});

var tshzdqymddr = {
    init: function () {
        this.qymdGrid = mini.get("qymdGrid");
        this.qymdFrom = new mini.Form("#qymdFrom");

        this.sqrqQ = mini.get("sqrqQ");
        this.sqrqZ = mini.get("sqrqZ");

        // this.doSearch();
    },
    sqrqQChange: function (e) {
        mini.get("sqrqZ").setMinDate(e.value);
    },
    sqrqZChange: function (e) {
        mini.get("sqrqQ").setMaxDate(e.value);
    },
    doSearch: function () {
        tshzdqymddr.qymdGrid.validate();
        if (!tshzdqymddr.qymdGrid.isValid()) {
            return false;
        }
        //日期跨度最大一年，超过一年提示"日期起止跨度不能大于1年。"
        //空值判定
        var start = mini.formatDate(tshzdqymddr.sqrqQ.getValue(), 'yyyy-MM-dd');
        var end = mini.formatDate(tshzdqymddr.sqrqZ.getValue(), 'yyyy-MM-dd');
        if (oneYearCheck(start, end)) {
            mini.alert("日期起止跨度不能大于1年。", "范围提示");
        }

        var formData = tshzdqymddr.qymdFrom.getData(true);
        var param = mini.encode(formData);
        tshzdqymddr.qymdGrid.setUrl("../../../../api/sh/wtgl/xbnsrtc/queryyqqk");
        tshzdqymddr.qymdGrid.load({
            data: param
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
        mini.get("zgswjg").setValue("");
        mini.get("sssxdl").setValue("");
        mini.get("sssxxl").setValue("");
        mini.get("sqrqQ").setValue("");
        mini.get("sqrqZ").setValue("");
        tshzdqymddr.qymdGrid.setData('');
    },
    //模拟上传文件控件点击事件
    openFlieSelect: function () {
        $(".mini-htmlfile .mini-htmlfile-file").click();
    },
    //导入
    startUpload: function () {
        //uploader.upload();
        var inputFile = $("#file1 > input:file")[0];
        $.ajaxFileUpload({
            url: '/wszx-web/api/xj/ywtbsmbs/uploadFile',                 //用于文件上传的服务器端请求地址
            fileElementId: inputFile,               //文件上传域的ID
            //data: { a: 1, b: true },            //附加的额外参数
            dataType: 'json',                   //返回值类型 一般设置为json
            success: function (data, status) {    //服务器成功响应处理函数
                if (data.success) {
                    uploadSuccessData = data.value;
                    mini.alert("导入成功！");
                    window.location.reload();
                } else {
                    mini.alert(data.message || "导入失败，请稍候再试");
                }
            },
            error: function (data, status, e) {   //服务器响应失败处理函数
                var mess = mini.decode(data);
                mini.alert(data.message || "接口异常，请稍候再试");
            }
        });
    },
    exportFpqd: function () {
        window.open('/dzgzpt-wsys/api/sh/wtgl/export/yqqk');
    }
};

function onActionRendererYq(e) {
    var record = e.record;
    return '<a class="Delete_Button" onclick="tshzdqymddr.openTcxq(record)" href ="#">查看</a>';
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