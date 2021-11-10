$(function () {
    mini.parse();
    zdkjywrObj.init();
});

// var zdkjywrApi = {
//     getGridData: "/dzgzpt-wsys/api/sh/fjmsdshd/queryYmyzData"// 查询
// };
var zdkjywrObj = {
    exportData: '',
    key: true, // 防止多次点击
    cxGrid: null,
    cxtjForm: null,
    sdrqQ: null,
    sdrqZ: null,
    param: null,
    blztDm: [{ 'ID': '17', 'value': '待核定' }],
    blztList: [{ 'ID': 'all', 'value': '所有' }, { 'ID': '17', 'value': '待核定' }, { 'ID': '00', 'value': '核定完成' }],
    init: function () {
        this.cxGrid = mini.get("cxGrid");
        this.cxtjForm = new mini.Form("#cxtjForm");
        this.yydWin = mini.get("yyd-win");
        //~起默认当前日期
        this.blqxQ = mini.get("blqxQ");
        this.blqxZ = mini.get("blqxZ");
        this.blztDm = mini.get("blztDm");
        this.blztDm.setData(this.blztList);
        this.blztDm.setValue([{ 'ID': '17', 'value': '待核定' }]);
        this.changeOther();
        this.doSearch()
    },
    changeOther: function () {
        // ~起止默认当前日期
        var sdrqQ = mini.get("sdrqQ");
        var sdrqZ = mini.get("sdrqZ");
        var now = new Date(), delay = new Date();
        delay.setMonth(delay.getMonth() - 1);
        sdrqQ.setValue(mini.formatDate(delay, 'yyyy-MM-dd'));
        sdrqQ.setMaxDate(now);
        sdrqZ.setValue(mini.formatDate(now, 'yyyy-MM-dd'));
        sdrqZ.setMinDate(delay);
        sdrqZ.setMaxDate(now);
    },
    hasKey: function () {
        zdkjywrObj.key = false;
        setTimeout(function () {
            zdkjywrObj.key = true;
        }, 1000);
    },
    //重置
    doReset: function () {
        this.cxtjForm.reset();
        this.cxGrid.setData("");
    },
    // 查询
    doSearch: function () {
        // if (this.blqxQ.value > this.blqxZ.value) {
        //     mini.alert("推送日期起大于推送日期止，请重新选择！", "提示");
        //     return
        // }
        if (!zdkjywrObj.key) return;
        zdkjywrObj.hasKey();

        var formData = this.cxtjForm.getData(true);
        if (!formData.blztDm) {
            mini.alert("请选择受理状态！", "提示");
            return
        }
        if (formData.blztDm === 'all') {// 受理状态  所有
            formData.blztDm = '';
        }
        zdkjywrObj.cxGrid.load({
            data: mini.encode(formData),
        }, function () {
            zdkjywrObj.showsearch()
        }, function (data) {
            var obj = JSON.parse(data.errorMsg);
            mini.alert(obj.message || "系统异常,请稍后再试。")
        })
    },
    // 点击分页
    onpagechanged: function (e) {
        zdkjywrObj.pageIndex = e.pageIndex;
        zdkjywrObj.pageSize = e.pageSize;
        zdkjywrObj.doSearch();
    },
    // 查询条件的 展开、折叠
    showsearch: function () {
        if ($(".searchdiv").is(":hidden")) {
            $(".searchdiv").slideDown();
        } else {
            $(".searchdiv").slideUp();
        }
    },
};
function onActionRenderer(e) { //操作列
    var record = e.record;
    var ylUrl = "/hgzx-gld/index.html#/sxsl/sxsl";
    var lcslId = e.record.lcslid;
    var rwbh = e.record.rwbh;
    if (record.rwztmc === '待核定') {
        return '<a class="Delete_Button" onclick="showNewDbsx(\'' + lcslId
            + '\',\'' + rwbh + '\',\'' + ylUrl + '\')" href="#">核定</a>';
    }
};
// 点击 核定  跳转的页面
function showNewDbsx(lcslId, rwbh, url) {
    window.location.href = url + "?lcslId=" + lcslId + "&rwbh=" + rwbh;
};
