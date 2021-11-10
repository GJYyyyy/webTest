var ldcxzs = {};
var ldcxzsApiHead = "/dzgzpt-wsys/";
var ldcxzsApi = {
  handleSearchByPhone:
    ldcxzsApiHead + "api/ldxzs/queryNsrxxByPhone" /* 根据电话查询 */,
  handleSearchByQyxx:
    ldcxzsApiHead + "api/ldxzs/queryNsrxxByKeyword" /* 根据企业信息查询 */,
  handleSearchByBdglLdhm:
    ldcxzsApiHead + "api/ldxzs/queryLdbd" /* 绑定管理根据来电电话查询 */,
  handleAddBdgl:
    ldcxzsApiHead + "api/ldxzs/insertOneLdbd" /* 绑定管理新增记录 */,
};

ldcxzs.pageIndex_byPhone = 0;
ldcxzs.pageSize_byPhone = 0; // 初始化为0
ldcxzs.pageIndex_bdgl = 0;
ldcxzs.pageSize_bdgl = 0;
ldcxzs.key = true; // 防止多次点击
ldcxzs.showSearchAlert = true;
ldcxzs.setTimeout = ""; // 延迟触发
ldcxzs.cxmxGridData = [];
ldcxzs.swryxx = {};

$(function () {
  mini.parse();

  ldcxzs.cxmxGrid_byPhone = mini.get("ldcxzs-grid-by-phone");
  ldcxzs.cxmxGrid_fphd = mini.get("ldcxzs-grid-fphd");
  ldcxzs.cxmxGrid_szhd = mini.get("ldcxzs-grid-szhd");
  ldcxzs.cxmxGrid_bdgl = mini.get("ldcxzs-grid-bdgl");
  ldcxzs.searchForm_byPhone = new mini.Form("#ldcxzs-form-by-phone");
  ldcxzs.searchForm_byQyxx = new mini.Form("#ldcxzs-form-by-qyxx");
  ldcxzs.searchForm_byBdglLxdh = new mini.Form("#ldcxzs-form-bdgl");
  ldcxzs.addRowWinForm_bdgl = new mini.Form("#win-addrow-form-bdgl");
  ldcxzs.addRowWin = mini.get("win-addrow-bdgl");
});

ldcxzs.getData = function (data, key) {
  return data;
};

/**
 * @desc 左侧-查询信息
 */
ldcxzs.handleSearchByPhone = function (param) {
  ldcxzs.showSearchAlert = param === "unShow" ? false : true;
  if (!ldcxzs.key) return;
  ldcxzs.hasKey();
  var form = ldcxzs.searchForm_byPhone,
    grid = ldcxzs.cxmxGrid_byPhone;
  var params = $.extend(
    {},
    {
      pageIndex: ldcxzs.pageIndex_byPhone,
      pageSize: ldcxzs.pageSize_byPhone || grid.getPageSize(),
    },
    form.getData()
  );
  if (!form.validate() || !ldcxzs.validatePhone(params.phone)) return;
  ldcxzs.log(params);
  ajax.post(ldcxzsApi.handleSearchByPhone, mini.encode(params), function (res) {
    res = ldcxzs.getData(res, "handleSearchByPhone");
    if (res && res.success && res.value) {
      if (res.value.length && ldcxzs.showSearchAlert) {
        mini.showMessageBox({
          width: 500,
          height: 300,
          title: "提示",
          message: ldcxzs.renderAttention(res.value),
          buttons: ["ok", "cancel"],
          callback: function (action) {
            var data = res.value,
              total = res.resultMap.totalNum;
            grid.setData(data);
            grid.setTotalCount(total);
            ldcxzs.showSearchAlert = false;
          },
        });
      } else if (ldcxzs.showSearchAlert) {
        mini.showMessageBox({
          width: 500,
          height: 200,
          title: "提示",
          message:
            "未查询到该来电信息对应的企业相关信息，请注意核实来电人员身份",
          buttons: ["ok", "cancel"],
          callback: function (action) {
            var data = res.value,
              total = res.resultMap.totalNum;
            grid.setData(data);
            grid.setTotalCount(total);
            ldcxzs.showSearchAlert = false;
          },
        });
      }else if(!ldcxzs.showSearchAlert && res.value.length){
        var data = res.value,
              total = res.resultMap.totalNum;
            grid.setData(data);
            grid.setTotalCount(total);
      }
    } else {
      mini.alert("系统异常，请稍后再试~", "提示");
    }
  });
};

/**
 * @desc 渲染提示信息
 */
ldcxzs.renderAttention = function (data) {
  var html = "";
  for (var i = 0; i < data.length; i++) {
    var item = data[i];
    html += "<p>" + item.nsrmc + "，" + item.glrxx + "</p>";
  }
  html += "<p>根据信息安全要求，请确认来电人员是否属于对应企业的相关人员</p>";
  return html;
};

/**
 * @desc 右侧-一户式-查询信息
 */
ldcxzs.handleSearchByQyxx = function () {
  var form = ldcxzs.searchForm_byQyxx,
    fphdGrid = ldcxzs.cxmxGrid_fphd,
    szhdGrid = ldcxzs.cxmxGrid_szhd;
  if (!form.validate()) return;
  var params = form.getData();
  ldcxzs.log(params);
  ajax.post(ldcxzsApi.handleSearchByQyxx, mini.encode(params), function (res) {
    res = ldcxzs.getData(res, "handleSearchByQyxx");
    if (res && res.success) {
      if (res.value) {
        var data = res.value,
          qyxxData = data.yhs,
          fphdData = ldcxzs.formatDateInObjInArr(data.fphd, "fphd"),
          szhdData = ldcxzs.formatDateInObjInArr(data.szhd, "szhd");
        fphdGrid.setData(fphdData);
        szhdGrid.setData(szhdData);
        ldcxzs.initQyxxTable(qyxxData);
      } else {
        mini.alert(res.message || "暂无数据~", "提示");
      }
    } else {
      mini.alert(res.message || "系统异常，请稍后再试~", "提示");
    }
  });
};

/**
 * @desc 右侧-绑定管理-查询信息
 */
ldcxzs.handleSearchByBdglLdhm = function () {
  if (!ldcxzs.key) return;
  ldcxzs.hasKey();
  var form = ldcxzs.searchForm_byBdglLxdh,
    grid = ldcxzs.cxmxGrid_bdgl;
  var params = $.extend(
    {},
    {
      pageIndex: ldcxzs.pageIndex_bdgl,
      pageSize: ldcxzs.pageSize_bdgl || grid.getPageSize(),
    },
    form.getData()
  );
  if (!form.validate() || !ldcxzs.validatePhone(params.ldhm)) return;
  ldcxzs.log(params);
  ajax.post(ldcxzsApi.handleSearchByBdglLdhm, mini.encode(params), function (
    res
  ) {
    res = ldcxzs.getData(res, "handleSearchByBdglLdhm");
    if (res && res.success && res.value) {
      var data = res.value,
        total = res.resultMap.totalNum;
      data = ldcxzs.formatDateInObjInArr(data, "bdgl");
      grid.setData(data);
      grid.setTotalCount(total);
    } else {
      mini.alert(res.message || "系统异常，请稍后再试~", "提示");
    }
  });
};

/**
 * @desc 右侧-绑定管理-新增信息
 */
ldcxzs.handleAddBdgl = function () {
  var form = ldcxzs.addRowWinForm_bdgl,
    grid = ldcxzs.cxmxGrid_bdgl;
  var params = form.getData();
  if (
    !form.validate() ||
    !ldcxzs.validatePhone(params.ldhm) ||
    !ldcxzs.validateNsrsbh(params.bdnsrsh)
  )
    return;
  ldcxzs.log(params);
  ajax.post(ldcxzsApi.handleAddBdgl, mini.encode(params), function (res) {
    res = ldcxzs.getData(res, "handleAddBdgl");
    if (res && res.success) {
      ldcxzs.winIsShow(false);
      form.reset();
      var temp = grid.getData();
      grid.setTotalCount(+grid.getTotalCount() + 1);
      params.lrsj = ldcxzs.formatDate();
      temp.unshift(params);
      grid.setData(ldcxzs.formatDateInObjInArr(temp, "bdgl"));
      ldcxzs.showTips("新增记录成功", "", "success", 1000);
    } else {
      mini.alert(res.message || "新增异常，请稍后再试~", "提示");
    }
  });
};

/**
 * @desc 赋值企业信息table
 */
ldcxzs.handleAddBdglSave = function () {
  ldcxzs.handleAddBdgl();
};

/**
 * @desc 赋值企业信息table
 */
ldcxzs.handleAddBdglCancel = function (data) {
  ldcxzs.winIsShow(false);
};

/**
 * @desc 赋值企业信息table
 */
ldcxzs.initQyxxTable = function (data) {
  var obj = data;
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      $(".data-" + key).text(obj[key]);
    }
  }
};

/**
 * @desc 分页设置 分页改变触发 左侧查询
 */
ldcxzs.onpagechangedByPhone = function (e) {
  ldcxzs.pageIndex_byPhone = e.pageIndex;
  ldcxzs.pageSize_byPhone = e.pageSize;
  ldcxzs.handleSearchByPhone("unShow");
};
/**
 * @desc 分页设置 分页改变触发 绑定管理
 */
ldcxzs.onpagechangedBdgl = function (e) {
  ldcxzs.pageIndex_bdgl = e.pageIndex;
  ldcxzs.pageSize_bdgl = e.pageSize;
  ldcxzs.handleSearchByBdglLdhm();
};
ldcxzs.onbeforeload = function (e) {
  e.cancel = true;
};

/**
 * @desc window是否显示
 */
ldcxzs.winIsShow = function (flag) {
  flag ? ldcxzs.addRowWin.show() : ldcxzs.addRowWin.hide();
};

/**
 * @desc console_log
 */
ldcxzs.log = function (msg) {
  console.log(msg);
};

/**
 * @desc 微提示
 */
ldcxzs.showTips = function (title, content, type, time) {
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

/**
 * @desc 将对象里的日期对象进行格式化
 */
ldcxzs.formatDate = function (date) {
  date = new Date() || new Date(date);
  return date.format("yyyy-MM-dd hh:mm:ss");
};

/**
 * @desc 将对象里的日期对象进行格式化
 */
ldcxzs.formatDateInObjInArr = function (arr, target) {
  var keys = [],
    fphd = target === "fphd",
    szhd = target === "szhd",
    bdgl = target === "bdgl";
  var format = "yyyy-MM-dd";
  if (fphd) keys = ["yxqq", "yxqz"];
  if (szhd) keys = ["rdyxqq", "rdyxqz"];
  if (bdgl) {
    format += " hh:mm:ss";
    keys = ["lrsj"];
  }
  arr = arr instanceof Array ? arr : [arr];
  for (var i = 0, len = arr.length; i < len; i += 1) {
    var obj = arr[i];
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (szhd) {
          obj.zsxm = obj.zsxmDm + "(" + obj.zsxmmc + ")";
          obj.zspm = obj.zspmDm + "(" + obj.zspmmc + ")";
        }
        if (keys.indexOf(key) >= 0) {
          obj[key] = new Date(obj[key]).format(format);
        }
      }
    }
  }
  return arr;
};

/**
 * @desc 校验手机号
 */
ldcxzs.validatePhone = function (phone) {
  var phoneNumReg = /^1[3456789]\d{9}$/,
    phone8 = /^[0-9]{7,8}$/,
    telNumReg1 = /^(\d+-)+\d+$/,
    telNumReg2 = /^(\d+-)+\d+(\d+-)+\d+$/; //固定电话
  var flag =
    phoneNumReg.test(phone) ||
    telNumReg1.test(phone) ||
    telNumReg2.test(phone) ||
    phone8.test(phone);
  if (!flag) {
    mini.alert("电话号码格式错误");
  }
  return flag;
};
/**
 * @desc 校验纳税人识别号
 */
ldcxzs.validateNsrsbh = function (nsrsbh) {
  var reg = /^[a-zA-Z0-9\-]{0,20}$/,
    flag = reg.test(nsrsbh);
  if (!flag) {
    mini.alert("纳税人识别号格式错误");
  }
  return flag;
};

/**
 * @desc 防止多次点击
 */
ldcxzs.hasKey = function () {
  ldcxzs.key = false;
  setTimeout(function () {
    ldcxzs.key = true;
  }, 1000);
};
