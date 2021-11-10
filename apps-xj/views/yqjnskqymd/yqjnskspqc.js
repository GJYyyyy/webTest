var yqjnskspqc = {};
var $swjgdm = mini.get('zgswjg');
var apiHead = '/dzgzpt-wsys/api';

yqjnskspqc.api = {
  getSWJGDM: apiHead + '/baseCode/getUserSwjgAndAllXsSwjgWithCode', // 税务机关 dm
  handleSearch: apiHead + '/wtgl/yqjnsk/queryYqjnskspjgqdByList', // 获取延期缴纳税款审批结果清册 分页列表查询
  handleExport: apiHead + '/wtgl/yqjnsk/exportYqjnskspjgqdByExcel' // 导出
};

yqjnskspqc.swjgList = [] // 税务机关列表

yqjnskspqc.qymdGrid = ''; // table grid
yqjnskspqc.pageIndex = 0;
yqjnskspqc.pageSize = 10; /* 初始化为0 */

$(function () {
  mini.parse();
  yqjnskspqc.init();
})

/**
 * @description 请求方法封装
 * @param {*} url 请求 url
 * @param {*} type 请求类型
 * @param {*} data 参数
 * @param {*} callback 请求成功执行的回调
 */
 yqjnskspqc.request = function (url, type, data, callback) {
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
      } else {
        mini.alert(res.message || '系统异常，请稍后再试~');
      }
    },
    error: function () {
      mini.alert('系统异常，请稍后再试~');
      mini.unmask();
    }
  });
};

// 初始化
yqjnskspqc.init = function () {
  yqjnskspqc.qymdGrid = mini.get('qymdGrid')
  yqjnskspqc.swjgInit()
  yqjnskspqc.doReset()
  yqjnskspqc.doSearch()
};

// 税务机关下拉列表
yqjnskspqc.swjgInit = function () {
  $swjgdm = mini.get('zgswjg');

  $.ajax({
    url: yqjnskspqc.api.getSWJGDM,
    data: "",
    type: "post",
    async: false,
    success: function (obj) {
        var datas = mini.decode(obj);
        $swjgdm.loadList(datas, "jgDm", "PID");
        // $swjgdm.setValue(datas[0].jgDm);
        yqjnskspqc.swjgList = datas
    },
    error: function () {
    }
  });
};

yqjnskspqc.validateForm = function () {
  var filterForm = new mini.Form("#filterForm");
  filterForm.validate();
  return filterForm.isValid();
}

// 查询
yqjnskspqc.doSearch = function () {
  if (!yqjnskspqc.validateForm()) return;

  var params = {
    pageIndex: yqjnskspqc.pageIndex + 1,
    pageSize: yqjnskspqc.pageSize || yqjnskspqc.qymdGrid.getPageSize(),
    nsrsbh: mini.get('nsrsbh').getValue(), // 纳税人识别号
    nsrmc: mini.get('nsrmc').getValue(), // 纳税人名称
    sphj: mini.get('sphj').getValue(), // 审批环节
    zxZt: mini.get('zxZt').getValue(), // 执行状态
    zgswjgdm: mini.get('zgswjg').getValue(), // 主管税务机关 dm
    sfqdxy: mini.get('sfqdxy').getValue() // 是否签订电子送达协议
  }
  yqjnskspqc.request(yqjnskspqc.api.handleSearch, 'POST', params, function (res) {
    mini.unmask();
    if (res && res.value && res.value.data) {
      var dt = res.value.data,
        total = res.value.total || 0;
      yqjnskspqc.qymdGrid.setData(dt);
      yqjnskspqc.qymdGrid.setTotalCount(total);
    } else {
      yqjnskspqc.qymdGrid.setData([]);
      mini.alert(res.message || '暂无数据~', '提示');
    };
  });
}

// 重置
yqjnskspqc.doReset = function () {
  var formList = ['zgswjg', 'sphj', 'zxZt', 'nsrsbh', 'nsrmc', 'sfqdxy'];

  for (var i = 0; i < formList.length; i++) {
    mini.get(formList[i]).setValue('');
  }

  // $swjgdm.setValue(yqjnskspqc.swjgList[0].jgDm);
}

yqjnskspqc.onPageChanged = function (e) {
  yqjnskspqc.pageIndex = e.pageIndex;
  yqjnskspqc.pageSize = e.pageSize;
  yqjnskspqc.doSearch();
}

// 导出
yqjnskspqc.doExport = function () {
  if (!yqjnskspqc.validateForm()) return;

  var params = {
    nsrsbh: mini.get('nsrsbh').getValue(), // 纳税人识别号
    nsrmc: mini.get('nsrmc').getValue(), // 纳税人名称
    sphj: mini.get('sphj').getValue(), // 审批环节
    zxZt: mini.get('zxZt').getValue(), // 执行状态
    zgswjgdm: mini.get('zgswjg').getValue(), // 主管税务机关 dm
    sfqdxy: mini.get('sfqdxy').getValue() // 是否签订电子送达协议
  }
  var queryParams = '?nsrsbh=' + params.nsrsbh + '&nsrmc=' + params.nsrmc + '&sphj=' + params.sphj + '&zxZt=' + params.zxZt + '&zgswjgdm=' + params.zgswjgdm + '&sfqdxy=' + params.sfqdxy
  window.open(yqjnskspqc.api.handleExport + queryParams)
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

yqjnskspqc.beforeLoad = function (e) {
  e.cancel = true;
}