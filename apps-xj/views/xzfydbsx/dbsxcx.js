
$(function () {
    gldUtil.addWaterInPages();
    init();
});

var grid;
var gridzr;

function init() {
    mini.parse();

    grid = mini.get("dbsxGrid");
    grid.setUrl("../../../../api/xj/wtgl/dbsx/queryDbsx");

    //获取缓存的ip、用户id、tableid进行判断
    var cip = mini.Cookie.get("cip");
    var ctableid = mini.Cookie.get("ctableid");
    var cuserid = mini.Cookie.get("cuserid");
    //获取当前登录账号及ip地址
    var loginuserid = getSession().userId;
    var ip = window.location.host;

    if (cuserid == "undefined" || cuserid == null || cuserid == "") {
        $.extend({
            id: 'sydb'
        });
    }
    //判断账号是否一致
    if (loginuserid == cuserid) {
        //账号一致判断ip号是否一致
        if (cip == ip) {
            var form = new mini.Form("#cxtjForm");
            var data=mini.Cookie.get(loginuserid+"searchConditionDbsxcx");
            var formData = form.setData(data?mini.decode(data):{});
            //若一直存入缓存的值
            $.extend({
                id: ctableid
            });
        } else {
            //若ip不一致则存，则存入所有代办
            $.extend({
                id: 'sydb'
            });
        }
    } else {
        //若前后登录的账号不一致，则存入所有代办 并且将新的查询条件存入
        var form = new mini.Form("#cxtjForm");
        var formData = form.getData(true);
        mini.Cookie.set(loginuserid+"searchConditionDbsxcx",mini.encode(formData));
        $.extend({
            id: 'sydb'
        });
    }

    //收到日期
    var sdrqQ = mini.get("sdrqQ");
    var sdrqZ = mini.get("sdrqZ");
    var now = new Date(),delay = new Date();
    delay.setMonth(delay.getMonth() - 1);
    sdrqQ.setValue(mini.formatDate(delay,'yyyy-MM-dd'));
    sdrqQ.setMaxDate(now);
    sdrqZ.setValue(mini.formatDate(now,'yyyy-MM-dd'));
    sdrqZ.setMinDate(delay);
    sdrqZ.setMaxDate(now);

    doSearch($);
    getcswsx();
}

$(document).ready(function() {
    $(".search").click(function() {
        showsearch();
    });
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

function doSearch(th) {
    var tabid = th.id;
    if (tabid != 'search') {
        $(".tab-bar .active").removeClass("active");
        document.getElementById(tabid).className = 'active';
    }
    var tabid = $(".tab-bar .active")[0].id;//获取当选选中的tabs
    mini.Cookie.set("ctableid", tabid);//存入缓存中
    //中软待办显示中软待办的查询条件
    if (tabid === 'zrdb') {
        $("#zrdbcxTable").show();
        $("#qtcxTable").hide();

        $("#dblbzr").show();
        $("#dblb").hide();
        $("#dblbkq").hide();
        $("#dblbfpsl").hide();
    } else if (tabid === 'kqydb') {
        $("#qtcxTable").show();
        $("#zrdbcxTable").hide();

        $("#dblbkq").show();
        $("#dblbfpsl").hide();
        $("#dblb").hide();
        $("#dblbzr").hide();
    } else if (tabid === 'fply') {
        $("#qtcxTable").show();
        $("#zrdbcxTable").hide();

        $("#dblbzr").hide();
        $("#dblbfpsl").show();
        $("#dblbkq").hide();
        $("#dblb").hide();
    } else {
        $("#qtcxTable").show();
        $("#zrdbcxTable").hide();

        $("#dblbzr").hide();
        $("#dblbkq").hide();
        $("#dblbfpsl").hide();
        $("#dblb").show();
    }
    ;
    var swsx = '';
    var lqfsDm = '';
    if (tabid == 'wcjyzmkj') {
        swsx = '跨区域经营证明开具';
    }
    if (tabid == 'swdjxxbldb') {
        swsx = '税务登记信息补录';
    }
    if (tabid == 'fplyldb') {
        swsx = '领用';
    }
    if (tabid == 'zzszpdkldb') {
        swsx = '增值税专用发票代开';
    }
    if (tabid == 'swxzxk') {
        swsx = '税务行政许可';
    }
    if (tabid == 'gtgshdehd') {
        swsx = '个体工商户定额核定';
    }
    if (tabid == 'zzsyhjmba') {
        swsx = '增值税税收减免备案申请';
    }
    if (tabid == 'zzsjzjtba') {
        swsx = '增值税即征即退备案';
    }
    if (tabid == 'xfsssjmba') {
        swsx = '消费税税收减免备案';
    }
    if (tabid == 'bgswdj') {
        swsx = '变更税务登记';
    }
    if (tabid == "swdjxxbl") {
        swsx = "税务登记信息补录";
    }
    if (tabid == "fply") {
        swsx = "发票领用";
        if (tabid == "fply") {
            lqfsDm = '03'
        }
    }


    var form = new mini.Form("#cxtjForm");
    var formData = form.getData(true);
    var loginuserid = getSession().userId;
    mini.Cookie.set(loginuserid+"searchConditionDbsxcx",mini.encode(formData));
    // var param = mini.encode(formData);
    // console.log(param);


    if (tabid !== 'zrdb') {
        if (tabid !== 'kqydb') {
            if (tabid == 'fply') {
                var data = {
                    nsrsbh: formData.nsrsbh,
                    wsh: formData.wsh,
                    sdrqQ: formData.sdrqQ,
                    sdrqZ: formData.sdrqZ,
                    swsxDm: formData.swsxdm,
                    zgswskfjDm: formData.swjgdm,
                    blqxQ: formData.blqxQ,
                    blqxZ: formData.blqxZ
                }
                gridzr = mini.get("dbsxGridfpsldb");
                gridzr.setUrl("../../../../api/xj/wtgl/dbsx/queryZzfplyDbsx");
                gridzr.load({
                    rwlxDm: '01',
                    data: mini.encode(data),
                }, function () {
                    $(".searchdiv").slideUp();
                }, function (data) {
                    var obj = JSON.parse(data.errorMsg);
                    mini.alert(obj.message || "系统异常,请稍后再试。")
                });
                $('#dblbfpsl').height($('#dblb').height());//设置待办表格高度,因初始化没有值表格不会被撑开
            } else {
                var data = {
                    nsrsbh: formData.nsrsbh,
                    wsh: formData.wsh,
                    sdrqQ: formData.sdrqQ,
                    sdrqZ: formData.sdrqZ,
                    swsxDm: '30120301', //formData.swsxdm,
                    zgswskfjDm: formData.swjgdm,
                    blqxQ: formData.blqxQ,
                    blqxZ: formData.blqxZ
                }
                grid.load({
                    rwlxDm: '01',
                    data: mini.encode(data),
                    swsxmc: swsx,
                    lqfsDm: lqfsDm
                }, function () {
                    $(".searchdiv").slideUp();
                }, function (data) {
                    var obj = JSON.parse(data.errorMsg);
                    mini.alert(obj.message || "系统异常,请稍后再试。")
                });
            }
        } else {
            var data = {
                nsrsbh: formData.nsrsbh,
                wsh: formData.wsh,
                sdrqQ: formData.sdrqQ,
                sdrqZ: formData.sdrqZ,
                swsxDm: formData.swsxdm,
                zgswskfjDm: formData.swjgdm,
                blqxQ: formData.blqxQ,
                blqxZ: formData.blqxZ
            }
            gridzr = mini.get("dbsxGridkqdb");
            gridzr.setUrl("../../../../api/xj/wtgl/dbsx/queryKqyDbsx");
            gridzr.load({
                rwlxDm: '01',
                data: mini.encode(data),
            }, function () {
                $(".searchdiv").slideUp();
            }, function (data) {
                var obj = JSON.parse(data.errorMsg);
                mini.alert(obj.message || "系统异常,请稍后再试。")
            });
            $('#dblbkq').height($('#dblb').height());//设置待办表格高度,因初始化没有值表格不会被撑开

        }
        ;
    } else {
        if (mini.get('sqrqq').getFormValue() == "") {
            mini.get('sqrqq').setValue(getFirstDayOfMonth());
            mini.get('sqrqz').setValue(getNowFormatDate());
        }
        ;
        var sqq = mini.get('sqrqq').getValue().getTime();
        var sqz = mini.get('sqrqz').getValue().getTime();
        var rs = (sqz - sqq) / (1000 * 60 * 60 * 24);
        if (rs > 30) {
            mini.alert("申请时间间隔不可超过30天，请重新选择！");
            return false;
        }
        formData = form.getData(true);
        var data = {
            nsrsbh: formData.nsrsbm,
            sxdl: formData.xmdl,
            sxzl: formData.xmzl,
            sxxl: formData.xmxl,
            sssxxm: formData.sssxxm,
            wsh: formData.wshm,
            sqsjQ: formData.sqrqq,
            sqsjZ: formData.sqrqz,
        };

        gridzr = mini.get("dbsxGridzrdb");
        gridzr.setUrl("../../../../api/xj/wtgl/dbsx/queryWtDbsx");
        gridzr.load({
            rwlxDm: '01',
            data: mini.encode(data),
        }, function () {
            $(".searchdiv").slideUp();
        }, function (data) {
            var obj = JSON.parse(data.errorMsg);
            mini.alert(obj.message || "系统异常,请稍后再试。")
        });
        $('#dblbzr').height($('#dblb').height());//设置中软待办表格高度,因初始化没有值表格不会被撑开

    }
}

function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var month = date.getMonth() + 1;

    var strDate = date.getDate(); //默认为当日

    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }

    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }

    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate;
    return currentdate;
}

function getFirstDayOfMonth() {
    var date = new Date();
    var seperator1 = "-";
    var month = date.getMonth() + 1;

    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }

    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + "01";
    return currentdate;
}

var sllx3 = {
    "110401": "/dzgzpt-wsys/dzgzpt-wsys/apps/views/dbsx/dbsx_sxsl.html",
    "110001": "/dzgzpt-wsys/dzgzpt-wsys/apps/views/xkhnsryjbs/xknsryjbscx.html"
};

/**
 * 办理期限小于等于2天则显示成红色背景  2到4天 黄色 其它不处理
 * @param e
 * @returns {String}
 */
function blqxActionRenderer(e) {
    var record = e.record;
    var blqx = record.blqx;
    var dateDiff = new Date(blqx).getTime() - new Date().getTime();
    if (dateDiff <= 2 * 24 * 60 * 60 * 1000) {
        e.rowCls = 'mini-grid-cell-error';
    }
    if (dateDiff > 2 * 24 * 60 * 60 * 1000 && dateDiff <= 4 * 24 * 60 * 60 * 1000) {
        e.rowCls = 'grid-cell-warning';
    }
}

/**
 * 票种核定首次和调整如果实名校验不通过则显示成红色背景
 * @param e
 * @returns {String}
 */
function pzhdActionRenderer(e) {
    var record = e.record;
    var lcslId = record.lcslid;
    var rwztDm = record.rwztDm;
    var swsxDm = record.swsxdm;
    var rwbh = record.rwbh;
    var index = record._index;

    // 任务状态为已办理时，不显示操作链接。
    if (!!record.smrzflag) {
        e.rowCls = 'mini-grid-cell-error';
    }

    if (record.swsxdm === '200006') {
        var viewData = mini.decode(record.viewdata);
        if (viewData.hasOwnProperty("smrzxx-form") && !viewData["smrzxx-form"].smrzflag) {
            e.rowCls = 'mini-grid-cell-error';
        }
    }
    //上海渲染办理状态
    /**
     * 办理期限小于等于2天则显示成红色背景  2到4天 黄色 其它不处理
     * @param e
     * @returns {String}
     */
    var blqx = record.blqx;
    var dateDiff = new Date(blqx).getTime() - new Date().getTime();
    if (dateDiff <= 2 * 24 * 60 * 60 * 1000) {
        e.rowCls = 'mini-grid-cell-error';
    }
    if (dateDiff > 2 * 24 * 60 * 60 * 1000 && dateDiff <= 4 * 24 * 60 * 60 * 1000) {
        e.rowCls = 'grid-cell-warning';
    }
}

//中软待办
function onActionRendererZrdb(e) {
    var ylUrl = e.record.url;
    var index = e.record._index;
    return '<a class="Delete_Button" onclick="showNewDbsxzr(\'' + ylUrl + '\',\'' + index + '\')" href="#">受理</a>';
}

function showNewDbsxzr(ylUrl, index) {
    mini.Cookie.set("zr_index", index);
    window.open(ylUrl);
}

/**
 * 操作按钮渲染
 * @param e
 * @returns {String}
 */
function onActionRenderer(e) {
    var record = e.record;
    var lcslId = record.lcslid;
    var rwztDm = record.rwztDm;
    var swsxDm = record.swsxdm;
    var rwbh = record.rwbh;
    var index = record._index;
    var xzspSwsxdm = ['30090102', '30090105', '30090106', '30090107','60090102','60090105'];
    if (swsxDm.charAt(0) === "3" && xzspSwsxdm.indexOf(swsxDm) < 0 && swsxDm != '30010415') {
        var ylUrl = "/hgzx-gld/index.html#/sxsl/sxsl"
        return '<a class="Delete_Button" onclick="showNewDbsx(\'' + lcslId
            + '\',\'' + rwbh + '\',\'' + ylUrl + '\')" href="#">受理</a>';
    }
    /**
     * 跳转到fpgld-web，新的管理端
     */
    var fpGldList = ['200012', '200018', '200017', '200014', '200015', '200020', '200005', '200006', '200007', '200026'];
    if (fpGldList.indexOf(swsxDm) !== -1) {
        var ylUrl = "/fpzx-gld/fpgld-web/index.html#/sxsl/sxsl";
        return '<a class="Delete_Button" onclick="showNewDbsx(\'' + lcslId
            + '\',\'' + rwbh + '\',\'' + ylUrl + '\')" href="#">受理</a>';
    }
    if (swsxDm === '200001' || swsxDm === '200002') {
        var ylUrl = "/fpzx-gld/fpgld-web/index.html#/sxsl/fply";
        return '<a class="Delete_Button" onclick="showNewDbsx(\'' + lcslId
            + '\',\'' + rwbh + '\',\'' + ylUrl + '\')" href="#">受理</a>';
    }
    /**
     * 跳转到nfgld-web，新的管理端
     */
    var nfGldList = ['500011','500012'];
    if(nfGldList.indexOf(swsxDm) != -1){
        var ylUrl = "/nfzx-gld-web/index.html#/sxsl/sxsl"
        return '<a class="Delete_Button" onclick="showNewDbsx(\'' + lcslId
            + '\',\'' + rwbh + '\',\'' + ylUrl + '\')" href="#">受理</a>';
    }
    /*=============================*/
    if ("01" == rwztDm) {
        return '<a class="Delete_Button" href="#">-</a>';
    }
    // 任务状态为已办理时，不显示操作链接。
    if (record.swsxdm === "110001") {
        return '<a class="Delete_Button" onclick="showYjbs(\'' + record.lcslid + '\',\'' + index + '\')" href="#">受理</a>';

    }

    if (sllx3.hasOwnProperty(swsxDm)) {
        return '<a class="Delete_Button" onclick="showSllx3(\'' + swsxDm
            + '\',\'' + lcslId + '\',\'' + rwbh + '\',\'' + record.djxh
            + '\',\'' + record.nsrsbh + '\',\'' + record.sqxh + '\',\'' + index
            + '\')" href="#">受理</a>';
    }
    if ("00" == rwztDm) {
        return '<a class="Delete_Button" onclick="showSwsxSqxx(\'' + lcslId
            + '\',\'' + rwbh + '\',\'' + index + '\',\'' + swsxDm + '\')" href="#">受理</a>';
    }
    if ("02" == rwztDm) {
        return '<a class="Delete_Button" onclick="showSwsxSqxx(\'' + lcslId
            + '\',\'' + rwbh + '\',\'' + index + '\',\'' + swsxDm
            + '\')" onclick="" href="#">税种登记</a>';
    }
}

/**
 * 操作按钮渲染
 * @param e
 * @returns {String}
 */
function onActionRendererKq(e) {
    var record = e.record;
    var lcslId = record.lcslid;
    var rwztDm = record.rwztDm;
    var swsxDm = record.swsxdm;
    var rwbh = record.rwbh;
    var index = record._index;
    var xzspSwsxdm = ['30090102', '30090105', '30090106', '30090107','60090102','60090105'];
    if (swsxDm.charAt(0) === "3" && xzspSwsxdm.indexOf(swsxDm) < 0 && swsxDm != '30010415') {
        var ylUrl = "/hgzx-gld/index.html#/sxsl/sxsl"
        return '<a class="Delete_Button" onclick="showNewDbsx(\'' + lcslId
            + '\',\'' + rwbh + '\',\'' + ylUrl + '\')" href="#">受理</a>';
    }

    if ("01" == rwztDm) {
        return '<a class="Delete_Button" href="#">-</a>';
    }

    if ("00" == rwztDm) {
        return '<a class="Delete_Button" onclick="showSwsxSqxx(\'' + lcslId
            + '\',\'' + rwbh + '\',\'' + index + '\',\'' + swsxDm + '\')" href="#">受理</a>';
    }
    if ("02" == rwztDm) {
        return '<a class="Delete_Button" onclick="showSwsxSqxx(\'' + lcslId
            + '\',\'' + rwbh + '\',\'' + index + '\',\'' + swsxDm
            + '\')" onclick="" href="#">税种登记</a>';
    }
}

/**
 * 操作按钮渲染
 * @param e
 * @returns {String}
 */
function onActionRendererFp(e) {
    var record = e.record;
    var lcslId = record.lcslid;
    var rwztDm = record.rwztDm;
    var swsxDm = record.swsxdm;
    var rwbh = record.rwbh;
    var index = record._index;
    if (swsxDm === '200001' || swsxDm === '200002') {
        var ylUrl = "/fpzx-gld/fpgld-web/index.html#/sxsl/fply";
        return '<a class="Delete_Button" onclick="showNewDbsx(\'' + lcslId
            + '\',\'' + rwbh + '\',\'' + ylUrl + '\')" href="#">受理</a>';
    }
    if ("00" == rwztDm || "01" == rwztDm) {
        return '<a class="Delete_Button" onclick="showSwsxSqxx(\'' + lcslId
            + '\',\'' + rwbh + '\',\'' + index + '\',\'' + swsxDm + '\')" href="#">受理</a>';
    }
    if ("02" == rwztDm) {
        return '<a class="Delete_Button" onclick="showSwsxSqxx(\'' + lcslId
            + '\',\'' + rwbh + '\',\'' + index + '\',\'' + swsxDm
            + '\')" onclick="" href="#">税种登记</a>';
    }
}

function showNewDbsx(lcslId, rwbh, url) {
    window.location.href = url + "?lcslId=" + lcslId + "&rwbh=" + rwbh;
}

/** 目前只有发票领用用到此方法，受理跳到第三方页面 */
function showSllx3(swsxDm, lcslId, rwbh, djxh, nsrsbh, sqxh, index) {
    var loadingId = mini.loading("处理中", "提示");
    checkDbsxslzt(lcslId, function () {
        url = sllx3[swsxDm] + "?swsxDm=" + swsxDm + "&djxh="
            + djxh + "&sqxh=" + sqxh + "&lcslId=" + lcslId + "&rwbh=" + rwbh
            + "&nsrsbh=" + nsrsbh;
        openDbsxsl(url, index);
    });
    mini.hideMessageBox(loadingId);
}

/**
 * Go to 事项受理页面
 * @param lcslId
 * @param blztDm
 * @param rwbh
 */
function showSwsxSqxx(lcslId, rwbh, index, swsxDm) {
    mini.mask({cls: 'mini-mask-loading', message: '处理中，请稍候...'});
    checkDbsxslzt(lcslId, function () {
        var url = "dbsx_sxsl.html?lcslId=" + lcslId + "&rwbh=" + rwbh;
        if (swsxDm === '11000201') {
            url = "../xbnsrcx/xbnsrtcSl.html?lcslId=" + lcslId + "&rwbh=" + rwbh;
        }
        openDbsxsl(url, index);
    });
    mini.unmask();
}

//弹出待办事项受理页面
function openDbsxsl(url, index) {
    var tabid = $(".tab-bar .active")[0].id;
    if (tabid == 'kqydb') {
        mini.Cookie.set("kqy_index", index);
    } else if (tabid == 'fply') {
        mini.Cookie.set("fply_index", index);
    } else {
        if (tabid != 'zrdb') {
            mini.Cookie.set("_index", index);
        }
    }

    var win = mini.open({
        showMaxButton: true,
        title: "待办事项受理",
        url: url,
        showModal: true,
        width: "100%",
        height: "100%",
        onload: function () {
        },
        ondestroy: function (action) {
            unlockDbsxslzt();
        }
    });
}

/**
 * 任务状态渲染
 * @param e
 * @returns {String}
 */
function rwztRenderer(e) {
    var record = e.record;
    var rwztDm = record.rwztDm;
    if ("00" == rwztDm) {
        return "未受理";
    }
    if ("01" == rwztDm) {
        return "已受理";
    }
    if ("02" == rwztDm) {
        return "待税种认定";
    }
    return "";
}

/**
 * 发票申领任务状态渲染
 * @param e
 * @returns {String}
 */
function fpslRwztRenderer(e) {
    var record = e.record;
    var rwztmc = record.rwztmc;
    return rwztmc;
}

/**
 * 重置查询条件
 */
function doReset() {
    var form = new mini.Form("#cxtjForm");
    form.reset();
}

/**
 * 刷新待办任务状态
 */
function reflashDbrwzt() {
    var reflash = mini.Cookie.get("reflash");
    if ("ok" == reflash) {
        var tabid = $(".tab-bar .active")[0].id;
        if (tabid == 'zrdb') {
            var dbsxGridzrdb = mini.get("dbsxGridzrdb");
            var zrIndex = Number(mini.Cookie.get("zr_index"));
            var zrRow = dbsxGridzrdb.getRow(zrIndex);
            dbsxGridzrdb.updateRow(zrRow._index, "rwztDm", "01");
        } else if (tabid == 'kqdb') {
            var dbsxGridkqdb = mini.get("dbsxGridkqdb");
            var kqIndex = Number(mini.Cookie.get("kq_index"));
            var kqRow = dbsxGridkqdb.getRow(kqIndex);
            dbsxGridkqdb.updateRow(kqRow._index, "rwztDm", "01");
        } else if (tabid == 'fply') {
            var dbsxGridfpsldb = mini.get("dbsxGridfpsldb");
            var fplyIndex = Number(mini.Cookie.get("fply_index"));
            var fplyRow = dbsxGridfpsldb.getRow(fplyIndex);
            dbsxGridfpsldb.updateRow(fplyRow._index, "rwztDm", "01");
        } else {
            var dbsxGrid = mini.get("dbsxGrid");
            var index = Number(mini.Cookie.get("_index"));
            var row = dbsxGrid.getRow(index);
            dbsxGrid.updateRow(row._index, "rwztDm", "01");
        }
    }
    mini.Cookie.set("reflash", "ng");
}

var refDbrwzt = setInterval(function () {
    reflashDbrwzt();
}, 1000);


function showYjbs(id, index) {
    mini.Cookie.set("_index", index);
    var loadingId = mini.loading("处理中", "提示");
    checkDbsxslzt(id, function () {
        mini.open({
            showMaxButton: true,
            title: "新办户一键办税",
            url: '../xkhnsryjbs/xknsryjbscx.html',
            showModal: true,
            width: "100%",
            height: "100%",
            onload: function () {
                var iframe = this.getIFrameEl();
                iframe.contentWindow.initYjbs(id);
            },
            ondestroy: function (action) {
                unlockDbsxslzt();
            }
        });
    });
    mini.hideMessageBox(loadingId);
}

var sssxxmData = [];
var xmzlData = [];

function xmdlChanged() {
    var xmdlValue = mini.get("xmdl").getValue();
    mini.get('xmzl').setValue('');
    mini.get('xmxl').setValue('');
    if (xmdlValue) {
        xmzlData = [{"ID": "0001", "MC": "税务登记", "PID": "01"},
            {"ID": "0002", "MC": "发票办理", "PID": "01"},
            {"ID": "0003", "MC": "证明办理", "PID": "01"},
            {"ID": "0004", "MC": "税务认定", "PID": "01"},
            {"ID": "0005", "MC": "优惠办理", "PID": "01"},
            {"ID": "0006", "MC": "网上审批备案", "PID": "01"},
            {"ID": "0007", "MC": "网上非贸管理", "PID": "01"},
            {"ID": "0008", "MC": "行政许可", "PID": "01"},
            {"ID": "0009", "MC": "申报纳税", "PID": "01"}]
        mini.get("xmzl").setData(xmzlData);

    } else {
        mini.get("xmzl").setData([]);
        mini.get("xmxl").setData([]);
    }
    getsssssx();

}

var xmxlData = [];

function xmzlChanged() {
    var xmzlValue = mini.get("xmzl").getValue();
    if (xmzlValue) {
        xmxlData = [{"ID": "0001", "MC": "税务登记", "PID": "0001"},
            {"ID": "0002", "MC": "发票办理", "PID": "0002"},
            {"ID": "0003", "MC": "证明办理", "PID": "0003"},
            {"ID": "0004", "MC": "税务认定", "PID": "0004"},
            {"ID": "0005", "MC": "优惠办理", "PID": "0050"},
            {"ID": "0088", "MC": "金三特软改造", "PID": "0009"},
            {"ID": "0009", "MC": "申报纳税", "PID": "0009"},
            {"ID": "0008", "MC": "行政许可", "PID": "0008"}]
        mini.get("xmxl").setData(xmxlData);

    } else {
        mini.get("xmxl").setData([]);
        return
    }
    if (xmzlValue === '0009') {
        mini.get('xmxl').setValue('0088');
    } else if (xmzlValue === '0008') {
        mini.get('xmxl').setValue('0008');
    } else if (xmzlValue === '0005') {
        mini.get('xmxl').setValue('0005');
    } else if (xmzlValue === '0004') {
        mini.get('xmxl').setValue('0004');
    } else if (xmzlValue === '0003') {
        mini.get('xmxl').setValue('0003');
    } else if (xmzlValue === '0002') {
        mini.get('xmxl').setValue('0002');
    } else if (xmzlValue === '0001') {
        mini.get('xmxl').setValue('0001');
    } else {
        mini.get('xmxl').setValue('');
    }
    getsssssx();
}

function xmxlChanged(e) {
    getsssssx();
}

function getsssssx() {
    var xmdlValue = mini.get("xmdl").getValue();
    var xmzlValue = mini.get("xmzl").getValue();
    var xmxlValue = mini.get("xmxl").getValue();
    var qqcs = {
        sxdl: xmdlValue,
        sxzl: xmzlValue,
        sxxl: xmxlValue
    };
    ajax.post('/dzgzpt-wsys/api/xj/wtgl/dbsx/queryWtSssx', qqcs, function (res) {
        if (res) {
            sssxxmData = res;
            mini.get("sssxxm").setData(sssxxmData);
        } else {
            mini.alert("系统异常,请稍后再试。")
            return false
        }
    });
}

var loginuserid;
var ctableid;

function getcswsx() {
    //获取当前登录人的id和ip
    loginuserid = getSession().userId;
    var ip = window.location.host;
    //从缓存中获取id
    cuserid = mini.Cookie.get("cuserid");
    //对账号登录进行判断
    if (cuserid == "undefined" || cuserid == null || cuserid == "") {
        //第一次登录
        mini.Cookie.set("cuserid", loginuserid);
        mini.Cookie.set("cip", ip);
    } else {
        //若二次登陆
        var cuserid = mini.Cookie.get("cuserid");
        ctableid = mini.Cookie.get("ctableid");
        var cip = mini.Cookie.get("cip");
        var ip = window.location.host;
        //判断前后登录账号是否相同
        if (loginuserid == cuserid) {
            //若登录账号相同则
            if (cip == ip) {
                //修改tbale页
                $(".tab-bar .active").removeClass("active");
                document.getElementById(ctableid).className = 'active';
            }
        } else {
            //若不相同，存入此次登录的账号信息
            mini.Cookie.set("cuserid", loginuserid);
            mini.Cookie.set("cip", ip);
        }
    }
}

var loginUser;

function getSession() {
    $.ajax({
        type: "GET",
        url: "../../../../api/wtgl/dbsx/getSession",
        success: function (data) {
            //获取当前登录账号以及tableid
            var loginUsers = mini.decode(data);
            loginUser = mini.decode(loginUsers.value);
        },
        error: function (result) {
            showMessageAtMiddle("获取税局管理员登录信息失败！");
        }
    });
    return loginUser;
}
