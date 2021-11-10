$(function () {
    init();
});

var grid, permission;

var cxlcxApi = {
    // A\B级页面查询接口
    searchAB: '/dzgzpt-wsys/api/dntj/pzhd/tjlshz',
    // C级页面查询接口
    searchC: '/dzgzpt-wsys/api/dntj/pzhd/tjls',
    /* 获取主管税务机关 */
    getZgswjg: '/dzgzpt-wsys/api/dntj/getSwjg',
    // 拒绝原因代码 
    getJjyy: "/dzgzpt-wsys/api/baseCode/get/baseCode2CombSelect2/DM_JJ_TJYY",
}

function init() {
    mini.parse();
    var date = new Date();
    var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    mini.get("slrqQ").setValue(firstDay);
    mini.get("slrqZ").setValue(new Date());
    grid = mini.get("tableGrid1");
    initCxtj();
    if (permission == "C") {
        $("#grid2").css("display", "block")
        $("#grid1").css("display", "none")
    }
}

/**
 * 初始化查询条件
 */
function initCxtj() {

    //调取主管税务机关接口
    ajax.get(cxlcxApi.getZgswjg, '', function (res) {
        if (res) {
            var datas = mini.decode(res.jg);
            mini.get('zgswjgDm').loadList(datas, "swjgdm", "sjswjgdm");
            permission = res.qx
        } else {
            mini.alert('主管税务机关系统异常，请稍后再试~', '提示');
        }
    });

    //调取不采用原因下拉接口
    ajax.get(cxlcxApi.getJjyy, '', function (res) {
        if (res) {
            res.unshift({ ID: "", MC: '全部' })
            mini.get('jjyyDm').setData(res);
        } else {
            mini.alert('不采用原因下拉异常，请联系管理员~', '提示');
        }
    });
}

$(document).ready(function () {
    $(".search").click(function () {
        showsearch();
    });
});

function showsearch() {
    if ($(".searchdiv").is(":hidden")) {
        $(".searchdiv").slideDown();
    } else {
        $(".searchdiv").slideUp();
    }
}

function doSearch() {
    var slrqQ = mini.get("slrqQ").value,
        slrqZ = mini.get("slrqZ").value,
        sqrqQ = mini.get("sqrqQ").value,
        sqrqZ = mini.get("sqrqZ").value;
    var form = new mini.Form("#cxtjForm");
    if (!form.validate()) return;
    if (slrqZ < slrqQ) {
        mini.alert("“ 受理日期止 ” 不能晚于 “ 受理日期起 ” ，请重新选择",
            "温馨提示");
        return
    }
    if (sqrqZ < sqrqQ) {
        mini.alert("“ 申请日期止 ” 不能晚于 “ 申请日期起 ” ，请重新选择",
            "温馨提示");
        return
    }

    if ((slrqQ && slrqZ) && !completeDate(slrqQ, slrqZ, 3)) {
        mini.alert("受理日期最多支持3个月的跨度查询！", "温馨提示")
        return
    }
    if ((sqrqQ && sqrqZ) && !completeDate(sqrqQ, sqrqZ, 3)) {
        mini.alert("申请日期最多支持3个月的跨度查询！", "温馨提示")
        return
    }

    var formData = form.getData(true);
    if (formData.nsrsbh || formData.wsh || permission == "C") {
        $("#grid2").css("display", "block")
        $("#grid1").css("display", "none")
        grid = mini.get("tableGrid2");
        grid.setUrl(cxlcxApi.searchC);
    } else {
        $("#grid1").css("display", "block")
        $("#grid2").css("display", "none")
        grid = mini.get("tableGrid1");
        grid.setUrl(cxlcxApi.searchAB);
    }
    grid.load(formData, function (res) {
        if (res.result.value.total == 0) {
            mini.alert("无数据");
            return
        }
        this.setData(res.result.value.data);
        this.setTotalCount(res.result.value.total);
        showsearch();
    }, function (res) {
        mini.alert(mini.decode(res.errorMsg).message);
    });

    grid.on('load', function (res) {
        var data = res.result;
        var gridSource = res.source;
        if (data.success) {
            var returnData = data.value;
            this.setData(returnData.data);
            this.setTotalCount(returnData.total);
            this.setPageIndex(gridSource.pageIndex);
        } else if (data.message) {
            mini.alert((data.message), '提示信息', function () { });
        }
    })
}
//判断两个时间段是否相差 m 个月
function completeDate(time1, time2, m) {
    var diffyear = time2.getFullYear() - time1.getFullYear();
    var diffmonth = diffyear * 12 + time2.getMonth() - time1.getMonth();
    if (diffmonth < 0) {
        return false;
    }

    var diffDay = time2.getDate() - time1.getDate();

    if (diffmonth < m || (diffmonth == m && diffDay <= 0)) {

        if (diffmonth == m && diffDay == 0) {
            var timeA = time1.getHours() * 3600 + 60 * time1.getMinutes() + time1.getSeconds();
            var timeB = time2.getHours() * 3600 + 60 * time2.getMinutes() + time2.getSeconds();
            if (timeB - timeA > 0) {
                return false;
            }
        }
        return true;
    }
    return false;
}
function onActionRenderer(e) {
    var record = e.record;
    var swjgmc = record.swjgmc
    var swjgdm = record.swjgdm
    return '<a  onclick="showSwsxSqxx(\'' + swjgdm + '\')" href="#">' + swjgmc + '</a>';
}

function showSwsxSqxx(swjgdm) {
    var baseUrl = permission == 'A' ? './secondGrid.html' : "./thirdGrid.html"
    var form = new mini.Form("#cxtjForm");
    var formData = form.getData(true);
    mini.open({
        url: baseUrl,        //页面地址
        title: '查询详情',      //标题
        iconCls: '',    //标题图标
        width: '100%',      //宽度
        height: 400,     //高度
        allowResize: true,       //允许尺寸调节
        allowDrag: false,         //允许拖拽位置
        showCloseButton: true,   //显示关闭按钮
        showMaxButton: false,     //显示最大化按钮
        showModal: true,         //显示遮罩
        currentWindow: false,      //是否在本地弹出页面,默认false
        effect: 'none',              //打开和关闭时的特果:'none','slow','fast',默认'none'
        onload: function () {       //弹出页面加载完成
            var iframe = this.getIFrameEl();
            //调用弹出页面方法进行初始化
            iframe.contentWindow.setData(formData, permission, swjgdm);
        },
        ondestroy: function (action) {  //弹出页面关闭前
        }
    });
}

function doReset() {
    var form = new mini.Form("#cxtjForm");
    form.reset();
    $("#grid1").css("display", "block")
    $("#grid2").css("display", "none")
    grid = mini.get("tableGrid1");
    grid.setData("")
}

/**
 * @method onValueChanged 单选框改变时，若选择“ Y ”，选择原因不可编辑并清空
 */
function onValueChanged(e) {
    if (e.value === 'Y') {
        mini.get("jjyyDm").setReadOnly(true);
        mini.get("jjyyDm").setValue("")
        mini.get("sfcytj").setValue(e.value)
        return
    }
    mini.get("jjyyDm").setReadOnly(false)
    return
}


/**
 * @method onCxlValueChanged 选择原因时，自动判定为 不接受推荐
 */
function onCxlValueChanged(e) {
    if (e.value) {
        mini.get("sfcytj").setValue("N");
        return
    }
    mini.get("sfcytj").setValue("")
    return
}