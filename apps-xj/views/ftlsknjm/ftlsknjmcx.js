$(function () {
    gldUtil.addWaterInPages();
    mini.parse();
    ftlsknObj.init();
});

var ftlsknApi = {
    getGridData: "/dzgzpt-wsys/api/ftlskn/queryFtlsknInfo",// 查询
    exportExcel: "/dzgzpt-wsys/api/ftlskn/downFtlsknInfo",// 导出
    queryJmsbasx: "/dzgzpt-wsys/api/ftlskn/queryJmsbasx",// 查询减免事项
    querySwjg: "/dzgzpt-wsys/api/ftlskn/querySwjg" // 查税务机关
}
var cztdsyssebzList = [ //减免原因
    { "code": 'all', "value": '全部' },
    { "code": '1', "value": '一级区域，每平方米年税额15元' },
    { "code": '2', "value": '二级区域，每平方米年税额10元' },
    { "code": '3', "value": '三级区域，每平方米年税额6元' },
    { "code": '4', "value": '四级区域，每平方米年税额3元' },
    { "code": '5', "value": '五级区域，每平方米年税额1.5元' },
];
var jmyyList = [ //减免原因
    { "code": 'all', "value": '全部' },
    { "code": '1', "value": '房屋土地被政府应急征用' },
    { "code": '2', "value": '主动为租户减免房地产租金' }
];
var ftlsknObj = {
    exportData: '',
    key: true, // 防止多次点击
    ftlsknGrid: null,
    cxtjForm: null,
    param: null,
    init: function () {
        this.ftlsknGrid = mini.get("ftlsknGrid");
        this.cxtjForm = new mini.Form("#cxtjForm");
        this.jmyxqqDom = mini.get('jmyxqq');
        this.jmyxqzDom = mini.get('jmyxqz');
        this.zysjqDom = mini.get('zysjq');
        this.zysjzDom = mini.get('zysjz');
        this.jmzjsjqDom = mini.get('jmzjsjq');
        this.jmzjsjzDom = mini.get('jmzjsjz');
        mini.get("#jmyy").setData(jmyyList);
        mini.get("#cztdsyssebz").setData(cztdsyssebzList);
        this.dateChange(); // 初始化-时间
        this.querySwjgList();//主管税务机关
        this.queryJmsbasxList();// 减免事项
        this.doSearch();// 初始化-调查询接口

    },
    querySwjgList: function () { //主管税务机关
        var zgswjgdmOption = { swjgDM: 'all', swjgJC: '全部' };
        $.ajax({
            url: ftlsknApi.querySwjg,
            type: 'post',
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
                        res.value.unshift(zgswjgdmOption)
                        mini.get('zgswjgdm').setData(res.value);
                    }
                }
            },
            error: function (res) {
                mini.unmask();
                mini.alert(res.message || '系统出现故障，请稍后重试');
            }
        });
    },

    queryJmsbasxList: function () {//减免税备案事项
        var jmsbasxOption = { key: 'all', val: '全部' };
        $.ajax({
            url: ftlsknApi.queryJmsbasx,
            type: 'post',
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
                        res.value.unshift(jmsbasxOption)
                        mini.get('jmsbasx').setData(res.value);
                    }
                }
            },
            error: function (res) {
                mini.unmask();
                mini.alert(res.message || '系统出现故障，请稍后重试');
            }
        });
    },
    dateChange: function () {
        var date = new Date();
        this.jmyxqqDom.setValue(mini.formatDate(date, "yyyy-MM"));
        this.jmyxqzDom.setValue(mini.formatDate(date, "yyyy-MM"));
        this.zysjqDom.setValue(mini.formatDate(date, "yyyy-MM"));
        this.zysjzDom.setValue(mini.formatDate(date, "yyyy-MM"));
        this.jmzjsjqDom.setValue(mini.formatDate(date, "yyyy-MM"));
        this.jmzjsjzDom.setValue(mini.formatDate(date, "yyyy-MM"));
    },
    hasKey: function () {
        ftlsknObj.key = false;
        setTimeout(function () {
            ftlsknObj.key = true;
        }, 1000);
    },
    doSearch: function () {
        var searchForm = new mini.Form('#cxtjForm');
        searchForm.validate();
        var formData = searchForm.getData();
        formData.jmyxqq = mini.get("jmyxqq").getFormValue();
        formData.jmyxqz = mini.get("jmyxqz").getFormValue();
        formData.zysjq = mini.get("zysjq").getFormValue();
        formData.zysjz = mini.get("zysjz").getFormValue();
        formData.jmzjsjq = mini.get("jmzjsjq").getFormValue();
        formData.jmzjsjz = mini.get("jmzjsjz").getFormValue();
        if (mini.get("jmyxqq").getValue() > mini.get("jmyxqz").getValue()) {
            mini.alert('减免有效期起不能大于止!');
        }
        if (mini.get("zysjq").getValue() > mini.get("zysjz").getValue()) {
            mini.alert('征用时间起不能大于止!');
        }
        if (mini.get("jmzjsjq").getValue() > mini.get("jmzjsjz").getValue()) {
            mini.alert('减免租金时间起不能大于止!');
        }
        if (!searchForm.isValid()) {
            return false;
        }
        if (formData.jmsbasx === 'all') {
            formData.jmsbasx = '';
        }
        if (formData.cztdsyssebz === 'all') {
            formData.cztdsyssebz = '';
        }
        if (formData.jmyy === 'all') {
            formData.jmyy = '';
        }
        if (!ftlsknObj.key) return;
        ftlsknObj.hasKey();
        var params = $.extend({}, {
            pageIndex: ftlsknObj.pageIndex || ftlsknObj.ftlsknGrid.getPageIndex(),
            pageSize: ftlsknObj.pageSize || ftlsknObj.ftlsknGrid.getPageSize()
        }, formData);
        ftlsknObj.exportData = params
        $.ajax({
            url: ftlsknApi.getGridData,
            data: mini.encode(params),
            type: "post",
            contentType: "application/json; charset=utf-8",
            success: function (res) {
                if (res.success) {
                    var datas = mini.decode(res);
                    ftlsknObj.ftlsknGrid.setData(datas.value.data || []);
                    ftlsknObj.ftlsknGrid.setTotalCount(datas.value.total);
                    ftlsknObj.ftlsknGrid.setPageIndex(ftlsknObj.ftlsknGrid.pageIndex);
                } else {
                    mini.alert(res.message || '暂无数据！');
                }
            },
            error: function () {
            }
        });
    },
    doReset: function () {// 重置
        var form = new mini.Form("#cxtjForm");
        form.reset();// 查询条件置空
        mini.get('jmyy').setValue('');// 减免原因置空
        mini.get('cztdsyssebz').setValue('');// 城镇土地使用税税额标准置空
        mini.get('jmsbasx').setValue('');// 减免税备案事项置空
        mini.get('ftlsknGrid').setData('');// 查询结果置空
    },
    onpagechanged: function (e) {
        ftlsknObj.pageIndex = e.pageIndex;
        ftlsknObj.pageSize = e.pageSize;
        ftlsknObj.doSearch();
    },
    onbeforeload: function (e) {
        e.cancel = true;
    },
    doExport: function () {// 导出
        if (!ftlsknObj.ftlsknGrid.data || (ftlsknObj.ftlsknGrid.data && ftlsknObj.ftlsknGrid.data.length > 0)) {
            var searchForm = new mini.Form('#cxtjForm');
            searchForm.validate();
            if (!searchForm.isValid()) {
                return false;
            }
            var req = searchForm.getData();
            req.jmyxqq = mini.get("jmyxqq").getFormValue();
            req.jmyxqz = mini.get("jmyxqz").getFormValue();
            req.zysjq = mini.get("zysjq").getFormValue();
            req.zysjz = mini.get("zysjz").getFormValue();
            req.jmzjsjq = mini.get("jmzjsjq").getFormValue();
            req.jmzjsjz = mini.get("jmzjsjz").getFormValue();
            if (req.jmsbasx === 'all') {
                req.jmsbasx = '';
            }
            if (req.cztdsyssebz === 'all') {
                req.cztdsyssebz = '';
            }
            if (req.jmyy === 'all') {
                req.jmyy = '';
            }
            var params = $.extend({}, {
                pageIndex: ftlsknObj.pageIndex || ftlsknObj.ftlsknGrid.getPageIndex(),
                pageSize: ftlsknObj.pageSize || ftlsknObj.ftlsknGrid.getPageSize()
            }, req);
            ftlsknObj.exportData = params
            $('#frame').attr('src', encodeURI(ftlsknApi.exportExcel + '?params=' + mini.encode(params)));
        } else {
            mini.alert("暂无数据，无法导出Excel！");
        }

    }
};

