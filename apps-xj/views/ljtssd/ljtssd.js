$(function () {
    mini.parse();
    $("#babDy").hide();//打印-隐藏
    $("#ty").hide();//打印-隐藏
    mini.get('dywj').hide
    if (__ps.page == 'dy') {
        $("#babDy").show();//打印-显示
    }
    if (__ps.page == 'ty') {
        $("#ty").show();//同意不同意-显示
        $("#sftyDiv").hide()
    } else {
        $("#ty").hide();//同意不同意-显示
        $("#sftyDiv").show()
    }
    $.ajax({
        url: '/dzgzpt-wsys/api/ljtssdba/queryViewData',
        type: 'POST',
        async: false,
        contentType: 'application/json; charset=UTF-8',
        data: mini.encode({
            "processInsId": __ps.processInstanceId,
        }),
        success: function (data, textStatus) {
            if (data.success) {
                var value = mini.decode(data.value)
                new mini.Form('#sqbylForm').setData(value.sqbylForm)
                mini.get("fzjgxxs").setData(value.fzjgxxs)
                mini.get('sqxh').setValue(value.sqbylForm.sqxh)
                $('#basj').html(value.sqbylForm.basj)
                $('#fddbrxm').html(value.sqbylForm.fddbrxm)
            }
        },
        error: function (error) {
            mini.alert(error.message || '接口异常，请稍后重试');
        }
    });
});
var qsbbctApi = {
    saveQsbbct: '/dzgzpt-wsys/api/ljtssdba/saveData',
    downloadPdf: '/dzgzpt-wsys/api/ljtssdba/downloads/pdf/'
}
//点击打印显示不同的的页面
function babDy() {
    mini.get('dywj').show()
}
function downloadPdf(pdfLx) {
    window.open(qsbbctApi.downloadPdf + mini.get("sqxh").getValue() + '/' + pdfLx)
}
//点击同意不同意显示情况
function setTyValue() {
    var self = this
    if (self.value == '0') {
        mini.get("lrxx").show()
        $("#byBabh").show()
        $("#byBabhly").show()
        $('#tyBabh').hide()
    } else {
        mini.get("lrxx").show()
        $("#byBabh").hide()
        $("#byBabhly").hide()
        $('#tyBabh').show()
    }
}
function setSftyValue() {
    var self = this
    if (self.value == '0') {
        $("#btyyy").show()
    } else {
        mini.get("btyyy").setValue("")
        $("#btyyy").hide()
    }
}
function define() {
    if (mini.get("ty").getValue() == '1' && !mini.get("badjtzsbh").getValue()) {
        mini.alert("备案登记通知书编号，不得为空！");
        return
    } else if (mini.get("ty").getValue() == '0' && (!mini.get("bybadjtzsbh").getValue() || !mini.get("bybaly").getValue())) {
        mini.alert("不予备案登记通知书编号和不予备案理由，不得为空！");
        return
    }
    mini.get("lrxx").hide()
}
//点击 取消
function onCancel() {
    mini.get("lrxx").hide()
    mini.get('badjtzsbh').setValue('')
    mini.get('bybadjtzsbh').setValue('')
    mini.get('bybaly').setValue('')
}
//保存
function saveData(isSend) {
    var flag = true;
    if (__ps.page == 'ty') {
        if (!mini.get("ty").getValue()) {
            mini.alert("请先选择是否同意并录入相应的通知书编号！");
            return
        }
        if (mini.get("ty").getValue() == '1' && !mini.get("badjtzsbh").getValue()) {
            mini.alert("备案登记通知书编号，不得为空！");
            return
        } else if (mini.get("ty").getValue() == '0' && (!mini.get("bybadjtzsbh").getValue() || !mini.get("bybaly").getValue())) {
            mini.alert("不予备案登记通知书编号和不予备案理由，不得为空！");
            return
        }

    } else {
        if (!mini.get("sfty").getValue()) {
            mini.alert("请先选择是否同意！");
            return
        }
        if (mini.get("sfty").getValue() == '0' && !mini.get("btyyy").getValue()) {
            mini.alert("请录入不同意原因！");
            return
        }
    }
    var processInstanceId = __ps.processInstanceId;
    var taskId = __ps.taskId;
    var saveData = {
        "processInsId": processInstanceId,//流程实例ID
        "taskId": taskId,
        "badjtzsbh": mini.get("ty").getValue() == '1' ? mini.get("badjtzsbh").getValue() : '',  //备案登记通知书编号
        "bybadjtzsbh": mini.get("ty").getValue() == '0' ? mini.get("bybadjtzsbh").getValue() : '',//不予备案登记通知书编号
        "bybaly": mini.get("ty").getValue() == '0' ? mini.get("bybaly").getValue() : '', //不予备案理由
        slhj: '',
        btyly: mini.get("sfty").getValue() == '0' ? mini.get("btyyy").getValue() : '',
    };

    $.ajax({
        url: qsbbctApi.saveQsbbct,
        type: 'POST',
        async: false,
        contentType: 'application/json; charset=UTF-8',
        data: mini.encode({ data: saveData }),
        success: function (data, textStatus) {
            if (data.success) {
                flag = true;
            } else {
                mini.alert(data.message || "操作失败！");
                flag = false
            }
        },
        error: function (error) {
            flag = false
            mini.alert(error.message || '失败，请稍后重试');
        }
    });
    return flag;
}
function getFormParams() {
    var formId = __ps.formId;
    var a = {};
    a[formId] = {
        'sfbl': mini.get("sfty").getValue()      //同意 传1 ， 不同意 传 0
    };
    return a;
}
function sendResult(isSuccess) { //为后端提供的回调函数 
    if (isSuccess) {
        $.ajax({
            url: '/dzgzpt-wsys/api/ljtssdba/generatePdf',
            type: 'POST',
            async: false,
            contentType: 'application/json; charset=UTF-8',
            data: mini.encode({
                sqxh: mini.get('sqxh').getValue(),
                pdflx: mini.get("ty").getValue() == '1' ? "badjtzs" : "bybadjtzs",
            }),
            success: function (data, textStatus) { },
            error: function (error) { }
        });
    }
}