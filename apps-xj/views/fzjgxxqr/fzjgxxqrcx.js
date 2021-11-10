$(function () {
  gldUtil.addWaterInPages();
  $(".search").click(function () {
    showsearch();
  });
  mini.parse();
  fzjgObj.init();
});

var apiService = {
  // 查询信息
  getGridData: "/dzgzpt-wsys/api/sh/fzjgdlns/query/sqjl",
}

var fzjgObj = {
  cxGrid: null,
  cxtjForm: null,
  sqrqQ: null,
  sqrqZ: null,
  param: null,
  init: function () {
    this.cxGrid = mini.get("cxGrid");
    this.cxtjForm = new mini.Form("#cxtjForm");
    this.yydWin = mini.get("yyd-win")

    this.sqrqQ = mini.get("sqrqQ").getValue()
    this.sqrqZ = mini.get("sqrqZ").getValue()
  },
  onShrqqChanged: function (e) {
    var sqrqZ = mini.get("sqrqZ");
    sqrqZ.setMinDate(e.value);
  },
  doSearch: function () {
    if (this.sqrqQ.value > this.sqrqZ.value) {
      mini.alert("申请日期起大于申请日期止，请重新选择！", "提示");
      return
    }
    var formData = this.cxtjForm.getData(true);
    fzjgObj.cxGrid.setUrl(apiService.getGridData);
    fzjgObj.cxGrid.load(formData, function () {
      $(".searchdiv").slideUp();
    }, function (data) {
      var obj = JSON.parse(data.errorMsg);
      mini.alert(obj.message || "系统异常,请稍后再试。")
    });
  },
  doReset: function () {
    this.cxGrid.setData("")
    this.cxtjForm.reset()
  }
};

function showsearch() {
  if ($(".searchdiv").is(":hidden")) {
    $(".searchdiv").slideDown();
    $(".searchC").html("隐藏查询条件");
  } else {
    $(".searchdiv").slideUp();
    $(".searchC").html("显示查询条件");
  }
}