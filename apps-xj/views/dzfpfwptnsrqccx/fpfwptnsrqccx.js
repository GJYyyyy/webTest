$(function () {
  mini.parse();
  fpfwptnsrqccx.init();
});

var fpfwptnsrqccx = {
  init: function () {
    this.fpfwptGrid = mini.get("fpfwptGrid");
    this.qymdFrom = new mini.Form("#qymdFrom");

    this.doSearch();
  },
  // 电子发票服务平台纳税人清册查询页--方法
  doSearch: function () {
    fpfwptnsrqccx.qymdFrom.validate();
    if (!fpfwptnsrqccx.qymdFrom.isValid()) {
      return false;
    }
    var formData = fpfwptnsrqccx.qymdFrom.getData(true),
      formPar = fpfwptnsrqccx.fpfwptGrid,
      params = $.extend({}, formData, {
        pageIndex: fpfwptnsrqccx.pageIndex || formPar.getPageIndex() + 1,
        pageSize: fpfwptnsrqccx.pageSize || formPar.getPageSize()
      });
    if (formData.lrrqStartTime) {
      if (formData.lrrqStartTime > new Date().format("yyyy-MM-dd")) {
        mini.alert("清册上传日期起不能大于今天的日期");
        return false;
      }
    }
    if (formData.lrrqEndTime) {
      if (formData.lrrqEndTime > new Date().format("yyyy-MM-dd")) {
        mini.alert("清册上传日期止不能大于今天的日期");
        return false;
      }
    }
    if (formData.lrrqStartTime && formData.lrrqEndTime) {
      if (formData.lrrqStartTime > formData.lrrqEndTime) {
        mini.alert("清册上传日期起不能大于清册上传日期止");
        return false;
      }
    }
    formPar.emptyText =
      "<span style='float: left;padding-right: 2%;color: #f00'>无记录</span>";
    $.ajax({
      url: '../../../../api/sh/nsrqc/searchNsrqcLists',
      data: mini.encode(params),
      contentType: "application/json;charset=UTF-8",
      success: function (res) {
        if (res.success && res.value.data.length > 0) {
          formPar.setData(res.value.data);
          formPar.setTotalCount(res.value.total);
        } else {
          formPar.setData([]);
          mini.alert((res && res.message) || "暂无数据", "提示");
        }
      },
      error: function (res) {
        errCallback(res)
      }
    })
  },
  // 重置
  doReset: function () {
    mini.get("ptsyrnsrsbh").setValue("");
    mini.get("ptmc").setValue("");
    mini.get("lrrqStartTime").setValue("");
    mini.get("lrrqEndTime").setValue("");
    fpfwptnsrqccx.fpfwptGrid.setData('');
  },
  // 查看详情页
  openCxxq: function (e) {
    window.open('/dzgzpt-wsys/dzgzpt-wsys/apps/views/dzfpfwptnsrqccx/fpfwqccx_xqy.html?');
  },
  // 导出
  exportFpqd: function () {
    if (fpfwptnsrqccx.fpfwptGrid.data.length < 1 || fpfwptnsrqccx.fpfwptGrid == "") {
      mini.alert("查询结果为空，无需导出文件！");
      return;
    }
    var pageIndex = fpfwptnsrqccx.fpfwptGrid.pageIndex;
    var pageSize = fpfwptnsrqccx.fpfwptGrid.pageSize;
    var ptsyrnsrsbh = mini.get("ptsyrnsrsbh").value || '';
    var ptmc = mini.get("ptmc").value || '';
    var lrrqStartTime = mini.formatDate(mini.get("lrrqStartTime").value, 'yyyy-MM-dd') || '';
    var lrrqEndTime = mini.formatDate(mini.get("lrrqEndTime").value, 'yyyy-MM-dd') || '';

    window.open('/dzgzpt-wsys/api/sh/nsrqc/tsmdExcel?ptsyrnsrsbh=' + ptsyrnsrsbh +
      '&ptmc=' + ptmc + '&lrrqStartTime=' + lrrqStartTime + '&lrrqEndTime=' + lrrqEndTime +
      '&pageSize=' + pageSize + '&pageIndex=' + pageIndex + '&nsrsbh=' + '&htqdrqEndTime=' + '&htqdrqStartTime=' + '&htyxqzStartTime=' +
      '&htyxqzEndTime=' + '&zgswjg=' + '&nsrmc=');
  },
};
// 点击分页
fpfwptnsrqccx.onpagechanged = function (e) {
  fpfwptnsrqccx.pageIndex = e.pageIndex + 1;
  fpfwptnsrqccx.pageSize = e.pageSize;
  fpfwptnsrqccx.doSearch();
};
fpfwptnsrqccx.onbeforeload = function (e) {
  e.cancel = true;
}
function onActionRenderer(e) {
  var record = e.record;
  return '<a href="javascript:fpfwptnsrqccx.openCxxq(\'' + record +
    '\');"  class="check-info">查看详情</a>'
}

function nsrsbhValidate(e) {
  if (e.value == false) return;
  if (e.isValid) {
    if (!/^[a-zA-Z0-9\-]{15,20}$/.test(e.value)) {
      e.errorText = "纳税人识别号必须为15到20位的字母或数字！";
      e.isValid = false;
      return;
    }
  }
}
