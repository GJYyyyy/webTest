$(function () {
    gldUtil.addWaterInPages();
    init();
});

var grid;
var gridzr;

function init() {
    mini.parse();



    grid = mini.get("dbsxGrid");
    grid.setUrl("/sxsq-wsys/api/ybtdsgl/rjcpzzsjzjt/fzsh/queryShrw");
    grid.on('beforeload', function (e) {
        e.contentType = 'application/json;charset=utf-8';
        e.data = mini.encode(e.data);
    });
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
            var data = mini.Cookie.get(loginuserid + "searchConditionFzshcx");
            var formData = form.setData(data ? mini.decode(data) : {});
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
        mini.Cookie.set(loginuserid + "searchConditionFzshcx", mini.encode(formData));
        $.extend({
            id: 'sydb'
        });
    }

    //收到日期
    var sdrqQ = mini.get("sdrqQ");
    var sdrqZ = mini.get("sdrqZ");
    var now = new Date(),
        delay = new Date();
    delay.setMonth(delay.getMonth() - 1);
    sdrqQ.setValue(mini.formatDate(delay, 'yyyy-MM-dd'));
    sdrqQ.setMaxDate(now);
    sdrqZ.setValue(mini.formatDate(now, 'yyyy-MM-dd'));
    sdrqZ.setMinDate(delay);
    sdrqZ.setMaxDate(now);


    doSearch($);
    getcswsx();
}

function doSearch(th) {
    $(".sysxTr").hide();
    var tabid = th.id;
    if (tabid != 'search') {
        $(".tab-bar .active").removeClass("active");
        document.getElementById(tabid).className = 'active';
    }
    var tabid = $(".tab-bar .active")[0].id; //获取当选选中的tabs
    mini.Cookie.set("ctableid", tabid); //存入缓存中
    $("#dblb").show();

    if(tabid==='sysx'){
        doSysxSearch(th);
        return;
    }

    var form = new mini.Form("#cxtjForm");
    var formData = form.getData(true);
    var loginuserid = getSession().userId;
    mini.Cookie.set(loginuserid + "searchConditionFzshcx", mini.encode(formData));

    var data = {
        wsh: formData.wsh,
        nsrsbh: formData.nsrsbh,
        sqrqq: formData.sdrqQ,
        sqrqz: formData.sdrqZ,
        blswjgDm:formData.swjgdm,
        tabFlag:'0',
        swsxDm:'69060802',
        blztDm:null
        // "blswjgDm": "13100000000"
    }
    grid.load(data, function () {
        // $(".searchdiv").slideUp();
    }, function (data) {
        var obj = JSON.parse(data.errorMsg);
        mini.alert(obj.message || "系统异常,请稍后再试。")
    });

}

function doSysxSearch(th){
   
    $(".sysxTr").show();
    var tabid = th.id;
    if (tabid != 'search') {
        $(".tab-bar .active").removeClass("active");
        document.getElementById(tabid).className = 'active';
        mini.get("shztdm").setValue('00');
        mini.get("swsxDm").setValue('69060802');
    }
    var tabid = $(".tab-bar .active")[0].id; //获取当选选中的tabs
    mini.Cookie.set("ctableid", tabid); //存入缓存中
    $("#dblb").show();

    var form = new mini.Form("#cxtjForm");
    var formData = form.getData(true);
    var loginuserid = getSession().userId;
    mini.Cookie.set(loginuserid + "searchConditionFzshcx", mini.encode(formData));

    var data = {
        wsh: formData.wsh,
        nsrsbh: formData.nsrsbh,
        sqrqq: formData.sdrqQ,
        sqrqz: formData.sdrqZ,
        blswjgDm:formData.swjgdm,
        tabFlag:'1',
        swsxDm:formData.swsxDm,
        blztDm:formData.shztdm==='00'?'':formData.shztdm
        // "blswjgDm": "13100000000"
    }
    grid.load(data, function () {
        // $(".searchdiv").slideUp();
    }, function (data) {
        var obj = JSON.parse(data.errorMsg);
        mini.alert(obj.message || "系统异常,请稍后再试。")
    });
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



/**
 * 操作按钮渲染
 * @param e
 * @returns {String}
 */
function onActionRenderer(e) {
    var record = e.record;
    var lcslId = record.lcslid||record.sqxh;
    var rwztDm = record.rwztDm;
    var swsxDm = record.swsxdm;
    var rwbh = record.rwbh;
    var index = record._index;

    var ylUrl = "/sxsq-wsys/sxsqgld-web/index.html#/fzsh/fzsh";
    return '<a class="Delete_Button" onclick="showNewDbsx(\'' + lcslId +
        '\',\'' + rwbh + '\',\'' + ylUrl + '\')" href="#">'+((record.shztdm==='2'||$(".tab-bar .active")[0].id==='sysx')?'查看':'受理')+'</a>';
}

function showNewDbsx(lcslId, rwbh, url) {
    window.location.href = url + "?lcslId=" + lcslId + "&rwbh=" + (rwbh||'')+'&type='+$(".tab-bar .active")[0].id;
}


/**
 * 任务状态渲染
 * @param e
 * @returns {String}
 */
function rwztRenderer(e) {
    var rwztDm = e.value;
    if ("0" == rwztDm) {
        return "待审核";
    }
    if ("1" == rwztDm) {
        return "审核中";
    }
    if ("2" == rwztDm) {
        return "完成审核";
    }
    return "";
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
        if (tabid == 'sysx') {
            var dbsxGridzrdb = mini.get("dbsxGridzrdb");
            var zrIndex = Number(mini.Cookie.get("zr_index"));
            var zrRow = dbsxGridzrdb.getRow(zrIndex);
            dbsxGridzrdb.updateRow(zrRow._index, "rwztDm", "01");
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