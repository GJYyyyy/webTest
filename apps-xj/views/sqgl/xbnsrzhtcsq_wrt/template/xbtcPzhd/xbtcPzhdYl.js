var cellcommitedit = function(e){
  if(e.field === 'lxkpsx' ){
    var lxkpsx = Number(e.value);
    if(isNaN(lxkpsx)){
      mini.alert('离线开票时限必须输入数字！');
      e.cancel = true;
    }else{
      e.value = lxkpsx;
    }
  }
  if(e.field === 'lxkpljxe' ){
    var lxkpljxe = Number(e.value);
    if(isNaN(lxkpljxe)){
      mini.alert('离线开票累计限额必须输入数字！');
      e.cancel = true;
    }else{
      e.value = lxkpljxe;
    }
  }
};
$(function () {
  var viewData = mini.decode(sxsl_store.sqsxData.viewData);
  mini.parse();
  mini.get('tabs').removeTab(1);
  $('#bzzlBtn').hide();
  mini.get('gzpz_grid_yl').setData(viewData.showLpContent);//领票数据
  mini.get('lpryl_grid').setData(viewData.showGprList);//购票人grid
});
