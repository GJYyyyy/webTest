$(function() {
  gldUtil.addWaterInPages();
  mini.parse();
  sbbcx.init();
});

var sbbcx = {
  selectMaps: [],
  qyztData: [
    { ID: "06", MC: "清算" },
    { ID: "03", MC: "取消清算" },
    { ID: "07", MC: "注销" }
  ],
  blqdData: [
    {
      ID: "j3hxzg",
      MC: "金三核心征管"
    },
    {
      ID: "dzswj",
      MC: "电子税务局纳税人端"
    }
  ],
  init: function() {
    this.qymdGrid = mini.get("qymdGrid");
    this.qymdFrom = new mini.Form("#qymdFrom");

    mini.get("qyzt").setData(sbbcx.qyztData);
    mini.get("blqd").setData(sbbcx.blqdData);
    var date = new Date();
    mini.get("blrqQ").setValue(new Date(date.getFullYear(), 0, 1));
    mini.get("blrqZ").setValue(new Date());
    this.qsyyInit();
    // this.doSearch();
  },
  swjgInit: function() {
    // 税务机关下拉
    var $swjgdm = mini.get("zgswjg");
    $.ajax({
      url: "../../../../api/baseCode/getUserSwjgAndAllXsSwjgWithCode",
      data: "",
      type: "POST",
      success: function(obj) {
        var datas = mini.decode(obj);
        $swjgdm.loadList(datas, "jgDm", "PID");
        $swjgdm.setValue(datas[0].jgDm);
        /*swjgDm = datas[0].YXW;
                $swjgdm.setValue(swjgDm);*/
      },
      error: function() {}
    });
  },
  qsyyInit: function() {
    var $qsyy = mini.get("qsyy");
    $.ajax({
      url: "/dzgzpt-wsys/api/baseCode/get/baseCode2CombSelect/DM_DJ_QSYY",
      data: "",
      type: "get",
      success: function(obj) {
        var datas = mini.decode(obj);
        datas.push({ ID: "99", MC: "无数据" });
        $qsyy.setData(datas);
      },
      error: function() {}
    });
  },
  sqrqQChange: function(e) {
    mini.get("sqrqZ").setMinDate(e.value);
  },
  sqrqZChange: function(e) {
    mini.get("sqrqQ").setMaxDate(e.value);
  },
  doSearch: function() {
    sbbcx.qymdFrom.validate();
    if (!sbbcx.qymdFrom.isValid()) {
      return false;
    }
    var formData = sbbcx.qymdFrom.getData(true);
    var qsbarQ = mini.get("qsbarQ").value,
      qsbarZ = mini.get("qsbarZ").value,
      qsjsrQ = mini.get("qsjsrQ").value,
      qsjsrZ = mini.get("qsjsrZ").value,
      blrqQ = mini.get("blrqQ").value,
      blrqZ = mini.get("blrqZ").value;
    if (qsbarQ && qsbarZ && !sbbcx.completeDate(qsbarQ, qsbarZ, 12)) {
      mini.alert("清算备案时间跨区超过12个月，请重新选择", "温馨提示");
      return;
    }
    if (qsjsrQ && qsjsrZ && !sbbcx.completeDate(qsjsrQ, qsjsrZ, 12)) {
      mini.alert("清算结束时间跨区超过12个月，请重新选择", "温馨提示");
      return;
    }
    if (blrqQ && blrqZ && !sbbcx.completeDate(blrqQ, blrqZ, 12)) {
      mini.alert("办理日期时间跨区超过12个月，请重新选择", "温馨提示");
      return;
    }
    var formData = sbbcx.qymdFrom.getData(true);
    var param = mini.decode(formData);
    sbbcx.qymdGrid.setUrl("/dzgzpt-wsys/api/sh/qysdsqsbb/query/qsbbqcList");
    sbbcx.qymdGrid.load(
      {
        nsrsbh: param.nsrsbh, //"纳税人识别号"
        nsrmc: param.nsrmc, //"纳税人名称"
        qsyy: param.qsyy, //"清算原因"
        qsbarq: param.qsbarQ, //"清算备案日起"
        qsbarz: param.qsbarZ, //"清算备案日止"
        qsjsrq: param.qsjsrQ, //"清算结束日起"
        qsjsrz: param.qsjsrZ, //"清算结束日止"
        qyzt: param.qyzt, //"企业状态"
        ywbll: param.ywbll, //业务办理量
        // "ywnll": Number(0),      //业务办理量
        fddbrxm: param.fddbrxm, //"法定代表人姓名"
        jbr: param.jbr, //"经办人"
        zgswjg: param.swjgdm, //"主管税务机关"
        blsjq: param.blrqQ, //"办理时间起"
        blsjz: param.blrqZ, //"办理时间止"
        blqd: param.blqd //"办理渠道"
      },
      function(res) {
        //按清算时长倒序排列
        var sortedData = res.data.sort(function(a, b) {
          return parseInt(b.qssc) - parseInt(a.qssc);
        });
        sbbcx.qymdGrid.setData(sortedData);
      },
      function(data) {
        var obj = JSON.parse(data.errorMsg);
        mini.alert(obj.message || "系统异常,请稍后再试。");
      }
    );
  },
  //判断两个时间段是否相差 m 个月
  completeDate: function(time1, time2, m) {
    var diffyear = time2.getFullYear() - time1.getFullYear();
    var diffmonth = diffyear * 12 + time2.getMonth() - time1.getMonth();
    if (diffmonth < 0) {
      return false;
    }

    var diffDay = time2.getDate() - time1.getDate();

    if (diffmonth < m || (diffmonth == m && diffDay <= 0)) {
      if (diffmonth == m && diffDay == 0) {
        var timeA =
          time1.getHours() * 3600 +
          60 * time1.getMinutes() +
          time1.getSeconds();
        var timeB =
          time2.getHours() * 3600 +
          60 * time2.getMinutes() +
          time2.getSeconds();
        if (timeB - timeA > 0) {
          return false;
        }
      }
      return true;
    }
    return false;
  },
  doReset: function() {
    sbbcx.qymdFrom.reset();
    sbbcx.qymdGrid.setData("");
  },
  exportFpqd: function() {
    if (
      sbbcx.qymdGrid == null ||
      sbbcx.qymdGrid == "" ||
      !sbbcx.qymdGrid.data.length
    ) {
      mini.alert("查询无数据，无法导出！");
      return;
    }
    if (sbbcx.qymdGrid.totalCount > 5000) {
      mini.alert("数据超过5000条，请增加查询条件，缩小数据范围。");
      return;
    }
    mini.confirm("确认是否导出？", "提示", function(action) {
      if (action == "ok") {
        var pageIndex = sbbcx.qymdGrid.pageIndex;
        var pageSize = sbbcx.qymdGrid.pageSize;
        var nsrsbh = mini.get("nsrsbh").value;
        var nsrmc = mini.get("nsrmc").value;
        var qsyy = mini.get("qsyy").value;
        var qsbarQ = mini.formatDate(mini.get("qsbarQ").value, "yyyy-MM-dd");
        var qsbarZ = mini.formatDate(mini.get("qsbarZ").value, "yyyy-MM-dd");
        var qsjsrQ = mini.formatDate(mini.get("qsjsrQ").value, "yyyy-MM-dd");
        var qsjsrZ = mini.formatDate(mini.get("qsjsrZ").value, "yyyy-MM-dd");
        var ywbll = mini.get("ywbll").value;
        var fddbrxm = mini.get("fddbrxm").value;
        var jbr = mini.get("jbr").value;
        var zgswjgDm = mini.get("swjgdm").value;
        var blsjQ = mini.formatDate(mini.get("blrqQ").value, "yyyy-MM-dd");
        var blsjZ = mini.formatDate(mini.get("blrqZ").value, "yyyy-MM-dd");
        var blqd = mini.get("blqd").value;
        var qyzt = mini.get("qyzt").value;

        window.open(
          "/dzgzpt-wsys/api/sh/qysdsqsbb/export/qysdsqsbb?nsrsbh=" +
            nsrsbh +
            "&nsrmc=" +
            mini.encode(nsrmc) +
            "&qsyy=" +
            qsyy +
            "&qsbarq=" +
            qsbarQ +
            "&qsbarz=" +
            qsbarZ +
            "&zgswjg=" +
            zgswjgDm +
            "&qsjsrq=" +
            qsjsrQ +
            "&qsjsrz=" +
            qsjsrZ +
            "&ywbll=" +
            ywbll +
            "&fddbrxm=" +
            mini.encode(fddbrxm) +
            "&jbr=" +
            mini.encode(jbr) +
            "&blsjq=" +
            blsjQ +
            "&blsjz=" +
            blsjZ +
            "&blqd=" +
            blqd +
            "&pageSize=" +
            pageSize +
            "&pageIndex=" +
            pageIndex +
            "&qyzt=" +
            qyzt
        );
      } else {
        return;
      }
    });
  },
  openTcxq: function(record) {
    mini.open({
      url: "./mxjl.html", //页面地址
      title: "企业所得税清算报备明细", //标题
      iconCls: "", //标题图标
      width: "98%", //宽度
      height: "98%", //高度
      allowResize: true, //允许尺寸调节
      allowDrag: true, //允许拖拽位置
      showCloseButton: true, //显示关闭按钮
      showMaxButton: true, //显示最大化按钮
      showModal: true, //显示遮罩
      currentWindow: false, //是否在本地弹出页面,默认false
      effect: "none", //打开和关闭时的特果:'none','slow','fast',默认'none'
      onload: function() {
        //弹出页面加载完成
        var iframe = this.getIFrameEl();
        //调用弹出页面方法进行初始化
        iframe.contentWindow.setData(record);
      },
      ondestroy: function(action) {
        //弹出页面关闭前
        // clcl.queryYjlx();
      }
    });
  },
  //复选框选中时记录所选数据
  onSelectoinChanged: function(e) {
    var rows = sbbcx.qymdGrid.getSelecteds();
    sbbcx.selectMaps[sbbcx.qymdGrid.getPageIndex()] = rows;
  }
};

function onActionRendererYq(e) {
  var record = e.record;
  return Number(record.ywbll) !== 1
    ? '<a class="link-ywl" onclick="sbbcx.openTcxq(record)" href ="#">' +
        record.ywbll +
        "</a>"
    : record.ywbll;
}
function onActionRendererQs(e) {
  var record = e.record;
  return record.qyzt == "正常" ? "取消清算" : record.qyzt;
}
function onActionRendererQd(e) {
  var record = e.record;
  switch (record.blqdMc) {
    case "线上":
      return "电子税务局纳税人端";
    case "线下":
      return "金三核心征管";
    default:
      return "";
  }
}

function onActionRendererSbh(e) {
  var record = e.record;
  return record.shxydm ? record.shxydm : record.nsrsbh;
}

//form展示隐藏
$(document).ready(function() {
  $(".search").click(function() {
    showsearch();
  });
  // $(".search").click();
});
function showsearch() {
  if ($(".searchdiv").is(":hidden")) {
    $(".searchdiv").slideDown();
    $(".searchC").html("显示查询条件");
  } else {
    $(".searchdiv").slideUp();
    $(".searchC").html("隐藏查询条件");
  }
}

function nsrsbhValidate(e) {
  if (e.value == false) return;
  if (e.isValid) {
    if (!/^[a-zA-Z0-9\-]{15,20}$/.test(e.value)) {
      e.errorText = "社会信用代码必须为15到20位的字母或数字！";
      e.isValid = false;
      return;
    }
  }
}

/**
 * 清算时长大于等于60天的数据进行标红显示
 * 清算时长大于等于50小于等于59天的数据进行标黄显示
 */
function drawRowBgColor(e) {
  var qssc = e.record.qssc;
  if (qssc >= "60") {
    e.rowStyle = "background:#FEE2F0";
  }

  if (qssc >= 50 && qssc <= 59) {
    e.rowStyle = "background:#FFFFD6";
  }
}
