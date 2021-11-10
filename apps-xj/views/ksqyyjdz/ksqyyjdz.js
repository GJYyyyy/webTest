var ksqy = {};
var ksqyApiHead = "/dzgzpt-wsys/";
var ksqyApi = {
  doSearch: ksqyApiHead + "api/sh/ksqy/ksqyyjdz/query",
  deleteRow: ksqyApiHead + "api/sh/ksqy/ksqyyjdz/delete",
  addRow: ksqyApiHead + "api/sh/ksqy/ksqyyjdz/add",
  import: ksqyApiHead + "api/sh/ksqy/ksqyyjdz/import",
  export: ksqyApiHead + "api/sh/ksqy/ksqyyjdz/export",
};

ksqy.pageIndex = 0;
ksqy.pageSize = 0;
ksqy.ksqyGridData = [];
ksqy.allowClick = true;
ksqy.key = true; // 防止多次点击

$(function () {
  gldUtil.addWaterInPages();
  mini.parse();

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

  ksqy.ksqyForm = new mini.Form("ksqy-form");
  ksqy.addRowForm = new mini.Form("win-addrow-form");
  ksqy.ksqyGrid = mini.get("ksqy-grid");
  ksqy.addWin = mini.get("ksqy-addrow-win");
  ksqy.addRowBtn = mini.get("addRow");
});

/**
 * @desc 查询
 */
ksqy.doSearch = function () {
  if (!ksqy.key) return;
  ksqy.hasKey();
  var ksqyForm = ksqy.ksqyForm,
    grid = ksqy.ksqyGrid;
  var formData = ksqyForm.getData(true),
    params = $.extend({}, formData, {
      currentPage: ksqy.pageIndex,
      pageSize: ksqy.pageSize || grid.getPageSize(),
    });

  grid.emptyText =
    "<span style='float: left;padding-right: 2%;color: #f00'>无记录</span>";
  var ksqyJudgeStatus = ksqyForm.validate();
  if (!ksqyJudgeStatus) return;
  ajax.post(ksqyApi.doSearch, mini.encode(params), function (res) {
    if (res.success && res.value) {
      grid.setData(res.value.value);
      ksqy.ksqyGridData = res.value.value;
      grid.setTotalCount(res.value.resultMap.total);
      if (res.value.value.length) {
        $("#addRowEnable").show();
        $("#addRow").hide();
      } else {
        $("#addRowEnable").hide();
        $("#addRow").show();
      }
    } else {
      grid.setData([]);
      mini.alert((res && res.message) || "暂无数据", "提示");
    }
  });
};

/**
 * @desc 校验手机号
 */
ksqy.validatePhone = function (e) {
  var value = e.value;
  var mobilePre = /^1[3456789]\d{9}$/;
  var phonePre = /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/;

  var moblieRes = mobilePre.test(value);
  var phoneRes = phonePre.test(value);
  if (e.isValid) {
    if (!moblieRes && !phoneRes) {
      if (value === "") {
        e.isValid = true;
      } else {
        e.errorText = "请输入正确的手机号码或固定电话";
        e.isValid = false;
      }
    }
  }
};

/* 防止多次点击 */
ksqy.hasKey = function () {
  ksqy.key = false;
  setTimeout(function () {
    ksqy.key = true;
  }, 1000);
};

/**
 * @desc 提交新增
 */
ksqy.handleAdd = function () {
  var form = ksqy.addRowForm;
  var params = form.getData();
  if (!form.validate()) return;
  ajax.post(ksqyApi.addRow, mini.encode(params), function (res) {
    if (res.success && res.value) {
      mini.alert("新增成功！");
      ksqy.addRowForm.reset();
      ksqy.addWin.hide();
      ksqy.doSearch();
    } else {
      mini.alert(res.message || "提交失败，请稍后再试", "提示");
    }
  });
};

ksqy.handleCancel = function () {
  ksqy.addRowForm.setData();
  ksqy.addWin.hide();
};

/**
 * @desc 重置
 */
ksqy.doReset = function () {
  ksqy.ksqyForm.reset();
  ksqy.initValue();
};

/**
 * 增加行
 */
ksqy.addRow = function () {
  ksqy.addWin.show();
  ksqy.getLoginInfo();
};

/**
 * @desc 获取登录信息
 */
ksqy.getLoginInfo = function () {
  $.ajax({
    type: "GET",
    url: "/dzgzpt-wsys/api/baseCode/get/SwjgQx",
    contentType: "application/json",
    dataType: "json",
    success: function (data) {
      if (data) {
        mini.get("zgswjDmText").setValue(data.MC);
        mini.get("zgswjDm").setValue(data.ID);
      }
    },
  });
};

/* 导出 */
ksqy.export = function () {
  var form = ksqy.ksqyForm,
    grid = ksqy.ksqyGrid;
  if (!ksqy.ksqyGridData.length) {
    mini.alert("未获取到可导出的数据，请确认后重新操作！", "提示");
    return;
  }
  var params = $.extend(
    {},
    {
      pageIndex: ksqy.pageIndex,
      pageSize: ksqy.pageSize || grid.getPageSize(),
    },
    form.getData()
  );
  location.href =
    ksqyApi.export +
    "?pageIndex=" +
    params.pageIndex +
    "&pageSize=" +
    params.pageSize +
    "&yjdz=" +
    params.yjdz +
    "&sjr=" +
    params.sjr +
    "&zxdh=" +
    params.zxdh +
    "&total=" +
    parseInt(ksqy.total);
};

/**
 * @desc 导入
 */
ksqy.localUpload = function () {
  $(".mini-htmlfile .mini-htmlfile-file").click();
};
ksqy.startUpload = function () {
  //uploader.upload();
  var inputFile = $("#file1 > input:file")[0];
  $.ajaxFileUpload({
    url: "/dzgzpt-wsys/api/sh/ksqy/ksqyyjdz/import", //用于文件上传的服务器端请求地址
    fileElementId: inputFile, //文件上传域的ID
    type: "get",
    //data: { a: 1, b: true },            //附加的额外参数
    dataType: "json", //返回值类型 一般设置为json
    success: function (data, status) {
      //服务器成功响应处理函数
      if (data.success) {
        uploadSuccessData = data.value;
        mini.alert("导入成功！");
        window.location.reload();
        ksqy.doSearch();
      } else {
        mini.alert(data.message || "导入失败，请稍候再试");
      }
    },
    error: function (data, status, e) {
      //服务器响应失败处理函数
      var mess = mini.decode(data);
      console.log(data);
      mini.alert(data.message || "接口异常，请稍候再试");
    },
  });
};

/**
 * 删除行
 */
ksqy.deleteRow = function (record) {
  var id = record.id;
  var params = {
    id: id,
  };

  mini.showMessageBox({
    title: "提示",
    buttons: ["ok", "cancel"],
    message: "是否确认删除？",
    callback: function (action) {
      if (action === "ok") {
        ajax.post(ksqyApi.deleteRow, mini.encode(params), function (res) {
          if (res.success) {
            mini.alert(res.message || "删除成功！");
            ksqy.doSearch();
            return;
          }
          mini.alert(res.message || "操作失败");
        });
      }
    },
  });
};

/**
 * @desc 渲染表格
 */
ksqy.renderDeleteBtn = function (e) {
  var record = e.record;
  return (
    "<span class='ableClick' onclick='ksqy.deleteRow(" +
    mini.encode(record) +
    ")'>删除</span>"
  );
};

/**
 * 翻页
 */
ksqy.onPageChanged = function (e) {
  ksqy.pageIndex = e.pageIndex;
  ksqy.pageSize = e.pageSize;
  ksqy.doSearch();
};
ksqy.onbeforeload = function (e) {
  e.cancel = true;
};
