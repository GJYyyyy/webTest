var grid;
var sxgzFlag = true; //事项跟踪标志
var tohgCxbPath;
$(function () {
    gldUtil.addWaterInPages();
    mini.parse();
    $(".mainmenubar a").click(function () {
        $(".mainmenubar a").each(function () {
            $(this).removeClass("current");
        })
        $(this).addClass("current");
        return false
    });
    /*$(".search").click(function() {
        showsearch();
    });*/
    init();
});

/**
 * @desc 获取跳转创新版路径
 */
function getTohgCxbPath() {
    tohgCxbPath = [];
    $.ajax({
        url: "/hgzx-gld/static/lib/tohgCxbPath.json",
        type: "get",
        async: false,
        success: function (res) {
            tohgCxbPath = res.sh;
        }
    });
}

/**
 * @desc 初始化ing
 */
function initing() {
    grid = mini.get("sxgzGrid");
    initSQRQ();
    // getValidation();
    initCxtj();
    grid.setUrl("../../../../api/xj/wtgl/sxgz/listSxgz");
    //doSearch();

    //获取缓存的ip、用户id进行判断
    var cip = mini.Cookie.get("cip");
    var cuserid = mini.Cookie.get("cuserid");
    //获取当前登录账号及ip地址
    var loginuserid = getSession().userId;
    var ip = window.location.host;

    //判断账号是否一致
    if (loginuserid == cuserid) {
        //账号一致判断ip号是否一致
        if (cip == ip) {
            var form = new mini.Form("#cxtjForm");
            formData = mini.decode(mini.Cookie.get(loginuserid + "searchConditionSxgz"));
            form.setData(formData ? formData : {});
        }
    }
    getcswsx()
}

/**
 * @desc 初始化
 */
function init() {
    mini.parse();
    getTohgCxbPath();
    initing();
}

function initSQRQ() {
    var sdrqQ = mini.get("sqrqKs");
    var sdrqZ = mini.get("sqrqJs");
    var now = new Date(), delay = new Date();
    delay.setMonth(delay.getMonth() - 1);
    sdrqQ.setValue(mini.formatDate(new Date(new Date().getTime() - 168 * 60 * 60 * 1000), 'yyyy-MM-dd'));
    sdrqZ.setValue(mini.formatDate(now, 'yyyy-MM-dd'));
}

function onSqrqChanged(e, name) {
    if (name == 'sqrqJs') {
        mini.get(name).setMinDate(e.value)
    } else {
        mini.get(name).setMaxDate(e.value)
    }
}

/**
 * @desc 获取权限
 *       根据权限 控制事项名称是否固定延期缴纳税款核准事项查询 以及 税务机关数据
 */
function getValidation() {
    var flag = false,
        target = mini.get('sxdm');
    $.ajax({
        url: '../../../../api/xj/wtgl/sxgz/pre/checkPermission',
        type: 'get',
        async: false,
        success: function (res) {
            if (res.success && res.value) {
                flag = true;
                target.setValue('30090103');
                target.setReadOnly(true);
            }
        }
    });
    return flag;
}

/**
 * 初始化查询条件
 */
function initCxtj() {
    // 税务机关下拉
    var $swjgdm = mini.get("swjgDm");
    $.ajax({
        url: "../../../../api/xj/wtgl/cxtj/getSxtjSwjg",
        data: "",
        type: "POST",
        success: function (obj) {
            var datas = mini.decode(obj);
            $swjgdm.loadList(datas, "swjgdm", "sjswjgdm");
            $swjgdm.setValue(datas[0].swjgdm);
            /*swjgDm = datas[0].YXW;
            $swjgdm.setValue(swjgDm);*/
        },
        error: function () {
        }
    });

    /*$.ajax({
        url: "../../../../api/xj/wtgl/cxtj/getSxtjSwsx",
        type: "post",
        data: {},
        async: false,
        success: function (data) {
            var resultData = mini.decode(data);
            if (resultData.success) {
                defaultSwsx = mini.decode(resultData.value);
                mini.get("sxdm").setData(resultData.value);
            }
        }
    });*/
}

function showsearch() {
    if ($(".searchdiv").is(":hidden")) {
        $(".searchdiv").slideDown();
    } else {
        $(".searchdiv").slideUp();
    }
}

/**
 * 30040111服务贸易对外支付备案-管理端-线下版-查询 特殊化处理
 * 70 已提交未查验
 * 71 查验通过
 * 72 查验不通过 (此三个状态暂只用于此税务事项使用)
 */
function handleFwmydwzfba(formData) {
    var fd = formData || {};
    var blztDm = {
        '70': '00',
        '71': '01',
        '72': '02',
    };
    if (['70', '71', '72'].indexOf(fd.blztDm) >= 0) {
        fd.blztDm = blztDm[formData.blztDm];
        fd.sxdm = fd.sxdm || '30040111';
    }
    if(fd.znsptj == "ALL"){
        fd.znsptj = ""
    }
    return fd;
}

function doSearch() {
    var form = new mini.Form("#cxtjForm");
    form.validate();
    if (!form.isValid()) {
        return false;
    }
    var formData = form.getData(true);
    formData = handleFwmydwzfba(formData);
    var param = mini.encode(formData);

    var loginuserid = getSession().userId;
    mini.Cookie.set(loginuserid + "searchConditionSxgz", param);

    grid.load({
        data: param
    }, function (data) {
        //showsearch();
    }, function (data) {
        var dataMessage = mini.decode(data.errorMsg);
        mini.alert(dataMessage.messageCode);
    });
}

function onActionRenderer(e) {
    var url = '';
    var record = e.record;
    var lcslId = record.lcslid;
    var blztDm = record.blztDm;
    var rwbh = record.rwbh;
    /**
     * 【户管】内的【创新版】功能跳转
     */
    var hgwebSwsxdm = []
    for (var index = 0; index < tohgCxbPath.length; index++) {
        hgwebSwsxdm.push(tohgCxbPath[index].swsxDm)
    }
    if (hgwebSwsxdm.indexOf(record.swsxDm) > -1) {
        var ylUrl = "/hgzx-gld/index.html#/sxgz/sxgz";
        return '<a class="Delete_Button" onclick="showNewDbsx(\'' + lcslId
            + '\',\'' + rwbh + '\',\'' + ylUrl + '\')" href="#">查看详情</a>';
    }
    /**
 * 60110104【一照一码户信息变更】
 * 60060102【入库减免退抵税】
 * 60060101【误收多缴退抵税】
 * 69060801【软件证书信息采集】
 * 69060802【入库减免退抵税-软件产品增值税】
 * 60060109【入库减免退抵税-残疾人】
 * 60060103【汇算清缴结算多缴退抵税】
 * 60010605【文化事业建设费缴费信息报告】
 * 69010001【工商信息变更】
 * SXN800001【失信事项核实】
 * 以上功能迁入创新版事项申请, 需跳转到事项申请管理端
 */
    var sxsqGldList = ['60110104', '60060102', '60060101', '69060801', '69060802', '60060109', '60060103', '60010605', '69010001', 'SXN800001', '110113'];
    if (sxsqGldList.indexOf(record.swsxDm) !== -1) {
        var ylUrl = "/sxsq-wsys/sxsqgld-web/index.html#/sxgz/sxgz";
        return '<a class="Delete_Button" onclick="showNewDbsx(\'' + lcslId
            + '\',\'' + rwbh + '\',\'' + ylUrl + '\')" href="#">查看详情</a>';
    }

    /**
     * SXN400001【印制有本单位名称发票】
     * 以上功能迁入创新版发票使用,需跳转到发票使用管理端
     */
    var fpsyGldList = ['SXN400001', '700006', '700007'];
    if (fpsyGldList.indexOf(record.swsxDm) !== -1) {
        var ylUrl = "/sxsq-wsys/fpsygld-web/index.html#/sxgz/sxgz";
        return '<a class="Delete_Button" onclick="showNewDbsx(\'' + lcslId
            + '\',\'' + rwbh + '\',\'' + ylUrl + '\')" href="#">查看详情</a>';
    }

    /**
     * 跳转到nfgld-web，新的管理端
     */
    var nfGldList = ['500011', '500012', '500013', '500014', '500015', '500016', '500019', '500020', '500021'];
    if (nfGldList.indexOf(record.swsxDm) != -1) {
        var ylUrl = "/nfzx-gld-web/index.html#/sxgz/sxgz"
        return '<a class="Delete_Button" onclick="showNewDbsx(\'' + lcslId
            + '\',\'' + rwbh + '\',\'' + ylUrl + '\')" href="#">查看详情</a>';
    }

    var fpGldList = ['200012', '200018', '200017', '200014', '200015', '200020'];
    var specailHgGldList = ['60090102', '30090107', '30010415'];//3开头但是还是走老文书的税务事项代码
    var specailHgGldList2 = ['60090102', '60090106', '60090107', '60010415'];
    if (record.swsxDm.charAt(0) === "3" && specailHgGldList.indexOf(record.swsxDm) < 0) {
        var ylUrl = "/hgzx-gld/index.html#/sxgz/sxgz";
        return '<a class="Delete_Button" onclick="showNewDbsx(\'' + lcslId
            + '\',\'' + rwbh + '\',\'' + ylUrl + '\')" href="#">查看详情</a>';
    }
    // 创新版 跨区域涉税事项报验登记及项目报告 查看页面跳转
    else if (record.swsxDm.charAt(0) === "6" && specailHgGldList2.indexOf(record.swsxDm) < 0) {
        var ylUrl = "/hgzx-gld/index.html#/sxgz/sxgz";
        return '<a class="Delete_Button" onclick="showNewDbsx(\'' + lcslId
            + '\',\'' + rwbh + '\',\'' + ylUrl + '\')" href="#">查看详情</a>';
    }
    else if (record.swsxDm.charAt(0) === "7" || record.swsxDm === 'SXN400001') {
        var ylUrl = "/fpzx-gld/fpgld-web/index.html#/sxgz/sxgz";
        var ishidden = true;
        // return '<a class="Delete_Button" onclick="showNewDbsx(\'' + lcslId
        // + '\',\'' + rwbh + '\',\'' + ylUrl + '\')" href="#">查看详情</a>';
        url = '<a class="Delete_Button" onclick="showFpYbsx(\'' + lcslId
            + '\',\'' + rwbh + '\',\'' + ishidden + '\',\'' + ylUrl + '\')" href="#">查看详情</a>';

    }
    else if (record.swsxDm.charAt(0) === "2") {
        var ylUrl = "/fpzx-gld/fpgld-web/index.html#/sxgz/sxgz";
        var ishidden = true;
        url = '<a class="Delete_Button" onclick="showFpYbsx(\'' + lcslId
            + '\',\'' + rwbh + '\',\'' + ishidden + '\',\'' + ylUrl + '\')" href="#">查看详情</a>';
    } else if (record.swsxDm == '110001') {
        url = '<a class="Delete_Button" onclick="showxkhSwsxSqxx(\'' + lcslId
            + '\',\'' + blztDm + '\',\'' + rwbh + '\',\'' + sxgzFlag + '\')" href="#">查看详情</a>';
    } else if (record.swsxDm === '11000201' || record.swsxDm === '11000202') {
        url = '<a class="Delete_Button" onclick="showSwsxSqxx(\'' + lcslId
            + '\',\'' + blztDm + '\',\'' + rwbh + '\',\'' + record.swsxDm + '\',\'' + record.qdid + '\')" href="#">查看详情</a>';
    } else {
        url = '<a class="Delete_Button" onclick="showSwsxSqxx(\'' + lcslId
            + '\',\'' + blztDm + '\',\'' + rwbh + '\')" href="#">查看详情</a>';
    }


    return url;
}
function showNewDbsx(lcslId, rwbh, url) {
    window.location.href = url + "?lcslId=" + lcslId + "&rwbh=" + rwbh;
}
function showFpYbsx(lcslId, rwbh, ishidden, url) {
    /** ishidden传过去用来隐藏底部操作按钮 **/
    window.location.href = url + "?lcslId=" + lcslId + "&rwbh=" + rwbh + "&ishidden=" + ishidden;
}
function showSwsxSqxx(lcslId, blztDm, rwbh, swsxDm, qdid) {
    // window.location.href = "sxgz_ckxq.html?lcslId=" + lcslId
    // 		+ "&blztDm=" + blztDm + "&rwbh=" + rwbh+"&sxgzFlag="+sxgzFlag;
    /**
     * 新办套餐
     */
    var url = "sxgz_ckxq.html?lcslId=" + lcslId
        + "&blztDm=" + blztDm + "&rwbh=" + rwbh + "&sxgzFlag=" + sxgzFlag;
    var isYct = '2'
    if (qdid === 'web' || qdid === 'xbweb') {
        isYct = '1'
    }
    var sqlymc = ''
    if (qdid === 'xbyct') {
        sqlymc = '一窗通（老网厅）'
    } else if (qdid == 'xbweb') {
        sqlymc = '电子税务局（老网厅）'
    } else if (qdid === 'web') {
        sqlymc = '电子税务局'
    } else {
        sqlymc = '一窗通'
    }
    if (swsxDm === '11000201') {
        url = '../xbnsrcx/xbnsrtcSl.html?lcslId=' + lcslId + '&isYct=' + isYct + '&rwbh=' + rwbh + '&sqlymc=' + encodeURIComponent(sqlymc)
    }
    if (swsxDm === '11000202') {
        // 创新版跳转
        url = "../xbnsrcx-cxb/xbnsrtcSl.html?lcslId=" + lcslId + '&isYct=' + isYct + '&rwbh=' + rwbh + '&sqlymc=' + encodeURIComponent(sqlymc);
    }
    if (swsxDm === '11041601') {
        //网络平台代开资格申请跳转
        url = "./../wlptdkzgsq/wlpt_sxsl.html?lcslId=" + lcslId + "&rwbh=" + rwbh + "&type=check";
    }
    var win = mini.open({
        showMaxButton: true,
        title: "事项跟踪",
        url: url,
        showModal: true,
        width: "100%",
        height: "100%",
        onload: function () {
            // var iframe = this.getIFrameEl();
            // iframe.contentWindow.initYjbs(slid,true);
        },
        ondestroy: function (action) {
            // location.reload();
        }
    });
}

function doReset() {
    var form = new mini.Form("#cxtjForm");
    form.reset();
    initSQRQ();
    mini.Cookie.del(loginuserid + "searchConditionSxgz");
}


function showxkhSwsxSqxx(str) {
    var st = arguments;
    var loadingId = mini.loading("处理中", "提示");
    var slid = st[0];
    // checkDbsxslzt(st[0], function () {
    var url = "../xkhnsryjbs/xknsryjbscx.html?lcslId=" + st[0]
        + "&isDw=" + st[1]
        + "&sqxh=" + st[2]
        + "&swsxDm=" + st[3]
        + "&blztDm=" + st[4];
    openDbsxsl(url, slid);  //此时为事项跟踪
    // });
    mini.hideMessageBox(loadingId);
}

//弹出待办事项受理页面
function openDbsxsl(url, slid) {
    var win = mini.open({
        showMaxButton: true,
        title: "事项跟踪详情",
        url: url,
        showModal: true,
        width: "100%",
        height: "100%",
        onload: function () {
            var iframe = this.getIFrameEl();
            iframe.contentWindow.initYjbs(slid, true);
        },
        ondestroy: function (action) {
            // location.reload();
        }
    });
}

function checkDbsxslzt(lcslId, callback) {
    mini.Cookie.set("lcslId", lcslId);
    $.ajax({
        url: "../../../../api/wtgl/dbsx/checkDbsxslzt",
        data: {
            lcslId: lcslId
        },
        success: function (data) {
            var resultData = mini.decode(data);
            if (resultData.success) {
                if ("true" != resultData.value.toString()) {
                    mini.alert(resultData.value + "正在审核此任务，无法继续操作。", "提示信息");
                } else {
                    callback();
                }
            } else {
                mini.alert(resultData.message, '提示信息', function () { });
            }
        },
        error: function () {
            mini.alert("判断是否存在并发受理失败。", '提示信息');
        }
    });
}
//导出
function exportFpqd() {
    /*var rows = grid.getSelecteds();*/
    if (!grid.data || !grid) {
        mini.alert("查询结果为空，无需导出文件！");
        return;
    }

    var cxtjForm = new mini.Form("#cxtjForm");
    var formData = cxtjForm.getData(true);

    var blztDm = formData.blztDm;
    var nsrsbh = formData.nsrsbh;
    var swjgDm = formData.swjgDm;
    var wsh = formData.wsh;
    var sxdm = formData.sxdm;
    var sqrqKs = formData.sqrqKs;
    var sqrqJs = formData.sqrqJs;
    var slrqKs = formData.slrqKs;
    var slrqJs = formData.slrqJs;
    var sprqKs = formData.sprqKs;
    var sfyqbz = formData.sfyqbz;

    window.open('/dzgzpt-wsys/api/xj/wtgl/sxgz/export/sxgz?nsrsbh=' + nsrsbh + '&blztDm=' + blztDm +
        '&sxdm=' + sxdm + '&wsh=' + wsh + '&sqrqKs=' + sqrqKs + '&sqrqJs=' + sqrqJs + '&slrqKs=' + slrqKs
        + '&slrqJs=' + slrqJs + '&sprqKs=' + sprqKs + '&sfyqbz=' + sfyqbz + '&swjgDm=' + swjgDm);
}
var loginuserid;

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
        //判断前后登录账号是否相同
        if (loginuserid != cuserid) {
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
        url: "/dzgzpt-wsys/api/wtgl/dbsx/getSession",
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
