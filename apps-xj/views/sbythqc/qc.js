/**
 * Created by liun on 2019/4/24.
 */
var qc = {
    pageSize: 30,
    nowYear: null,
    nowMonth: null,
    selectedDh: {},
    searchUrl: '/dzgzpt-wsys/api/wtgl/sbtc/getSbythqc',// 查询
    exportUrl: '/dzgzpt-wsys/api/wtgl/sbtc/download/sbythqc',// 导出
    nsrztUrl: '/dzgzpt-wsys/api/wtgl/sbtc/queryNsrzt',// 纳税人状态
    zlztUrl: '/dzgzpt-wsys/api/wtgl/sbtc/get/zlzt',// 责令状态
    cfztUrl: '/dzgzpt-wsys/api/wtgl/sbtc/get/cfzt',// 处罚状态
    zsxmUrl: '/dzgzpt-wsys/api/wtgl/sbtc/get/zsxm',// 征收项目下拉
    init: function () {
        var now = new Date($.ajax({ async: false }).getResponseHeader('Date'));
        this.nowYear = now.getFullYear();
        this.nowMonth = now.getMonth() + 1;
        this.getSelectOptions()
        this.initSelect();
    },
    getSelectOptions: function () {
        //纳税人状态
        var resultOption = { ID: '', MC: '全部' };
        $.ajax({
            url: this.nsrztUrl,
            type: 'GET',
            contentType: 'application/json;charset=UTF-8',
            async: false,
            success: function (res) {
                mini.unmask();
                if (res.message === 'ajaxSessionTimeOut') {
                    top.location.reload(true);
                    return;
                }
                if (res.success !== undefined && !res.success) {
                    mini.alert(res.message || '系统出现故障，请稍后重试');
                } else {
                    if (res.value && res.value.length >= 0) {
                        res.value.unshift(resultOption)
                        mini.get('nsrztDm').setData(res.value);
                    }
                }
            },
            error: function (res) {
                mini.unmask();
                mini.alert(res.message || '系统出现故障，请稍后重试');
            }
        });
        // 责令状态
        $.ajax({
            url: this.zlztUrl,
            type: 'GET',
            contentType: 'application/json;charset=UTF-8',
            async: false,
            success: function (res) {
                mini.unmask();
                if (res && res.length > 0) {
                    res.unshift(mini.get('zlzt').getData()[0])
                    mini.get('zlzt').setData(res);
                } else {
                    mini.alert(res.message || '系统出现故障，请稍后重试')
                }
            },
            error: function (res) {
                mini.unmask();
                mini.alert(res.message || '系统出现故障，请稍后重试');
            }
        });
        // 处罚状态
        $.ajax({
            url: this.cfztUrl,
            type: 'GET',
            contentType: 'application/json;charset=UTF-8',
            async: false,
            success: function (res) {
                mini.unmask();
                res = mini.decode(res)
                if (res && res.length > 0) {
                    res.unshift(mini.get('cfzt').getData()[0])
                    mini.get('cfzt').setData(res);
                } else {
                    mini.alert(res.message || '系统出现故障，请稍后重试')
                }
            },
            error: function (res) {
                mini.unmask();
                mini.alert(res.message || '系统出现故障，请稍后重试');
            }
        });
        // 征收项目下拉
        $.ajax({
            url: this.zsxmUrl,
            type: 'GET',
            contentType: 'application/json;charset=UTF-8',
            async: false,
            success: function (res) {
                mini.unmask();
                res = mini.decode(res)
                if (res && res.length > 0) {
                    res.unshift(mini.get('zsxmDm').getData()[0])
                    mini.get('zsxmDm').setData(res);
                } else {
                    mini.alert(res.message || '系统出现故障，请稍后重试')
                }
            },
            error: function (res) {
                mini.unmask();
                mini.alert(res.message || '系统出现故障，请稍后重试');
            }
        });
    },
    ndChanged: function (e) {
        var yd = Number(mini.get('yf').getValue());
        if (Number(e.value) === qc.nowYear) {
            var maxMonth = qc.nowMonth;
        } else {
            var maxMonth = 12;
        }
        var ydArr = [];
        for (var i = 1; i <= maxMonth; i++) {
            ydArr.push({ code: (i > 9 ? '' + i : '0' + i), value: (i > 9 ? '' + i : '0' + i) });
        }
        mini.get('yf').setData(ydArr);
        if (yd <= maxMonth) {
            mini.get('yf').setValue(yd);
        } else {
            mini.get('yf').setValue('');
        }
    },
    search: function (pageIndex, pageSize) {// 查询
        var searchForm = new mini.Form('search-box');
        searchForm.validate();
        if (!searchForm.isValid()) {
            return false;
        }
        var req = searchForm.getData();
        req.pageIndex = pageIndex.toString();
        req.pageSize = pageSize.toString();
        mini.mask('查询中...');
        $.ajax({
            url: this.searchUrl,
            data: mini.encode(req),
            type: 'POST',
            contentType: 'application/json;charset=UTF-8',
            async: false,
            success: function (res) {
                mini.unmask();
                if (res.message === 'ajaxSessionTimeOut') {
                    top.location.reload(true);
                    return;
                }
                if (!res.success) {
                    mini.alert(res.message || '系统出现故障，请稍后重试');
                } else if (res) {
                    var grid = mini.get('ghqc_grid');
                    grid.setTotalCount(Number(res.total));
                    grid.setPageSize(pageSize);
                    grid.setPageIndex(pageIndex);
                    $.each(res.data, function (i, v) {
                        if (v.bdjg == 'Y') {
                            v.bdjgText = '比对一致'
                        } else if (v.bdjg == 'N') {
                            v.bdjgText = '比对不一致'
                        } else {
                            v.bdjgText = ''
                        }
                    })
                    grid.setData(res.data || []);
                    $.each(res.data, function (i, v) {
                        if (v.bdjg == 'N') {
                            grid.addRowCls(grid.getRow(i), 'yellowBg');
                        }
                    })
                }
            },
            error: function (res) {
                mini.unmask();
                mini.alert(res.message || '系统出现故障，请稍后重试');
            }
        });
    },
    initSelect: function () {
        // 年度/月份
        var ndList = [];
        for (var i = 2018; i <= this.nowYear; i++) {
            ndList.push({ code: '' + i, value: i });
        }
        mini.get('nd').setData(ndList);
        mini.get('nd').setValue(this.nowYear, false);
        var ydList = [];
        for (var i = 1; i <= this.nowMonth; i++) {
            ydList.push({ code: (i > 9 ? '' + i : '0' + i), value: (i > 9 ? '' + i : '0' + i) });
        }
        mini.get('yf').setData(ydList);
        mini.get('yf').setValue(this.nowMonth > 9 ? '' + this.nowMonth : '0' + this.nowMonth);
        mini.get('nsrztDm').setValue('');
        mini.get('swjgDm').setValue('');
        // 申报状态
        mini.get('sbzt').setValue('');
        // 缴款状态
        mini.get('jkzt').setValue('');
        // 责令状态
        mini.get('zlzt').setValue('');
        // 自动责令状态
        mini.get('zdzlzt').setValue('');
        // 核实状态
        mini.get('hszt').setValue('');
        // 处罚状态
        mini.get('cfzt').setValue('');
        // 征收项目下拉
        mini.get('zsxmDm').setValue('');
        // 签订电子送达确认
        mini.get('wssdzt').setValue('');
    },
    beforeLoad: function (e) {// 点 查询 按钮
        e.cancel = true;
        var pageIndex = e.data.pageIndex, pageSize = e.data.pageSize;
        qc.pageSize = pageSize;
        qc.search(pageIndex, pageSize);
    },
    doReset: function () {
        // 重置
        qc.initSelect()
        mini.get('ghqc_grid').setData("");
    },
    exportAll: function () {// 导出
        var grid = mini.get('ghqc_grid');
        if (!grid.getData().length) {
            mini.alert("暂无数据，无需导出")
            return
        }
        if (grid.totalCount > 100000) {
            mini.alert("最多导出100000条记录，请重新选择~")
            return
        }
        var searchForm = new mini.Form('search-box');
        var req = searchForm.getData();
        req.pageIndex = grid.pageIndex
        req.pageSize = grid.pageSize
        window.open(this.exportUrl + '?bdjg=' + req.bdjg + '&cfzt=' + req.cfzt + '&hszt=' + req.hszt + '&jkzt=' + req.jkzt + '&nd=' + req.nd + '&nsrsbh=' + req.nsrsbh + '&nsrztDm=' + req.nsrztDm + '&pageIndex=' + req.pageIndex + '&pageSize=' + req.pageSize + '&sbzt=' + req.sbzt + '&swjgDm=' + req.swjgDm + '&yf=' + req.yf + '&zdzlzt=' + req.zdzlzt + '&zlzt=' + req.zlzt + '&zsxmDm=' + req.zsxmDm + '&wssdzt=' + req.wssdzt)
    },
    openAsk: function () {
        var htmlStr = "<h2 style='text-align:center;margin-bottom:30px;'>说明</h2><div style='width:60%;margin:0 auto;'><p>申报状态&nbsp;&nbsp;更新频率：每小时一更新</p><p>缴款状态&nbsp;&nbsp;更新频率：每小时一更新</p><p>责令状态&nbsp;&nbsp;更新频率：T+1</p><p>核实状态&nbsp;&nbsp;更新频率：T+1</p><p>申报状态&nbsp;&nbsp;处罚频率：每小时一更新</p><p>是否已自动责令&nbsp;&nbsp;更新频率：T+1</p></div>"
        mini.showMessageBox({
            showHeader: false,
            showModal: true,
            width: 600,
            message: htmlStr,
            buttons: ['确认']
        });
    }
};
$(function () {
    gldUtil.addWaterInPages();
    qc.init();
});
mini.VTypes["nsrsbhErrorText"] = "请输入正确的社会信用代码";

function onZlyyRenderer(e) {
    var record = e.record
    return "<a href='#'  onclick='showYyDetail(record.zlyy)'>查看</a>"
}

function onCfyyRenderer(e) {
    var record = e.record
    return "<a href='#'  onclick='showYyDetail(record.cfyy)'>查看</a>"
}

function showYyDetail(value) {
    mini.alert(value || '', "详情")
}
