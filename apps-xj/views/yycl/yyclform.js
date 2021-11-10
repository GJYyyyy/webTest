$(function () {
    initData()
})

var btglyRequired = false, result = ''

function initData() {
    $.ajax({
        url: '/dzgzpt-wsys/api/sh/yycl/view/yycldata',
        type: "POST",
        data: mini.encode({
            processinstanceid: __ps.processInstanceId,
        }),
        contentType: "application/json; charset=utf-8",
        success: function (res) {
            if (res.success) {
                mini.get('nsrmc').setValue(res.value.nsrmc)
                mini.get('nsrsbh').setValue(res.value.nsrsbh)
                mini.get('yyd').setValue(res.value.yyd)
                $("#blqx").html(new Date(res.value.blqx).format('yyyy年MM月dd日'))
                $("#zjhm").html(res.value.zjhm)
                $("#nsrmc").html(res.value.nsrmc)
                $("#tjsj").html(new Date(res.value.tjsj).format('yyyy年MM月dd日'))
                $("#bcfrmc_td").html(res.value.bcfrmc)
                $("#bcfrzjmc_td").html(res.value.bcfrzjmc)
                $("#zjhm_td").html(res.value.zjhm)
                $("#wfssq_td").html(res.value.wfssq)
                $("#wsssjcfyj_td").html(res.value.wfssjcfyj)
                $("#fkje").html(res.value.fkje)
                $("#fkje_Dx").html(arabicToChinese(res.value.fkje))
                var shyjForm = new mini.Form("#shyj");
                shyjForm.setData(res.value)
                result = res.value
                var controls = shyjForm.getFields();
                __ps.hj == '3' && $(controls).each(function (i, item) {
                    item.setReadOnly(true);
                })
            } else {
                mini.alert(res.message || '查询失败！')
            }
        },
        error: function () { }
    });
}

function radioValueChange(e) {
    if (e.value == 'Y') {
        $('#btglyTr').hide()
        btglyRequired = false
    } else {
        $('#btglyTr').show()
        btglyRequired = true
    }
}

//金额转换大写
function arabicToChinese(arabicNum) {
    var arabicNum = new String(Math.round(arabicNum * 100)); // 数字金额
    var chineseValue = ''; // 转换后的汉字金额
    var String1 = '零壹贰叁肆伍陆柒捌玖'; // 汉字数字
    var String2 = '万仟佰拾亿仟佰拾万仟佰拾元角分'; // 对应单位
    var len = arabicNum.length; // arabicNum 的字符串长度
    var Ch1; // 数字的汉语读法
    var Ch2; // 数字位的汉字读法
    var nZero = 0; // 用来计算连续的零值的个数
    var String3; // 指定位置的数值
    if (len > 15) {
        alert('超出计算范围');
        return '';
    }
    if (arabicNum == 0) {
        chineseValue = '零元整';
        return chineseValue;
    }
    String2 = String2.substr(String2.length - len, len); // 取出对应位数的STRING2的值
    for (var i = 0; i < len; i++) {
        String3 = parseInt(arabicNum.substr(i, 1), 10); // 取出需转换的某一位的值
        if (i != (len - 3) && i != (len - 7) && i != (len - 11) &&
            i != (len - 15)) {
            if (String3 == 0) {
                Ch1 = '';
                Ch2 = '';
                nZero = nZero + 1;
            } else if (String3 != 0 && nZero != 0) {
                Ch1 = '零' + String1.substr(String3, 1);
                Ch2 = String2.substr(i, 1);
                nZero = 0;
            } else {
                Ch1 = String1.substr(String3, 1);
                Ch2 = String2.substr(i, 1);
                nZero = 0;
            }
        } else { // 该位是万亿，亿，万，元位等关键位
            if (String3 != 0 && nZero != 0) {
                Ch1 = '零' + String1.substr(String3, 1);
                Ch2 = String2.substr(i, 1);
                nZero = 0;
            } else if (String3 != 0 && nZero == 0) {
                Ch1 = String1.substr(String3, 1);
                Ch2 = String2.substr(i, 1);
                nZero = 0;
            } else if (String3 == 0 && nZero >= 3) {
                Ch1 = '';
                Ch2 = '';
                nZero = nZero + 1;
            } else {
                Ch1 = '';
                Ch2 = String2.substr(i, 1);
                nZero = nZero + 1;
            }
            if (i == (len - 11) || i == (len - 3)) { // 如果该位是亿位或元位，则必须写上
                Ch2 = String2.substr(i, 1);
            }
        }
        chineseValue = chineseValue + Ch1 + Ch2;
    }
    if (String3 == 0) { // 最后一位（分）为0时，加上“整”
        chineseValue = chineseValue + '整';
    }
    return chineseValue;
}

function saveData(isSend) {
    var saveSuccess = false;

    var shyjForm = new mini.Form("#shyj");
    shyjForm.validate();
    if (!shyjForm.isValid()) {
        return;
    }
    var formData = shyjForm.getData();

    $.ajax({
        url: '/dzgzpt-wsys/api/sh/yycl/saveSljg',
        type: 'POST',
        data: mini.encode({
            jnfkuuid: result.jnfkuuid,
            shjg: formData.shjg,
            shbtgly: formData.shbtgly
        }),
        async: false,
        contentType: 'application/json; charset=UTF-8',
        success: function (data, textStatus) {
            if (data.success) {
                saveSuccess = true;
            } else {
                message.add(data.message || '保存失败，请稍后重试', "warning");
            }
        },
        error: function (error) {
            mini.alert(error.message || '保存失败，请稍后重试');

        }
    });
    return saveSuccess;
}

function getFormParams() {
    var shyjForm = new mini.Form("#shyj");
    var formData = shyjForm.getData();
    var params = {
        [__ps.formId]: {
            shjg: formData.shjg == 'Y' ? '1' : '0'
        },
    };
    return params;
}
function getFormDepart() {
    let string = ''
    $.ajax({
        url: '/workflow/web/workflow/form/yycl/querynextswjg',
        type: "get",
        contentType: "application/json; charset=utf-8",
        success: function (res) {
            if (res.code == 'SUCCESS') {
                string = res.data.swjgDm || ""
            } else {
                mini.alert(res.message || '获取推送信息失败！')
                return
            }
        },
        error: function () { }
    });
    return string;//第二步-推送对象代码
}
//推送成功后执行
function sendResult(isSend, eventId) {
    if (eventId == 'SJ_HT') {
        return false
    }
    var shyjForm = new mini.Form("#shyj");
    var formData = shyjForm.getData();
    if (__ps.type == 'new') {
        $.ajax({
            url: '/dzgzpt-wsys/api/sh/yycl/updateStatus ',
            type: "post",
            data: mini.encode({
                lcslid: __ps.processInstanceId,
            }),
            contentType: "application/json; charset=utf-8",
            success: function (res) { },
            error: function () { }
        });
        return
    }

    if (__ps.hj == '2') {
        if (formData.shjg == 'N') {
            $.ajax({
                url: '/dzgzpt-wsys/api/sh/yycl/sendMessage',
                type: "post",
                data: mini.encode({
                    shxydm: result.shxydm,
                    bcfrmc: result.bcfrmc,
                    wfssq: result.wfssq,
                    bz: formData.shjg,
                    jnfkuuid: result.jnfkuuid
                }),
                contentType: "application/json; charset=utf-8",
                success: function (res) { },
                error: function () { }
            });
        }
        return
    }
    $.ajax({
        url: '/dzgzpt-wsys/api/sh/yycl/sendMessage',
        type: "post",
        data: mini.encode({
            shxydm: result.shxydm,
            bcfrmc: result.bcfrmc,
            wfssq: result.wfssq,
            bz: formData.shjg,
            jnfkuuid: result.jnfkuuid
        }),
        contentType: "application/json; charset=utf-8",
        success: function (res) { },
        error: function () { }
    });
}