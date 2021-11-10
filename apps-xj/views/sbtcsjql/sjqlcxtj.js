var sjqlcxtj = {
    cxtjgrid: null,
    cxtjForm: null,
    sqrqQ: null,
    init: function () {
        this.cxtjForm = new mini.Form("cxtjForm");
        this.cxtjgrid = mini.get('cxtjgrid');
        this.detailWin = mini.get("detail-win");
        //进入页面默认搜索
        // this.doSearch("init");
        this.initSelect()
    },
    initSelect: function () {
        var now = new Date($.ajax({ async: false }).getResponseHeader('Date'));
        this.nowYear = now.getFullYear();
        this.nowMonth = now.getMonth() + 1;
        var ndList = [];
        for (var i = 2019; i <= this.nowYear; i++) {
            ndList.push({ code: '' + i, value: i });
        }
        mini.get('nd').setData(ndList);
        var ydList = [];
        for (var i = 1; i <= this.nowMonth; i++) {
            ydList.push({ code: (i > 9 ? '' + i : '0' + i), value: (i > 9 ? '' + i : '0' + i) });
        }
        mini.get('yf').setData(ydList);

        // mini.get('wssdzt').setValue('');
    },
    ndChanged: function (e) {
        var yd = Number(mini.get('yf').getValue());
        if (Number(e.value) === sjqlcxtj.nowYear) {
            var maxMonth = sjqlcxtj.nowMonth;
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
        sjqlcxtj.cxtjForm.validate();
        if (!sjqlcxtj.cxtjForm.isValid()) {
            return false;
        }
        var formData = sjqlcxtj.cxtjForm.getData(true);
        var param = mini.decode(formData);
        sjqlcxtj.cxtjgrid.setUrl("../../../../api/sh/sbtc/query/cxtj");
        sjqlcxtj.cxtjgrid.load(param, function (res) {

        }, function (data) {
            var obj = JSON.parse(data.errorMsg);
            mini.alert(obj.message || "系统异常,请稍后再试。")
        });
        // $.ajax({
        //     url:"../../../../api/sh/sbtc/query/cxtj",
        //     type:"post",
        //     data:{
        //         pageIndex:"",  //分页参数
        //         pageSize:"",   //分页参数
        //         djrq:formData.djrq,  //登记日期，精确到月
        //         zsjgDm:formData.zsjg,   //终审结果代码
        //         shxydm:formData.shxydm
        //     },
        //     async:false,
        //     success:function(data){
        //         sjqlcxtj.fillData(0, sjqlcxtj.cxtjgrid.getPageSize(), bgMoke, sjqlcxtj.cxtjgrid);
        //     },
        //     err:function(){
        //
        //     }
        // });
    },
    doReset: function () {
        sjqlcxtj.cxtjForm.reset();
        sjqlcxtj.cxtjgrid.setData("");
        // sjqlcxtj.djrqChange();
    },
    exportFpqd: function () {
        //前置校验
        if (sjqlcxtj.cxtjgrid.data.length == 0) {
            mini.alert("无数据，无需导出");
            return;
        }

        var rows = sjqlcxtj.cxtjgrid.getSelecteds();

        if (sjqlcxtj.cxtjgrid == null || sjqlcxtj.cxtjgrid == "") {
            mini.alert("查询结果为空，无需导出文件！");
            return;
        }
        if (sjqlcxtj.cxtjgrid.totalCount > 100000) {
            mini.alert("最多导出100000条记录，请重新选择~")
            return
        }

        var formData = sjqlcxtj.cxtjForm.getData(true);
        var param = mini.decode(formData);

        // var djrq = param.djrq;
        var zsjgDm = param.zsjg;
        var shxydm = param.shxydm;
        var nd = param.nd;
        var yf = param.yf;
        var pageIndex = sjqlcxtj.cxtjgrid.pageIndex;
        var pageSize = sjqlcxtj.cxtjgrid.pageSize;

        // if (rows.length == 0 || rows.length == pageSize) {
        //     window.open('/dzgzpt-wsys/api/sh/sbtc/export/cxtj?zsjgDm=' + zsjgDm + '&shxydm=' + shxydm
        //         + '&pageIndex=' + pageIndex + '&pageSize=' + pageSize);
        // } else {
        //     openPostWindow('/dzgzpt-wsys/api/sh/sbtc/export/cxtj', Base64.encode(mini.encode(rows)), 'name');
        // }
        window.open('/dzgzpt-wsys/api/sh/sbtc/export/cxtj?zsjgDm=' + zsjgDm + '&shxydm=' + shxydm + '&nd=' + nd + '&yf=' + yf);

    },
    openShow: function (str) {
        mini.alert(str);
    },
    // 详情弹框关闭
    detailWinCancel: function () {
        sjqlcxtj.detailWin.hide()
    },
    //查看详情
    xqShow: function (record) {
        var szxx = mini.decode(record.szxx)
        mini.get("detail_grid").setData(szxx || [])
        sjqlcxtj.detailWin.show()
    },
    doAutoStart: function () {
        // 发起自动催报责令
        var panel = mini.showMessageBox({
            width: 250,
            title: "提示",
            buttons: ["授权", "不授权"],
            message: "本事项支持机器人自动办，是否授权机器人为您处理后续环节（催报、责令）？",
            callback: function (action) {
                if (action === "授权") {
                    $.ajax({
                        url: "../../../../api/sh/jqr/jy/dyzhpz",
                        type: "get",
                        async: false,
                        success: function (res) {
                            if (res.success) {
                                sjqlcxtj.doZdcbzl()
                            } else {
                                $.ajax({
                                    url: "../../../../api/sh/jqr/jy/zhpz",
                                    type: "get",
                                    async: false,
                                    success: function (data) {
                                        if (data.success) {
                                            $.ajax({
                                                url: "../../../../api/sh/jqr/jl/dyzhpz",
                                                type: "get",
                                                async: false,
                                                success: function (result) {
                                                    if (result.success) {
                                                        sjqlcxtj.doZdcbzl()
                                                    } else {
                                                        mini.alert(result.message || "授权失败，保存账户失败")
                                                    }
                                                },
                                                err: function () {

                                                }
                                            });
                                        } else {
                                            mini.alert(data.message || "您暂未配置机器人账号，请先通过【配置机器人账户】功能进行维护")
                                        }
                                    },
                                    err: function () {

                                    }
                                });
                            }
                        },
                        err: function () {

                        }
                    });
                }
                mini.hideMessageBox(panel);
            }
        });
    },
    doZdcbzl: function (param) {
        $.ajax({
            url: "../../../../api/sh/jqr/fq/zdcbzl",
            type: "get",
            async: false,
            success: function (res) {
                if (!res.success) {
                    mini.alert(res.message || "发起自动催报责令，请重试～")
                }
            },
            err: function () {

            }
        });
    }
};
function shxydmRenderer(e) {
    var record = e.record
    return record.shxydm ? record.shxydm : record.nsrsbh
}

function xqRenderer(e) {
    var record = e.record
    return '<a class="color-blue wh100 inlineblock lineH36" onclick="sjqlcxtj.xqShow(record)"' + '>查看</a>'
}

function lyRenderer(e) {
    var field = e.field;
    var record = e.record;
    var str = record[field];
    return str ? '<a class="color-blue wh100 inlineblock lineH36" onclick="sjqlcxtj.openShow(' + '\'' + str + '\'' + ')"' + '>查看</a>' : '';
}

function openPostWindow(url, data, name) {
    var tempForm = document.createElement('form');
    tempForm.id = 'tempForm1';
    tempForm.method = 'post';
    tempForm.action = url;
    tempForm.target = name;

    var hideInput = document.createElement('input');
    hideInput.type = 'hidden';
    hideInput.name = 'content';

    hideInput.value = data;
    tempForm.appendChild(hideInput);
    $(tempForm).bind('onsubmit', function () {
        openWindow(name);
    });
    document.body.appendChild(tempForm);

    //tempForm.fireEvent('onsubmit');
    $(tempForm).submit();
    document.body.removeChild(tempForm);
}

function openWindow(name) {
    window.open(
        'about:blank',
        name,
        'height=400, width=400, top=0, left=0, toolbar=yes, menubar=yes, scrollbars=yes, resizable=yes,location=yes, status=yes'
    );
}

$(function () {
    gldUtil.addWaterInPages();
    sjqlcxtj.init();
});