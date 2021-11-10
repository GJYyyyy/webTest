var swjgtj = {};
var swjgtjApiHead = '/dzgzpt-wsys/';
var swjgtjApi = {
    getSwjg: swjgtjApiHead + 'api/wtjl/cxbyw/getTreeData',
    getSwsx: swjgtjApiHead + 'api/wtjl/cxbyw/querySxMc',
    doSearch: swjgtjApiHead + 'api/wtjl/cxbyw/querySwjg',
};
swjgtj.level = 1;
swjgtj.pageIndex = 0;
swjgtj.pageSize = 10;

$(function () {
    mini.parse();

    swjgtj.swjgtjForm = new mini.Form('swjgtj-form');
    swjgtj.swjgtjGrid = mini.get('swjgtj-grid');

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

    swjgtj.getSwjg();
});

/**
 * @desc 初始化
 */
swjgtj.init = function () {
    swjgtj.urlParams = {
        level: Tools.getUrlParamByName('level'),
        swjgdm: Tools.getUrlParamByName('swjgdm'),
        sxmc: Tools.getUrlParamByName('sxmc'),
        value: Tools.getUrlParamByName('value'),
        formSwjgDm: Tools.getUrlParamByName('formSwjgDm'),
        formSwsxDm: Tools.getUrlParamByName('formSwsxDm'),
        begintime: Tools.getUrlParamByName('begintime'),
        endtime: Tools.getUrlParamByName('endtime'),
    };

    if (swjgtj.urlParams.level && swjgtj.urlParams.level == 2) {
        swjgtj.initFormValue();
        $('.operate-btn').show();
        setTimeout(function () {
            swjgtj.doSearch('detail');
        }, 500);
    }
};

swjgtj.initFormValue = function () {
    mini.get('swjgDm').setValue(Tools.getUrlParamByName('swjgdm'));
    mini.get('swsxDm').setValue(Tools.getUrlParamByName('formSwsxDm'));
    mini.get('begintime').setValue(Tools.getUrlParamByName('begintime'));
    mini.get('endtime').setValue(Tools.getUrlParamByName('endtime'));
};

/**
 * @desc 获取税务机关
 */
swjgtj.getSwjg = function () {
    $.ajax({
        url: swjgtjApi.getSwjg,
        type: 'get',
        contentType: 'application/x-www-form-urlencoded;charset=utf-8',
        success: function (res) {
            if (res.success && res.value) {
                mini.get('swjgDm').loadList(res.value);
                swjgtj.getSwsx()
            }
        },
    });
};
/**
 * @desc 获取税务事项
 */
swjgtj.getSwsx = function () {
    $.ajax({
        url: swjgtjApi.getSwsx,
        type: 'get',
        success: function (res) {
            if (res.success && res.value.length) {
                mini.get('swsxDm').setData(res.value);
                swjgtj.init();
            }
        },
    });
};

/**
 * @desc 转换事项名称
 */
swjgtj.transforSxmc = function (sxmc, value) {
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
 * @desc 查询
 */
swjgtj.beforeSearch = function () {
    swjgtj.pageIndex = 0;
    swjgtj.doSearch();
};
swjgtj.doSearch = function (type) {
    var grid = swjgtj.swjgtjGrid,
        formData = swjgtj.swjgtjForm.getData(true),
        urlParams = swjgtj.urlParams,
        sxmc = swjgtj.sxmc,
        params = {};

    if (type && type == 'detail') {
        if (sxmc === 'swjg') {
            params = $.extend({}, formData, {
                swjgDm: urlParams.swjgdm,
                yxbz: 'N',
                pageIndex: swjgtj.pageIndex,
                pageSize: swjgtj.pageSize || grid.getPageSize(),
            });
        } else {
            var sxmcParam = swjgtj.transforSxmc(sxmc, urlParams.value);
            params = $.extend({}, sxmcParam, formData, {
                swjgDm: urlParams.swjgdm,
                yxbz: 'N',
                pageIndex: swjgtj.pageIndex,
                pageSize: swjgtj.pageSize || grid.getPageSize(),
            });
        }
    } else {
        params = $.extend({}, formData, {
            pageIndex: swjgtj.pageIndex,
            pageSize: swjgtj.pageSize || grid.getPageSize(),
        });
        var swjgJudgeStatus = swjgtj.swjgtjForm.validate();
        if (!swjgJudgeStatus) return;
    }
    ajax.get(swjgtjApi.doSearch, params, function (res) {
        if (res.success && res.value) {
            grid.setData(res.value.data);
            grid.setTotalCount(res.value.total);
        } else {
            grid.setData([]);
            mini.alert(res.message || '系统繁忙，请稍后再试', '提示');
        }
    });
};

/**
 * @desc 渲染表格
 */
swjgtj.renderColumn = function (e) {
    var template = '',
        url = '',
        record = e.record,
        swjgdm = record.swjgdm,
        name = e.field,
        value = record[name],
        formData = swjgtj.swjgtjForm.getData(true);
    if (name === 'swjgmc') {
        url =
            './ywl_swjgtj.html?level=2&sxmc=swjg' +
            '&swjgdm=' +
            swjgdm +
            '&value=' +
            value +
            '&formSwjgDm=' +
            formData.swjgDm +
            '&formSwsxDm=' +
            formData.swsxDm +
            '&begintime=' +
            formData.begintime +
            '&endtime=' +
            formData.endtime;
    } else {
        url =
            './ywl_detailFromNum.html?sxmc=' +
            name +
            '&swjgdm=' +
            swjgdm +
            '&value=' +
            value +
            '&formSwjgDm=' +
            formData.swjgDm +
            '&formSwsxDm=' +
            formData.swsxDm +
            '&begintime=' +
            formData.begintime +
            '&endtime=' +
            formData.endtime +
            '&type=swjg';
    }
    template =
        '<a  href="' +
            url +
            '" style="color: #2e8ded;cursor: pointer">' +
            record[name] || '' + '</a>';
    return template;
};
/**
 * 重置按钮
 */
swjgtj.doReset = function () {
    swjgtj.swjgtjForm.reset();
};
/**
 * 申请时间的校验
 */
swjgtj.onDateValidateq = function () {
    var sqrqq = mini.get('begintime').getValue();
    var sqrqz = mini.get('endtime').getValue();
    if (sqrqq && sqrqz && sqrqq.getTime() > sqrqz.getTime()) {
        mini.alert('申请日期起必须小于申请日期止！');
        mini.get('begintime').setValue();
    }
};
swjgtj.onDateValidatez = function () {
    var sqrqq = mini.get('begintime').getValue();
    var sqrqz = mini.get('endtime').getValue();
    if (sqrqz && sqrqq && sqrqz.getTime() < sqrqq.getTime()) {
        mini.alert('申请日期止必须大于申请日期起！');
        mini.get('endtime').setValue();
    }
};
//返回上一级按钮
swjgtj.goback = function () {
    history.go('-1');
};

/**
 * 翻页
 */
swjgtj.onPageChanged = function (e) {
    swjgtj.pageIndex = e.pageIndex;
    swjgtj.pageSize = e.pageSize;
    swjgtj.doSearch();
};
swjgtj.onbeforeload = function (e) {
    e.cancel = true;
};
