var jswhhjlqc = {
    GridDatas: null,
    initPage: function () {
        this.srarchForm = new mini.Form("srarch-form");
        this.cxtjgrid = mini.get('kqqyywjlqc_grid');

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
        jswhhjlqc.srarchForm.validate();
        if(!jswhhjlqc.srarchForm.isValid()){
            return false;
        }
        var formData = jswhhjlqc.srarchForm.getData(true);
        jswhhjlqc.cxtjgrid.setUrl("/dzgzpt-wsys/api/sh/kqqytjbb/query/gt3btgjlqc");
        jswhhjlqc.cxtjgrid.load({
            nsrsbh: formData.nsrsbh,  //税号
            sqrqQ: formData.sqrqQ,   //申请日期起
            sqrqZ: formData.sqrqZ,   //申请日期止
            qcswjgDm: formData.qcswjg,   //迁出税务机关
            qrswjgDm: formData.qrswjg    //迁入税务机关

        },function(res){
            jswhhjlqc.GridDatas = res.data;
        },function(data){
            var obj=JSON.parse(data.errorMsg);
            mini.alert(obj.message||"系统异常,请稍后再试。")
        });
    },
    //重置
    doReset: function () {
        // this.srarchForm.reset();
        var form = new mini.Form("#srarch-form");
        form.reset();
        this.cxtjgrid.setData("");
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
                    var nsrsbh = mini.get("nsrsbh").value;
                    var qcswjgDm = mini.get("qcswjg").value;
                    var qrswjgDm = mini.get("qrswjg").value;
                    var pageIndex = jswhhjlqc.cxtjgrid.pageIndex;
                    var pageSize = jswhhjlqc.cxtjgrid.pageSize;

                    window.open('/dzgzpt-wsys/api/sh/kqqytjbb/export/gt3btgjlqc?sqrqQ='+ sqrqQ +'&sqrqZ=' +sqrqZ+'&nsrsbh='+nsrsbh
                        +'&qcswjgDm=' +qcswjgDm +'&qrswjgDm=' +qrswjgDm + '&pageIndex=' + pageIndex
                        + '&pageSize=' + pageSize);
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
    },
    openTip: function (e) {
        mini.alert(e.sxjksm || "", "详情信息");
    },
    pushSend: function (e) {
        //置灰不可点击
        // if (e) return;
        mini.confirm("确认已经完成该纳税人主管税务机关的分配？","提示",function (action) {
            if(action === "ok") {
                // var messageId = mini.mask({
                //     el: document.body,
                //     cls: 'mini-mask-loading',
                //     html: '推送中, 请稍等 ...'
                // });
                var messageId = mini.loading("推送中, 请稍等 ...", "推送中");

                setTimeout(function () {
                    $.ajax({
                        url: "/hgzx-gld/api/hgzx/kqqyqy/autoBjsx/" + e.sllsh,
                        type: "get",
                        async: false,
                        success: function (data) {
                            var resultData = mini.decode(data);
                            if (resultData.success) {
                                //获取点击行
                                var key = e.autorowno;
                                var clickRow;
                                for (var i = 0; i < jswhhjlqc.GridDatas.length; i++) {
                                    if (jswhhjlqc.GridDatas[i].autorowno == key) {
                                        clickRow = jswhhjlqc.GridDatas[i];
                                    }
                                }
                                mini.hideMessageBox(messageId);

                                clickRow.fpOk = true;
                                jswhhjlqc.cxtjgrid.setData(jswhhjlqc.GridDatas);
                                mini.alert("推送成功！","提示");
                            } else {
                                mini.hideMessageBox(messageId);
                                mini.alert("该纳税人的主管税务机关尚未分配，请处理之后再进行推送！", "提示");
                            }
                        },
                        error: function (data) {
                            mini.hideMessageBox(messageId);
                            mini.alert(data.message || '请求错误，请稍候再试',"错误信息");
                        }
                    });
                },200);
            }
        })
    }
};

$(function () {
    gldUtil.addWaterInPages();
    jswhhjlqc.initPage();
});

function onActionRendererYq (e){
    var record = e.record;
    if (!record.fpOk) {
        return '<a class="Delete_Button" onclick="jswhhjlqc.openTip(record)" href ="#">查看详情</a>';
        // return '<a class="Delete_Button" onclick="jswhhjlqc.openTip(record)" href ="#">查看详情</a>' +
        //     '<a class="Delete_Button" style="display: inline-block; margin-left: 15px;" onclick="jswhhjlqc.pushSend(record)" href ="#"> 推送</a>';
    } else {
        return '<a class="Delete_Button" onclick="jswhhjlqc.openTip(record)" href ="#">查看详情</a>';
        // return '<a class="Delete_Button" onclick="jswhhjlqc.openTip(record)" href ="#">查看详情</a>' +
        //     '<a class="Delete_Button" style="color: #9f9f9f; cursor:default; display: inline-block; margin-left: 15px;" href ="#"> 推送</a>';
    }
}
