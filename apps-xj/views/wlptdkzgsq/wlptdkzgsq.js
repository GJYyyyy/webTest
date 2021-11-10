var zgsq = {};
var zgsqApiHead = "/dzgzpt-wsys/";
var zgsqApi = {
  getSwjg: zgsqApiHead + "api/baseCode/getUserQxSwjgAndAllXsSwjgWithCode",
  doSearch: zgsqApiHead + "api/sh/wldk/query/sqjl",
  exportData: zgsqApiHead + "api/fpzyps/wszypscx/exportExcel",
  sl: zgsqApiHead + "api/fpzyps/wszypscx/updatePszt",
};

zgsq.pageIndex = 0;
zgsq.pageSize = 0;
zgsq.key = true; // 防止多次点击
zgsq.allowClick = true;

$(function () {
  gldUtil.addWaterInPages();
  mini.parse();

  zgsq.zgsqForm = new mini.Form("zgsq-form");
  zgsq.zgsqGrid = mini.get("zgsq-grid");
  zgsq.init();
  zgsq.initValue();
  // zgsq.doSearch();
});

/**
 * @desc 初始化
 */
zgsq.init = function () {
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

  zgsq.getSwjg();
};

/**
 * @desc 获取主管税务机关代码
 */
zgsq.getSwjg = function () {
  ajax.get(zgsqApi.getSwjg, "", function (data) {
    if (data) {
      mini.get("swjgDm").loadList(data);
    }
  });
};

/**
 * @desc 收到日期初始化
 */
zgsq.initValue = function () {
  //收到日期
  var sdrqQ = mini.get("sdrqQ");
  var sdrqZ = mini.get("sdrqZ");
  var now = new Date(),
    delay = new Date();
  delay.setMonth(delay.getMonth() - 1);
  sdrqQ.setValue(mini.formatDate(delay, "yyyy-MM-dd"));
  sdrqQ.setMaxDate(now);
  sdrqZ.setValue(mini.formatDate(now, "yyyy-MM-dd"));
  sdrqZ.setMinDate(delay);
  sdrqZ.setMaxDate(now);

  //受理状态初始化为 ' 待受理 '
  mini.get("slzt").setValue("00");
};

/**
 * @desc 查询
 */
zgsq.doSearch = function () {
  if (!zgsq.key) return;
  zgsq.hasKey();
  var zgsqForm = zgsq.zgsqForm,
    grid = zgsq.zgsqGrid;
  var formData = zgsqForm.getData(true);
  if (formData.slzt === "all") {
    formData.slzt = "";
  }
  var params = $.extend({}, formData, {
    pageIndex: zgsq.pageIndex,
    pageSize: zgsq.pageSize || grid.getPageSize(),
  });

  grid.emptyText =
    "<span style='float: left;padding-right: 2%;color: #f00'>暂无数据</span>";
  var zgsqJudgeStatus = zgsqForm.validate();
  if (!zgsqJudgeStatus) return;
  $.ajax({
    url: zgsqApi.doSearch,
    contentType: "application/x-www-form-urlencoded;charset=utf-8",
    type: "post",
    data: params,
    success: function (res) {
      if (res.data) {
        grid.setData(res.data);
        grid.setTotalCount(res.total);
      } else {
        grid.setData([]);
        mini.alert((res && res.message) || "暂无数据", "提示");
      }
    },
  });
};

/**
 * @desc 重置
 */
zgsq.doReset = function () {
  zgsq.zgsqForm.reset();
  zgsq.initValue();
};

/**
 * @desc 日期校验
 */
zgsq.onDateValidate = function (e) {
  if (e.value) {
    var dateTarget = e.sender.id;
    var sbrqQ = mini.get("sbrqQ").getValue();
    var sbrqZ = mini.get("sbrqZ").getValue();
    var blqxQ = mini.get("blqxQ").getValue();
    var blqxZ = mini.get("blqxZ").getValue();

    sbrqQ = sbrqQ && sbrqQ.getTime();
    sbrqZ = sbrqZ && sbrqZ.getTime();

    if (dateTarget === "sbrqQ" || dateTarget === "sbrqZ") {
      if (sbrqQ && sbrqZ && sbrqQ > sbrqZ) {
        mini.alert("收到日期起应小于收到日期止~");
        mini.get(dateTarget).setValue("");
      }
    }
    if (dateTarget === "blqxQ" || dateTarget === "blqxZ") {
      if (blqxQ && blqxZ && blqxQ > blqxZ) {
        mini.alert("办理期限起应小于办理期限止~");
        mini.get(dateTarget).setValue("");
      }
    }
  }
};

/* 防止多次点击 */
zgsq.hasKey = function () {
  zgsq.key = false;
  setTimeout(function () {
    zgsq.key = true;
  }, 1000);
};

/**
 * 翻页
 */
zgsq.onPageChanged = function (e) {
  zgsq.pageIndex = e.pageIndex;
  zgsq.pageSize = e.pageSize;
  zgsq.doSearch();
};
zgsq.onbeforeload = function (e) {
  e.cancel = true;
};

/**
 * @desc 渲染列
 */
zgsq.renderCollumn = function (e) {
  var record = e.record;
  var field = e.field;
  var blzt = record.blztDm;
  var lcslId = record.lcslid;
  var rwztDm = record.rwztDm;
  var swsxDm = record.swsxdm;
  var rwbh = record.rwbh;
  var index = record._index;
  if (field === "blztDm") {
    var blztObj = {
      "00": "待受理",
      "01": "受理成功",
      "02": "不予受理",
      "06": "补正资料",
      "07": "已补正",
      "11": "已撤销",
      "99": "申请异常",
    };
    return "<span>"+blztObj[blzt]+"</span>"
  }

  if (field === "cz") {
    if (blzt === "00") {
      var type = "deal";
      return (
        '<span class="ableClick" onclick="zgsq.showSwsxSqxx(\'' +
        lcslId +
        "','" +
        rwbh +
        "','" +
        index +
        "','" +
        swsxDm +
        "','" +
        type +
        "')\">受理</span>"
      );
    } else {
      var type = "check";
      return (
        '<span class="ableClick" onclick="zgsq.showSwsxSqxx(\'' +
        lcslId +
        "','" +
        rwbh +
        "','" +
        index +
        "','" +
        swsxDm +
        "','" +
        type +
        "')\">查看</span>"
      );
    }
  }
};

/**
 * Go to 事项受理页面
 * @param lcslId
 * @param rwbh
 * @param index
 * @param swsxDm
 */
zgsq.showSwsxSqxx = function (lcslId, rwbh, index, swsxDm, type) {
  var url =
    "./wlpt_sxsl.html?lcslId=" + lcslId + "&rwbh=" + rwbh + "&type=" + type;

  mini.open({
    showMaxButton: true,
    title: "待办事项受理",
    url: url,
    showModal: true,
    width: "100%",
    height: "100%",
    onload: function () {},
    ondestroy: function (action) {
      unlockDbsxslzt();
    },
  });
};
