/**
 * Created with JetBrains WebStorm
 * Author：lizm
 * Date：2017/3/28
 * Time：15:49
 *
 */

var wcjyDbsx = {}; // 定义外出经营证明待办事项对象

/**
 * 控制查询条件区域的显示与隐藏
 */
wcjyDbsx.toggleSearchArea=function() {
    if (wcjyDbsx.searchArea.is(":hidden")) {
        wcjyDbsx.searchTitleText.html('隐藏查询条件');
        wcjyDbsx.searchArea.slideDown();
    } else {
        wcjyDbsx.searchArea.slideUp();
        wcjyDbsx.searchTitleText.html('显示查询条件');
    }
};
/**
 * 执行查询
 */
wcjyDbsx.doSearch = function() {
    var formData = wcjyDbsx.cxtjForm.getData(true);
    formData.taskId = "Logic_WslzGzlLzrwQueryDbrw";
    //formData.overdue = "true"; // 逾期未受理标志
    var param = mini.encode(formData);
    wcjyDbsx.dbsxGrid.load({
        rwlxDm : '01',
        data : param
    }, function() {
        wcjyDbsx.searchArea.slideUp();
    });
};
/**
 * 重置查询条件
 */
wcjyDbsx.doReset=function() {
    wcjyDbsx.cxtjForm.reset();
};
/**
 * 渲染grid “操作” 列
 * @param e
 * @returns {string}
 */
var sllx3 = {"110209":"../sqgl/fplygl/fp_ptfplygl.html"};
wcjyDbsx.onActionRenderer=function(e) {
    var record = e.record;
    var lcslId = record.lcslid;
    /*var rwztDm = record.rwztDm;*/
    var blztDm = record.blztDm;
    var swsxDm = record.swsxdm;
    var rwbh = record.rwbh;
    var action = '';
    /**目前只有发票领用用到此方法，受理跳到第三方页面*/

    if (sllx3.hasOwnProperty(swsxDm)) {
        action = '<a class="Delete_Button" onclick="wcjyDbsx.showSllx3(\'' + swsxDm
            + '\',\'' + lcslId + '\',\'' + rwbh + '\',\'' + record.nsrsbh
            + '\',\'' + record.sqxh + '\')" href="#">受理</a>';
    }else{
        action = '<a class="Delete_Button" onclick="wcjyDbsx.showSwsxSqxx(\'' + lcslId
            + '\',\'' + blztDm + '\',\'' + rwbh + '\')" href="#">查看详情</a>';
    }
    return  action;
};
/**
 * 渲染grid “受理状态” 列
 * @param e
 * @returns {string}
 */
wcjyDbsx.rwztRenderer=function(e) {
    var record = e.record;
    var rwztDm = record.rwztDm;
    var rwztText='';
    switch (rwztDm){
        case '00':
            rwztText =  '未受理';
            break;
        case '01':
            rwztText =  '已受理';
            break;
        case '02':
            rwztText =  '待补正资料';
            break;
        case '03':
            rwztText =  '待缴税';
            break;
        case '04':
            rwztText =  '待税种认定';
            break;
        case '05':
            rwztText =  '已补录待开票';
            break;
        default:
            break;
    }
    return rwztText;
};


/**目前只有发票领用用到此方法，受理跳到第三方页面*/
wcjyDbsx.showSllx3=function(swsxDm, lcslId, rwbh, nsrsbh, sqxh) {
    window.location.href = sllx3[swsxDm] + "?swsxDm=" + swsxDm + "&nsrsbh="
        + nsrsbh + "&sqxh=" + sqxh + "&lcslId=" + lcslId + "&rwbh=" + rwbh;
};

/**
 * 查看详情
 * @param lcslId
 * @param blztDm
 * @param rwbh
 */
wcjyDbsx.showSwsxSqxx=function(lcslId, blztDm, rwbh) {
    window.location.href = "../dbsx/dbsx_sxsl.html?lcslId=" + lcslId
        + "&blztDm=" + blztDm + "&rwbh=" + rwbh + "&ishidden=" + true;
};


$(function() {
    mini.parse();
    wcjyDbsx.dbsxGrid = mini.get("dbsxGrid"); // 查询结果grid
    wcjyDbsx.dbsxGrid.setUrl("../../../../api/wtgl/dbsx/queryDbsxReview");
    wcjyDbsx.cxtjForm = new mini.Form("#cxtjForm"); // 查询条件form
    wcjyDbsx.searchArea = $(".searchdiv"); // 查询条件div
    wcjyDbsx.searchTitleText = $(".searchC"); // 查询条件标题
    wcjyDbsx.doSearch();

});


