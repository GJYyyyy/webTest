function initData(record, topReq) {
    cxtj.topRecord = record
    cxtj.topReq = topReq
    cxtj.init();
    cxtj.search()
}

var cxtj = {
    qxdj: '',
    searchForm: new mini.Form('search-box'),
    searchUrl: '/dzgzpt-wsys/api/sh/lsjbdqsb/query/zxqk', // 查询
    init: function () {
        var delay = new Date()
        delay.setMonth(delay.getMonth() - 1);
        mini.get('rwzxrqQ').setValue(cxtj.topReq.rwzxrqQ)
        mini.get('rwzxrqZ').setValue(cxtj.topReq.rwzxrqZ)

        // // 税务机关下拉
        // var $swjgdm = mini.get("swjgDm");
        // $.ajax({
        //     url: "/dzgzpt-wsys/api/xj/wtgl/cxtj/getSxtjSwjg",
        //     data: "",
        //     type: "POST",
        //     success: function (obj) {
        //         var datas = mini.decode(obj);
        //         $swjgdm.loadList(datas, "swjgdm", "sjswjgdm");
        //         $swjgdm.setValue(cxtj.topRecord.swjgdm);
        //     },
        //     error: function () {
        //     }
        // });

        
    },
    search: function (pageIndex, pageSize) { // 查询
        this.searchForm.validate();
        if (!this.searchForm.isValid()) {
            return false;
        }
        var req = this.searchForm.getData(true);
        mini.mask('查询中...');
        $.ajax({
            url: this.searchUrl,
            data: req,
            type: 'POST',
            contentType: 'application/x-www-form-urlencoded;charset=UTF-8',
            async: false,
            success: function (res) {
                mini.unmask();
                if (!isArray(res)) {
                    mini.alert('系统出现故障，请稍后重试');
                } else {
                    var grid = mini.get('cxtj_grid');
                    $.each(res, function (i, v) {
                        v.rwzxrqQ = req.rwzxrqQ
                        v.rwzxrqZ = req.rwzxrqZ
                    })
                    grid.setData(res);
                }
            },
            error: function (res) {
                mini.unmask();
                mini.alert(res.message || '系统出现故障，请稍后重试');
            }
        });
    },
    openMx: function (record, jbzt) {
        // 明细
        mini.open({
            url: './jbnsrmxcx.html', //页面地址
            title: '降版纳税人明细信息查询', //标题
            iconCls: '', //标题图标
            width: '100%', //宽度
            height: "600", //高度
            allowResize: true, //允许尺寸调节
            allowDrag: false, //允许拖拽位置
            showCloseButton: true, //显示关闭按钮
            showMaxButton: false, //显示最大化按钮
            showModal: true, //显示遮罩
            currentWindow: false, //是否在本地弹出页面,默认false
            effect: 'none', //打开和关闭时的特果:'none','slow','fast',默认'none'
            onload: function () { //弹出页面加载完成
                var iframe = this.getIFrameEl();
                //调用弹出页面方法进行初始化
                var req = cxtj.searchForm.getData(true);
                iframe.contentWindow.initData(record, jbzt, req);
            },
            ondestroy: function (action) { //弹出页面关闭前
                if (action == 'ok') {
                    cxtj.doSearch()
                }
            }
        });
    },
    doReset: function () {
        // 重置
        this.searchForm.reset()
        this.init()
        var grid = mini.get('cxtj_grid');
        grid.setData("");
    },
    dateChange: function (e, type, name) {
        if (type == 'minDate') {
            mini.get(name).setMinDate(e.value)
        } else if (type == 'maxDate') {
            mini.get(name).setMaxDate(e.value)
        }
    }
}

function onzxzhsrenderer(e) {
    var record = e.record
    var jbzt = ''
    switch (e.field) {
        case 'gt3fail':
            jbzt = '00'
            break;
        case 'fpfail':
            jbzt = '01'
            break;
        case 'jbcg':
            jbzt = '02'
            break;

        default:
            break;
    }
    if (record[e.field] > 0) {
        return '<a href="javascript:;" onclick="cxtj.openMx(record,\'' + jbzt + '\')" >' + record[e.field] + '</a>'
    } else {
        return '<span>' + record[e.field] + '</span>'
    }
}

function isArray(str) {
    return Object.prototype.toString.call(str) == "[object Array]";
}