/**
 * Created by chenjunj on 2018/11/13 20:10.
 */
$(function () {
  //11010201
  mini.parse();
  mini.get("tabs").updateTab(mini.get("tabs").getTab(1), { visible: false });
  var jbxx = parent.sxslcommon.swsxsqJbxx;
  var djxh = jbxx.djxh;
  $('#shxydm').html(jbxx.sqr);
  $('.nsrmc').html(jbxx.nsrmc);
  var blxx = mini.decode(parent.xbtcGrid.findRow(function (row) {
    return row.swsxDm === '110101' || row.swsxDm === '110121';
  }).data).blxx;
  blxx = mini.decode(blxx);
  var zgswskfjDm = blxx.zgswskfjDm;
  var ybnsrdjObj = parent.xbtcGrid.findRow(function (row) {
    return row.swsxDm === '110113';
  });
  var isYbnsr = '';
  if(!ybnsrdjObj){
    isYbnsr = 'N';
  }else{
    isYbnsr = 'Y';
  }
  $.ajax({
    url: '/dzgzpt-wsys/api/wtgl/xbnsrzhtcsq/getRecommendSfzrdList',//接口待定
    type: 'post',
    data: {
      djxh: djxh,
      swjgDm: zgswskfjDm,
      isYbnsr: isYbnsr
    },
    async: false,
    success: function (response) {
      if(response.success){
        mini.get('sfz_grid').setData(response.value)
      }
    },
    error: function () {
      mini.alert('获取税费种推荐失败！');
    }
  });
});
