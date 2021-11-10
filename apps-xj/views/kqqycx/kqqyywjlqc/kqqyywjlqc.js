var kqqyywjlqc = {
    GridDatas: null,
    sljg: [{"MC": "未受理成功", "ID": "00"},{"MC": "受理通过", "ID": "01"}],
    sfrggy: [{"MC": "是", "ID": "Y"},{"MC": "否", "ID": "N"}],
    initPage: function () {
        this.srarchForm = new mini.Form("srarchForm");
        this.kqqyywjlqcGrid = mini.get('kqqyywjlqcGrid');
        //this.ssglyChange();
        this.sljgDom = mini.get("sljg");
        this.sfrggyDom = mini.get("sfrggy");
        this.sljgDom.setData(this.sljg);
        this.sfrggyDom.setData(this.sfrggy);
        this.sljgDom.setValue([{"MC": "受理通过", "ID": "01"}]);

        //默认初始化显示所有跨区迁移受理通过的业务记录
        this.doSearch("sltg");

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
        kqqyywjlqc.srarchForm.validate();
        if(!kqqyywjlqc.srarchForm.isValid()){
            return false;
        }
        var formData = kqqyywjlqc.srarchForm.getData(true);
        kqqyywjlqc.kqqyywjlqcGrid.setUrl("/dzgzpt-wsys/api/sh/kqqytjbb/query/ywjlqc");
        kqqyywjlqc.kqqyywjlqcGrid.load({
            nsrsbh: formData.nsrsbh,  //税号
            sqrqQ: formData.sqrqQ,   //申请日期起
            sqrqZ: formData.sqrqZ,   //申请日期止
            sljg: str === "sltg" ? "01" : formData.sljg,  //审核指标
            qcswjgDm: formData.qcswjg,   //迁出税务机关
            qrswjgDm: formData.qrswjg,    //迁入税务机关
            sfrggy: formData.sfrggy,  //审核指标

        },function(res){
            kqqyywjlqc.GridDatas = res.data;
        },function(data){
            var obj=JSON.parse(data.errorMsg);
            mini.alert(obj.message||"系统异常,请稍后再试。")
        });
    },
    //重置
    doReset: function () {
        this.srarchForm.reset();
        this.kqqyywjlqcGrid.setData("");
        kqqyywjlqc.GridDatas = null;

    },
    //导出
    doExport: function(){
        if (kqqyywjlqc.GridDatas == null || kqqyywjlqc.GridDatas.length <= 0) {
            mini.alert("当前页面不存在导出数据。");
            return;
        }
        mini.confirm("确认是否导出？", "提示",
        function (action) {
            if (action == "ok") {

                var sqrqQ = mini.formatDate(mini.get("sqrqQ").value, "yyyy-MM-dd");
                var sqrqZ = mini.formatDate(mini.get("sqrqZ").value, "yyyy-MM-dd");
                var nsrsbh = mini.get("nsrsbh").value;
                var sljg = mini.get("sljg").value;
                var sfrggy = mini.get("sfrggy").value;
                var qcswjgDm = mini.get("qcswjg").value;
                var qrswjgDm = mini.get("qrswjg").value;
                var pageIndex = kqqyywjlqc.kqqyywjlqcGrid.pageIndex;
                var pageSize = kqqyywjlqc.kqqyywjlqcGrid.pageSize;
                window.open('/dzgzpt-wsys/api/sh/kqqytjbb/export/ywjlqc?sqrqQ='+ sqrqQ +'&sqrqZ=' +sqrqZ+'&nsrsbh='+nsrsbh
                    +'&sljg=' +sljg +'&sfrggy=' +sfrggy +'&qcswjgDm=' +qcswjgDm +'&qrswjgDm=' +qrswjgDm + '&pageIndex=' + pageIndex
                    + '&pageSize=' + pageSize);
            } else {
                return;
            }
        });
    },
    sqrqQChange: function(e) {
        mini.get("sqrqZ").setMinDate(e.value);
    },
    sqrqZChange: function(e) {
        mini.get("sqrqQ").setMaxDate(e.value);
    },
    sfrggyRender: function (e) {
        var rowData = e.row;
        switch (e.record.sfrggy) {
            case 'Y':
                return '是';
            case 'N':
                return '否';
            case '':
                return '';
            default:
                return '';
        }
    }
};

function wfssRenderer(e) {
    var recordWfss = e.record;
    var wfss = recordWfss.wfss;
    var rowIndex = e.rowIndex;
    return wfss ? '<a class="color-blue wh100 inlineblock lineH36" onclick="kqqyywjlqc.openWfssShow(' + '\'' + rowIndex + '\'' + ')"' + '>详情</a>' : '';
}

function getQueryString(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return unescape(r[2]);
    }
    return null;
}

$(function () {
    gldUtil.addWaterInPages();
    kqqyywjlqc.initPage();
});