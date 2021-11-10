$(function () {
  gldUtil.addWaterInPages();
  mini.parse();
  gzmd.init();
});


var gzmd = {
  exportData: '',
  key: true, // 防止多次点击
  cxGrid: null,
  cxtjForm: null,
  param: null,
  init: function () {
    this.cxGrid = mini.get("cxGrid");
    this.cxtjForm = new mini.Form("#cxtjForm");
  },
  hasKey: function () {
    gzmd.key = false;
    setTimeout(function () {
      gzmd.key = true;
    }, 1000);
  },
  zgswjgChanged: function (e, action) {
    mini.get('zgsws' + action).setValue()
    mini.get('zgsws' + action).loadList([], "ID", "PID");
    e.value && $.ajax({
      url: '/dzgzpt-wsys/api/baseCode/getAllXsSwjgByGivenSwjg/' + e.value,
      type: "get",
      async: true,
      contentType: "application/json; charset=utf-8",
      success: function (res) {
        mini.get('zgsws' + action).loadList(res, "ID", "PID");
      },
      error: function () {
      }
    });
  },
  doSearch: function () {
    if (!gzmd.key) return;
    gzmd.hasKey();

    var formData = this.cxtjForm.getData(true);
    var params = $.extend({}, {
      pageIndex: gzmd.pageIndex || gzmd.cxGrid.getPageIndex(),
      pageSize: gzmd.pageSize || gzmd.cxGrid.getPageSize()
    }, formData);
    gzmd.exportData = params
    $.ajax({
      url: '/dzgzpt-wsys/api/ksqy/gzmd/queryDatas',
      data: mini.encode(params),
      type: "post",
      async: true,
      contentType: "application/json; charset=utf-8",
      success: function (res) {
        if (res.success) {
          var datas = mini.decode(res);
          var datas = mini.decode(res);
          gzmd.cxGrid.setData(datas.value);
          gzmd.cxGrid.setTotalCount(datas.resultMap.totalNum);
          gzmd.cxGrid.setPageIndex(gzmd.cxGrid.pageIndex);
        } else {
          mini.alert(res.message || '查询失败！')
        }
      },
      error: function () {
      }
    });
  },
  onpagechanged: function (e) {
    gzmd.pageIndex = e.pageIndex;
    gzmd.pageSize = e.pageSize;
    gzmd.doSearch();
  },
  onbeforeload: function (e) {
    e.cancel = true;
  },
  doImport: function () {
    //导入
    gzmd.upWin = mini.open({
      url: 'sc.html',  //页面地址
      title: '跨省（市）迁移关注名单导入',      //标题
      iconCls: '',    //标题图标
      width: 900,      //宽度
      height: 300,     //高度
      allowResize: true,       //允许尺寸调节
      allowDrag: true,         //允许拖拽位置
      showCloseButton: true,   //显示关闭按钮
      showMaxButton: false,     //显示最大化按钮
      showModal: true,         //显示遮罩
      currentWindow: false,      //是否在本地弹出页面,默认false
      effect: 'none',              //打开和关闭时的特果:'none','slow','fast',默认'none'
      ondestroy: function (action) {
        if (action == "close") {  //

        }

      }
    });
  },
  doExport: function () {
    if (!gzmd.cxGrid.data || (gzmd.cxGrid.data && gzmd.cxGrid.data.length > 0)) {
      var formData = this.cxtjForm.getData(true);
      var param = JSON.stringify(formData);
      window.open('/dzgzpt-wsys/api/ksqy/gzmd/exportExcel?requestJson=' + param)
    } else {
      mini.alert("暂无数据，无法导出Excel！");
    }
  },
  reSet: function () {
    this.cxGrid.setData([])
    this.cxtjForm.clear()
  },
  addData: function () {
    var addData = new mini.Form("#addForm").getData(true)
    $.ajax({
      url: '/dzgzpt-wsys/api/ksqy/gzmd/insertOne',
      data: mini.encode(addData),
      type: "post",
      async: true,
      contentType: "application/json; charset=utf-8",
      success: function (res) {
        if (res.success) {
          mini.alert("新增成功！", "提示", function () {
            gzmd.handleCancel()
            gzmd.doSearch()
          })

        } else {
          mini.alert(res.message || '新增失败，请重试。')
        }
      },
      error: function () {
      }
    });
  },
  deleteData: function (nsrsbh) {
    $.ajax({
      url: '/dzgzpt-wsys/api/ksqy/gzmd/deleteOne',
      data: nsrsbh,
      type: "post",
      async: true,
      contentType: "application/json; charset=utf-8",
      success: function (res) {
        if (res.success) {
          mini.alert("删除成功！", "提示", function () {
            gzmd.doSearch()
          })
        } else {
          mini.alert(res.message || '删除失败，请重试。')
        }
      },
      error: function () {
      }
    });
  },
  handleCancel: function () {
    new mini.Form("#addForm").clear()
    mini.get('add-win').hide()
  },
  onAddnsrsbhChanged: function (e) {
    e.value && $.ajax({
      url: '/dzgzpt-wsys/api/ksqy/gzmd/selectDataBeforeInsertOne',
      data: { nsrsbh: e.value },
      type: "get",
      async: true,
      contentType: "application/json; charset=utf-8",
      success: function (res) {
        if (res.success) {
          if (res.value) {
            new mini.Form("#addForm").setData(res.value || '')
          } else {
            gzmd.clearAddForm()
            mini.alert("未查询到纳税人信息，请确认")
          }
        } else {
          gzmd.clearAddForm()
          mini.alert(res.message || '获取失败，请重试。')
        }
      },
      error: function () {
      }
    });
  },
  clearAddForm: function () {
    mini.get("addNsrmc").setValue()
    mini.get("zgswjgxz").setValue()
    mini.get("zgswsxz").setValue()
    mini.get("hy").setValue()
    mini.get("qnsssr").setValue()
  }
};

function onActionRenderer(e) {
  var record = e.record
  return "<a href='#' onclick='gzmd.deleteData(record.nsrsbh)'>删除</a>"
}

function upSuccess(message) {
  gzmd.upWin.hide();
  mini.alert(message || "导入成功！", "提示", function (e) {
    gzmd.doSearch()
  });
}
function upLoser(message) {
  gzmd.upWin.hide();
  mini.alert(message || "接口异常，请稍候再试", "提示", function (e) {
    // window.location.reload();
  });
}
