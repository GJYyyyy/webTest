var sxtj = {};
var sxtjApiHead = '/dzgzpt-wsys/';
var sxtjApi = {
    getSwjg: sxtjApiHead + 'api/wtjl/cxbyw/getTreeData',
    getSwsx: sxtjApiHead + 'api/wtjl/cxbyw/querySxMc',
    doSxSearch: sxtjApiHead + 'api/wtjl/cxbyw/queryBySxmc',
};
sxtj.level = 1;
sxtj.pageIndex = 0;
sxtj.pageSize = 10;

$(function () {
    mini.parse();

    sxtj.sxtjForm = new mini.Form('sxtj-form');
    sxtj.sxtjGrid = mini.get('sxtj-grid');

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

    sxtj.getSwjg();
});

/**
 * @desc 初始化
 */
sxtj.init = function () {
    sxtj.urlParams = {
        level: Tools.getUrlParamByName('level'),
        swsxdm: Tools.getUrlParamByName('swsxdm'),
        sxmc: Tools.getUrlParamByName('sxmc'),
        value: Tools.getUrlParamByName('value'),
        formSwjgDm: Tools.getUrlParamByName('formSwjgDm'),
        formSwsxDm: Tools.getUrlParamByName('formSwsxDm'),
        begintime: Tools.getUrlParamByName('begintime'),
        endtime: Tools.getUrlParamByName('endtime'),
    };

    if (sxtj.urlParams.level && sxtj.urlParams.level == 2) {
        sxtj.initFormValue();
        $('.operate-btn').show();
        setTimeout(function () {
            sxtj.doSearch(2);
        }, 500);
    }
};

sxtj.initFormValue = function () {
    mini.get('swjgDm').setValue(Tools.getUrlParamByName('formSwjgDm'));
    mini.get('swsxDm').setValue(Tools.getUrlParamByName('swsxdm'));
    mini.get('begintime').setValue(Tools.getUrlParamByName('begintime'));
    mini.get('endtime').setValue(Tools.getUrlParamByName('endtime'));
};

/**
 * @desc 获取税务机关
 */
sxtj.getSwjg = function () {
    $.ajax({
        url: sxtjApi.getSwjg,
        type: 'get',
        contentType: 'application/x-www-form-urlencoded;charset=utf-8',
        success: function (res) {
            if (res.success && res.value) {
                mini.get('swjgDm').loadList(res.value);
                sxtj.getSwsx();
            }
        },
    });
};
/**
 * @desc 获取税务事项
 */
sxtj.getSwsx = function () {
    $.ajax({
        url: sxtjApi.getSwsx,
        type: 'get',
        success: function (res) {
            if (res.success && res.value.length) {
                mini.get('swsxDm').setData(res.value);
                sxtj.init();
            }
        },
    });
};

/**
 * @desc 转换事项名称
 */
sxtj.transforSxmc = function (sxmc, value) {
    var sxmcObj = {
        ybj: { ybj: value },
        blz: { blz: value },
        bsl: { bsl: value },
        qt: { qt: value },
        zs: { zs: value },
    };
    return sxmcObj[sxmc];
};

sxtj.beforeSearch = function () {
    sxtj.pageIndex = 0;
    sxtj.doSearch();
};
/**
 * @desc 查询
 */
sxtj.doSearch = function (type) {
    var grid = sxtj.sxtjGrid,
        formData = sxtj.sxtjForm.getData(true),
        urlParams = sxtj.urlParams,
        sxmc = urlParams.sxmc,
        params = {};

    if (type && type == 2) {
        if (sxmc === 'swjg') {
            params = $.extend({}, formData, {
                swsxDm: urlParams.swsxdm,
                yxbz: 'N',
                pageIndex: sxtj.pageIndex,
                pageSize: sxtj.pageSize || grid.getPageSize(),
            });
        } else {
            var sxmcParam = sxtj.transforSxmc(sxmc, urlParams.value);
            params = $.extend({}, sxmcParam, formData, {
                swsxDm: urlParams.swsxdm,
                yxbz: 'N',
                pageIndex: sxtj.pageIndex,
                pageSize: sxtj.pageSize || grid.getPageSize(),
            });
        }
    } else {
        params = $.extend({}, formData, {
            pageIndex: sxtj.pageIndex,
            pageSize: sxtj.pageSize || grid.getPageSize(),
        });
    }
    var swjgJudgeStatus = sxtj.sxtjForm.validate();
    if (!swjgJudgeStatus) return;
    ajax.get(sxtjApi.doSxSearch, params, function (res) {
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
sxtj.renderColumn = function (e) {
    var template = '',
        url = '',
        record = e.record,
        swsxdm = record.swsxdm,
        name = e.field,
        value = record[name],
        formData = sxtj.sxtjForm.getData(true),
        swjgdm = formData.swjgDm;
    if (name === 'sxmc') {
        url =
            './ywl_sxtj.html?level=2&sxmc=swjg' +
            '&swjgdm=' +
            swjgDm +
            '&swsxdm=' +
            swsxdm +
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
            '&swsxdm=' +
            swsxdm +
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
            '&type=sx';
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
sxtj.doReset = function () {
    sxtj.sxtjForm.reset();
};
/**
 * 申请时间的校验
 */
sxtj.onDateValidateq = function () {
    var sqrqq = mini.get('begintime').getValue();
    var sqrqz = mini.get('endtime').getValue();
    if (sqrqq && sqrqz && sqrqq.getTime() > sqrqz.getTime()) {
        mini.alert('申请日期起必须小于申请日期止！');
        mini.get('begintime').setValue();
    }
};
sxtj.onDateValidatez = function () {
    var sqrqq = mini.get('begintime').getValue();
    var sqrqz = mini.get('endtime').getValue();
    if (sqrqz && sqrqq && sqrqz.getTime() < sqrqq.getTime()) {
        mini.alert('申请日期止必须大于申请日期起！');
        mini.get('endtime').setValue();
    }
};
//返回上一级按钮
sxtj.goback = function () {
    history.go('-1');
};

/**
 * 翻页
 */
sxtj.onPageChanged = function (e) {
    sxtj.pageIndex = e.pageIndex;
    sxtj.pageSize = e.pageSize;
    sxtj.doSearch();
};
sxtj.onbeforeload = function (e) {
    e.cancel = true;
};
