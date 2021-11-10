$(function () {
    mini.parse();
    console.log(__ps.activityCode);//获取url参数
    if (__ps.activityCode == 0) {
        mini.get('txxx').disable();
        mini.get('clyj').disable();
        $('#Tr').hide()
    } else {
        mini.get('txxx').enable();
        mini.get('clyj').enable();
        $("#txxxTr").hide()
    }
    // 查询清算报备查统-初始化接口
    $.ajax({
        url: '/dzgzpt-wsys/api/sh/qsbb/get/shxx',
        type: 'POST',
        async: false,
        contentType: 'application/json; charset=UTF-8',
        data: mini.encode({
            "processInsId": __ps.processInstanceId,
        }),
        success: function (data, textStatus) {
            if (data.success) {
                mini.get('nsrsbh').setValue(data.value.nsrsbh);
                mini.get('nsrmc').setValue(data.value.nsrmc);
                mini.get('zgswjg').setValue(data.value.zgswjMc);
                mini.get('gly').setValue(data.value.ssglyMc);
                mini.get('qsbbsj').setValue(data.value.qsdjr);
                mini.get('clyj').setValue(data.value.clyj);
                mini.get('txxx').setValue(data.value.shxx);
            }
        },
        error: function (error) {
            mini.alert(error.message || '接口异常，请稍后重试');
        }
    });
});
var qsbbctApi = {
    // 保存清算报备查统-处理意见（其他）和填写信息
    saveQsbbct: '/dzgzpt-wsys/api/sh/qsbb/save/shxx',
}
function setClyjValue() {
    var self = this
    if (self.value == '0') {
        $("#txxxTr").show()
        $('#Tr').hide()
    } else {
        $("#txxxTr").hide()
        $('#Tr').show()
    }
}
function saveData(flag) {
    var flag = true;
    var processInstanceId = __ps.processInstanceId;
    var saveData = {
        "processInsId": processInstanceId,//流程实例ID
        "clyj": mini.get("clyj").getValue(),  //处理意见
        "shxx": mini.get("clyj").getValue() == '0' ? mini.get("txxx").getValue() : '' //填写信息
    };
    if (!mini.get("clyj").getValue()) {
        mini.alert("请选择处理意见！");
        flag = false;
        return flag
    }
    if (!mini.get("txxx").getValue() && mini.get("clyj").getValue() =='0') {
        mini.alert("填写信息未填写！");
        return
    } else {
        $.ajax({
            url: qsbbctApi.saveQsbbct,
            type: 'POST',
            async: false,
            contentType: 'application/json; charset=UTF-8',
            data: mini.encode(saveData),
            success: function (data, textStatus) {
                if (data.success) {
                    flag = true;
                } else {
                    mini.alert(data.message || "操作失败！");
                }
            },
            error: function (error) {
                mini.alert(error.message || '失败，请稍后重试');
            }
        });
    }
    return flag;
}
function sendResult(flag) { //为后端提供的回调函数 
    if (flag) {
        $.ajax({
            url: '/dzgzpt-wsys/api/sh/qsbb/update/shzt',
            type: 'POST',
            async: false,
            contentType: 'application/json; charset=UTF-8',
            data: mini.encode({
                "processInsId": __ps.processInstanceId
            }),
            success: function (data, textStatus) { },
            error: function (error) { }
        });
    }
}
//处理意见的值  转给流程中的判断条件分支
function getFormParams() {
    var formId = __ps.formId;
    var clyjParams = mini.get("clyj").getValue() == '0' ? '0' : '1';
    var obj = {};
    obj[formId] = {
        'clyj': clyjParams  //接收传1 ， 不接收传 0
    };
    return obj;
}