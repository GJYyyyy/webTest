
$(function () {
    gldUtil.addWaterInPages();
    mini.parse();
    swbacx.init();
});

var swbacx = {
    key: true, // 防止多次点击
    sqlymcData: [{
        'ID': '02', 'MC': '电子税务局'
    }, {
        'ID': '03', 'MC': '电子工作平台'
    }, {
        'ID': '01', 'MC': '金税三期'
    }],
    init: function () {
        this.qymdGrid = mini.get("qymdGrid");
        this.detailGrid = mini.get("detailGrid");
        this.qymdFrom = new mini.Form("#qymdFrom");
        this.baxxWin = mini.get("baxx-win")
        this.sczlWin = mini.get("sczl-win")

        mini.get("sqqd").setData(swbacx.sqlymcData);
        this.swjgInit();
        // this.doSearch();
    },
    doZgswjSelected: function () {
        mini.get("zgswskfjDm").setValue('')
        swbacx.zgswskfjInit(mini.get("zgswjgDm").getValue())
    },
    swjgInit: function () {
        // 税务机关下拉
        var $swjgdm = mini.get("zgswjgDm");
        $.ajax({
            url: "/dzgzpt-wsys/api/fwmydxmdwzfswba/getZgswjgDm",
            data: "",
            type: "POST",
            success: function (obj) {
                var datas = mini.decode(obj);
                $swjgdm.loadList(datas, "ID", "PID");
            },
            error: function () {
            }
        });
    },
    zgswskfjInit: function (swzjdm) {
        // 税务机关科所下拉
        var $swjgskfjdm = mini.get("zgswskfjDm");
        $.ajax({
            url: "/dzgzpt-wsys/api/fwmydxmdwzfswba/getZgswskfjDm",
            data: mini.encode({ zgswjgDm: swzjdm }),
            type: "post",
            contentType: "application/json; charset=utf-8",
            success: function (obj) {
                var datas = mini.decode(obj);
                $swjgskfjdm.loadList(datas, "ID", "PID");
                // $swjgskfjdm.setValue(datas[0].jgDm);
            },
            error: function () {
            }
        });
    },
    sqrqQChange: function (e) {
        mini.get("sqrqZ").setMinDate(e.value);
    },
    sqrqZChange: function (e) {
        mini.get("sqrqQ").setMaxDate(e.value);
    },
    hasKey: function () {
        swbacx.key = false;
        setTimeout(function () {
            swbacx.key = true;
        }, 1000);
    },
    doSearch: function () {
        if (!swbacx.key) return;
        swbacx.hasKey();
        swbacx.qymdFrom.validate();
        if (!swbacx.qymdFrom.isValid()) {
            return false;
        }

        var formData = swbacx.qymdFrom.getData(true);
        var params = $.extend({}, {
            pageIndex: swbacx.pageIndex || swbacx.qymdGrid.getPageIndex(),
            pageSize: swbacx.pageSize || swbacx.qymdGrid.getPageSize()
        }, formData);
        $.ajax({
            url: "/dzgzpt-wsys/api/fwmydxmdwzfswba/dwzfba/queryDatas",
            data: mini.encode(params),
            type: "post",
            contentType: "application/json; charset=utf-8",
            success: function (res) {
                if (res.success) {
                    var datas = mini.decode(res);
                    swbacx.qymdGrid.setData(datas.value);
                    swbacx.qymdGrid.setTotalCount(datas.resultMap.totalNum);
                    swbacx.qymdGrid.setPageIndex(swbacx.qymdGrid.pageIndex);
                } else {
                    mini.alert(res.message || '查询失败！')
                }
            },
            error: function () {
            }
        });
    },
    onbeforeload: function (e) {
        e.cancel = true;
    },
    onpagechanged: function (e) {
        swbacx.pageIndex = e.pageIndex;
        swbacx.pageSize = e.pageSize;
        swbacx.doSearch();
    },
    doReset: function () {
        this.qymdFrom.reset();
        this.qymdGrid.setData('');
    },
    exportFpqd: function () {
        if (swbacx.qymdGrid == null || swbacx.qymdGrid == "" || swbacx.qymdGrid.data.length < 1) {
            mini.alert("查询结果为空，无需导出文件！");
            return;
        }
        mini.confirm("确认是否导出？", "提示",
            function (action) {
                if (action == "ok") {
                    var formData = swbacx.qymdFrom.getData(true);
                    var param = JSON.stringify(formData);
                    window.open('/dzgzpt-wsys/api/fwmydxmdwzfswba/dwzfba/exportDatas?requestJson=' + param)
                } else {
                    return;
                }
            });
    },
    openSczlWin: function (isDownload) {
        swbacx.isDownload = isDownload
        var title = isDownload ? "上传资料下载" : "上传资料预览"
        this.sczlWin.setTitle(title)
        this.sczlWin.show()
    },
    preOrdownloadPdf: function (index) {
        var fileKey
        if (swbacx.returnData.sczl && swbacx.returnData.sczl[index]) {
            fileKey = swbacx.returnData.sczl[index].fileKey
        }
        window.open('/dzgzpt-wsys/api/fwmydxmdwzfswba/viewOrDownloadFbzl?isDownload=' + swbacx.isDownload + '&fileKey=' + fileKey)
    },
    sqqdCheck: function (record) {
        record.barq = new Date(record.barq).format("yyyy-MM-dd hh:mm:ss")
        record.cyrq = new Date(record.cyrq).format("yyyy-MM-dd hh:mm:ss")
        var returnData = ''
        $.ajax({
            url: "/dzgzpt-wsys/api/fwmydxmdwzfswba/dwzfba/getDataBySqqd",
            type: "post",
            data: record,
            success: function (res) {
                if (res.success) {
                    swbacx.nowData = record
                    returnData = res.value
                    swbacx.returnData = res.value
                    //申请渠道三种情况: 02电子税务局、03电子工作平台、01金税三期
                    if (record.sqqd == "02") {
                        if (returnData.sczl && returnData.sczl.length > 0) { //上传资料 预览/下载 按钮
                            for (var index = 0; index < returnData.sczl.length; index++) {
                                $(".sczlFiles").html("")
                                $(".sczlFiles").append("<li><a href='javascript:;' onclick='swbacx.preOrdownloadPdf(" + index + ")'>" + returnData.sczl[index].fileName + "</a></li>")
                            }
                            $("#win-sczl").html('<a href="javascript:;" style="margin-right: 20px;" onclick="swbacx.openSczlWin(false)">预览</a>' + '<a href="javascript:;" onclick="swbacx.openSczlWin(true)">下载</a>');
                        } else {
                            $("#win-sczl").html("暂无附件");
                        }

                        $("#win-baslbh").html(returnData.baslbh);
                        $("#win-bar").html(returnData.bar);
                        $("#win-barlxdh").html(returnData.barlxdh);
                        $("#win-hyjrjg").html(returnData.hyjrjg);
                        $("#win-hyry").html(returnData.hyry);
                        $("#win-hysj").html(returnData.hysj);
                        $("#tr-baslbh").show()
                        $("#tr-bar").show()
                        $("#tr-barlxdh").show()
                        $("#tr-hyjrjg").show()
                        $("#tr-hyry").show()
                        $("#tr-hysj").show()
                        $("#tr-sczl").show()
                        $("#tr-slr").hide();
                        $("#tr-slswjg").hide();
                    }
                    if (record.sqqd === "03") {
                        $("#win-baslbh").html(returnData.baslbh);
                        $("#win-bar").html(returnData.bar);
                        $("#win-barlxdh").html(returnData.barlxdh);
                        $("#win-slr").html(returnData.slr);
                        $("#win-slswjg").html(returnData.slswjg);
                        $("#win-hyjrjg").html(returnData.hyjrjg);
                        $("#win-hyry").html(returnData.hyry);
                        $("#win-hysj").html(returnData.hysj);
                        $("#tr-baslbh").show()
                        $("#tr-bar").show()
                        $("#rt-barlxdh").show()
                        $("#tr-slr").show()
                        $("#tr-slswjg").show()
                        $("#tr-hyjrjg").show()
                        $("#tr-hyry").show()
                        $("#tr-hysj").show()
                        $("#tr-sczl").hide();
                    }
                    if (record.sqqd === "01") {
                        $("#win-bar").html(returnData.bar);
                        $("#win-barlxdh").html(returnData.barlxdh);
                        $("#win-slr").html(returnData.slr);
                        $("#win-slswjg").html(returnData.slswjg);
                        $("#tr-bar").show()
                        $("#tr-barlxdh").show()
                        $("#tr-slr").show()
                        $("#tr-slswjg").show()
                        $("#tr-baslbh").hide();
                        $("#tr-hyjrjg").hide();
                        $("#tr-hyry").hide();
                        $("#tr-hysj").hide();
                        $("#tr-sczl").hide();

                    }
                    swbacx.baxxWin.show();
                } else {
                    mini.alert(res.message || "查询失败！");
                }
            },
            error: function () {
            }
        });
    },
    xzCheck: function (record) {
        if (!swbacx.key) return;
        swbacx.hasKey();

        var formData = swbacx.qymdFrom.getData(true);
        mini.open({
            url: './mx.html',        //页面地址
            title: '境内机构付汇逐笔数据',      //标题
            iconCls: '',    //标题图标
            width: '95%',      //宽度
            height: "600",     //高度
            allowResize: true,       //允许尺寸调节
            allowDrag: false,         //允许拖拽位置
            showCloseButton: true,   //显示关闭按钮
            showMaxButton: false,     //显示最大化按钮
            showModal: true,         //显示遮罩
            currentWindow: false,      //是否在本地弹出页面,默认false
            effect: 'none',              //打开和关闭时的特果:'none','slow','fast',默认'none'
            onload: function () {       //弹出页面加载完成
                var iframe = this.getIFrameEl();
                //调用弹出页面方法进行初始化
                iframe.contentWindow.setData(formData, record);
            },
            ondestroy: function (action) {  //弹出页面关闭前
            }
        });
    }
};

function onActionRendererYq(e) {
    var record = e.record, sqqdMc = '';
    switch (record.sqqd) {
        case '01':
            sqqdMc = '金税三期'
            break;
        case '02':
            sqqdMc = '电子税务局'
            break;
        case '03':
            sqqdMc = '电子工作平台'
            break;
        default:
            break;
    }
    return record.sqqd ? '<a class="Delete_Button" onclick="swbacx.sqqdCheck(record)" href ="#">' + sqqdMc + '</a>' : '';

}

function onActionRendererXz(e) {
    var record = e.record;
    if (record.djxh.substr(0, 1) == '1') {
        return '<a onclick="swbacx.xzCheck(record)" href ="#">' + record.jnfkfnsrsbh + '</a>';
    } else {
        return record.jnfkfnsrsbh;
    }
}
function onActionRendererBlzt(e) {
    var record = e.record;
    switch (record.blzt) {
        case "01":
            return "审核通过"
        case "02":
            return "审核不通过"
        case "03":
            return "作废"
        case "04":
            return "待审核"
        case "05":
            return "撤销"
        default:
            return ''
    }
}

//form展示隐藏
$(document).ready(function () {
    $(".search").click(function () {
        showsearch();
    });
    // $(".search").click();
});
function showsearch() {
    if ($(".searchdiv").is(":hidden")) {
        $(".searchdiv").slideDown();
        $('.searchC').html('隐藏查询条件');
    } else {
        $(".searchdiv").slideUp();
        $('.searchC').html('显示查询条件');
    }
}

function nsrsbhValidate(e) {
    if (e.value == false) return;
    if (e.isValid) {
        if (!/^[a-zA-Z0-9\-]{15,20}$/.test(e.value)) {
            e.errorText = "社会信用代码必须为15到20位的字母或数字！";
            e.isValid = false;
            return;
        }
    }
}
