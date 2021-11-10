var wszyps = {};
var wszypsApiHead = "/dzgzpt-wsys/";
var wszypsApi = {
  getSwjg: wszypsApiHead + "api/baseCode/getUserQxSwjgAndAllXsSwjgWithCode",
  doSearch: wszypsApiHead + "api/fpzyps/wszypscx/queryDatas",
  exportData: wszypsApiHead + "api/fpzyps/wszypscx/exportExcel",
  sl: wszypsApiHead + "api/fpzyps/wszypscx/updatePszt",
};

wszyps.pageIndex = 0;
wszyps.pageSize = 0;
wszyps.allowClick = true;

$(function () {
  mini.parse();

  wszyps.wszypsForm = new mini.Form("wszyps-form");
  wszyps.wszypsGrid = mini.get("wszyps-grid");
  wszyps.init();
  wszyps.initValue();
  wszyps.doSearch()
});

/**
 * @desc 初始化
 */
wszyps.init = function () {
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

  wszyps.getSwjg();
};

/**
 * @desc 获取主管税务机关代码
 */
wszyps.getSwjg = function () {
  ajax.get(wszypsApi.getSwjg, "", function (data) {
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
wszyps.initValue = function () {
  var firstDate = new Date(new Date().setDate(1)).format("yyyy-MM-dd");
  var currentData = new Date().format("yyyy-MM-dd");
  mini.get("sdrqq").setValue(firstDate);
  mini.get("sdrqz").setValue(currentData);

  mini.get("sxlx").setValue("0");
  mini.get("pszt").setValue("2");
};

/**
 * @desc 查询
 */
wszyps.doSearch = function () {
  var wszypsForm = wszyps.wszypsForm,
    grid = wszyps.wszypsGrid;
  var formData = wszypsForm.getData(true),
    params = $.extend({}, formData, {
      pageIndex: wszyps.pageIndex,
      pageSize: wszyps.pageSize || grid.getPageSize(),
    });

  grid.emptyText =
    "<span style='float: left;padding-right: 2%;color: #f00'>无记录</span>";
  var wszypsJudgeStatus = wszypsForm.validate();
  if (!wszypsJudgeStatus) return;
  ajax.post(wszypsApi.doSearch, mini.encode(params), function (res) {
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
wszyps.doReset = function () {
  wszyps.wszypsForm.reset();
  wszyps.initValue();
};

/**
 * @desc 导出
 */
wszyps.exportData = function () {
  var wszypsForm = wszyps.wszypsForm,
    gridData = wszyps.wszypsGrid.getData();
  var formData = wszypsForm.getData(true);

  if (gridData == null || gridData == "") {
    mini.alert("查询结果为空，无需导出文件！");
    return;
  }

  formData = JSON.stringify(formData).replace(/\"/g, '"');

  window.open(wszypsApi.exportData + "?requestJson=" + formData);
};

/**
 * @desc 渲染操作按钮
 */
wszyps.renderAction = function (e) {
  var record = e.record;
  var pszt = record.pszt;
  var sqxh = record.sqxh;
  if (pszt === "已配送") {
    return '<span class="unableClick">受理</span>';
  }
  return (
    '<span class="ableClick" onclick="wszyps.showModal(\'' +
    sqxh +
    "')\">受理</span>"
  );
};
wszyps.showModal = function (sqxh) {
  var params = sqxh;

  mini.showMessageBox({
    width: 300,
    height: 200,
    title: "提示",
    message: "是否确定已配送",
    buttons: ["ok", "cancel"],
    callback: function (action) {
      if (action === "ok") {
        ajax.post(wszypsApi.sl, params, function (shData) {
          if (shData.success) {
            mini.alert(shData.message || "操作成功！");
            wszyps.doSearch();
            return;
          }
          mini.alert(shData.message || "操作失败");
          wszyps.doSearch();
          return;
        });
      }
    },
  });
};

/**
 * @desc 日期校验
 */
wszyps.onDateValidate = function (e) {
  if (e.value) {
    var dateTarget = e.sender.id;
    var sdrqq = mini.get("sdrqq").getValue();
    var sdrqz = mini.get("sdrqz").getValue();
    var blqxq = mini.get("blqxq").getValue();
    var blqxz = mini.get("blqxz").getValue();

    sdrqq = sdrqq && sdrqq.getTime();
    sdrqz = sdrqz && sdrqz.getTime();
    blqxq = blqxq && blqxq.getTime();
    blqxz = blqxz && blqxz.getTime();

    if (dateTarget === "sdrqq" || dateTarget === "sdrqz") {
      if (sdrqq && sdrqz && sdrqq > sdrqz) {
        mini.alert("收到日期起应小于收到日期止~");
        mini.get(dateTarget).setValue("");
      }
    }

    if (dateTarget === "blqxq" || dateTarget === "blqxz") {
      if (blqxq && blqxz && blqxq > blqxz) {
        mini.alert("办理期限起应小于办理期限止~");
        mini.get(dateTarget).setValue("");
      }
    }
  }
};

wszyps.onPageChanged = function (e) {
  wszyps.pageIndex = e.pageIndex;
  wszyps.pageSize = e.pageSize;
  wszyps.doSearch();
};
wszyps.onbeforeload = function (e) {
  e.cancel = true;
};
