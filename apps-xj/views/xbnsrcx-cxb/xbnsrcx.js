$(function () {
    gldUtil.addWaterInPages();
    mini.parse();
    xbnsrcx.init();
});
var xbnsrcx = {
    sqrqq: null,
    sqrqz: null,
    blzt: null,
    grid: null,
    searchForm: null,
    reflashZT: null,
    blztData : [{'ID': '','MC': '全部'},
        {'ID': '00', 'MC': '待受理'},
        {'ID': '02', 'MC': '不予受理'},
        {'ID': '60', 'MC': '已受理'},
        {'ID': '61', 'MC': '已办结'},
        {'ID': '63', 'MC': '电子税务局发放'},
        {'ID': '62', 'MC': '大厅发放'}],
    sqlymcData: [{
        'ID': 'web', 'MC': '电子税务局'
    }, {
        'ID': 'yct', 'MC': '一窗通'
    }, {
        'ID': 'xbweb', 'MC': '电子税务局（老网厅）'
    }, {
        'ID': 'xbyct', 'MC': '一窗通（老网厅）'
    }],
    init: function () {
        var me = this;
        this.sqrqq = mini.get('sqrqq');
        this.sqrqz = mini.get('sqrqz');
        this.grid = mini.get('dbsxGrid');
        this.blzt = mini.get('blztDm');
        this.sqly = mini.get('sqly');
        this.searchForm = new mini.Form("#cxtjForm");
        this.blzt.setData(this.blztData);
        if (__ps.kzztdjlxDm === '1120') {
            this.sqlymcData = [{
                'ID': 'web', 'MC': '电子税务局'
            }]
        }
        this.sqly.setData(this.sqlymcData);
        this.changeOther('init');
        this.grid.setUrl("/dzgzpt-wsys/api/shxbtc/dbsx/queryDbsx");
        this.grid.on('beforeload',function (e) {
            e.contentType='application/json;charset=utf-8';
            e.data = mini.encode(e.data);
        });
        // this.search();
        this.reflashZT = this.refDbrwzt();
    },
    load : function() {

    },
    search: function () {
        var me = this;
        var sqrqqDate = this.sqrqq.getValue();
        var sqrqzDate = this.sqrqz.getValue();
        var formData = this.searchForm.getData(true);
        var kzztdjlxDm = __ps.kzztdjlxDm
        // 申请日期有一个为空
        if((sqrqqDate && !sqrqzDate) || (!sqrqqDate && sqrqzDate)) {
          mini.alert('请补全申请日期');
          return;
        }
        if (!kzztdjlxDm) {
          mini.alert('url上不存在kzztdjlxDm')
          return
        }
        sqrqzDate = !sqrqzDate ? (new Date(sqrqzDate)) : sqrqzDate
        sqrqqDate = !sqrqqDate ? (new Date(sqrqqDate)): sqrqqDate
        // 申请区间超过一个月
        if(sqrqzDate.getTime() - sqrqqDate.getTime() > 31 * 24 * 3600 * 1000) {
            mini.alert('申请日期时间跨度不能超过1个月');
            return;
        }
        this.grid.load({
            sqly: formData.sqly === 'yct' ? 'yct,yct_C' : (formData.sqly === 'web' ? 'web,web_C' : formData.sqly),
            kzztdjlxDm: kzztdjlxDm,
            nsrsbh: formData.nsrsbh,
            sqrqq: formData.sqrqq,
            sqrqz: formData.sqrqz,
            blztDm: formData.blztDm,
            swsxdm: '11000201,11000202'
        }, function (res) {
            var data = res.result;
            if(!data.success && data.message) {
                mini.alert((data.message), '提示信息', function() {});
            }
        },function(res){
            var data = mini.decode(res.errorMsg)
            if(data.message) {
                mini.alert((data.message), '提示信息', function() {});
            }
        });
        this.grid.on('load',function(res){
            var data = res.result;
            var gridSource = res.source;
                if (data.success) {
                    var returnData = data.value;
                    $.each(returnData.dbsxDtos, function(i, obj){
                      obj['ywlb'] = '税务登记';
                      obj['swsxmc'] = '新办纳税人套餐';
                    });
                    me.grid.setData(returnData.dbsxDtos);
                    me.grid.setTotalCount(returnData.total);
                    me.grid.setPageIndex(gridSource.pageIndex);
                } else if(data.message){
                    mini.alert((data.message), '提示信息', function() {});
                }
        })
    },
    changeOther: function (option) {
        if(option === 'reset') {
            // 置空不可输入
            this.sqrqq.setValue('');
            this.sqrqq.setReadOnly(true);
            this.sqrqz.setValue('');
            this.sqrqz.setReadOnly(true);
            this.blzt.setValue('');
            this.sqly.setValue('')
            this.blzt.setReadOnly(true);
        } else {
            // 日期间隔默认设置为当前日期往前推1个星期
            var now = new Date();
            this.sqrqz.setValue(mini.formatDate(now,'yyyy-MM-dd'));
            var time = (new Date).getTime() - 6 * 24 * 60 * 60 * 1000
            this.sqrqq.setValue(mini.formatDate(new Date(time), 'yyyy-MM-dd'));
            this.sqrqq.setReadOnly(false);
            this.sqrqz.setReadOnly(false);
            this.blzt.setValue('00');
            this.sqly.setValue('web')
            this.blzt.setReadOnly(false);
        }
    },
    showSwsxSqxx: function (lcslId, sqlybj, blztDm,rwbh,slsj,sqlymc,swsxdm) {
        mini.mask({cls: 'mini-mask-loading', message: '处理中，请稍候...'});
        mini.Cookie.set("lcslId", lcslId);
        // 默认跳转创新版(税务事项代码为11000202)
        var baseUrl = '/dzgzpt-wsys/dzgzpt-wsys/apps/views/xbnsrcx-cxb/xbnsrtcSl.html';
        // 税务事项代码为11000201则跳转到标准版
        if (swsxdm === '11000201') {
            baseUrl = '/dzgzpt-wsys/dzgzpt-wsys/apps/views/xbnsrcx/xbnsrtcSl.html';
        }
        var url = baseUrl + "?lcslId=" + lcslId + "&isYct=" + sqlybj + "&rwbh=" + rwbh + '&slsj=' + slsj + '&sqlymc=' + encodeURIComponent(sqlymc);
        xbnsrcx.openDbsxsl(url, lcslId, blztDm);
        mini.unmask();
    },
    // checkDbsxslzt: function (lcslId, callback){
    //     mini.Cookie.set("lcslId", lcslId);
    //     $.ajax({
    //         url : "../../../../api/wtgl/dbsx/checkDbsxslzt",
    //         data : {
    //             lcslId : lcslId
    //         },
    //         success : function(data) {
    //             var resultData = mini.decode(data);
    //             if (resultData.success) {
    //                 if ("true" != resultData.value.toString()) {
    //                     mini.alert(resultData.value + "正在审核此任务，无法继续操作。", "提示信息");
    //                 } else {
    //                     callback();
    //                 }
    //             } else {
    //                 mini.alert(resultData.message, '提示信息', function() {});
    //             }
    //         },
    //         error : function() {
    //             mini.alert("判断是否存在并发受理失败。", '提示信息');
    //         }
    //     });
    // },
    openDbsxsl: function (url, lcslId, blztDm) {
        mini.Cookie.set("lcslId", lcslId);
        mini.Cookie.set("blztDm", blztDm);
        mini.open({
            showMaxButton: true,
            title: "新办纳税人套餐受理",
            url: url,
            showModal: true,
            width: "100%",
            height: "100%",
            onload: function () {
            },
            ondestroy: function (action) {
                xbnsrcx.search();
                unlockDbsxslzt();
            }
        });
    },
    onActionRenderer: function (e) {
        var record = e.record;
        var lcslId = record.bh;
        // 申请来源标记
        var sqlybj = record.sqlybj;
        var blztDm = record.blztDm;
        var rwbh = record.rwbh;
        var slsj = record.slsj ? (record.slsj.format?record.slsj.format('yyyy-MM-dd'):record.slsj) : '';
        var sqlymc = record.sqlymc;
        var swsxdm = record.swsxdm;
        // 状态显示待确认===========================
        // if(blztDm === '02' || blztDm === '61' || blztDm === '62') {
        //     return '<a class="Delete_Button" onclick="xbnsrcx.showSwsxSqxx(\'' + lcslId
        //         + '\',\'' + sqlybj + '\',\'' + blztDm + '\',\'' + rwbh + '\' )" href="#">查看</a>';
        // }
        return '<a class="Delete_Button" onclick="xbnsrcx.showSwsxSqxx(\'' + lcslId
                + '\',\'' + sqlybj + '\',\'' + blztDm + '\',\'' + rwbh + '\',\'' + slsj + '\',\'' + sqlymc + '\', \'' + swsxdm + '\')" href="#">查看</a>';
        // } else {
        //     return '<a class="Delete_Button" onclick="xbnsrcx.showSwsxSqxx(\'' + lcslId
        //         + '\',\'' + sqlybj + '\',\'' + blztDm + '\')" href="#">查看</a>';
        // }
        
    },
    dzRenderer: function(e) {
        if (__ps.kzztdjlxDm === '1120') {
            $('#dbsxGrid .mini-grid-headerCell').eq(6).text('生产经营地址')
            return e.record.zcdz
        } else {
            $('#dbsxGrid .mini-grid-headerCell').eq(6).text('注册地址')
            return e.record.zcdz
        }
    },
    doReset: function() {
        this.changeOther();
        mini.get('nsrsbh').setValue();
    },
    rwztRenderer: function (e) {
        var record = e.record;
        var rwztDm = record.blztDm;
        var rwztMc = '';
        $.each(this.blztData,function(i, obj) {
            if(rwztDm == obj.ID) {
                rwztMc = obj.MC;
                return;
            }
        })
        return rwztMc;
    },
    nsrsbhChange: function (e) {
        // 纳税人识别号有值的时候 其他条件置灰不可修改，
        var nsrsbh = e.value;
        if(nsrsbh) {
            xbnsrcx.changeOther('reset');
        } else {
            xbnsrcx.changeOther('restore')
        }
    },
    refDbrwzt: function() {
        // 定时更新办理状态
        var me = this;
        return setInterval(function () {
            me.reflashDbrwzt();
        }, 1000);
    },
    reflashDbrwzt: function () {
        // 更新办理状态
        var reflash = mini.Cookie.get("reflash");
        if ("ok" == reflash) {
            var bh = mini.Cookie.get("lcslId");
            var blztDm = mini.Cookie.get('blztDm');
            var row = this.findRowByBh(bh);
            this.grid.updateRow(row, {"blztDm": blztDm});
        }
        mini.Cookie.set("reflash", "ng");
    },
    findRowByBh: function(bh) {
        return this.grid.findRow(function(bh){
            if(row.bh == bh) return true;
        });
    }
};

