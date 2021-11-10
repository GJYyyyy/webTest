var yjxx = {};
var yjxxApiHead = "/dzgzpt-wsys/";
var yjxxApi = {
  getSwjg: yjxxApiHead + "api/baseCode/getUserQxSwjgAndAllXsSwjgWithCode",
  doSearch: yjxxApiHead + "api/fpzyps/wszypscx/queryDatas",
  exportData: yjxxApiHead + "api/fpzyps/wszypscx/exportExcel",
  sl: yjxxApiHead + "api/fpzyps/wszypscx/updatePszt",
};

yjxx.pageIndex = 0;
yjxx.pageSize = 0;
yjxx.allowClick = true;
yjxx.key = true; //防止多次点击

$(function () {
  gldUtil.addWaterInPages();
  mini.parse();

  yjxx.yjxxForm = new mini.Form("yjxx-form");
  yjxx.yjxxGrid = mini.get("yjxx-grid");
  yjxx.init();
  yjxx.initValue();
  yjxx.doSearch();
});

/**
 * @desc 初始化
 */
yjxx.init = function () {
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

  yjxx.getSwjg();
};

/**
 * @desc 获取主管税务机关代码
 */
yjxx.getSwjg = function () {
  ajax.get(yjxxApi.getSwjg, "", function (data) {
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
yjxx.initValue = function () {
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
yjxx.doSearch = function (lx) {
  var yjxxForm = yjxx.yjxxForm,
    grid = yjxx.yjxxGrid;
  
  if(lx=='fy'){
    var formData = yjxxForm.getData(true),
    params = $.extend({}, formData, {
      pageIndex: yjxx.pageIndex,
      pageSize: yjxx.pageSize || grid.getPageSize(),
    });
  }else{
    var formData = yjxxForm.getData(true),
    params = $.extend({}, formData, {
      pageIndex: 0,
      pageSize: yjxx.pageSize || grid.getPageSize(),
    });
  }
   

  if (!yjxx.key) return;
  yjxx.hasKey();
  grid.emptyText =
    "<span style='float: left;padding-right: 2%;color: #f00'>无记录</span>";
  var yjxxJudgeStatus = yjxxForm.validate();
  if (!yjxxJudgeStatus) return;
  ajax.post(yjxxApi.doSearch, mini.encode(params), function (res) {
    if (res.success && res.value) {
      grid.setData(res.value);
      grid.setTotalCount(res.resultMap.totalNum);
      yjxx.renderCheckStyle(res.value);
    } else {
      grid.setData([]);
      mini.alert((res && res.message) || "暂无数据", "提示");
    }
  });
};

/* 防止多次 */
yjxx.hasKey = function () {
  yjxx.key = false;
  setTimeout(function () {
    yjxx.key = true;
  }, 500);
};

/**
 * @desc 重置
 */
yjxx.doReset = function () {
  yjxx.yjxxForm.reset();
  yjxx.initValue();
};

/**
 * @desc 导出
 */
yjxx.exportData = function () {
  var yjxxForm = yjxx.yjxxForm,
    gridData = yjxx.yjxxGrid.getData();
  var formData = yjxxForm.getData(true);

  if (gridData == null || gridData == "") {
    mini.alert("查询结果为空，无需导出文件！");
    return;
  }

  formData = JSON.stringify(formData).replace(/\"/g, '"');

  window.open(yjxxApi.exportData + "?requestJson=" + formData);
};

/**
 * @desc 确认交接
 */
yjxx.qrjj = function () {
  var selectedData = yjxx.yjxxGrid.getSelecteds();
  var arr = [];

  if (selectedData.length === 0) {
    mini.alert("请选择确认交接的数据", "提示");
    return;
  }
  for (var i = 0; i < selectedData.length; i++) {
    var item = selectedData[i];
    arr.push(item.sqxh);
  }
  var params = {
    sqxh: arr,
  };

  mini.showMessageBox({
    title: "提示",
    buttons: ["ok", "cancel"],
    message: "是否确认交接？",
    callback: function (action) {
      if (action === "ok") {
        ajax.post(yjxxApi.sl, mini.encode(params), function (shData) {
          if (shData.success) {
            mini.alert(shData.message || "操作成功！");
            yjxx.doSearch();
            return;
          }
          mini.alert(shData.message || "操作失败");
          yjxx.doSearch();
          return;
        });
      }
    },
  });
};

/**
 * @desc 交接完成的数据选框置灰
 */
yjxx.renderCheckStyle = function (gridData) {
  var userAgent = navigator.userAgent;
  var isIE = window.ActiveXObject || "ActiveXObject" in window;
  var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
  reIE.test(userAgent);
  var fIEVersion = parseFloat(RegExp["$1"]);
  for (var i = 0; i < gridData.length; i += 1) {
    var dataItem = gridData[i];
    if (dataItem.pszt === "已交接") {
      console.log(i);
      $(".mini-grid-body input[type=checkbox]")[i].style.opacity = ".4";
    }

    if (isIE && fIEVersion == 8 && dataItem.pszt === "已交接") {
      $(".mini-grid-body input[type=checkbox]")[i].style.filter =
        "alpha(opacity=40)";
    }
  }
};

/**
 * 选框是否可以选择
 */
function isShowCheck(e) {
  var record = e.record;
  if (record.pszt === "已交接") {
    e.cancel = true;
  }
}

/**
 * @desc 日期校验
 */
yjxx.onDateValidate = function (e) {
  if (e.value) {
    var dateTarget = e.sender.id;
    var sdrqq = mini.get("sdrqq").getValue();
    var sdrqz = mini.get("sdrqz").getValue();

    sdrqq = sdrqq && sdrqq.getTime();
    sdrqz = sdrqz && sdrqz.getTime();

    if (dateTarget === "sdrqq" || dateTarget === "sdrqz") {
      if (sdrqq && sdrqz && sdrqq > sdrqz) {
        mini.alert("收到日期起应小于收到日期止~");
        mini.get(dateTarget).setValue("");
      }
    }
  }
};

/**
 * 翻页
 */
yjxx.onPageChanged = function (e) {
  yjxx.pageIndex = e.pageIndex;
  yjxx.pageSize = e.pageSize;
  yjxx.doSearch("fy");
};
yjxx.onbeforeload = function (e) {
  e.cancel = true;
};
