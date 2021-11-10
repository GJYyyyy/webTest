var yqjnskqymd = {};
var apiHead = '/dzgzpt-wsys/api';

yqjnskqymd.api = {
  getSWJGDM: apiHead + '/baseCode/getUserSwjgAndAllXsSwjgWithCode', // 税务机关 dm
  downloadTemplate: '/dzgzpt-wsys/dzgzpt-wsys/apps/data/yqjnskqymd.xls', // 延期税款缴纳企业名单Excel 模板下载
  handleImport: apiHead + '/wtgl/yqjnsk/uploadYqjnskmdByExcel', // 延期税款缴纳企业名单Excel导入
  getList: apiHead + '/wtgl/yqjnsk/queryYqjnskmdByList', // 延期税款缴纳企业名单 分页列表查询
  handleExport: apiHead + '/wtgl/yqjnsk/exportYqjnskmdByExcel' // 延期税款缴纳企业名单Excel导出
};

yqjnskqymd.pageIndex = 0;
yqjnskqymd.pageSize = 10;

$(function () {
  mini.parse();
  yqjnskqymd.doReset();
  yqjnskqymd.swjgInit();
  yqjnskqymd.handleGetTableData();
})

/**
 * @description 请求方法封装
 * @param {*} url 请求 url
 * @param {*} type 请求类型
 * @param {*} data 参数
 * @param {*} callback 请求成功执行的回调
 */
yqjnskqymd.request = function (url, type, data, callback) {
  mini.mask('正在查询，请稍后...');

  $.ajax({
    type,
    data: type === 'POST' || type === 'post' ? mini.encode(data) : data,
    url,
    contentType: 'application/json;charset=utf-8',
    success: function (res) {
      mini.unmask();
      if (res && res.success) {
        callback(res)
      } else if (!res.success && !res.value) {
        yqjnskqymd.message(res.message || '上传失败');
      } else {
        mini.alert(res.message || '系统异常，请稍后再试~');
      }
    },
    error: function () {
      mini.alert('系统异常，请稍后再试~');
      mini.unmask();
    }
  });
}

// 税务机关下拉列表
yqjnskqymd.swjgInit = function () {
  $swjgdm = mini.get('zgswjgdm');

  $.ajax({
    url: yqjnskqymd.api.getSWJGDM,
    data: "",
    type: "post",
    async: false,
    success: function (obj) {
        var datas = mini.decode(obj);
        $swjgdm.loadList(datas, "jgDm", "PID");
        // $swjgdm.setValue(datas[0].jgDm);
        yqjnskqymd.swjgList = datas
    },
    error: function () {
    }
  });
};

yqjnskqymd.handleDownloadTemplate = function () {
  window.location.href = yqjnskqymd.api.downloadTemplate
}

yqjnskqymd.validateForm = function () {
  var filterForm = new mini.Form("#filterForm");
  filterForm.validate();
  return filterForm.isValid();
}

// 获取 table 数据
yqjnskqymd.handleGetTableData = function () {
  if (!yqjnskqymd.validateForm()) return;

  var drrqq = mini.get('drrqq').getValue()
  var drrqz = mini.get('drrqz').getValue()

  if ((drrqq && !drrqz) || (!drrqq && drrqz)) {
    mini.alert('导入日期请填写完整', '提示');
    return
  }

  var grid = mini.get('qymdGrid')
  var params = {
    pageIndex: yqjnskqymd.pageIndex + 1,
    pageSize: yqjnskqymd.pageSize || grid.getPageSize(),
    zgswjgdm: mini.get('zgswjgdm').getValue(),
    nsrsbh: mini.get('nsrsbh').getValue(),
    nsrmc: mini.get('nsrmc').getValue(),
    lrrqQ: mini.formatDate(drrqq, 'yyyy-MM-dd'),
    lrrqZ: mini.formatDate(drrqz, 'yyyy-MM-dd')
  }
  yqjnskqymd.request(yqjnskqymd.api.getList, 'POST', params, function (res) {
    if (res && res.value && res.value.data) {
      grid.setData(res.value.data);
      grid.setTotalCount(res.value.total);
    } else {
      grid.setData([]);
      mini.alert(res.message || '暂无数据~', '提示');
    };
  });
};

yqjnskqymd.isExcel = function (filepath) {
  var extStart = filepath.lastIndexOf(".");
  var ext = filepath.substring(extStart, filepath.length).toLowerCase()
  if (ext !== ".xlsx" && ext !== ".xls" && ext !== ".xlsm") {
    yqjnskqymd.message("文件只能是xlsx,xls,xlsm格式");
    return false;
  }
  return true;
}

// 开始导入
yqjnskqymd.startUpload = function () {
  if (!yqjnskqymd.isExcel(mini.get('file1').getValue())) return
  
  $.ajaxFileUpload({
    url: yqjnskqymd.api.handleImport,      //用于文件上传的服务器端请求地址
    fileElementId: "file1",               //文件上传域的ID
    //data: { a: 1, b: true },            //附加的额外参数
    dataType: 'json',                   //返回值类型 一般设置为json
    async: false,
    success: function (res, status) {    //服务器成功响应处理函数
      if (res.success) {
        yqjnskqymd.message("上传成功");
      } else {
        yqjnskqymd.message(res.message)
      }
      // else if (!res.success && !res.value) {
      //   yqjnskqymd.message(res.message || '上传失败');
      // } else {
      //   var errorTips = '<p class="text-align-center">名单导入信息错误:</p>'
      //   var errorMap = {
      //     '0': '关键数据为空;',
      //     '1': '登记序号重复;'
      //   }
      //   if(res.value.length) {
      //     for (var i = 0; i < res.value.length; i++) {
      //       var rowData = res.value[i]
      //       errorTips += '<p class="text-align-center">' + parseInt(i + 1) +  '、第' + rowData.rowNum + '行' + errorMap[rowData.illegalMessageType] + '</p>\n'
      //     }
  
      //     yqjnskqymd.message(errorTips);
      //   } else {
      //     yqjnskqymd.message(res.message)
      //   }
      // }
    },
    error: function (data, status, e) {   //服务器响应失败处理函数
      console.log(data, status, e);
      mini.alert(data ? data.message : "接口异常，请稍候再试");
    }
  });
}

// 导入
yqjnskqymd.importTable = function () {
  $(".mini-htmlfile .mini-htmlfile-file").click();
};

// 导出
yqjnskqymd.exportTable = function () {
  if (!yqjnskqymd.validateForm()) return;

  var drrqq = mini.get('drrqq').getValue()
  var drrqz = mini.get('drrqz').getValue()

  if ((drrqq && !drrqz) || (!drrqq && drrqz)) {
    mini.alert('导入日期请填写完整', '提示');
    return
  }
  var params = {
    zgswjgdm: mini.get('zgswjgdm').getValue(),
    nsrsbh: mini.get('nsrsbh').getValue(),
    nsrmc: mini.get('nsrmc').getValue(),
    lrrqQ: mini.formatDate(drrqq, 'yyyy-MM-dd'),
    lrrqZ: mini.formatDate(drrqz, 'yyyy-MM-dd')
  }
  window.open(yqjnskqymd.api.handleExport + '?zgswjgdm=' + params.zgswjgdm + '&nsrsbh=' + params.nsrsbh + '&nsrmc=' + params.nsrmc + '&lrrqQ=' + params.lrrqQ + '&lrrqZ=' + params.lrrqZ);
};

yqjnskqymd.onPageChanged = function (e) {
  yqjnskqymd.pageIndex = e.pageIndex;
  yqjnskqymd.pageSize = e.pageSize;
  yqjnskqymd.handleGetTableData();
}

yqjnskqymd.message = function (msg) {
  mini.confirm(msg, "提示",
    function (action) {            
        // if (action == "ok") {
        //   callback(true)
        // } else {
        //   callback(true)
        // }
      window.location.reload()
    }
  );
}

// 重置
yqjnskqymd.doReset = function () {
  var formList = ['zgswjgdm', 'drrqq', 'drrqz', 'nsrsbh', 'nsrmc'];

  for (var i = 0; i < formList.length; i++) {
    mini.get(formList[i]).setValue('');
  }

  // $swjgdm.setValue(yqjnskspqc.swjgList[0].jgDm);
}

yqjnskqymd.beforeLoad = function (e) {
  e.cancel = true;
}

function nsrsbhValidate(e) {
  if (e.value == false) return;
  if (e.isValid) {
    if (!/^[a-zA-Z0-9\-]{15,20}$/.test(e.value)) {
      e.errorText = "社会信用代码必须为15到20位的字母或数字以及“—”！";
      e.isValid = false;
      return;
    }
  }
}