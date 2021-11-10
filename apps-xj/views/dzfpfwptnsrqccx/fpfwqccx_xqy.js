$(function () {
  mini.parse();
  fpfwqccx_xqy.init();
});

var fpfwqccx_xqy = {
  init: function () {
    this.fpfwGridXq = mini.get("fpfwGridXq");
    this.qymdFromXq = new mini.Form("#qymdFromXq");
    this.swjg = mini.get("zgswjg");
    this.swjgxl();
    this.doSearchXq();
  },
  // 查看详情页--方法
  swjgxl: function () {
    // 税务机关下拉
    $.ajax({
      url: "../../../../api/xj/wtgl/cxtj/getSxtjSwjg",
      data: "",
      type: "POST",
      success: function (obj) {
        var datas = mini.decode(obj);
        fpfwqccx_xqy.swjg.loadList(datas, "jgDm", "PID");
      },
      error: function () {
      }
    });
  },
  doSearchXq: function () {
    fpfwqccx_xqy.qymdFromXq.validate();
    if (!fpfwqccx_xqy.qymdFromXq.isValid()) {
      return false;
    }
    var formData = fpfwqccx_xqy.qymdFromXq.getData(true),
      formPar = fpfwqccx_xqy.fpfwGridXq,
      params = $.extend({}, formData, {
        pageIndex: fpfwqccx_xqy.pageIndex || formPar.getPageIndex() + 1,
        pageSize: fpfwqccx_xqy.pageSize || formPar.getPageSize()
      });
    if (formData.htyxqzStartTime && formData.htyxqzEndTime) {
      if (formData.htyxqzStartTime > formData.htyxqzEndTime) {
        mini.alert("合同有效期起不能大于合同有效期止");
        return false;
      }
    }
    if (formData.htqdrqStartTime) {
      if (formData.htqdrqStartTime > new Date().format("yyyy-MM-dd")) {
        mini.alert("合同签订日期起不能大于今天的日期");
        return false;
      }
    }
    if (formData.htqdrqEndTime) {
      if (formData.htqdrqEndTime > new Date().format("yyyy-MM-dd")) {
        mini.alert("合同签订日期止不能大于今天的日期");
        return false;
      }
    }
    if (formData.htqdrqStartTime && formData.htqdrqEndTime) {
      if (formData.htqdrqStartTime > formData.htqdrqEndTime) {
        mini.alert("合同签订日期起不能大于合同签订日期止");
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
  doReset: function () {
    mini.get("nsrsbh").setValue("");
    mini.get("nsrmc").setValue("");
    mini.get("zgswjg").setValue("");
    mini.get("htyxqzStartTime").setValue("");
    mini.get("htyxqzEndTime").setValue("");
    mini.get("htqdrqStartTime").setValue("");
    mini.get("htqdrqEndTime").setValue("");
    fpfwqccx_xqy.fpfwGridXq.setData('');
  },
  exportFpqdXq: function () {
    /*var rows = grid.getSelecteds();*/
    if (fpfwqccx_xqy.fpfwGridXq.data.length < 1 || fpfwqccx_xqy.fpfwGridXq == "") {
      mini.alert("查询结果为空，无需导出文件！");
      return;
    }
    var pageIndex = fpfwqccx_xqy.fpfwGridXq.pageIndex;
    var pageSize = fpfwqccx_xqy.fpfwGridXq.pageSize;
    var nsrsbh = mini.get("nsrsbh").value || '';
    var nsrmc = mini.get("nsrmc").value || '';
    var zgswjgDm = mini.get("zgswjg").value;
    var htyxqzStartTime = mini.formatDate(mini.get("htyxqzStartTime").value, 'yyyy-MM-dd') || '';
    var htyxqzEndTime = mini.formatDate(mini.get("htyxqzEndTime").value, 'yyyy-MM-dd') || '';
    var htqdrqStartTime = mini.formatDate(mini.get("htqdrqStartTime").value, 'yyyy-MM-dd') || '';
    var htqdrqEndTime = mini.formatDate(mini.get("htqdrqEndTime").value, 'yyyy-MM-dd') || '';

    window.open('/dzgzpt-wsys/api/sh/nsrqc/tsmdExcel?nsrsbh=' + nsrsbh + '&nsrmc=' + nsrmc + '&zgswjg=' + zgswjgDm +
      '&htqdrqEndTime=' + htqdrqEndTime + '&htqdrqStartTime=' + htqdrqStartTime + '&htyxqzStartTime=' + htyxqzStartTime +
      '&htyxqzEndTime=' + htyxqzEndTime + '&pageSize=' + pageSize + '&pageIndex=' + pageIndex + '&ptsyrnsrsbh=' +
      '&ptmc=' + '&lrrqStartTime=' + '&lrrqEndTime=');
  }
};
// 点击分页
fpfwqccx_xqy.onpagechanged = function (e) {
  fpfwqccx_xqy.pageIndex = e.pageIndex + 1;
  fpfwqccx_xqy.pageSize = e.pageSize;
  fpfwqccx_xqy.doSearchXq();
};
fpfwqccx_xqy.onbeforeload = function (e) {
  e.cancel = true;
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
