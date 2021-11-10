var ywltj = {};
var ywltjApiHead = '/dzgzpt-wsys/';
var ywltjApi = {
    getSwjg: ywltjApiHead + 'api/wtjl/cxbyw/getTreeData',
    getSwsx: ywltjApiHead + 'api/wtjl/cxbyw/querySxMc',
    doSxSearch: ywltjApiHead + 'api/wtjl/cxbyw/queryMxBysx',
    doSwjgSearch: ywltjApiHead + 'api/wtjl/cxbyw/queryMxBySwjg',
};

ywltj.pageIndex = 0;
ywltj.pageSize = 10;

$(function () {
    mini.parse();

    $('.search').click(function () {
        var toogle = $('.search').data('show');
        if (toogle === 'yes') {
            $('.searchdiv').stop().slideUp();
            $('.search').data('show', 'no');
            $('.searchC').html('显示查询条件');
        } else if (toogle === 'no') {
            $('.searchdiv').stop().slideDown();
            $('.search').data('show', 'yes');
            $('.searchC').html('隐藏查询条件');
        }
    });

    ywltj.ywltjForm = new mini.Form('ywltj-form');
    ywltj.ywltjGrid = mini.get('ywltj-grid');
    $('.operate-btn').show();
    ywltj.getSwjg();
});

/**
 * @desc 初始化
 */
ywltj.init = function () {
    ywltj.urlParams = {
        swjgdm: Tools.getUrlParamByName('swjgdm'),
        swsxdm: Tools.getUrlParamByName('swsxdm'),
        sxmc: Tools.getUrlParamByName('sxmc'),
        value: Tools.getUrlParamByName('value'),
        formSwjgDm: Tools.getUrlParamByName('formSwjgDm'),
        formSwsxDm: Tools.getUrlParamByName('formSwsxDm'),
        begintime: Tools.getUrlParamByName('begintime'),
        endtime: Tools.getUrlParamByName('endtime'),
        type: Tools.getUrlParamByName('type'),
    };

    ywltj.initFormValue();
    $('.operate-btn').show();
};

ywltj.initFormValue = function () {
    var swsxDm = !!Tools.getUrlParamByName('formSwsxDm')
        ? ywltj.urlParams.formSwsxDm
        : ywltj.urlParams.swsxdm;
    mini.get('swjgDm').setValue(Tools.getUrlParamByName('swjgdm'));
    mini.get('swsxDm').setValue(swsxDm);
    mini.get('begintime').setValue(Tools.getUrlParamByName('begintime'));
    mini.get('endtime').setValue(Tools.getUrlParamByName('endtime'));
    ywltj.doSearch('detail');
};

/**
 * @desc 获取税务机关
 */
ywltj.getSwjg = function () {
    $.ajax({
        url: ywltjApi.getSwjg,
        type: 'get',
        contentType: 'application/x-www-form-urlencoded;charset=utf-8',
        success: function (res) {
            if (res.success && res.value) {
                mini.get('swjgDm').loadList(res.value);
                mini.get('swjgDm').setValue(res.value[0].swjgdm);
                ywltj.getSwsx();
            }
        },
    });
};

/**
 * @desc 获取税务事项
 */
ywltj.getSwsx = function () {
    $.ajax({
        url: ywltjApi.getSwsx,
        type: 'get',
        success: function (res) {
            if (res.success && res.value.length) {
                mini.get('swsxDm').setData(res.value);
                ywltj.init();
            }
        },
    });
};

/**
 * 重置按钮
 */
ywltj.doReset = function () {
    ywltj.ywltjForm.reset();
};

/**
 * @desc 查询
 */
ywltj.beforeSearch = function () {
    ywltj.pageIndex = 0;
    ywltj.doSearch();
};
ywltj.doSearch = function (type) {
    var grid = ywltj.ywltjGrid,
        formData = ywltj.ywltjForm.getData(true),
        urlParams = ywltj.urlParams,
        sxmc = urlParams.sxmc,
        value = urlParams.value,
        url = type === 'sx' ? ywltjApi.doSxSearch : ywltjApi.doSwjgSearch,
        params = {};

    var sxmcParam = ywltj.transforSxmc(sxmc, value);
    if (type && type === 'detail') {
        params = $.extend({}, formData, sxmcParam, {
            swsxDm: urlParams.swsxdm,
            pageIndex: ywltj.pageIndex,
            pageSize: ywltj.pageSize || grid.getPageSize(),
        });
    } else {
        params = $.extend({}, formData, sxmcParam, {
            pageIndex: ywltj.pageIndex,
            pageSize: ywltj.pageSize || grid.getPageSize(),
        });
        var swjgJudgeStatus = ywltj.ywltjForm.validate();
        if (!swjgJudgeStatus) return;
    }

    ajax.get(url, params, function (res) {
        if (res.success && res.value) {
            grid.setData(res.value.data);
            grid.setTotalCount(res.value.total);
        } else {
            mini.alert(res.message || '系统繁忙，请稍后再试', '提示');
            grid.setData([]);
        }
    });
};

/**
 * @desc 转换事项名称
 */
ywltj.transforSxmc = function (sxmc, value) {
    var sxmcObj = {
        ybj: { ybj: value },
        blz: { blz: value },
        bsl: { bsl: value },
        qt: { qt: value },
        zs: { zs: value },
    };
    return sxmcObj[sxmc];
};

/**
 * 申请时间的校验
 */
ywltj.onDateValidateq = function () {
    var begintime = mini.get('begintime').getValue();
    var endtime = mini.get('endtime').getValue();
    if (begintime && endtime && begintime.getTime() > endtime.getTime()) {
        mini.alert('申请日期起必须小于申请日期止！');
        mini.get('begintime').setValue();
    }
};
ywltj.onDateValidatez = function () {
    var begintime = mini.get('begintime').getValue();
    var endtime = mini.get('endtime').getValue();
    if (endtime && begintime && endtime.getTime() < begintime.getTime()) {
        mini.alert('申请日期止必须大于申请日期起！');
        mini.get('endtime').setValue();
    }
};

//返回上一级按钮
ywltj.goback = function () {
    history.go('-1');
};

/**
 * 翻页
 */
ywltj.onPageChanged = function (e) {
    ywltj.pageIndex = e.pageIndex;
    ywltj.pageSize = e.pageSize;
    ywltj.doSearch();
};
ywltj.onbeforeload = function (e) {
    e.cancel = true;
};
