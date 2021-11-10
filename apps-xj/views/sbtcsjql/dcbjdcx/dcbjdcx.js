$(function () {
    gldUtil.addWaterInPages();
    mini.parse();
    dcbjdcx.init();
});
var dcbjdcx = {
    pageSize: 30,
    cxtjgrid: null,
    cxtjForm: null,
    init: function () {
        this.cxtjForm = new mini.Form("cxtjForm");
        this.cxtjgrid = mini.get('cxtjgrid');
        var now = new Date($.ajax({ async: false }).getResponseHeader('Date'));
        this.nowYear = now.getFullYear();
        this.nowMonth = now.getMonth() + 1;
        this.initSelect()
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
    },
    ndChanged: function (e) {
        var yd = Number(mini.get('yf').getValue());
        if (Number(e.value) === dcbjdcx.nowYear) {
            var maxMonth = dcbjdcx.nowMonth;
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
    // 查询
    doSearch: function (pageIndex, pageSize) {
        dcbjdcx.cxtjForm.validate();
        var formData = dcbjdcx.cxtjForm.getData(true);
        if (!formData.nd) {
            mini.alert("请选择年度");
            return false;
        }
        if (!formData.yf) {
            mini.alert("请选择月份");
            return false;
        }
        var param = $.extend({}, {
            pageIndex: pageIndex.toString(),
            pageSize: pageSize.toString()
        }, formData);
        dcbjdcx.cxtjgrid.emptyText =
            "<span style='float: left;padding-right: 2%;color: #f00'>暂无数据</span>";
        ajax.get('/dzgzpt-wsys/api/sh/dcbsj/query/hsjdcx', param, function (res) {
            if (res.success && res.value) {
                dcbjdcx.cxtjgrid.setData(res.value.data);
                dcbjdcx.cxtjgrid.setTotalCount(res.value.total);
            } else {
                dcbjdcx.cxtjgrid.setData([]);
                mini.alert((res && res.message) || "暂无数据", "提示");
            }
        });
    },
    beforeLoad: function (e) {
        e.cancel = true;
        var pageIndex = e.data.pageIndex, pageSize = e.data.pageSize;
        dcbjdcx.pageSize = pageSize;
        dcbjdcx.doSearch(pageIndex, pageSize);
    },
    // 重置
    doReset: function () {
        // dcbjdcx.initSelect();  调获取年、月方法
        dcbjdcx.cxtjForm.reset(); // 清空查询条件
        // dcbjdcx.cxtjgrid.setData(""); 不需要清空数据
    },
};