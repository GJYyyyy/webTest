function init(record, tag) {
    mini.parse();
    zstzs.dataInfo = record
    zstzs.tag = tag
    $('#zs').hide()
    // 右下角日期默认当日
    var today = mini.formatDate(new Date(), 'yyyy年M月d日')
    $("#today").html(today)

    // 设置带出的数据 
    $('#nsrmc').html(record.nsrmc)
    $('#nsrsbh').html(record.nsrsbh)
    $('#swjgmc').html(record.swjgmc)


    if (record.swsxdm == '30060108') {
        $('#byjsznjCon').show()
        if (tag == 'Y') {
            $('#tytznr_byjsznj').show()
            mini.get("tywsh").setValue(record.wsh)
        } else {
            $('#btytznr_byjsznj').show()
            mini.get("btywsh_byjsznj").setValue(record.wsh)
        }
    }
    if (record.swsxdm == '30060107') {
        $('#yxfstsCon').show()
        if (tag == 'Y') {
            $('#tytznr_yxfsts').show()
            mini.get("tywsh_yxfsts").setValue(record.wsh)
        } else {
            $('#btytznr_yxfsts').show()
            mini.get("btywsh_yxfsts").setValue(record.wsh)
        }
    }
    if (record.swsxdm == '60030109') {
        $('#ssyhzgCon').show()
        if (tag == 'Y') {
            $('#tytznr_ssyhzg').show()
            zstzs.getSqsj(record)
            mini.get('tableGrid').setData(zstzs.gridData)
        } else {
            $('#btytznr_ssyhzg').show()
            $('#sqsj').html(mini.formatDate(record.sqsj, 'yyyy年M月d日'))
        }
    }
    if (record.swsxdm == '60010220') {
        $('#jwsfrdsCon').show()
        if (tag == 'Y') {
            $('#tytznr_jwsfrds').show()
            zstzs.getSqsj(record)
            $('#jwsfrdsnsrmc').html(record.nsrmc)
            $('#jwsfrdsswjgmc').html(record.swjgmc)
            $('#zs').show()
        } else {
            $('#btytznr_jwsfrds').show()
        }
    }
    if (record.swsxdm == 'SXA072016001') {
        $('#zzsldqsCon').show()
        if (tag == 'Y') {
            $('#tytznr_zzsldqs').show()
            $('#zzsshsj').html(mini.formatDate(new Date(), 'yyyy年M月d日'))
        } else {
            $('#btytznr_zzsldqs').show()
            $('#zzssqsj').html(mini.formatDate(record.sqsj, 'yyyy年M月d日'))
        }
    }
    if (record.swsxdm == '60010711') {
        $('#fjmqyjjzrccCon').show()
        if (tag == 'Y') {
            $('#tytznr_fjmqyjjzrcc').show()
            $('#fjmqysqsj').html(mini.formatDate(record.sqsj, 'yyyy年M月d日'))
        } else {
            $('#btytznr_fjmqyjjzrcc').show()
            $('#fjmsqsj').html(mini.formatDate(record.sqsj, 'yyyy年M月d日'))
        }
    }
    if (record.swsxdm == '110418') { // 开具无欠税证明
        $('.title1').hide()
        $('.title2').html('无欠税证明')
        $('#jdzdTxt').html('无欠税证')
        $('.nsrxx').html('<span>纳税人名称：' + record.nsrmc + '，纳税人识别号：' + record.nsrsbh + '，</span>')
        $('#kjwqszmCon').show()
        if (tag == 'Y') {
            $('#tytznr_kjwqszm').show()
            zstzs.getSqsj(record)
            $('#yxzjlx').html(zstzs.yxzjlx)
            $('#yxzjhm').html(zstzs.yxzjhm)
            mini.get("wqsNd").setValue(new Date().getFullYear())
        } else {
            $('#btytznr_kjwqszm').show()
            $('#kjwsqsj').html(mini.formatDate(record.sqsj, 'yyyy年M月d日'))
        }
    }
}

var zstzs = {
    gridData: [],
    cancel: function () { // 取消
        window.CloseOwnerWindow && window.CloseOwnerWindow();
    },
    onValidation(e, type) { // 校验必填项
        if (!e.isValid) {
            e.errorText = type + "还未填写";
        }
    },
    getSqsj: function (record) { // 获取tableGrid的值
        $.ajax({
            url: '/dzgzpt-wsys/api/sh/zfzstzs/get/sqsj',
            type: 'get',
            data: { sqxh: record.sqxh },
            contentType: 'application/json; charset=UTF-8',
            success: function (res) {
                if (res.success) {
                    zstzs.gridData = res.value.ssyhzgglmxbDtos || []
                    zstzs.lxrxx = mini.decode(res.value.blxx)
                    zstzs.yxzjlx = mini.decode(res.value.data).zzlxText || ''
                    zstzs.yxzjhm = mini.decode(res.value.data).zzhm || ''
                } else {
                    mini.alert(res.message || "获取失败，请重试!")
                }
            },
            error: function (err) {
                mini.alert('网络异常，请稍后再试！')
            }
        })
    },
    sendTzs: function () { // 制发通知书
        var form = new mini.Form("#tzs");
        if (!form.validate()) return;
        var formData = form.getData(true);
        mini.confirm("请确认是否发放", "提示", function (action) {
            if (action == 'ok') {
                let jkrq = new Date(Date.parse(formData.jkrq.replace('年', '-').replace('月', '-').replace('日', '')))
                switch (zstzs.dataInfo.swsxdm) {
                    case "30060107":
                        data = { //石脑油、燃料油消费税退税
                            "swsxdm": zstzs.dataInfo.swsxdm,    //税务事项代码，必传
                            "wszg": formData.wszg,    //文书字轨
                            "nh": formData.nh,      //年号
                            "wh": formData.wh,   //文号
                            "djxh": zstzs.dataInfo.djxh,
                            "wsh": zstzs.tag == 'Y' ? formData.tywsh : formData.btywsh,   //文书号
                            "sqxh": zstzs.dataInfo.sqxh,   //事项的申请序号
                            "tsje": formData.tsje,    //退税金额
                            "tkzh": formData.tkzh,     //办理退库时《税收收入退还书》的字号
                            "sfzjhm": formData.sfzjhm,       //身份证件号码
                            "qkyhmc": formData.qkyhmc,       //取款银行名称
                            "qkyhdz": formData.qkyhdz,       //取款银行地址
                            "swjgmc": zstzs.dataInfo.swjgmc,   //税务机关名称
                            "nsrsbh": zstzs.dataInfo.nsrsbh,
                            "nsrmc": zstzs.dataInfo.nsrmc,
                            "zfYear": new Date().getFullYear(),   //制发通知书年份
                            "zfMonth": new Date().getMonth() + 1,    //制发通知书月份
                            "zfDay": new Date().getDate(),      //制发通知书日
                            "isTg": zstzs.tag,    //终审是否通过标志
                            "jdzd": formData.jdzd,   //机动字段
                            "zgswjgDm": zstzs.dataInfo.swjgDm  //主管税务机关所属分局代码
                        }
                        break;
                    case "30060108":
                        data = { //不予加收滞纳金审批
                            "wszg": formData.wszg,    //文书字轨
                            "nh": formData.nh,      //年号
                            "wh": formData.wh,   //文号
                            "jdzd": formData.jdzd,   //机动字段
                            "djxh": zstzs.dataInfo.djxh,
                            "wsh": zstzs.tag == 'Y' ? formData.tywsh : formData.btywsh,   //文书号
                            "sqxh": zstzs.dataInfo.sqxh,
                            "jkYear": jkrq.getFullYear(),    //缴款截止年份
                            "jkMonth": jkrq.getMonth() + 1,     //缴款截止月份
                            "jkDay": jkrq.getDate(),       //缴款截止日
                            "swjgmc": zstzs.dataInfo.swjgmc,   //税务机关名称
                            "nsrsbh": zstzs.dataInfo.nsrsbh,
                            "nsrmc": zstzs.dataInfo.nsrmc,
                            "zfYear": new Date().getFullYear(),   //制发通知书年份
                            "zfMonth": new Date().getMonth() + 1,    //制发通知书月份
                            "zfDay": new Date().getDate(),      //制发通知书日
                            "swsxdm": zstzs.dataInfo.swsxdm,   //税务事项代码
                            "isTg": zstzs.tag,    //终审是否通过标志
                            "zgswjgDm": zstzs.dataInfo.swjgDm   //主管税务机关所属分局代码
                        }
                        break;
                    case "60030109":
                        data = { //税收优惠资格取消
                            "swjgmc": zstzs.dataInfo.swjgmc,   //税务机关名称
                            "swsxdm": zstzs.dataInfo.swsxdm,   //税务事项代码，必传
                            "wszg": formData.wszg,    //文书字轨
                            "nh": formData.nh,     //年号
                            "wh": formData.wh,  //文号
                            "djxh": zstzs.dataInfo.djxh,
                            "wsh": zstzs.dataInfo.wsh,   //文书号
                            "sqxh": zstzs.dataInfo.sqxh,     //事项的申请序号
                            "byslly": formData.byslly,       //不予受理理由
                            "nsrsbh": zstzs.dataInfo.nsrsbh,
                            "nsrmc": zstzs.dataInfo.nsrmc,
                            "blYear": zstzs.dataInfo.sqsj.getFullYear() || '',  //制发通知书年份
                            "blMonth": zstzs.dataInfo.sqsj.getMonth() + 1 || '',   //制发通知书月份
                            "blDay": zstzs.dataInfo.sqsj.getDate() || '',   //制发通知书日
                            "zfYear": new Date().getFullYear(),   //制发通知书年份
                            "zfMonth": new Date().getMonth() + 1,    //制发通知书月份
                            "zfDay": new Date().getDate(),      //制发通知书日
                            "isTg": zstzs.tag,    //终审是否通过标志
                            "jdzd": formData.jdzd,    //机动字段
                            "zgswjgDm": zstzs.dataInfo.swjgDm  //主管税务机关所属分局代码
                        }
                        break;
                    case "60010220":
                        data = { //境外注册中资控股居民企业认定
                            "swsxdm": zstzs.dataInfo.swsxdm,   //税务事项代码，必传
                            "wszg": formData.wszg,    //文书字轨
                            "nh": formData.nh,   //年号
                            "wh": formData.wh,   //文号
                            "djxh": zstzs.dataInfo.djxh,
                            "wsh": zstzs.dataInfo.wsh,  //文书号
                            "sqxh": zstzs.dataInfo.sqxh,   //事项的申请序号
                            "bfhgd": formData.bfhgd || '',//不符合规定
                            "sh": formData.sh,//税函
                            "hh": formData.hh,//函号
                            "nd": formData.nd,//年度
                            "nsrsbh": zstzs.dataInfo.nsrsbh,
                            "nsrmc": zstzs.dataInfo.nsrmc,
                            "zfYear": new Date().getFullYear(),   //制发通知书年份
                            "zfMonth": new Date().getMonth() + 1,    //制发通知书月份
                            "zfDay": new Date().getDate(),      //制发通知书日
                            "isTg": zstzs.tag,    //终审是否通过标志
                            "jdzd": formData.jdzd,//机动字段
                            "zgswjgDm": zstzs.dataInfo.swjgDm,//主管税务机关所属分局代码
                            "zgswskfjMc": zstzs.dataInfo.zgswskfjMc,  //主管税务机关所属分局代码
                            "swjgmc": zstzs.dataInfo.swjgmc, //主管税务机关名称
                            "lxrxm": formData.lxrxm, //联系人姓名
                            "lxrdh": formData.lxrdh //联系人电话
                        }
                        break;
                    case "SXA072016001":
                        data = { //增值税留抵欠税
                            "swjgmc": zstzs.dataInfo.swjgmc,   //税务机关名称
                            "swsxdm": zstzs.dataInfo.swsxdm,   //税务事项代码，必传
                            "wszg": formData.wszg,    //文书字轨
                            "nh": formData.nh,   //年号
                            "wh": formData.wh,   //文号
                            "djxh": zstzs.dataInfo.djxh,
                            "wsh": zstzs.dataInfo.wsh,   //文书号
                            "sqxh": zstzs.dataInfo.sqxh,   //事项的申请序号
                            "zzsqjse": formData.zzsqjse,  //增值税欠缴税额
                            "yjznj": formData.yjznj,  //应缴滞纳金
                            "zzsjxldse": formData.zzsjxldse,  //增值税进项留抵税额
                            "zzsldse": formData.zzsldse,  //增值税留抵税额
                            "djqjse": formData.djqjse,//抵减欠缴税额
                            "djznj": formData.djznj,//抵减滞纳金
                            "syzzsldse": formData.syzzsldse,//尚余增值税留抵税额
                            "bysl": formData.zzsByslly,//增值税留抵欠税-不予受理理由
                            "nsrsbh": zstzs.dataInfo.nsrsbh,
                            "nsrmc": zstzs.dataInfo.nsrmc,
                            "blYear": zstzs.dataInfo.sqsj.getFullYear() || '',  //申请通过年份
                            "blMonth": zstzs.dataInfo.sqsj.getMonth() + 1 || '', //申请通过月份
                            "blDay": zstzs.dataInfo.sqsj.getDate() || '',   //申请通过日期
                            "tgYear": new Date().getFullYear(),   //制发通知书年份
                            "tgMonth": new Date().getMonth() + 1,    //制发通知书月份
                            "tgDay": new Date().getDate(),      //制发通知书日
                            "isTg": zstzs.tag,    //终审是否通过标志
                            "jdzd": formData.jdzd,//机动字段
                            "zgswjgDm": zstzs.dataInfo.swjgDm//主管税务机关所属分局代码
                        }
                        break;
                    case "60010711":
                        data = { //非居民企业间接转让财产事项报告
                            "swjgmc": zstzs.dataInfo.swjgmc,   //税务机关名称
                            "swsxdm": zstzs.dataInfo.swsxdm,   //税务事项代码，必传
                            "wszg": formData.wszg,    //文书字轨
                            "nh": formData.nh,   //年号
                            "wh": formData.wh,   //文号
                            "djxh": zstzs.dataInfo.djxh,
                            "wsh": zstzs.dataInfo.wsh,   //文书号
                            "sqxh": zstzs.dataInfo.sqxh,   //事项的申请序号
                            "nsrsbh": zstzs.dataInfo.nsrsbh,
                            "nsrmc": zstzs.dataInfo.nsrmc,
                            "blYear": zstzs.dataInfo.sqsj.getFullYear() || '',  //制发通知书年份
                            "blMonth": zstzs.dataInfo.sqsj.getMonth() + 1 || '',   //制发通知书月份
                            "blDay": zstzs.dataInfo.sqsj.getDate() || '',   //制发通知书日
                            "zfYear": new Date().getFullYear(),   //制发通知书年份
                            "zfMonth": new Date().getMonth() + 1,    //制发通知书月份
                            "zfDay": new Date().getDate(),      //制发通知书日
                            "isTg": zstzs.tag,    //终审是否通过标志
                            "jdzd": formData.jdzd,//机动字段
                            "zgswjgDm": zstzs.dataInfo.swjgDm,//主管税务机关所属分局代码
                            "xgsm": formData.xgsm, // 相关说明
                            "bysl": formData.fjmbyslly //不予受理理由
                        }
                        break;
                    case "110418":
                        data = { // 无欠税证明
                            "swjgmc": zstzs.dataInfo.swjgmc,   //税务机关名称
                            "swsxdm": zstzs.dataInfo.swsxdm,   //税务事项代码，必传
                            "wszg": formData.wszg,    //文书字轨
                            "nh": formData.nh,   //年号
                            "wh": formData.wh,   //文号
                            "djxh": zstzs.dataInfo.djxh,
                            "wsh": zstzs.dataInfo.wsh,   //文书号
                            "sqxh": zstzs.dataInfo.sqxh,   //事项的申请序号
                            "nsrsbh": zstzs.dataInfo.nsrsbh,
                            "nsrmc": zstzs.dataInfo.nsrmc,
                            "blYear": formData.wqsNd,  //办理通知书年份
                            "blMonth": formData.wqsYd,   //办理通知书月份
                            "blDay": formData.wqsR,   //办理通知书日
                            "zfYear": new Date().getFullYear(),   //制发通知书年份
                            "zfMonth": new Date().getMonth() + 1,    //制发通知书月份
                            "zfDay": new Date().getDate(),      //制发通知书日
                            "isTg": zstzs.tag,    //终审是否通过标志
                            "jdzd": formData.jdzd,//机动字段
                            "zgswjgDm": zstzs.dataInfo.swjgDm,//主管税务机关所属分局代码
                            "yxzjlx": zstzs.yxzjlx, // 证件类型
                            "yxzjhm": zstzs.yxzjhm, // 证件号码
                            "bysl": formData.qszmbyslly //不予受理理由
                        }
                        break;
                    default:
                        break;
                }
                $.ajax({
                    url: '/dzgzpt-wsys/api/sh/zfzstzs/zf/tzs',
                    type: 'POST',
                    data: mini.encode(data),
                    contentType: 'application/json; charset=UTF-8',
                    success: function (res) {
                        if (res.success) {
                            mini.alert("发送成功！", "", function (action) {
                                if (action == 'ok') {
                                    zstzs.updateBlzt()
                                }
                            })
                        } else {
                            mini.alert(res.message || "发送失败!")
                        }
                    },
                    error: function (err) {
                        mini.alert('网络异常，请稍后再试！')
                    }
                })

            }
        })
    },
    // 更新办理状态
    updateBlzt: function () {
        let data = {
            sqxh: zstzs.dataInfo.sqxh,
            blztDm: zstzs.tag == 'Y' ? '04' : '05',
        }
        $.ajax({
            url: '/dzgzpt-wsys/api/sh/zfzstzs/update/blzt',
            type: 'POST',
            data: mini.encode(data),
            contentType: 'application/json; charset=UTF-8',
            success: function (res) {
                if (res.success) {
                    window.CloseOwnerWindow && window.CloseOwnerWindow('ok');
                } else {
                    mini.alert(res.message || "办理状态更新失败!")
                }
            },
            error: function (err) {
                mini.alert('网络异常，请稍后再试！')
            }
        })
    }
}