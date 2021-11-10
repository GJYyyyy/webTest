// /workflow/web/workflow/
$(function () {
  gldUtil.addWaterInPages();
  mini.parse();
  yyclObj.init();
});

var yyclApi = {
  // 查询被检举人信息
  getGridData: "/workflow/web/workflow/form/yycl/query",
  // 导出被检举人信息
  exportExcel: "/workflow/web/workflow/form/yycl/excel"
}

var yyclObj = {
  exportData: '',
  key: true, // 防止多次点击
  cxGrid: null,
  cxtjForm: null,
  sdrqq: null,
  sdrqz: null,
  param: null,
  init: function () {
    this.cxGrid = mini.get("cxGrid");
    this.cxtjForm = new mini.Form("#cxtjForm");
    this.yydWin = mini.get("yyd-win")
    //~起默认当前日期
    this.sdrqq = mini.get("sdrqq");
    this.sdrqz = mini.get("sdrqz");
    this.tsrqq = mini.get("tsrqq");
    this.tsrqz = mini.get("tsrqz");
    // this.changeOther();
    this.doSearch()
  },
  changeOther: function () {
    // ~起止默认当前日期
    var now = new Date()
    this.sdrqq.setValue(now);
    this.sdrqz.setValue(now);
    this.tsrqq.setValue(now);
    this.tsrqz.setValue(now);
    this.doSearch()
  },
  hasKey: function () {
    yyclObj.key = false;
    setTimeout(function () {
      yyclObj.key = true;
    }, 1000);
  },
  doSearch: function () {
    if (this.sdrqq.text > this.sdrqz.text) {
      mini.alert("收到日期起大于收到日期止，请重新选择！", "提示");
      return
    }
    if (this.tsrqq.text > this.tsrqz.text) {
      mini.alert("推送日期起大于推送日期止，请重新选择！", "提示");
      return
    }
    if (!yyclObj.key) return;
    yyclObj.hasKey();

    var formData = this.cxtjForm.getData(true);
    var params = $.extend({}, {
      pageIndex: yyclObj.pageIndex || yyclObj.cxGrid.getPageIndex(),
      pageSize: yyclObj.pageSize || yyclObj.cxGrid.getPageSize()
    }, formData);
    yyclObj.exportData = params
    $.ajax({
      url: yyclApi.getGridData,
      data: mini.encode(params),
      type: "post",
      contentType: "application/json; charset=utf-8",
      success: function (res) {
        if (res.code == 'SUCCESS') {
          var datas = mini.decode(res);
          yyclObj.cxGrid.setData(datas.data.data || []);
          yyclObj.cxGrid.setTotalCount(datas.data.total);
          yyclObj.cxGrid.setPageIndex(yyclObj.cxGrid.pageIndex);
        } else {
          mini.alert(res.message || '查询失败！')
        }
      },
      error: function () {
      }
    });
  },
  onpagechanged: function (e) {
    yyclObj.pageIndex = e.pageIndex;
    yyclObj.pageSize = e.pageSize;
    yyclObj.doSearch();
  },
  onbeforeload: function (e) {
    e.cancel = true;
  },
  doExport: function () {
    if (!yyclObj.cxGrid.data || (yyclObj.cxGrid.data && yyclObj.cxGrid.data.length > 0)) {
      document.getElementById("exportData").value = mini.encode(yyclObj.exportData);
      document.getElementById('exportForm').submit();
    } else {
      mini.alert("暂无数据，无法导出Excel！");
    }
  },
};

function onyydActionRenderer(e) {
  var record = e.record
  return "<a href='#' title='点击查看完整信息' onclick='showYydDetail(record.yyd)'>查看</a>"
}
function onRwmcActionRenderer(e) {
  return "异议处理"
}
function showYydDetail(data) {
  // 查看异议点详情
  $("#yydDetail").html(data)
  yyclObj.yydWin.show()
}

function onActionRenderer(e) {
  var record = e.record
  if (record.slzt == '未受理') {
    return "<a href='#' onclick='slyy(record)'>受理</a>"
  }
}

function onWfssjcfyjRenderer(e) {
  var record = e.record
  return "<a href='#' onclick='showYydDetail(record.wfssjcfyj)'>" + record.wfssjcfyj + "</a>"
}

function slyy(record) {
  // 进入受理页面
  mini.open({
    url: './yycl_sxsl.html',        //页面地址
    title: '罚款缴纳异议处理',      //标题
    iconCls: '',    //标题图标
    width: '100%',      //宽度
    height: "600",     //高度
    allowResize: true,       //允许尺寸调节
    allowDrag: false,         //允许拖拽位置
    showCloseButton: true,   //显示关闭按钮
    showMaxButton: false,     //显示最大化按钮
    showModal: true,         //显示遮罩
    currentWindow: false,      //是否在本地弹出页面,默认false
    effect: 'none',              //打开和关闭时的特果:'none','slow','fast',默认'none'
    onload: function () {       //弹出页面加载完成
      var iframe = this.getIFrameEl();
      //调用弹出页面方法进行初始化
      iframe.contentWindow.initData(record);
    },
    ondestroy: function (action) {  //弹出页面关闭前
      if (action == 'ok') {
        yyclObj.doSearch()
      }
    }
  });
}
