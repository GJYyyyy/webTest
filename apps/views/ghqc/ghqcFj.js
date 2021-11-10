/**
 * Created by liun on 2019/8/26.
 */
var ghqc = {
    swjgDm: '',
    searchUrl: '/dzgzpt-wsys/api/wtgl/sbtc/getYsbGhqcGroupBySwjg',
    init: function () {
        if (location.href.indexOf('swjgDm') > -1) {
            this.swjgDm = location.href.split('swjgDm=')[1].split('&')[0];
        } else {
            $('.back-btn-box').hide();
        }
        this.search();
    },
    search: function () {
        var req = {
            nd: '',
            yf: '',
            swjgDm: this.swjgDm
        };
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
                    ghqc.setGridData(res.value || []);
                }
            },
            error: function (res) {
                mini.unmask();
                mini.alert(res.message || '系统出现故障，请稍后重试');
            }
        });
    },
    setGridData: function (data) {
        var gridData = [];
        var ysbHj = 0; //应申报人数汇总
        var ysbHj1 = 0; //已申报人数汇总
        var wsbHj = 0; //未申报人数汇总
        $.each(data, function (i, item) {
            gridData.push(item);
            ysbHj += Number(item.yingsb || 0);
            ysbHj1 += Number(item.ysbhs || 0);
            wsbHj += Number(item.wsbhs || 0);
        });
        gridData.unshift({
            swjgDm: '',
            swjgMc: '汇总',
            yingsb: ysbHj.toString(),
            ysbhs: ysbHj1.toString(),
            wsbhs: wsbHj.toString(),
            sbl: ysbHj !== 0 ? (ysbHj1 / ysbHj * 100).toFixed(2) : '0.00'
        });
        mini.get('ghqc_fj_grid').setData(gridData);
    },
    swjgRender: function (e) {
        if (!e.record.swjgDm) {
            return e.record.swjgMc;
        } else {
            return '<a class="txt-blue" href="ghqcKsld.html?swjgDm='+ e.record.swjgDm +'">'+e.record.swjgMc+'</a>';
        }
    },
    ysbblRender: function (e) {
        return Number(e.value || 0).toFixed(2) + '%';
    }
};
$(function () {
    ghqc.init();
});

