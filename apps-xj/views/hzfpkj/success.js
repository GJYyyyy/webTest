function setData(hzfpkj) {
  $('#hzfpdm').text(hzfpkj.hpfpdm);
  $('#hzfphm').text(hzfpkj.hpfphm);
  window.emailluuid = hzfpkj.emailluuid;
}

hzfpkj.sendEmail = function() {
  var hzfpkjEmail = mini.get('#hzfpkjEmail').getValue();
  if (hzfpkjEmail == '') {
    mini.alert('请输入邮箱');
    return;
  }
  if (!validator.isEmail(hzfpkjEmail)) {
    mini.alert('请输入正确的邮箱');
    return;
  }
  var json = {
    mailAddress: hzfpkjEmail,//邮箱地址
    dksquuid: emailluuid//代开申请UUID
  }
  mini.mask('加载中...');
  hzfpkjService.sendYj(mini.encode(json), function (res) {
    if (res.success) {
      mini.unmask();
      mini.alert('发送成功', '提示', function(){
        onCancel('two');
      })
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