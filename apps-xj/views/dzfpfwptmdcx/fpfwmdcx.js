$(function () {
    gldUtil.addWaterInPages();
    mini.parse();
    fpfwmdcx.init();
});
var shxydmValid = true;
var sjhmValid = true;
var fpfwmdcx = {
    init: function () {
        this.fpfwmdGrid = mini.get("fpfwmdGrid");
        this.fpfwmdFrom = new mini.Form("#fpfwmdFrom");
    },
    doSearch: function () {
        var formData = fpfwmdcx.fpfwmdFrom.getData(true);
        var params = $.extend({}, {
            pageIndex: fpfwmdcx.pageIndex || fpfwmdcx.fpfwmdGrid.getPageIndex(),
            pageSize: fpfwmdcx.pageSize || fpfwmdcx.fpfwmdGrid.getPageSize()
        }, formData);
        if (formData.nsrsbh) {
            if (!/^[a-zA-Z0-9\-]{13,18}$/.test(formData.nsrsbh)) {
                mini.alert("纳税人识别号必须为13或18位的字母或数字！");
                return false;
            }
        }
        if (formData.ccbarqq) {
            if (formData.ccbarqq > new Date().format("yyyy-MM-dd")) {
                mini.alert("初次备案日期起不能大于今天的日期");
                return false;
            }
        }
        if (formData.ccbarqz) {
            if (formData.ccbarqz > new Date().format("yyyy-MM-dd")) {
                mini.alert("初次备案日期止不能大于今天的日期");
                return false;
            }
        }
        if (formData.dzbarqq) {
            if (formData.dzbarqq > new Date().format("yyyy-MM-dd")) {
                mini.alert("调整备案日期起不能大于今天的日期");
                return false;
            }
        }
        if (formData.dzbarqz) {
            if (formData.dzbarqz > new Date().format("yyyy-MM-dd")) {
                mini.alert("调整备案日期止不能大于今天的日期");
                return false;
            }
        }
        if (formData.ccbarqq && formData.ccbarqz) {
            if (formData.ccbarqq > formData.ccbarqz) {
                mini.alert("初次备案日期起不能大于初次备案日期止");
                return false;
            }
        }
        if (formData.dzbarqq && formData.dzbarqz) {
            if (formData.dzbarqq > formData.dzbarqz) {
                mini.alert("调整备案日期起不能大于调整备案日期止");
                return false;
            }
        }
        fpfwmdcx.fpfwmdGrid.emptyText =
            "<span style='float: left;padding-right: 2%;color: #f00'>暂无数据</span>";
        ajax.get('/dzgzpt-wsys/api/sh/zzsdzfpfwptmd/query/zzsdzfpfwptmd', params, function (res) {
            if (res.success && res.value) {
                fpfwmdcx.fpfwmdGrid.setData(res.value.data);
                fpfwmdcx.fpfwmdGrid.setTotalCount(res.value.total);
            } else {
                fpfwmdcx.fpfwmdGrid.setData([]);
                mini.alert((res && res.message) || "暂无数据", "提示");
            }
        });
    },
    doReset: function () {
        mini.get("nsrsbh").setValue("");
        mini.get("nsrmc").setValue("");
        mini.get("ptmc").setValue("");
        mini.get("ccbarqq").setValue("");
        mini.get("ccbarqz").setValue("");
        mini.get("dzbarqq").setValue("");
        mini.get("dzbarqz").setValue("");
        // fpfwmdcx.fpfwmdGrid.setData('');// 数据清空
    },
    exportFpqd: function () {
        if (fpfwmdcx.fpfwmdGrid.data.length < 1) {
            mini.alert("暂无数据，无法导出！");
            return;
        }
        // var pageIndex = fpfwmdcx.fpfwmdGrid.pageIndex;
        // var pageSize = fpfwmdcx.fpfwmdGrid.pageSize;
        var nsrsbh = mini.get("nsrsbh").value;
        var nsrmc = mini.get("nsrmc").value;
        var ptmc = mini.get("ptmc").value;
        var ccbarqq = mini.formatDate(mini.get("ccbarqq").value, 'yyyy-MM-dd');
        var ccbarqz = mini.formatDate(mini.get("ccbarqz").value, 'yyyy-MM-dd');
        var dzbarqq = mini.formatDate(mini.get("dzbarqq").value, 'yyyy-MM-dd');
        var dzbarqz = mini.formatDate(mini.get("dzbarqz").value, 'yyyy-MM-dd');
        window.open('/dzgzpt-wsys/api/sh/zzsdzfpfwptmd/download/zzsdzfpfwptmd?nsrsbh=' + nsrsbh + '&nsrmc='
            + nsrmc + '&ptmc=' + ptmc + '&ccbarqq=' + ccbarqq + '&ccbarqz=' + ccbarqz + '&dzbarqq=' + dzbarqq
            + '&dzbarqz=' + dzbarqz);
    },
};
// 点击分页
fpfwmdcx.onpagechanged = function (e) {
    fpfwmdcx.pageIndex = e.pageIndex;
    fpfwmdcx.pageSize = e.pageSize;
    fpfwmdcx.doSearch();
};
fpfwmdcx.onbeforeload = function (e) {
    e.cancel = true;
}