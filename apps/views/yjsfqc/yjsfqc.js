/**
 * Created by liun on 2019/8/21.
 */
var yjsfqc = {
    pageSize: 30,
    selectedDh: {},
    searchUrl: '/dzgzpt-wsys/api/wtgl/sbtc/getCjGhqc',
    detailUrl: '/dzgzpt-wsys/api/wtgl/sbtc/getCjGhmx',
    messageUrl: '/dzgzpt-wsys/api/wtgl/sbtc/sendMsgCj',
    nsrztUrl: '/dzgzpt-wsys/api/wtgl/sbtc/queryNsrzt',
    init: function () {
        var now = new Date($.ajax({async: false}).getResponseHeader('Date'));
        mini.get('jkyf').setValue(now.format('yyyyMM'));
        this.initSelect();
    },
    initSelect: function () {
        //纳税人状态
        var result = [{ID: '', MC: '全部'}];
        $.ajax({
            url: this.nsrztUrl,
            type: 'GET',
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
                    if (res.value && res.value.length >=0){
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
    search: function (pageIndex, pageSize) {
        var searchForm = new mini.Form('search-box');
        searchForm.validate();
        if (!searchForm.isValid()){
            return false;
        }
        var req = {
            nsrztDm: (mini.get('nsrztDm').getValue() === 'all' ? '' : mini.get('nsrztDm').getValue()),
            nsrsbh: mini.get('nsrsbh').getValue(),
            jkyf: mini.get('jkyf').getText()
        };
        req.pageIndex = pageIndex.toString();
        req.pageSize = pageSize.toString();
        mini.mask('查询中...');
        $.ajax({
            url: this.searchUrl,
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
                if (!res.success){
                    mini.alert(res.message || '系统出现故障，请稍后重试');
                } else if (res) {
                    var grid = mini.get('yjsf_grid');
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
    ssglyRender: function (e) {
        return '<span>'+ e.record.swryxm.trim() +'（'+ e.record.ssglyDm.trim() +'）</span>'
    },
    czRender: function (e) {
        var record = e.record;
        return '<a class="txt-blue" onclick="yjsfqc.showDetail(\''+record._uid+'\')">查看详情</a>'
    },
    beforeLoad: function (e) {
        e.cancel = true;
        var pageIndex = e.data.pageIndex, pageSize = e.data.pageSize;
        yjsfqc.pageSize = pageSize;
        yjsfqc.search(pageIndex, pageSize);
    },
    showDetail: function (uid) {
        var record = mini.get('yjsf_grid').getRowByUID(uid);
        var req = {
            jkqx: record.jkqx,
            jkyf: record.jkyf,
            djxh: record.djxh
        };
        this.selectedDh.jkyf = record.jkyf;
        this.selectedDh.djxh = record.djxh;
        $.ajax({
            url: this.detailUrl,
            type: "POST",
            data: mini.encode(req),
            contentType: 'application/json;charset=UTF-8',
            async: false,
            success: function (res) {
                mini.unmask();
                if(res.message==='ajaxSessionTimeOut'){
                    top.location.reload(true);
                    return;
                }
                if (!res.success){
                    mini.alert(res.message || '系统出现故障，请稍后重试');
                } else {
                    var mxList = res.value ? res.value.dhmx : [];
                    var ghList = res.value ? res.value.lsr : [];
                    mini.get('mx_grid').setData(mxList);
                    mini.get('ghxx_grid').setData(ghList);
                    var allowSend = false;
                    $.each(mxList,function () {
                        var now = new Date(this.dqrq).getTime();  //当前时间
                        var jkqx = new Date(this.jkqx).getTime();  //缴款期限
                        if (this.jkzt === 'N' && ((jkqx - now <= 24*60*60*1000 && jkqx - now > 0 && res.value && res.value.sfyfs === 'N') // todo sbzt
                            || (jkqx - now === 0 && res.value && res.value.sfyfs !== 'T'))){
                            allowSend = true;
                            return false;
                        }
                    });
                    if (allowSend){
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
        yjsfqc.selectedDh = {};
    },
    sendMsg: function () {
        var selected = mini.get('ghxx_grid').getSelecteds();
        if ($('.message-btn').hasClass('btn-gray')){
            return;
        }
        if (selected.length === 0){
            mini.alert('请先勾选发送对象');
            return;
        }
        var _this = this;
        if (selected.length > 0){
            mini.confirm('发送短信后当天无法向该企业办税人员再次发送短信，确认向勾选对象发送短信？','提示',function (action) {
                if (action === 'ok'){
                    var req = {
                        djxh: _this.selectedDh.djxh,
                        nd: _this.selectedDh.jkyf.substr(0, 4),
                        yf: _this.selectedDh.jkyf.substr(4, 2),
                        zsxmmcs: '',
                        lsr: []
                    };
                    var zsxmList = [];
                    var ts = 0;
                    $.each(mini.get('mx_grid').getData(), function () {
                        if (this.jkzt === 'N' && new Date(this.jkqx).getMonth() === new Date(this.dqrq).getMonth() && new Date(this.jkqx).getTime() - new Date(this.dqrq).getTime() >= 0){
                            if (!ts){
                                ts = Number(this.jkqx.replace(/\-/g, '')) - Number(this.dqrq.replace(/\-/g, ''));
                            } else {
                                ts = Math.min(ts, Number(this.jkqx.replace(/\-/g, '')) - Number(this.dqrq.replace(/\-/g, '')));
                            }
                            zsxmList.push(this.zsxmMc);
                        }
                    });
                    req.ts = (ts || 0).toString();
                    req.zsxmmcs = zsxmList.join(',');
                    $.each(selected,function (i, item) {
                        req.lsr.push({
                            role: item.role,
                            xm: item.xm,
                            mobile: item.mobile
                        })
                    });
                    $.ajax({
                        url: yjsfqc.messageUrl,
                        data: mini.encode(req),
                        type: "POST",
                        contentType: 'application/json;charset=UTF-8',
                        async: false,
                        success: function (res) {
                            mini.unmask();
                            if(res.message==='ajaxSessionTimeOut'){
                                top.location.reload(true);
                                return;
                            }
                            if (!res.success){
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
    }
};
$(function () {
    gldUtil.addWaterInPages();
    yjsfqc.init();
});
mini.VTypes["nsrsbhErrorText"] = "请输入正确的社会信用代码";
