/**
 * Created by liun on 2019/4/24.
 */
var ghqccx = {
    pageSize: 30,
    nowYear: null,
    nowMonth: null,
    // userInfo: null,
    selectedDh: {},
    ssglyDm: '',
    swjgDm: '',
    searchUrl: '/dzgzpt-wsys/api/wtgl/sbtc/getYsbGhqc',
    detailUrl: '/dzgzpt-wsys/api/wtgl/sbtc/getDhysbmx',
    messageUrl: '/dzgzpt-wsys/api/wtgl/sbtc/sendMsg',
    subscribeUrl: '/dzgzpt-wsys/api/wtgl/sbtc/sendXxtx',
    exportUrl: '/dzgzpt-wsys/api/wtgl/sbtc/download/ysbGhqc',
    nsrztUrl: '/dzgzpt-wsys/api/wtgl/sbtc/queryNsrzt',
    syglyUrl: '/dzgzpt-wsys/api/wtgl/sbtc/get/ssgly ',
    getSession: '/dzgzpt-wsys/api/wtgl/dbsx/getSession',
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
                    ghqccx.userInfo = res || {};
                }
            },
            error: function (res) {
                mini.alert(res.message || '系统出现故障，请稍后重试');
            }
        });*/
        this.initSelect();
        $.ajax({//当前登录的税务人员代码
            url: this.getSession,
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
                    if (res.value) {
                        mini.get('swrydm').setValue(res.value.userId)
                    }
                }
            },
            error: function (res) {
                mini.unmask();
                mini.alert(res.message || '系统出现故障，请稍后重试');
            }
        });
    },
    initSelect: function () {
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

        this.search(0, 30);
    },
    ndChanged: function (e) {
        var yd = Number(mini.get('yf').getValue());
        if (Number(e.value) === ghqccx.nowYear) {
            var maxMonth = ghqccx.nowMonth;
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
    swjgChanged: function (e) {
        //税源管理员
        var syglyList = [{ ssglydm: 'all', ssglymc: '全部' }];
        $.ajax({
            url: '/dzgzpt-wsys/api/wtgl/sbtc/get/ssgly?swjgDm=' + e.value,
            type: 'get',
            contentType: 'application/json;charset=UTF-8',
            async: false,
            success: function (res) {
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
                mini.alert(res.message || '系统出现故障，请稍后重试');
            }
        });
        mini.get('ssglyDm').setData(syglyList);
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
        if (req.nsrztDm === 'all') {
            req.nsrztDm = '';
        }
        // req.ssglyDm = this.ssglyDm;
        // req.swjgDm = this.swjgDm;
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
        return '<a class="txt-blue" onclick="ghqccx.showDetail(\'' + record._uid + '\')">查看详情</a>'
    },
    ysbbzRender: function (e) {
        if (Number(e.record.wsbs) <= 0) {
            return '已申报';
        } else {
            return '未申报';
        }
    },
    beforeLoad: function (e) {
        e.cancel = true;
        var pageIndex = e.data.pageIndex, pageSize = e.data.pageSize;
        ghqccx.pageSize = pageSize;
        ghqccx.search(pageIndex, pageSize);
    },
    showDetail: function (uid) {
        var record = mini.get('ghqc_grid').getRowByUID(uid);
        var req = {
            nd: record.nd,
            yf: record.yf,
            djxh: record.djxh
        };
        this.selectedDh.nd = record.nd;
        this.selectedDh.yf = record.yf;
        this.selectedDh.djxh = record.djxh;
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
                    var allowSend = false;
                    var now = new Date(new Date().format('yyyy-MM-dd')).getTime(); //当前时间
                    $.each(ysbList, function () {
                        var sbqx = new Date(this.sbqx).getTime();  //申报期限
                        var dayBefore = new Date(this.dayBefore).getTime();  //前一天工作日
                        var ssglyDm = this.ssglyDm;  //税收管理员代码
                        if (dayBefore - now === 0 || sbqx - now === 0) {
                            if (this.sbzt === '未申报' && ssglyDm === mini.get('swrydm').getValue() && (res.value && res.value.sfyfs != 'T')) {
                                allowSend = true;
                                return false;
                            }
                        } else {
                            allowSend = false;
                            return false;
                        }
                    });
                    if (allowSend) {
                        $('.message-btn').removeClass('btn-gray');
                    } else {
                        $('.message-btn').addClass('btn-gray');
                    }
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
    beforehide: function () {
        ghqccx.selectedDh = {};
    },
    sendMsg: function () {
        var selected = mini.get('ghxx_grid').getSelecteds();
        if ($('.message-btn').hasClass('btn-gray')) {
            return;
        }
        if (selected.length === 0) {
            mini.alert('请先勾选发送对象');
            return;
        }
        var _this = this;
        if (selected.length > 0) {
            mini.confirm('发送短信后当天无法向该企业办税人员再次发送短信，确定是否发送？', '提示', function (action) {
                if (action === 'ok') {
                    var req = {
                        djxh: _this.selectedDh.djxh,
                        nd: _this.selectedDh.nd,
                        yf: _this.selectedDh.yf,
                        zsxmmcs: '',
                        lsr: []
                    };
                    var zsxmList = [];
                    var ts;
                    var now = new Date(new Date().format('yyyy-MM-dd')).getTime();  //当前时间
                    $.each(mini.get('ysb_grid').getData(), function () {
                        var sbqx = new Date(this.sbqx).getTime();  //申报期限
                        var dayBefore = new Date(this.dayBefore).getTime();  //前一天工作日
                        if (this.sbzt === '未申报' && dayBefore - now === 0) {
                            ts = 1
                        } else if (this.sbzt === '未申报' && sbqx - now === 0) {
                            ts = 0
                        }
                        zsxmList.push(this.zsxmmc);
                        // if (this.sbzt === '未申报' && new Date(this.sbqx).getMonth() === new Date(new Date().format('yyyy-MM-dd')).getMonth() && new Date(this.sbqx).getTime() - new Date(new Date().format('yyyy-MM-dd')).getTime() >= 0) {
                        //     if (!ts) {
                        //         ts = Number(this.sbqx.replace(/\-/g, '')) - Number(new Date().format('yyyy-MM-dd').replace(/\-/g, ''));
                        //     } else {
                        //         ts = Math.min(ts, Number(this.sbqx.replace(/\-/g, '')) - Number(new Date().format('yyyy-MM-dd').replace(/\-/g, '')));
                        //     }
                        //     zsxmList.push(this.zsxmmc);
                        // }
                    });
                    req.ts = (ts || 0).toString();
                    req.zsxmmcs = zsxmList.join(',');
                    $.each(selected, function (i, item) {
                        req.lsr.push({
                            role: item.role,
                            xm: item.xm,
                            mobile: item.mobile
                        })
                    });
                    $.ajax({
                        url: ghqccx.messageUrl,
                        data: mini.encode(req),
                        type: "POST",
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
                                mini.alert('发送成功');
                                $('.message-btn').addClass('btn-gray');
                            }
                        },
                        error: function (res) {
                            mini.unmask();
                            mini.alert(res.message || '系统出现故障，请稍后重试');
                        }
                    });
                }
            });
        }
    },
    sendMsg2: function () {
        var selected = mini.get('ghxx_grid').getSelecteds();
        if ($('.message-btn').hasClass('btn-gray')) {
            return;
        }
        if (selected.length === 0) {
            mini.alert('请先勾选发送对象');
            return;
        }
        var _this = this;
        if (selected.length > 0) {
            var req = {
                djxh: _this.selectedDh.djxh,
                nd: _this.selectedDh.nd,
                yf: _this.selectedDh.yf,
                zsxmmcs: '',
                lsr: []
            };
            var zsxmList = [];
            var ts;
            var now = new Date(new Date().format('yyyy-MM-dd')).getTime();  //当前时间
            $.each(mini.get('ysb_grid').getData(), function () {
                var sbqx = new Date(this.sbqx).getTime();  //申报期限
                var dayBefore = new Date(this.dayBefore).getTime();  //前一天工作日
                if (this.sbzt === '未申报' && dayBefore - now === 0) {
                    ts = 1
                } else if (this.sbzt === '未申报' && sbqx - now === 0) {
                    ts = 0
                }
                zsxmList.push(this.zsxmmc);
                // if (this.sbzt === '未申报' && new Date(this.sbqx).getMonth() === new Date(new Date().format('yyyy-MM-dd')).getMonth() && new Date(this.sbqx).getTime() - new Date(new Date().format('yyyy-MM-dd')).getTime() >= 0) {
                //     if (!ts) {
                //         ts = Number(this.sbqx.replace(/\-/g, '')) - Number(new Date().format('yyyy-MM-dd').replace(/\-/g, ''));
                //     } else {
                //         ts = Math.min(ts, Number(this.sbqx.replace(/\-/g, '')) - Number(new Date().format('yyyy-MM-dd').replace(/\-/g, '')));
                //     }
                //     zsxmList.push(this.zsxmmc);
                // }
            });
            req.ts = (ts || 0).toString();
            req.zsxmmcs = zsxmList.join(',');
            $.each(selected, function (i, item) {
                req.lsr.push({
                    role: item.role,
                    xm: item.xm,
                    mobile: item.mobile
                })
            });
            $.ajax({
                url: ghqccx.subscribeUrl,
                data: mini.encode(req),
                type: "POST",
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
                        mini.alert('发送成功');
                        $('.message-btn').addClass('btn-gray');
                    }
                },
                error: function (res) {
                    mini.unmask();
                    mini.alert(res.message || '系统出现故障，请稍后重试');
                }
            });
        }
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
        if (req.nsrztDm === 'all') {
            req.nsrztDm = '';
        }
        // req.ssglyDm = this.ssglyDm;
        // req.swjgDm = this.swjgDm;
        $('#frame').attr('src', encodeURI(this.exportUrl + '?params=' + mini.encode(req)));
        // req.swjgDm = this.userInfo.swjgDm || '';
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
    ghqccx.init();
});
mini.VTypes["nsrsbhErrorText"] = "请输入正确的社会信用代码";
