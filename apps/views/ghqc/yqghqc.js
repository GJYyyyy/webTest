/**
 * Created by liun on 2019/4/25.
 */
var yqghqc = {
    pageSize: 30,
    nowYear: null,
    nowMonth: null,
    // userInfo: null,
    yqclztMap: {},   //逾期处理状态map
    ssglyDm: '',
    swjgDm: '',
    yqclztUrl: '/dzgzpt-wsys/api/baseCode/get/baseCode2CombSelect/DM_FZ_SSWFXWCLZT',
    searchUrl: '/dzgzpt-wsys/api/wtgl/sbtc/getYqYsbGhqc',
    detailUrl: '/dzgzpt-wsys/api/wtgl/sbtc/getYqDhysbmx',
    messageUrl: '/dzgzpt-wsys/api/wtgl/sbtc/sendMsg',
    exportUrl: '/dzgzpt-wsys/api/wtgl/sbtc/download/yqYsbGhqc',
    nsrztUrl: '/dzgzpt-wsys/api/wtgl/sbtc/queryNsrzt',
    syglyUrl: '/dzgzpt-wsys/api/wtgl/sbtc/get/ssgly ',
    // userInfoUrl: '/dzgzpt-wsys/api/wtgl/public/login/session',
    init: function () {
        if (location.href.indexOf('ssglyDm') > -1) {
            this.ssglyDm = location.href.split('ssglyDm=')[1].split('&')[0];
        } else if (location.href.indexOf('swjgDm') > -1) {
            this.swjgDm = location.href.split('swjgDm=')[1].split('&')[0];
        } else {
            $('.back-btn').hide();
        }
        var now = new Date($.ajax({ async: false }).getResponseHeader('Date'));
        this.nowYear = now.getFullYear();
        this.nowMonth = now.getMonth() + 1;
        /*$.ajax({
            url: this.userInfoUrl,
            type: 'GET',
            contentType: 'application/json;charset=UTF-8',
            async: false,
            success: function (res) {
                if ((res.success !== undefined && !res.success)){
                    mini.alert(res.message || '系统出现故障，请稍后重试');
                } else {
                    yqghqc.userInfo = res || {};
                }
            },
            error: function (res) {
                mini.alert(res.message || '系统出现故障，请稍后重试');
            }
        });*/
        this.initSelect();
    },
    initSelect: function () {
        var yqclztList = [{ ID: 'all', MC: '全部' }];
        ajax.get(this.yqclztUrl, null, function (res) {
            if (res.length < 0 && !res.success) {
                mini.alert(res.message);
            } else {
                $.each(res, function () {
                    yqghqc.yqclztMap[this.ID] = this.MC;
                });
                yqclztList = yqclztList.concat(res);
            }
        });
        mini.get('sswfxwclztDm').setData(yqclztList);
        mini.get('sswfxwclztDm').setValue('all');
        var ndList = [];
        for (var i = 2018; i <= this.nowYear; i++) {
            ndList.push({ code: '' + i, value: i });
        }
        mini.get('nd').setData(ndList);
        mini.get('nd').setValue(this.nowYear, false);
        var ydList = [];
        for (var i = 1; i <= this.nowMonth; i++) {
            ydList.push({ code: (i > 9 ? '' + i : '0' + i), value: (i > 9 ? '' + i : '0' + i) });
        }
        mini.get('yf').setData(ydList);
        mini.get('yf').setValue(this.nowMonth > 9 ? '' + this.nowMonth : '0' + this.nowMonth);
        //纳税人状态
        var result = [{ ID: 'all', MC: '全部' }];
        $.ajax({
            url: this.nsrztUrl,
            type: 'GET',
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
                        result = result.concat(res.value);
                    }
                }
            },
            error: function (res) {
                mini.unmask();
                mini.alert(res.message || '系统出现故障，请稍后重试');
            }
        });
        mini.get('nsrztDm').setData(result);
        mini.get('nsrztDm').setValue('03');
        //税源管理员
        var syglyList = [{ ssglydm: 'all', ssglymc: '全部' }];
        $.ajax({
            url: this.syglyUrl,
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
                        syglyList = syglyList.concat(res.value);
                    }
                }
            },
            error: function (res) {
                mini.unmask();
                mini.alert(res.message || '系统出现故障，请稍后重试');
            }
        });
        mini.get('ssglyDm').setData(syglyList);
        this.search(0, 30);
    },
    ndChanged: function (e) {
        var yd = Number(mini.get('yf').getValue());
        if (Number(e.value) === yqghqc.nowYear) {
            var maxMonth = yqghqc.nowMonth;
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
    search: function (pageIndex, pageSize) {
        var searchForm = new mini.Form('search-box');
        searchForm.validate();
        if (!searchForm.isValid()) {
            return false;
        }
        var req = searchForm.getData();
        if (req.ysbbz === 'all') {
            req.ysbbz = '';
        }
        if (req.sswfxwclztDm === 'all') {
            req.sswfxwclztDm = '';
        }
        if (req.nsrztDm === 'all') {
            req.nsrztDm = '';
        }
        // req.ssglyDm = this.ssglyDm;
        req.swjgDm = this.swjgDm;
        req.pageIndex = pageIndex.toString();
        req.pageSize = pageSize.toString();
        // req.swjgDm = this.userInfo.swjgDm || '';
        mini.mask('查询中...');
        $.ajax({
            url: this.searchUrl,
            data: mini.encode(req),
            type: 'POST',
            contentType: 'application/json;charset=UTF-8',
            async: false,
            success: function (res) {
                mini.unmask();
                if (res.message === 'ajaxSessionTimeOut') {
                    top.location.reload(true);
                    return;
                }
                if (!res.success) {
                    mini.alert(res.message || '系统出现故障，请稍后重试');
                } else if (res) {
                    var grid = mini.get('ghqc_grid');
                    grid.setTotalCount(Number(res.total));
                    grid.setPageSize(pageSize);
                    grid.setPageIndex(pageIndex);
                    grid.setData(res.data || []);
                }
            },
            error: function (res) {
                mini.unmask();
                mini.alert(res.message || '系统出现故障，请稍后重试');
            }
        });
    },
    czRender: function (e) {
        var record = e.record;
        return '<a class="txt-blue" onclick="yqghqc.showDetail(\'' + record._uid + '\')">查看详情</a>'
    },
    ysbbzRender: function (e) {
        if (Number(e.record.wsbs) <= 0) {
            return '已申报';
        } else {
            return '未申报';
        }
    },
    yqclztRender: function (e) {
        if (e.value) {
            return yqghqc.yqclztMap[e.value];
        } else {
            return '';
        }
    },
    beforeLoad: function (e) {
        e.cancel = true;
        var pageIndex = e.data.pageIndex, pageSize = e.data.pageSize;
        yqghqc.pageSize = pageSize;
        yqghqc.search(pageIndex, pageSize);
    },
    showDetail: function (uid) {
        var record = mini.get('ghqc_grid').getRowByUID(uid);
        var req = {
            nd: record.nd,
            yf: record.yf,
            djxh: record.djxh
        };
        $.ajax({
            url: this.detailUrl,
            type: "POST",
            data: mini.encode(req),
            contentType: 'application/json;charset=UTF-8',
            async: false,
            success: function (res) {
                mini.unmask();
                if (res.message === 'ajaxSessionTimeOut') {
                    top.location.reload(true);
                    return;
                }
                if (!res.success) {
                    mini.alert(res.message || '系统出现故障，请稍后重试');
                } else {
                    var ysbList = res.value ? res.value.dhmx : [];
                    var ghList = res.value ? res.value.lsr : [];
                    mini.get('ysb_grid').setData(ysbList);
                    mini.get('ghxx_grid').setData(ghList);
                    mini.get('detail_win').show();
                    mini.get('tabs').activeTab(0);
                }
            },
            error: function (res) {
                mini.unmask();
                mini.alert(res.message || '系统出现故障，请稍后重试');
            }
        });
    },
    exportAll: function () {
        var searchForm = new mini.Form('search-box');
        searchForm.validate();
        if (!searchForm.isValid()) {
            return false;
        }
        var grid = mini.get('ghqc_grid');
        if (!grid.getData().length) {
            mini.alert("暂无数据，无需导出")
            return
        }
        if (grid.totalCount > 100000) {
            mini.alert("最多导出100000条记录，请重新选择~")
            return
        }
        var req = searchForm.getData();
        if (req.ysbbz === 'all') {
            req.ysbbz = '';
        }
        if (req.sswfxwclztDm === 'all') {
            req.sswfxwclztDm = '';
        }
        if (req.nsrztDm === 'all') {
            req.nsrztDm = '';
        }
        req.ssglyDm = this.ssglyDm;
        req.swjgDm = this.swjgDm;
        // req.swjgDm = this.userInfo.swjgDm || '';
        $('#frame').attr('src', this.exportUrl + '?params=' + mini.encode(req));
        /*$.ajax({
            url: this.exportUrl,
            data: mini.encode(req),
            type: 'POST',
            contentType: 'application/json;charset=UTF-8',
            async: false,
            success: function (res) {
                mini.unmask();
                if(res.message==='ajaxSessionTimeOut'){
                    top.location.reload(true);
                    return;
                }
                if (res.success !== undefined && !res.success){
                    mini.alert(res.message || '系统出现故障，请稍后重试');
                } else {
                    $('#frame').attr('src',res);
                }
            },
            error: function (res) {
                mini.unmask();
                mini.alert(res.message || '系统出现故障，请稍后重试');
            }
        });*/
    }
};
$(function () {
    gldUtil.addWaterInPages();
    yqghqc.init();
});
mini.VTypes["nsrsbhErrorText"] = "请输入正确的社会信用代码";
