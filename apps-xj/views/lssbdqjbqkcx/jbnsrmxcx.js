function initData(record, jbzt, topReq) {
    cxtj.topRecord = record
    cxtj.jbzt = jbzt
    cxtj.topReq = topReq
    cxtj.init();
    cxtj.search()
}
var cxtj = {
    searchForm: new mini.Form('search-box'),
    searchUrl: '/dzgzpt-wsys/api/sh/lsjbdqsb/query/mxxx',// 查询
    init: function () {
        var delay = new Date()
        delay.setMonth(delay.getMonth() - 1);
        var jbzt = ''
        if (cxtj.jbzt) {
            jbzt = cxtj.jbzt
            // mini.get('jbzt').setReadOnly(true)
        }
        this.searchForm.setData({ fpzlDm: '', swjgDm: cxtj.topRecord.swjgdm, jbzt: jbzt })
    },
    search: function (pageIndex, pageSize) {// 查询
        this.searchForm.validate()
        if (!this.searchForm.isValid()) {
            return false;
        }
        var req = this.searchForm.getData(true);
        if (req.xkyxqQ > req.xkyxqZ) {
            mini.alert('行政许可到期日起不能大于行政许可到期日止')
            return
        }
        // req.pageIndex = pageIndex.toString();
        // req.pageSize = pageSize.toString();
        var param = $.extend(cxtj.topReq, req)
        var grid = mini.get('mxtj_grid');
        grid.load(param, function (data) {
        }, function (data) {
            var obj = JSON.parse(data.errorMsg);
            mini.alert(obj.message || "系统异常,请稍后再试。")
        });
    },
    doReset: function () {
        // 重置
        this.searchForm.reset()
        this.init()
        var grid = mini.get('mxtj_grid');
        grid.setData("");
    },
    dateChange: function (e, type, name) {
        if (type == 'minDate') {
            mini.get(name).setMinDate(e.value)
        } else if (type == 'maxDate') {
            mini.get(name).setMaxDate(e.value)
        }
    },
    hideWindow: function () {
        var win = mini.get("xqwin");
        win.hide();
    },
    openDetail: function (record) {
        $.ajax({
            url: '/dzgzpt-wsys/api/sh/lsjbdqsb/query/xxqk/' + record.swxzxkuuid,
            type: 'get',
            success: function (res) {
                if (isArray(res)) {
                    var grid = mini.get('xqtj_grid');
                    grid.setData(res)
                    var win = mini.get("xqwin");
                    win.show();
                    if (record.jbzt == '01') {
                        $('#xqtip').show()
                    } else {
                        $('#xqtip').hide()
                    }
                } else {
                    mini.alert(res.message || '系统出现故障，请稍后重试');
                }
            },
            error: function (res) {
                mini.alert(res.message || '系统出现故障，请稍后重试');
            }
        });
    },
    doSdjb: function (record) {
        mini.confirm('请确认是否要手动发起降版操作？若降版失败您可点击【查看详情】，按照提示进行处理。', '提示', function () {
            var req = {
                swxzxkuuid: record.swxzxkuuid,
                djxh: record.djxh,
                sbbh: record.sbbh,
                oldFpzgkpxeDm: record.oldFpzgkpxeDm,
                lrsj: mini.formatDate(record.lrsj, 'yyyy-MM-dd'),
            }
            $.ajax({
                url: '/dzgzpt-wsys/api/sh/lsjbdqsb/sdjb',
                type: 'post',
                data: req,
                success: function (res) {
                    if (res.success) {
                        if (res.value == '00' || res.value == '01') {
                            mini.alert('降版失败，请重试')
                        } else {
                            mini.alert('降版成功', '提示', function () {
                                cxtj.search()
                            })
                        }
                    } else {
                        mini.alert(res.message || '系统出现故障，请稍后重试');
                    }
                },
                error: function (res) {
                    mini.alert(res.message || '系统出现故障，请稍后重试');
                }
            });
        })
    }
}

function onczrenderer(e) {
    var record = e.record
    if (record.jbzt == '00') {
        return '<a style="margin-right:10px;" class="mini-button" onclick="cxtj.openDetail(record)">查看详情</a>' + '<a class="mini-button" onclick="cxtj.doSdjb(record)">手动降版</a>'
    } else {
        return '<a style="margin-right:10px;" class="mini-button" onclick="cxtj.openDetail(record)">查看详情</a>'
    }
}
function onjbztrenderer(e) {
    var record = e.record
    var jbzt = ''
    switch (record.jbzt) {
        case '00':
            jbzt = '同步金三失败'
            break;
        case '01':
            jbzt = '同步金三成功，但同步2.0失败'
            break;
        case '02':
            jbzt = '降版成功'
            break;
        default:
            break;
    }
    return jbzt
}

function isArray(str) {
    return Object.prototype.toString.call(str) == "[object Array]";
}