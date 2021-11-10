var mxcx = {};
var mxcxApiHead = "/dzgzpt-wsys/";
var mxcxApi = {
  getSwjg: mxcxApiHead + "api/xj/wtgl/cxtj/getSxtjSwjg",
  getNowSwjg: mxcxApiHead + "api/common/zgswjgDm",
  getSwsx: mxcxApiHead + "api/wtgl/cxtj/gzmd/getSwsx",
  doSearch: mxcxApiHead + "api/wtgl/cxtj/gzmd/queryLog",
  exportData: mxcxApiHead + "api/wtgl/cxtj/gzmd/exportLog",
};

mxcx.pageIndex = 0;
mxcx.pageSize = 0;
mxcx.allowClick = true;

$(function () {
  gldUtil.addWaterInPages();
  mini.parse();

  mxcx.mxcxForm = new mini.Form("mxcx-form");
  mxcx.mxcxGrid = mini.get("mxcx-grid");
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
  mxcx.getSwsx();
};

/**
 * @desc 获取主管税务机关代码
 */
mxcx.getSwjg = function () {
  ajax.get(mxcxApi.getSwjg, "", function (data) {
    if (data) {
      mini.get("zgswjgDm").loadList(data);
      ajax.get(mxcxApi.getNowSwjg, "", function (data) {
        if (data.success) {
          mini.get("zgswjgDm").setValue(data.value);
        } else {
          mini.alert(data.message || '获取当前税务机关失败')
        }
      });
    }
  });
};
/**
 * @desc 获取触发事项
 */
mxcx.getSwsx = function () {
  ajax.get(mxcxApi.getSwsx, "", function (data) {
    if (data.success) {
      mini.get("swsxDm").setData(data.value);
    }
  });
};

/**
 * @desc 收到日期初始化设置为当月一号至今
 */
mxcx.initValue = function () {
  var firstDate = new Date(new Date().setDate(1)).format("yyyy-MM-dd");
  var currentData = new Date().format("yyyy-MM-dd");
  mini.get("cfrqQ").setValue(firstDate);
  mini.get("cfrqZ").setValue(currentData);
};

/**
 * @desc 查询
 */
mxcx.doSearch = function () {
  var mxcxForm = mxcx.mxcxForm,
    grid = mxcx.mxcxGrid;
  var formData = mxcxForm.getData(true),
    params = $.extend({}, { data: formData }, {
      pageIndex: mxcx.pageIndex,
      pageSize: mxcx.pageSize || grid.getPageSize(),
    });

  grid.emptyText =
    "<span style='float: left;padding-right: 2%;color: #f00'>无记录</span>";
  var mxcxJudgeStatus = mxcxForm.validate();
  if (!mxcxJudgeStatus) return;
  ajax.post(mxcxApi.doSearch, mini.encode(params), function (res) {
    if (res.success && res.value && res.value.data) {
      grid.setData(res.value.data);
      grid.setTotalCount(res.value.total);
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

  var reqUrl = mxcxApi.exportData + '?'
  for (var key in formData) {
    reqUrl += key + '=' + formData[key] + '&'
  }
  window.open(reqUrl)
};

/**
 * @desc 日期校验
 */
mxcx.onDateValidate = function (e) {
  if (e.value) {
    var dateTarget = e.sender.id;
    var cfrqQ = mini.get("cfrqQ").getValue();
    var cfrqZ = mini.get("cfrqZ").getValue();

    cfrqQ = cfrqQ && cfrqQ.getTime();
    cfrqZ = cfrqZ && cfrqZ.getTime();

    if (dateTarget === "cfrqQ" || dateTarget === "cfrqZ") {
      if (cfrqQ && cfrqZ && cfrqQ > cfrqZ) {
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
