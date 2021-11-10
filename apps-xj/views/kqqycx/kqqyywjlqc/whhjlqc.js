var jswhhjlqc = {
    GridDatas: null,
    initPage: function () {
        this.srarchForm = new mini.Form("srarch-form");
        this.cxtjgrid = mini.get('kqqyywjlqc_grid');
        this.doSearch();
    },
    doSearch: function (str) {
        jswhhjlqc.srarchForm.validate();
        if(!jswhhjlqc.srarchForm.isValid()){
            return false;
        }
        var formData = jswhhjlqc.srarchForm.getData(true);
        jswhhjlqc.cxtjgrid.setUrl("/dzgzpt-wsys/api/sh/kqqytjbb/query/whhjlqc");
        jswhhjlqc.cxtjgrid.load({
            sqrqQ: formData.sqrqQ,   //申请日期起
            sqrqZ: formData.sqrqZ   //申请日期止

        },function(res){
            jswhhjlqc.GridDatas = res.data;
        },function(data){
            var obj=JSON.parse(data.errorMsg);
            mini.alert(obj.message||"系统异常,请稍后再试。")
        });
    },
    //重置
    doReset: function () {
        jswhhjlqc.srarchForm.reset();
        jswhhjlqc.cxtjgrid.setData("");
        jswhhjlqc.GridDatas = null;
    },
    //导出
    doExport: function(){
        if (jswhhjlqc.GridDatas == null || jswhhjlqc.GridDatas.length <= 0) {
            mini.alert("当前页面不存在导出数据。");
            return;
        }

        mini.confirm("确认是否导出？", "提示",
            function (action) {
                if (action == "ok") {

                    var sqrqQ = mini.formatDate(mini.get("sqrqQ").value, "yyyy-MM-dd");
                    var sqrqZ = mini.formatDate(mini.get("sqrqZ").value, "yyyy-MM-dd");
                    var pageIndex = jswhhjlqc.cxtjgrid.pageIndex;
                    var pageSize = jswhhjlqc.cxtjgrid.pageSize;

                    window.open('/dzgzpt-wsys/api/sh/kqqytjbb/export/whhjlqc?sqrqQ='+ sqrqQ +'&sqrqZ=' +sqrqZ
                        + '&pageIndex=' + pageIndex + '&pageSize=' + pageSize);
                } else {
                    return;
                }
            }
        );
    },
    sqrqQChange: function(e) {
        mini.get("sqrqZ").setMinDate(e.value);
    },
    sqrqZChange: function(e) {
        mini.get("sqrqQ").setMaxDate(e.value);
    }
};

$(function () {
    gldUtil.addWaterInPages();
    jswhhjlqc.initPage();
});