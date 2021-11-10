var mxcx = {};
var mxcxApiHead = "/dzgzpt-wsys/";
var mxcxApi = {
  getSwjg:
    mxcxApiHead + "api/baseCode/getUserQxSwjgAndAllXsSwjgWithCode?kfqx=0000",
  doSearch: mxcxApiHead + "api/wlptdk/mxbs/queryDatas",
  exportData: mxcxApiHead + "api/wlptdk/mxbs/exportExcel",
};

mxcx.pageIndex = 0;
mxcx.pageSize = 0;
mxcx.allowClick = true;

$(function () {
  gldUtil.addWaterInPages();
  mini.parse();

  mxcx.mxcxForm = new mini.Form("mxcx-form");
  mxcx.mxcxGrid = mini.get("mxcx-grid");
  mxcx.mxcxWin = mini.get("mxcx-win");
  mxcx.grid = mini.get("dkmxbs-grid");
  mxcx.ylGrid = mini.get("yl-dkmxbs-grid");
  mxcx.init();
  mxcx.initValue();
});

/**
 * @desc 初始化
 */
mxcx.init = function () {
  $(".search").click(function () {
    var toogle = $(".search").data("show");
    if (toogle === "yes") {
      $(".searchdiv").stop().slideUp();
      $(".search").data("show", "no");
      $(".searchC").html("显示查询条件");
    } else if (toogle === "no") {
      $(".searchdiv").stop().slideDown();
      $(".search").data("show", "yes");
      $(".searchC").html("隐藏查询条件");
    }
  });

  mxcx.getSwjg();
};

/**
 * @desc 获取主管税务机关代码
 */
mxcx.getSwjg = function () {
  ajax.get(mxcxApi.getSwjg, "", function (data) {
    if (data) {
      mini.get("swjgDm").loadList(data);
    }
  });
};

/**
 * @desc 收到日期初始化设置为当月一号至今
 *          事项类型初始化值为 全部
 *          配送状态初始化值为 未配送
 */
mxcx.initValue = function () {
  var firstDate = new Date(new Date().setDate(1)).format("yyyy-MM-dd");
  var currentData = new Date().format("yyyy-MM-dd");
  mini.get("sbrqq").setValue(firstDate);
  mini.get("sbrqz").setValue(currentData);
};

/**
 * @desc 查询
 */
mxcx.doSearch = function () {
  var mxcxForm = mxcx.mxcxForm,
    grid = mxcx.mxcxGrid;
  var formData = mxcxForm.getData(true),
    params = $.extend({}, formData, {
      pageIndex: mxcx.pageIndex,
      pageSize: mxcx.pageSize || grid.getPageSize(),
    });

  grid.emptyText =
    "<span style='float: left;padding-right: 2%;color: #f00'>无记录</span>";
  var mxcxJudgeStatus = mxcxForm.validate();
  if (!mxcxJudgeStatus) return;
  ajax.post(mxcxApi.doSearch, mini.encode(params), function (res) {
    if (res.success && res.value) {
      grid.setData(res.value);
      grid.setTotalCount(res.resultMap.totalNum);
    } else {
      grid.setData([]);
      mini.alert((res && res.message) || "暂无数据", "提示");
    }
  });
};

/**
 * @desc 重置
 */
mxcx.doReset = function () {
  mxcx.mxcxForm.reset();
  mxcx.initValue();
};

/**
 * @desc 导出
 */
mxcx.exportData = function () {
  var mxcxForm = mxcx.mxcxForm,
    gridData = mxcx.mxcxGrid.getData();
  var formData = mxcxForm.getData(true);

  if (gridData == null || gridData == "") {
    mini.alert("查询结果为空，无需导出文件！");
    return;
  }

  formData = JSON.stringify(formData).replace(/\"/g, '"');

  window.open(mxcxApi.exportData + "?requestJson=" + formData);
};

/**
 * @desc 遍历表格
 */
mxcx.renderCollumn = function (e) {
  var record = e.record;
  return (
    "<span class='ableClick' onclick='mxcx.showDetail(" +
    mini.encode(record) +
    ")'>查看</span>"
  );
};

/**
 * @desc 展示明细弹框
 */
mxcx.showDetail = function (record) {
  var mxbsList = record.mxbsList;
  mxcx.mxcxWin.show();
  mxcx.ylGrid.setData(mxbsList);
};

/**
 * @desc 日期校验
 */
mxcx.onDateValidate = function (e) {
  if (e.value) {
    var dateTarget = e.sender.id;
    var sbrqq = mini.get("sbrqq").getValue();
    var sbrqz = mini.get("sbrqz").getValue();

    sbrqq = sbrqq && sbrqq.getTime();
    sbrqz = sbrqz && sbrqz.getTime();

    if (dateTarget === "sbrqq" || dateTarget === "sbrqz") {
      if (sbrqq && sbrqz && sbrqq > sbrqz) {
        mini.alert("收到日期起应小于收到日期止~");
        mini.get(dateTarget).setValue("");
      }
    }
  }
};

/**
 * 翻页
 */
mxcx.onPageChanged = function (e) {
  mxcx.pageIndex = e.pageIndex;
  mxcx.pageSize = e.pageSize;
  mxcx.doSearch();
};
mxcx.onbeforeload = function (e) {
  e.cancel = true;
};
