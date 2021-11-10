var yswh = {};
var yswhApiHead = "/dzgzpt-wsys/";
var yswhApi = {
  validatioin: yswhApiHead + "api/fpzyps/yswh/getLoginUserPerm",
  /* 权限 */
  handleSearch: yswhApiHead + "api/fpzyps/yswh/query",
  /* 查询 */
  handleAddSave: yswhApiHead + "api/fpzyps/yswh/insert",
  /* 增加保存 */
  handleEditSave: yswhApiHead + "api/fpzyps/yswh/update",
  /* 编辑保存 */
  handleRemove: yswhApiHead + "api/fpzyps/yswh/delete",
  /* 删除 */
  getSwjgDm: yswhApiHead + "api/fpzyps/yswh/getLoginUserSwjgDm",
  /* 获取税务机关代码 */
  getSwryxx:
    yswhApiHead + "api/wtgl/public/login/session" /* 获取当前登录人员信息 */,
  /* 获取税务事项下拉选项 */
  querywhswsx:
    yswhApiHead + "api/fpzyps/yswh/querywhswsx",
};

yswh.pageIndex = 0;
yswh.pageSize = 0; // 初始化为0
yswh.key = true; // 防止多次点击
yswh.setTimeout = ""; // 延迟触发
yswh.cxmxGridData = [];
yswh.disChecked = [];
yswh.swryxx = {};
yswh.sxList = []
$(function () {
  gldUtil.addWaterInPages();
  mini.parse();

  yswh.cxmxGrid = mini.get("yswh-grid");
  yswh.addRowWin = mini.get("yswh-addrow-win");
  yswh.searchForm = new mini.Form("#yswh-form");
  yswh.addRowWinForm = new mini.Form("#win-addrow-form");

  yswh.init();
});

/* 初始化 */
yswh.init = function () {
  yswh.initValidation();
  yswh.initSwryxx();
  yswh.initSwjg();
  yswh.querywhswsx()
};

/* 权限 */
yswh.initValidation = function () {
  ajax.post(yswhApi.validatioin, "", function (res) {
    if (res) {
      if (!res.operate) $(".operate").hide();
    } else {
      mini.alert("系统异常，请稍后再试~");
    }
  });
};

/* 获取当前登录人员信息 */
yswh.initSwryxx = function () {
  ajax.post(yswhApi.getSwryxx, "", function (res) {
    if (res && res.value) {
      var data = res.value;
      yswh.swryxx.nowDate = data.nowDate;
      yswh.swryxx.username = data.currentSwrysfmc;
      yswh.swryxx.swjgDm = data.swjgDm;
    } else {
      mini.alert(res.message || "获取当前登录人信息异常，请稍后再试~");
    }
  });
};

/* 区局税务人员展示其从属的税务机关，市局和超管展示所有税务机关 */
yswh.initSwjg = function () {
  ajax.get(yswhApi.getSwjgDm, "", function (data) {
    if (data) {
      mini.get("_ysssswjgDm").loadList(data);
      mini.get("ysssswjgDm").loadList(data);
    } else {
      mini.alert(res.message || "系统异常，请稍后再试~", "提示");
    }
  });
};

/* 税务事项下拉选项 */
yswh.querywhswsx = function () {
  ajax.get(yswhApi.querywhswsx, "", function (data) {
    if (data.success) {
      yswh.sxList = data.value || []
      mini.get('swsxdm').setData(data.value || [])
      mini.get('sxdm').setData(data.value || [])
    } else {
      mini.alert(res.message || "系统异常，请稍后再试~", "提示");
    }
  });
};

/* 查询 */
yswh.handleSearch = function () {
  if (!yswh.key) return;
  yswh.hasKey();
  var form = yswh.searchForm,
    grid = yswh.cxmxGrid;
  if (!form.validate()) return;
  var params = $.extend(
    {},
    {
      pageIndex: yswh.pageIndex,
      pageSize: yswh.pageSize || grid.getPageSize(),
    },
    form.getData()
  );
  grid.emptyText = "<span style='float: left;padding-right: 2%;color: #f00'>无记录</span>";

  $.ajax({
    type: "POST",
    url: yswhApi.handleSearch,
    contentType: 'application/json;charset=utf-8',
    data: mini.encode(params),
    success : function(res) {
      if (res && res.success && res.value && res.resultMap) {
        // $.each(res.value, function (index, item) {
        //   item.sxdm = item.swsxdm
        //   item.sxmc = item.swsxmc
        // })
        //初次录入状态显示为 ' 有效 '
        yswh.addStatus(res.value, "add");
        yswh.cxmxGridData = yswh.formatDate(res.value);
        grid.setData(yswh.cxmxGridData);
        grid.setTotalCount(res.resultMap.totalNum);
        yswh.renderCheckStyle(yswh.cxmxGridData);
      } else {
        mini.alert(res.message || "系统异常，请稍后再试~", "提示");
      }
    }
  })
};

/* 初始化录入信息 */
yswh.initLrxx = function () {
  mini.get("xgrq").setValue(new Date());
  mini.get("lrry").setValue(yswh.swryxx.username);
};

/* 增加行 */
yswh.handleAddRow = function () {
  yswh.addRowWinForm.reset();
  yswh.initLrxx();
  yswh.winIsShow(true);
  mini.get("yswh-addrow-win").setTitle("新增");
  yswh.setFormEnablede(true);
  mini.get("xgrq").setEnabled(false);
  mini.get("lrry").setEnabled(false);
  yswh.handleSave = function () {
    var grid = yswh.cxmxGrid,
      gridData = yswh.cxmxGridData,
      form = yswh.addRowWinForm;
    if (!form.validate() || !yswh.validDate() || !yswh.validMoney()) return;
    var formData = form.getData(true);
    formData.xgrq = new Date(
      formData.xgrq.replace(/-/g, "/") +
      new Date().format("yyyy-MM-dd hh:mm:ss").substring(10)
    ).getTime();
    formData.ysrqq = new Date(
      formData.ysrqq.replace(/-/g, "/") + " 00:00:00"
    ).getTime();
    formData.ysrqz = new Date(
      formData.ysrqz.replace(/-/g, "/") + " 23:59:59"
    ).getTime();
    for (var i = 0; i < yswh.sxList.length; i++) {
      if (formData.sxdm == yswh.sxList[i].swsxdm) {
        formData.swsxmc = yswh.sxList[i].swsxmc
        formData.swsxdm = yswh.sxList[i].swsxdm
      }
    }
    $.ajax({
      type: "POST",
      url: yswhApi.handleAddSave,
      contentType: 'application/json;charset=utf-8',
      data: mini.encode(formData),
      success : function(res) {
        if (res && res.success && res.value) {
          gridData.unshift(yswh.formatDate(res.value)[0]);
          yswh.addStatus(gridData, "add");
          grid.setData(gridData);
          yswh.winIsShow(false);
          yswh.showTips("保存成功", "", "success", 1000);
          yswh.renderCheckStyle(gridData);
        } else {
          mini.alert(res.message || "保存异常，请稍后再试~");
        }
      }
    })
  };
};

/* 取消 */
yswh.handleCancel = function () {
  yswh.winIsShow(false);
};

/* 修改行 */
yswh.handleEditRow = function () {
  var grid = yswh.cxmxGrid,
    rows = grid.getSelecteds();
  if (rows.length !== 1) {
    mini.alert("请选择一笔数据进行修改。");
    return;
  }
  yswh.addRowWinForm.reset();
  yswh.winIsShow(true);
  mini.get("yswh-addrow-win").setTitle("修改");
  yswh.setFormEnablede(false);
  var dt = rows[0];
  dt.sxdm = dt.swsxdm
  yswh.addRowWinForm.setData(dt);
  yswh.initLrxx();
  var hasYz = dt.dzxysje || dt.yzxysje; /* 有邮资 */
  if (hasYz) {
    mini.get("yjje").setEnabled(true);
    mini.get("ysje").setEnabled(true);
    mini.get("whrsjh").setEnabled(true);
    mini.get("sfps").setEnabled(true);
  } else {
    mini.get("ysrqq").setEnabled(true);
    mini.get("ysrqz").setEnabled(true);
    mini.get("ysje").setEnabled(true);
    mini.get("yjje").setEnabled(true);
    mini.get("whrsjh").setEnabled(true);
    mini.get("sfps").setEnabled(true);
  }
  $('.mini-placeholder-label').hide();

  yswh.handleSave = function () {
    var flag = false;
    var grid = yswh.cxmxGrid,
      gridData = yswh.cxmxGridData,
      rows = grid.getSelecteds();
    form = yswh.addRowWinForm;
    if (
      !form.validate() ||
      !yswh.validDate() ||
      !yswh.validMoney() ||
      (hasYz && !yswh.validateYsjeYzxysje())
    )
      return;
    var formData = form.getData(true);
    //修改时如果添加了维护人手机号，修改成功后需要加到table上
    if (formData.whrsjh !== "") {
      flag = true;
    }
    console.log("手机号：", formData);
    formData.xgrq = new Date(
      formData.xgrq.replace(/-/g, "/") +
      new Date().format("yyyy-MM-dd hh:mm:ss").substring(10)
    ).getTime();
    formData.ysrqq = new Date(
      formData.ysrqq.replace(/-/g, "/") + " 00:00:00"
    ).getTime();
    formData.ysrqz = new Date(
      formData.ysrqz.replace(/-/g, "/") + " 23:59:59"
    ).getTime();
    for (var i = 0; i < yswh.sxList.length; i++) {
      if (formData.sxdm == yswh.sxList[i].swsxdm) {
        formData.swsxmc = yswh.sxList[i].swsxmc
        formData.swsxdm = yswh.sxList[i].swsxdm
      }
    }
    $.ajax({
      type: "POST",
      url: yswhApi.handleEditSave,
      contentType: 'application/json;charset=utf-8',
      data: mini.encode(formData),
      success : function(res) {
        if (res && res.success && res.value) {
          var index = rows[0]._index;
  
          //给GridData添加手机号
          if (flag) {
            gridData[index].whrsjh = formData.whrsjh;
          }
  
          gridData.splice(index, 1, yswh.formatDate(formData)[0]);
          console.log(gridData[index]);
          yswh.addStatus(gridData[index], "modify");
          grid.setData(gridData);
          yswh.winIsShow(false);
          yswh.showTips("修改成功", "", "success", 1000);
          yswh.renderCheckStyle(gridData);
        } else {
          mini.alert(res.message || "系统异常，请稍后再试~", "提示");
        }
      }
    })
  };
};

yswh.setFormEnablede = function (flag) {
  var fields = yswh.addRowWinForm.getFields();
  for (var i = 0, len = fields.length; i < len; i += 1) {
    var item = fields[i],
      target = mini.get(item.id);
    if (target) {
      target.setEnabled(flag);
      target.setIsValid(true);
    }
  }
};

yswh.validateYsjeYzxysje = function () {
  var ysje = mini.get("ysje").getValue(),
    dzxysje = mini.get("dzxysje").getValue(),
    yzxysje = mini.get("yzxysje").getValue(),
    flag = +ysje >= +yzxysje + +dzxysje;
  if (!flag) mini.alert("预算金额不能小于已执行预算金额与待执行预算金额之和");
  return flag;
};

/* 删除行 */
// yswh.handleRemoveRow = function () {
//     var grid = yswh.cxmxGrid,
//         rows = grid.getSelecteds();
//     if (!rows.length) {
//         mini.alert('请至少选择一条数据进行删除。');
//         return;
//     }
//     var params = {
//         yswhId: []
//     };
//     mini.confirm('请确认是否删除？', '提示', function (action) {
//         if (action === 'ok') {
//             for (var i = 0, len = rows.length; i < len; i += 1) {
//                 params.yswhId.push(rows[i].yswhId);
//             }
//             ajax.post(yswhApi.handleRemove, mini.encode(params), function (res) {
//                 if (res && res.success && res.value) {
//                     var temp = [];
//                     for (var j = 0, lenj = yswh.cxmxGridData.length; j < lenj; j += 1) {
//                         var item = yswh.cxmxGridData[j];
//                         if (params.yswhId.indexOf(item.yswhId) < 0) temp.push(item);
//                     }
//                     yswh.cxmxGridData = temp;
//                     grid.loadData(yswh.cxmxGridData);
//                     yswh.showTips('删除成功', '', 'success', 1000);
//                 } else {
//                     mini.alert(res.message || '删除异常，请稍后再试~');
//                 }
//             });
//         }
//     });
// };

/* window是否显示 */
yswh.winIsShow = function (flag) {
  flag ? yswh.addRowWin.show() : yswh.addRowWin.hide();
};

/* 点击树节点 */
yswh.beforenodeselect = function (e) {
  //禁止选中父节点 e.tree.getParentNode(e.node)
  if (e.isLeaf === false) {
    e.cancel = e.node.ID.substr(-6) === "000000";
  }
};

/* 日期校验 */
yswh.validDate = function () {
  var tar1 = mini.get("ysrqq"),
    tar2 = mini.get("ysrqz"),
    rqq = tar1.getValue(),
    rqz = tar2.getValue();
  if (!rqq || !rqz) return false;
  if (rqq > rqz) {
    if (yswh.key) {
      /* 处理多次提示的触发 */
      mini.alert("预算日期起应小于预算日期止~");
      yswh.hasKey();
    }
    yswh.setIsValid(false, [tar1, tar2]);
    return false;
  }
  yswh.setIsValid(true, [tar1, tar2]);
  return true;
};

/* 计算剩余预算金额 */
yswh.setSyysje = function () {
  var ysje = mini.get("ysje").getValue(),
    yzxysje = mini.get("yzxysje").getValue() || "";
  // mini.get('syysje').setValue(''); /* 没有已执行预算金额 暂置空 */
  if (ysje) mini.get("syysje").setValue(Number((ysje - yzxysje).toFixed(2)));
};

/* 金额校验 */
yswh.validMoney = function () {
  yswh.setSyysje();
  var tar1 = mini.get("ysje"),
    tar2 = mini.get("yjje"),
    ysje = tar1.getValue(),
    yjje = tar2.getValue();
  if (!ysje || !yjje) return false;
  if (+yjje < 0 || +ysje < 0) {
    if (yswh.key) {
      /* 处理多次提示的触发 */
      mini.alert("金额不能小于0~");
      yswh.hasKey();
    }
    if (+ysje < 0) yswh.setIsValid(false, [tar1]);
    if (+yjje < 0) yswh.setIsValid(false, [tar2]);
    return false;
  }
  if (+yjje > +ysje) {
    if (yswh.key) {
      /* 处理多次提示的触发 */
      mini.alert("预警金额不能大于预算金额~");
      yswh.hasKey();
    }
    yswh.setIsValid(false, [tar1, tar2]);
    return false;
  }
  // yswh.setIsValid(true, [tar1, tar2]);
  return true;
};

yswh.moneyOnfocus = function (e) {
  e &&
    mini.get(e.source.getId()).setValue(e.source.getValue().replace(".00", ""));
};

/* 设置是否valid */
yswh.setIsValid = function (flag, arr) {
  setTimeout(function () {
    for (var i = 0, len = arr.length; i < len; i += 1) {
      arr[i] && arr[i].setIsValid && arr[i].setIsValid(flag);
    }
  }, 50);
};

/* 分页设置 分页改变触发 */
yswh.onpagechanged = function (e) {
  yswh.pageIndex = e.pageIndex;
  yswh.pageSize = e.pageSize;
  yswh.handleSearch();
};
yswh.onbeforeload = function (e) {
  e.cancel = true;
};

/* 防止多次点击 */
yswh.hasKey = function () {
  yswh.key = false;
  setTimeout(function () {
    yswh.key = true;
  }, 1000);
};

/* 税务机关onchange触发 */
yswh.zgswjgValueChanged = function (e) {
  mini.get("ysssswjgJc").setValue(e.source.getText());
};

/* 微提示 */
yswh.showTips = function (title, content, type, time) {
  var _time = 3000;
  if (!!time) {
    _time = time;
  }
  mini.showTips({
    content: "<b>" + title + "</b><br/>" + content,
    state: type,
    x: "center",
    y: "top",
    offset: [0, 58],
    timeout: _time,
  });
};

/* 将对象里的日期对象进行格式化 */
yswh.formatDate = function (arr, keys) {
  keys = keys || ["ysrqq", "ysrqz", "xgrq"];
  arr = arr instanceof Array ? arr : [arr];
  if (!arr.length) return arr;
  for (var i = 0, len = arr.length; i < len; i += 1) {
    var obj = arr[i];
    for (var key in obj) {
      if (obj.hasOwnProperty(key) && keys.indexOf(key) >= 0) {
        /* 修改 是时间戳 不是字符串 */
        if (typeof obj[key] === "string") {
          obj[key] = obj[key].replace(/-/g, "/");
        }
        obj[key] = new Date(obj[key]).format("yyyy-MM-dd");
      }
    }
  }
  return arr;
};

yswh.addStatus = function (value, type) {
  if (type === "add") {
    for (var i = 0; i < value.length; i++) {
      var item = value[i];
      if (item.xgcs == "0") {
        item.zt = "有效";
      } else {
        item.zt = "被修改";
      }
    }
  } else {
    value.zt = "被修改";
  }
  return value;
};

/**
 * @desc 被修改数据选框置灰
 */
yswh.renderCheckStyle = function (gridData) {
  var userAgent = navigator.userAgent;
  var isIE = window.ActiveXObject || "ActiveXObject" in window;
  var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
  reIE.test(userAgent);
  var fIEVersion = parseFloat(RegExp["$1"]);
  for (var i = 0; i < gridData.length; i += 1) {
    var dataItem = gridData[i];
    if (dataItem.xgcs != "0") {
      $(".mini-grid-body input[type=checkbox]")[i].style.opacity = ".4";
    }

    if (isIE && fIEVersion == 8 && dataItem.xgcs != "0") {
      $(".mini-grid-body input[type=checkbox]")[i].style.filter =
        "alpha(opacity=40)";
    }
  }
};

/**
 * 按钮是否可以选择
 */
function isShowCheck(e) {
  var record = e.record;
  if (record.zt === "被修改") {
    e.cancel = true;
  }
}

function onRenderSfps(e) {
  var record = e.record;
  return record.sfps == 'Y' ? '是' : '否'
}
