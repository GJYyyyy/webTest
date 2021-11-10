var kqqybtgjlqc = {
    GridDatas: null,
    btgxqWin: null,
    initPage: function () {
        this.srarchForm = new mini.Form("srarch-form");
        this.kqqybtgjlqcGrid = mini.get('kqqybtgjlqc_grid');

        //默认初始化显示全部的跨区迁移不通过记录
        this.doSearch();
    },
    //nsrsbh过滤判定
    nsrsbhValidate: function (e) {
        if (e.value == false) return;
        if (e.isValid) {
            if (!/^[a-zA-Z0-9\-]{15,20}$/.test(e.value)) {
                e.errorText = "社会信用代码必须为15到20位的字母或数字！";
                e.isValid = false;
                return;
            }
        }
    },
    doSearch: function (str) {
        kqqybtgjlqc.srarchForm.validate();
        if (!kqqybtgjlqc.srarchForm.isValid()) {
            return false;
        }
        var formData = kqqybtgjlqc.srarchForm.getData(true);
        kqqybtgjlqc.kqqybtgjlqcGrid.setUrl("/dzgzpt-wsys/api/sh/kqqytjbb/query/btgjlqc");
        kqqybtgjlqc.kqqybtgjlqcGrid.load({
            nsrsbh: formData.nsrsbh,  //税号
            sqrqQ: formData.sqrqQ,   //申请日期起
            sqrqZ: formData.sqrqZ,   //申请日期止
            shzb: str === "btgjl" ? "btgjl" : formData.shzb,  //审核指标
            qcswjgDm: formData.qcswjg,   //迁出税务机关
            qrswjgDm: formData.qrswjg,  //迁入税务机关
            qyzt: formData.qyzt,    //迁入税务机关

        }, function (res) {
            kqqybtgjlqc.GridDatas = res.data;

        }, function (data) {
            var obj = JSON.parse(data.errorMsg);
            mini.alert(obj.message || "系统异常,请稍后再试。")
        });
    },
    //重置
    doReset: function () {
        kqqybtgjlqc.srarchForm.reset();
        kqqybtgjlqc.kqqybtgjlqcGrid.setData("");
        kqqybtgjlqc.GridDatas = null;

    },
    //导出
    doExport: function () {
        if (kqqybtgjlqc.GridDatas == null || kqqybtgjlqc.GridDatas.length <= 0) {
            mini.alert("当前页面不存在导出数据。");
            return;
        }
        mini.confirm("确认是否导出？", "提示",
            function (action) {
                if (action == "ok") {

                    var sqrqQ = mini.formatDate(mini.get("sqrqQ").value, "yyyy-MM-dd");
                    var sqrqZ = mini.formatDate(mini.get("sqrqZ").value, "yyyy-MM-dd");
                    var nsrsbh = mini.get("nsrsbh").value;
                    var shzb = mini.get("shzb").value;
                    var qcswjgDm = mini.get("qcswjg").value;
                    var qrswjgDm = mini.get("qrswjg").value;
                    var pageIndex = kqqybtgjlqc.kqqybtgjlqcGrid.pageIndex;
                    var pageSize = kqqybtgjlqc.kqqybtgjlqcGrid.pageSize;

                    window.open('/dzgzpt-wsys/api/sh/kqqytjbb/export/btgjlqc?sqrqQ=' + sqrqQ + '&sqrqZ=' + sqrqZ + '&nsrsbh=' + nsrsbh
                        + '&shzb=' + shzb + '&qcswjgDm=' + qcswjgDm + '&qrswjgDm=' + qrswjgDm + '&pageIndex=' + pageIndex
                        + '&pageSize=' + pageSize);
                } else {
                    return;
                }
            }
        );
    },
    //查看详情页面
    openTip: function (record) {

        kqqybtgjlqc.btgxqWin = mini.open({
            url: "./btgxq.html",        //页面地址
            title: '不通过详情',      //标题
            width: "100%",      //宽度
            height: "100%",     //高度
            allowResize: false,       //允许尺寸调节
            allowDrag: true,         //允许拖拽位置
            showCloseButton: false,   //显示关闭按钮
            showMaxButton: false,     //显示最大化按钮
            showModal: true,         //显示遮罩
            currentWindow: false,      //是否在本地弹出页面,默认false
            onload: function () {       //弹出页面加载完成
                var iframe = this.getIFrameEl();
                //调用弹出页面方法进行初始化
                iframe.contentWindow.setData(record);
            },
            ondestroy: function (e) {

            }
        });
    },
    openQksm: function (record) {
        mini.showMessageBox({ message: record.qksm || "", title: "情况说明", buttons: ["确认", "关闭"], width: 500, minHeight: 250 });
    },
    openQ: function (e) {
        mini.alert(e.sxjksm || "", "提示");
    },
    sqrqQChange: function (e) {
        mini.get("sqrqZ").setMinDate(e.value);
    },
    sqrqZChange: function (e) {
        mini.get("sqrqQ").setMaxDate(e.value);
    }
};

//存在以下几个未通过项需要展现明细（查看详情页面同2.2.2）：
// 不存在未申报记录
// 纳税人不存在欠税信息
// 其余不通过记录的，点击查看详情，弹出不通过说明，例如：当前纳税人状态不为正常，所以就提示：当前纳税人状态为停业。跟前置校验不通过提示保持一致。
function onActionRendererYq(e) {
    var record = e.record;
    return '<a class="Delete_Button" onclick="kqqybtgjlqc.openTip(record)" href ="#">查看详情</a>';
    // return '<a class="Delete_Button" onclick="kqqybtgjlqc.openQ(record)" href ="#">查看详情</a>';
}
function onActionRendererQksm(e) {
    var record = e.record;
    return '<a class="Delete_Button" onclick="kqqybtgjlqc.openQksm(record)" href ="#">查看说明</a>';
}
function onActionRendererQkzt(e) {
    var record = e.record;
    return record.qyzt == 'Y' ? '迁移成功' : '迁移失败';
}

function closeWin() {
    kqqyWin.hide();
}

$(function () {
    gldUtil.addWaterInPages();
    kqqybtgjlqc.initPage();
});

function openHtml(rightUrls) {

}