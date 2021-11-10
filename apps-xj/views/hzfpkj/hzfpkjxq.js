function setData(hzfpkj) {
  $('#lzfpdm').text(hzfpkj.fpdm);//蓝字发票代码
  $('#lzfphm').text(hzfpkj.fphm);//蓝字发票号码
  $('#nsrmc').text(hzfpkj.lpviewdata['gh-info'].ghfNsrmc);//名称
  $('#nsrsh').text(hzfpkj.lpviewdata['gh-info'].ghfNsrsbh);//税号
  $('#dhjdz').text(hzfpkj.lpviewdata['gh-info'].ghfLxdh + '  ' + hzfpkj.lpviewdata['gh-info'].ghfDz);//电话及地址
  $('#khyhjzh').text(hzfpkj.lpviewdata['gh-info'].yhyywdDmText + '  ' + hzfpkj.lpviewdata['gh-info'].ghfYhkhzh);//开户银行及账号
  
  mini.get('#hp-hwlwxx-grid').setData(hzfpkj.hwlwxxList);
  mini.get('#hp-fjs-grid').setData(hzfpkj.lpviewdata['ynskxx-yl-grid']);
  //$('#bzxx').text(hzfpkj.lpsqsj.zzsptfpFpdksbdVO.fpdkZzsptfpVO.bz);//备注信息
  $('#xhfxxmc').text(hzfpkj.lpviewdata['xhfxx_yl'].nsrmc);//销货方名称
  $('#xhfxxsh').text(hzfpkj.lpviewdata['xhfxx_yl'].nsrsbh);//销货方税号
  $('#dhjdz2').text(hzfpkj.lpviewdata['xhfxx_yl'].jbrdh + '  ' + hzfpkj.lpviewdata['xhfxx_yl'].scjydz);//销货方电话及地址
  $('#khyhjzh2').text(hzfpkj.lpviewdata['xhfxx_yl'].khyhlbText + '  ' + hzfpkj.lpviewdata['xhfxx_yl'].yhzh);//销货方开户银行及账号
  //$('#bzxx').text('对应正数发票代码:' + parent.hzfpkj.fpdm + ' 号码:' + parent.hzfpkj.fphm);
  $('#bzxx').text('代开企业税号：' + hzfpkj.lpsqsj.zzsptfpFpdksbdVO.fpdkZzsptfpVO.xhfsfzjhm + '；代开企业名称：' + hzfpkj.lpsqsj.zzsptfpFpdksbdVO.fpdkZzsptfpVO.xhfnsrmc + '；对应正数发票代码：' + hzfpkj.fpdm + ' 号码：' + hzfpkj.fphm);
  window.json = {
    sqsj: hzfpkj.lpsqsj,//申请数据
    viewdata: hzfpkj.lpviewdata,//预览数据
    gt3lcslid: hzfpkj.gt3lcslid,//金三流程受理ID
    lpsqxh: hzfpkj.lpsqxh, //蓝票申请序号
    lpdksquuid: hzfpkj.dksquuid,//蓝票代开申请UUID
    lpfpdm: hzfpkj.fpdm, //蓝票发票代码
    lpfphm: hzfpkj.fphm, //蓝票发票号码
    lpdzsphm: hzfpkj.dzsphm, //蓝票电子税票号码
    djxh: hzfpkj.djxh, //登记序号
  }
  window.sfzhm = hzfpkj.sfzhm
}
hzfpkj.hzfpkjBtn = function(){
  mini.mask('加载中...');
  hzfpkjService.submitHpdk(encodeURIComponent(encodeURIComponent(mini.encode(json))), function (res) {
    if (res.success) {
      mini.unmask();
      //成功页面
      if (res.value) {
        hzfpkj.emailluuid = res.value.dksquuid;
        hzfpkj.hpfpdm = res.value.fpdm;
        hzfpkj.hpfphm = res.value.fphm;
        hzfpkj.sfzhm = sfzhm;
        openDbsxsl('success.html');
      } else {
        mini.alert(res.message);
      }        
    } else {
      mini.unmask();
      mini.alert(res.message);
    }
  },function(err){
    mini.unmask();
    mini.alert('接口出错','提示信息',function(){
      onCancel('ok');
    });
  })
}