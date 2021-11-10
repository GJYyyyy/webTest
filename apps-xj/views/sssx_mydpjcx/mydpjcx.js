var mydpj = {};
var countImg = 0; // 图片计数
var imgUrlOnServer = {}; //图片对象｛index：‘’，url：‘’｝
var imgList = []; //图片路径数组
var mydpjApiHead = "/dzgzpt-wsys/";
var mydpjApi = {
  doSearch: mydpjApiHead + "api/sh/gldmydpj/query/gldpj",
  exportData: mydpjApiHead + "api/sh/gldmydpj/download/gldpj",
};

mydpj.pageIndex = 0;
mydpj.pageSize = 0;

$(function () {
  gldUtil.addWaterInPages();
  mini.parse();

  mydpj.mydpjForm = new mini.Form("mydpj-form");
  mydpj.mydpjGrid = mini.get("mydpj-grid");
  mydpj.init();
  mydpj.initValue();

  // setEnable("nsrsbh");
});

/**
 * @desc 初始化
 */
mydpj.init = function () {
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
};

/**
 * @desc 收到日期初始化设置为当天
 *        评价情况初始化为 "全部"
 */
mydpj.initValue = function () {
  var currentData = new Date().format("yyyy-MM-dd");
  mini.get("tjkssj").setValue(currentData);
  mini.get("tjjssj").setValue(currentData);

  mini.get("pjqk").setValue("");
};

/**
 * @desc 查询
 */
mydpj.doSearch = function () {
  var mydpjForm = mydpj.mydpjForm,
    grid = mydpj.mydpjGrid;
  var formData = mydpjForm.getData(true),
    params = $.extend({}, formData, {
      pageIndex: mydpj.pageIndex,
      pageSize: mydpj.pageSize || grid.getPageSize(),
    });

  grid.emptyText =
    "<span style='float: left;padding-right: 2%;color: #f00'>暂无数据</span>";
  var mydpjJudgeStatus = mydpjForm.validate();
  if (!mydpjJudgeStatus) return;
  ajax.get(mydpjApi.doSearch, params, function (res) {
    if (res.success && res.value) {
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
mydpj.doReset = function () {
  mydpj.mydpjForm.reset();
  mydpj.initValue();
};

/**
 * @desc 导出
 */
mydpj.exportData = function () {
  var mydpjForm = mydpj.mydpjForm,
    gridData = mydpj.mydpjGrid.getData();
  var formData = mydpjForm.getData(true);

  if (gridData == null || gridData == "") {
    mini.alert("查询结果为空，无需导出文件！");
    return;
  }

  // formData = JSON.stringify(formData).replace(/\"/g, '"');

  window.open(
    mydpjApi.exportData +
      "?nsrsbh=" +
      formData.nsrsbh +
      "&wsh=" +
      formData.wsh +
      "&zgswjgDm=" +
      formData.zgswjgDm +
      "&pjqk=" +
      formData.pjqk +
      "&tjkssj=" +
      formData.tjkssj +
      "&tjjssj=" +
      formData.tjjssj
  );
};

/**
 * @desc 渲染操作按钮
 */
mydpj.renderAction = function (e) {
  var record = e.record;
  var field = e.field;
  var fbzl = record.fbzl || [];
  var lspjList = record.lspjList || [];

  if (field === "pz") {
    if (fbzl.length === 0) {
      return '<span class="unableClick">查看</span>';
    }
    var fbzl = JSON.stringify(fbzl).replace(/\"/g, "'");
    return (
      '<span class="ableClick" onclick="mydpj.showImg(' +
      fbzl +
      ')">查看</span>'
    );
  }

  if (field === "cz") {
    if (lspjList.length <= 1) {
      return '<span class="unableClick">查看</span>';
    }
    var lspjList = JSON.stringify(lspjList).replace(/\"/g, "'");
    return (
      '<span class="ableClick" onclick="mydpj.showHistoryModal(' +
      lspjList +
      ')">查看</span>'
    );
  }
};

/**
 * 查看历史评价弹框
 */
mydpj.showHistoryModal = function (lspjList) {
  mini.get("lspj_win").show();
  mini.get("lspj-grid").setData(lspjList);
};

/**
 * 展示凭证图片
 */
mydpj.showImg = function (fbzl) {
  var html = '<div class="img_content">';
  for (var i = 0; i < fbzl.length; i++) {
    var fileKey = fbzl[i].fileKey;
    var fileName = fbzl[i].fileName;
    var baseUrl = "/dzgzpt-wsys/api/sh/gldmydpj/viewpic?fileKey=";
    imgUrlOnServer.index = countImg;
    imgUrlOnServer.path = baseUrl + fileKey;
    imgList.push(imgUrlOnServer);
    countImg++;
    html +=
      '<div class="box"><div class="imgBox"><img class="imgItem" src="' +
      imgUrlOnServer.path +
      '"/></div><div class="img_name"><span>' +
      fileName +
      "</span></div></div>";
  }
  html += "</div>";

  mini.showMessageBox({
    width: 520,
    title: "凭证",
    buttons: ["ok"],
    html: html,
  });
};

/**
 * @desc 日期校验
 */
mydpj.onDateValidate = function (e) {
  if (e.value) {
    var dateTarget = e.sender.id;
    var tjkssj = mini.get("tjkssj").getValue();
    var tjjssj = mini.get("tjjssj").getValue();

    tjkssj = tjkssj && tjkssj.getTime();
    tjjssj = tjjssj && tjjssj.getTime();

    if (dateTarget === "tjkssj" || dateTarget === "tjjssj") {
      if (tjkssj && tjjssj && tjkssj > tjjssj) {
        mini.alert("评价时间起应小于评价时间止~");
        mini.get(dateTarget).setValue("");
      }
    }
  }
};

mydpj.handleCancel = function () {
  mini.get("lspj_win").hide();
};

mydpj.onPageChanged = function (e) {
  mydpj.pageIndex = e.pageIndex;
  mydpj.pageSize = e.pageSize;
  mydpj.doSearch();
};
mydpj.onbeforeload = function (e) {
  e.cancel = true;
};

function setEnable(id) {
  mini.get('"' + id + '"').setReadOnly(true);
}
