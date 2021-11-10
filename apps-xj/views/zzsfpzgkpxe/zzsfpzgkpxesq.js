var kpxesq = {
    zlqd: [{ bltj: '增值税专用发票最高开票限额长期升版审核结果调整表', required: true, checked: true }, { bltj: '纳税人情况说明', required: true }, { bltj: '纳税人合同等相关业务资料', required: false }],
    kpxeList: [{ "kpxedm": "1", "kpxemc": "一亿元" }, { "kpxedm": "2", "kpxemc": "一千万元" }, { "kpxedm": "3", "kpxemc": "一百万元" }]
};
var kpxesqApiHead = "/dzgzpt-wsys/";
var kpxesqApi = {
    handleSearch: kpxesqApiHead + "api/sh/zgkpxesqrgtz/get/sqjk",
    /* 查询(获取事前监控的结果集) */
    handleZbSearch: kpxesqApiHead + "api/sh/zgkpxesqrgtz/get/shzb",
    /* 查询(获取审核指标的结果集 */
    queryNsrxx: kpxesqApiHead + "api/sh/zgkpxesqrgtz/query/nsr",
    /* 查询纳税人信息 */
    queryFpzlList: kpxesqApiHead + "api/sh/zgkpxesqrgtz/query/zppz/",
    /* 获取发票种类下拉 */
    saveSqxx: kpxesqApiHead + "api/sh/zgkpxesqrgtz/save/sqxx",
    /* 保存申请信息 */
    sendGwdb: kpxesqApiHead + "api/sh/zgkpxesqrgtz/send/gwdb",
    /* 推送岗位待办 */
};

$(function () {
    gldUtil.addWaterInPages();
    mini.parse();
    kpxesq.dataGrid = mini.get("kpxesq-grid");
    kpxesq.validateGrid = mini.get("validate-info");
    kpxesq.zlqdGrid = mini.get("zlqd-info");
    kpxesq.mxxxWindow = mini.get("mxxxWindow");
    kpxesq.searchForm = new mini.Form("#kpxesq-form");
});

kpxesq.onnsrsbhchanged = function (e, type) {
    // 根据纳税人识别号查询纳税人名称
    e.value && $.ajax({
        url: kpxesqApi.queryNsrxx,
        type: 'post',
        contentType: 'application/x-www-form-urlencoded',
        data: { nsrsbh: e.value || '', nsrmc: '' },
        success: function (res) {
            if (res && res.success && res.value) {
                kpxesq.info = res.value || ''
                mini.get('nsrmc').setValue(res.value.nsrmc || '')
                if (type !== 'zbmx') {
                    kpxesq.dataGrid.setData([])
                    kpxesq.getFpzlList()
                }
            } else {
                mini.alert(res.message || "系统异常，请稍后再试~", "提示");
            }
        }
    })
}

/* 发票种类下拉查询 */
kpxesq.getFpzlList = function () {
    ajax.get(kpxesqApi.queryFpzlList + kpxesq.info.djxh, '', function (res) {
        if (res && res.success && res.value) {
            kpxesq.fpzlList = res.value || []
        } else {
            mini.alert(res.message || "系统异常，请稍后再试~", "提示");
        }
    });
};

/* 查询 */
kpxesq.handleSearch = function () {
    var form = kpxesq.searchForm,
        grid = kpxesq.dataGrid;
    if (!form.validate()) return;
    if (grid.getSelecteds().length < 1) {
        mini.alert('请至少选择一条数据~')
        return
    }
    var zgkpxedms = [], flag = true;
    $.each(grid.getSelecteds(), function (i, v) {
        if (!v.kpxedm || !v.fpzldm) {
            mini.alert('存在空行，请确认！')
            flag = false
            return false
        }
        zgkpxedms.push(v.kpxedm)
    })
    var params = $.extend({}, { djxh: kpxesq.info.djxh || '' }, { zgkpxedms });
    flag && $.ajax({
        type: "POST",
        url: kpxesqApi.handleSearch,
        contentType: 'application/json;charset=utf-8',
        data: mini.encode(params),
        success: function (res) {
            if (res && res.success && res.value) {
                kpxesq.zlqdGrid.setData(kpxesq.zlqd)
                kpxesq.validateGrid.setData(res.value || [])
            } else {
                mini.alert(res.message || "系统异常，请稍后再试~", "提示");
            }
        },
        error: function (e) {
            mini.alert("系统异常，请稍后再试~");
        }
    });
};
/* 指标查询 */
kpxesq.handleZbSearch = function () {
    var form = kpxesq.searchForm,
        bwyGrid = mini.get('bwy-info'), qwyGrid = mini.get('qwy-info'), yyGrid = mini.get('yy-info');
    if (!form.validate()) return;
    $.ajax({
        type: "POST",
        url: kpxesqApi.handleZbSearch,
        contentType: 'application/json;charset=utf-8',
        data: mini.encode({ type: 'cf', djxh: kpxesq.info.djxh, zgkpxedms: ['1', '2', '3'] }),
        success: function (res) {
            if (res && res.success && res.value) {
                for (var key in res.value) {
                    $.each(res.value[key], function () {
                        res.value[key] = res.value[key].sort(function (a, b) {
                            return a.xh >= b.xh ? 1 : -1;
                        })
                    })
                };
                bwyGrid.setData(res.value.ybw || [])
                qwyGrid.setData(res.value.yqw || [])
                yyGrid.setData(res.value.yy || [])
            } else {
                mini.alert(res.message || "系统异常，请稍后再试~", "提示");
            }
        },
        error: function (e) {
            mini.alert("系统异常，请稍后再试~");
        }
    });
}

kpxesq.addRow = function () {
    // 新增数据
    if (!kpxesq.info) {
        mini.alert('请先输入纳税人识别号/社会信用代码~')
        return
    }
    kpxesq.dataGrid.addRow({}, 0);
}

kpxesq.deleteData = function () {
    // 删除数据
    kpxesq.selectedRows = kpxesq.dataGrid.getSelecteds()
    if (kpxesq.selectedRows.length < 1) {
        mini.alert('请选择需要删除的记录！')
        return
    }
    mini.confirm('确认删除选中的数据吗？', '提示', function (action) {
        if (action == 'ok') {
            kpxesq.dataGrid.removeRows(kpxesq.selectedRows)
        } else {
            kpxesq.dataGrid.deselectAll()
        }
    })
}

kpxesq.handleNextStep = function () {
    // 下一步发起流程
    var flag = kpxesq.zlqdGrid.getData().length ? true : false
    $.each(kpxesq.zlqdGrid.getData(), function (i, v) {
        if (v.required && !v.checked) {
            flag = false
        }
    })
    if (!flag) {
        var message = kpxesq.zlqdGrid.getData().length ? '必报资料必须勾选！' : "资料清单不存在，请点击查询~"
        mini.alert(message)
        return
    }
    var validate = kpxesq.validateGrid.getData().length ? true : false
    $.each(kpxesq.validateGrid.getData(), function (i, v) {
        if (!v.result) {
            validate = false
        }
    })
    if (!validate) {
        var msg = kpxesq.validateGrid.getData().length ? '办理前置指标校验未通过~' : "办理前置指标不存在，请点击查询~"
        mini.alert(msg)
        return
    }
    var dzkpxe = kpxesq.dataGrid.getSelecteds()
    $.each(dzkpxe, function (i, v) {
        $.each(kpxesq.kpxeList, function (j, ele) {
            if (ele.kpxedm == v.kpxedm) {
                v.kpxemc = ele.kpxemc
            }
        })
        $.each(kpxesq.fpzlList, function (k, item) {
            if (item.fpzldm == v.fpzldm) {
                v.fpzlmc = item.fpzlmc
            }
        })
    })
    var params = $.extend({}, kpxesq.info, { dzkpxe: JSON.stringify(dzkpxe) })
    $.ajax({
        type: "POST",
        url: kpxesqApi.saveSqxx,
        contentType: 'application/json;charset=utf-8',
        data: mini.encode(params),
        success: function (res) {
            if (res && res.success) {
                ajax.post(kpxesqApi.sendGwdb + '?uuid=' + kpxesq.info.uuid || '', '', function (data) {
                    if (data && data.success && JSON.stringify(data.value) != '{}') {
                        mini.confirm('创建待办任务成功~', '提示', function (action) {
                            if (action == 'ok') {
                                window.open('/workflow/taskOn.html#/originating?taskId=' + data.value.taskId + '&processInstanceId=' + data.value.processInstanceId + '&processId' + data.value.processId + '&swmhOpenType=_swmh&SWMHPortalToken=' + mini.Cookie.get("SWMHPortalToken"))
                            }
                            window.location.reload();
                        })
                    } else {
                        mini.alert(data.message || "系统异常，请稍后再试~", "提示");
                    }
                });
            } else {
                mini.alert(res.message || "系统异常，请稍后再试~", "提示");
            }
        },
        error: function (e) {
            mini.alert("系统异常，请稍后再试~");
        }
    });
}

kpxesq.onzlqdcheckchanged = function (index, checked) {
    var arr = kpxesq.zlqdGrid.getData()
    arr[index].checked = checked
    kpxesq.zlqdGrid.setData(arr)
}

kpxesq.showMxxx = function (record) {
    if (record.mc == "最近两年纳税人是否存在违法行为") {
        kpxesq.mxxxWindow.show()
        mini.get('mxxxGrid').setData(record.btgxq || [])
    } else {
        mini.alert(record.btgxq || '', '不通过明细信息')
    }

}

function onRenderDegree(e) {
    return "<span class='word-blue'>强制监控</span>";
}

function onRenderResult(e) {
    var record = e.record;
    if (record.result) {
        return "<span class='word-green'>监控通过</span>";
    } else {
        return "<span class='word-red'>监控不通过</span>";
    }
}

function onRenderZbcxResult(e) {
    var record = e.record;
    if (!!record.jkjg) {
        return "<span class='word-green'>监控通过</span>";
    } else {
        if (record.btgxq) {
            return "<a class='word-red' onclick='kpxesq.showMxxx(record)'>监控不通过</a>";
        } else {
            return "<span class='word-red'>监控不通过</span>";
        }
    }
}

function onRenderRequire(e) {
    var record = e.record;
    if (record.required) {
        return "<span class='word-blue'>必报</span>";
    } else {
        return "<span class='word-blue'>条件报送</span>";
    }
}
function onRenderQbdq(e) {
    var record = e.record
    var checked = record.checked ? 'checked' : '', index = record._index
    if (index == 0) {
        html = '<label class="function-item"><input disabled ' + checked + ' type="checkbox" hideFocus/>带齐</label>';
    } else {
        html = '<label class="function-item"><input onclick="kpxesq.onzlqdcheckchanged(\'' + index + '\', this.checked)" ' + checked + ' type="checkbox" hideFocus/>带齐</label>';
    }
    return html;
}

function cellcommitedit(sender) {
    if (sender.field == "kpxedm") {
        if (sender.value) {
            if (kpxesq.dataGrid.getData().length > 1) {
                if (sender.value != kpxesq.dataGrid.getData()[kpxesq.dataGrid.getData().length - 1].kpxedm) {
                    mini.alert('请保持申请最高开票限额一致！')
                    sender.cancel = true
                }
            }
        }
    }
}