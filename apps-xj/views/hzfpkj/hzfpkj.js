//弹出待办事项受理页面
function openDbsxsl(url) {
  var win = mini.open({
      showMaxButton: true,
      title: "",
      url: url,
      showModal: true,
      width: "100%",
      height: "100%",
      onload: function () {
        var iframe = this.getIFrameEl();
        iframe.contentWindow.setData(hzfpkj);
      },
      ondestroy: function (action) {
          if (action == 'two' || this.loadedUrl.indexOf('success') != -1) {
            var i = parseInt(this.id.split('-')[1]) - 1;
            onCancel('ok');
            return;
          }
          if (this.loadedUrl.indexOf('success') != -1) {
          }
          if (true) {
            var iframe = this.getIFrameEl();
            if (hzfpkj.sfzhm) {
              var sfzhm = hzfpkj.sfzhm;
            } else {
              var sfzhm = mini.get('sfzhm').getValue();
              if (sfzhm == '') {
                mini.alert('请输入身份证号');
                return;
              }
              if (!validator.isSfzhm(sfzhm)) {
                mini.alert('请输入正确的身份证号');
                return;
              }
            }
            var requestData = {
              sfzjhm: sfzhm
            }
            hzfpkj.sfzhm = sfzhm;
            mini.mask('加载中...');
            hzfpkjService.getHlKjxx(mini.encode(requestData), function (res) {
              if (res.success) {
                mini.unmask();
                if (res.value.length == 0) {
                  mini.get('#hzfpkj-grid').setData([]);
                } else {
                  for (var index = 0; index < res.value.length; index++) {
                    res.value[index].xh = index + 1;          
                  }
                  mini.get('#hzfpkj-grid').setData(res.value);
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
      }
  });
}
window.alert = function(msg, callback, title) {
	//屏蔽掉代码形式的异常信息  2014-01-24 linchen
	if(msg&&msg.constructor==String){
		if(msg === "null"){
			msg = "服务器暂时无法连接，请稍后再试！";
		}
	}
	MessageUtil._msg(msg, callback, 'alert', title);
}
function onCancel(action) {
  if (window.CloseOwnerWindow)
      return window.CloseOwnerWindow(action);
  else
      window.close();
}

function onDrawSummaryCell(e) {
  var data = e.sender.getData();
  //客户端汇总计算
  if (e.field == "se") {
      var ybs = 0;
      $.each(data, function(i, obj){
        if (!isNaN(obj.se)) {
          ybs += parseFloat( obj.se||0 );
        }          
      })
      ybs = ybs.toFixed(2) ;
      e.cellHtml = "税额合计: " + ybs;
  }
}

var hzfpkj = {
  sqsj: '',
  viewdata: '',
  dksquuid: '',
  fpdm: '',
  fphm: '',
  renderDone: function(e) {
    var record = e.record;
    if (record.fplx == 'LP') {
      e.rowCls = 'hp-blue';
    } else {
      e.rowCls = 'hp-red';
    }
    if (record.nfkjhp == 'Y') {
      return "<a href='#' onclick='hzfpkj.getHzfpkj(\"" + record.djxh + "\",\"" + record.dksquuid + "\",\"" + record.fpdm + "\",\"" + record.fphm + "\",\"" + record.gt3lcslid + "\",\"" + record.dzsphm + "\",\"" + record.message + "\")'>开具红票</a>";
    }
    if (record.fplx == 'HP') {
      return "<a href='#' onclick='hzfpkj.openSendEmailPage(\"" + record.dksquuid + "\",\"" + record.fpdm + "\",\"" + record.fphm + "\")'>发送邮箱</a>";
    }
  },
  openSendEmailPage: function(dksquuid, fpdm, fphm) {
    hzfpkj.dksquuid = dksquuid;
    hzfpkj.fpdm = fpdm;
    hzfpkj.fphm = fphm;
    openDbsxsl('sendEmail.html');
  },
  cxBtn: function() {
    var sfzhm = mini.get('sfzhm').getValue();
    if (sfzhm == '') {
      mini.alert('请输入身份证号');
      return;
    }
    if (!validator.isSfzhm(sfzhm)) {
      mini.alert('请输入正确的身份证号');
      return;
    }
    var requestData = {
      sfzjhm: sfzhm
    }
    hzfpkj.sfzhm = sfzhm;
    mini.mask('加载中...');
    hzfpkjService.getHlKjxx(mini.encode(requestData), function (res) {
      if (res.success) {
        mini.unmask();
        if (res.value.length == 0) {
          mini.get('#hzfpkj-grid').setData([]);
        } else {
          for (var index = 0; index < res.value.length; index++) {
            res.value[index].xh = index + 1;          
          }
          mini.get('#hzfpkj-grid').setData(res.value);
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
  },
  getHzfpkj: function(djxh, dksquuid, fpdm, fphm, gt3lcslid, dzsphm, message){
    if (message && message != 'undefined') {
      mini.alert(message, '提示', function(){
        hzfpkj.cxBtn();
      });
    } else {
      var json = {
        dksquuid: dksquuid
      }
      mini.mask('加载中...');
      hzfpkjService.getLpDkxx(mini.encode(json), function (res) {
        if (res.success) {
          hzfpkj.djxh = djxh;
          hzfpkj.dksquuid = dksquuid;
          hzfpkj.gt3lcslid = gt3lcslid;
          hzfpkj.fpdm = fpdm;
          hzfpkj.fphm = fphm;
          hzfpkj.dzsphm = dzsphm;
          if (res.value) {
            if (res.value.lpsqsj) {
              hzfpkj.lpsqsj = mini.decode(res.value.lpsqsj);
            }
            if (res.value.lpviewdata) {
              hzfpkj.lpviewdata = mini.decode(res.value.lpviewdata);
            }        
            hzfpkj.lpsqxh = res.value.lpsqxh;
            hzfpkj.lpsqsj = mini.decode(hzfpkj.lpsqsj);
            hzfpkj.lpsqsj.dpdkHjVO.jehj = parseFloat(hzfpkj.lpsqsj.dpdkHjVO.jehj) == '0'? hzfpkj.lpsqsj.dpdkHjVO.jehj : '-' + hzfpkj.lpsqsj.dpdkHjVO.jehj;
            hzfpkj.lpsqsj.dpdkHjVO.jrljje = parseFloat(hzfpkj.lpsqsj.dpdkHjVO.jrljje) == '0'? hzfpkj.lpsqsj.dpdkHjVO.jrljje : '-' + hzfpkj.lpsqsj.dpdkHjVO.jrljje;
            hzfpkj.lpsqsj.dpdkHjVO.jshj = parseFloat(hzfpkj.lpsqsj.dpdkHjVO.jshj) == '0' ? hzfpkj.lpsqsj.dpdkHjVO.jshj : '-' + hzfpkj.lpsqsj.dpdkHjVO.jshj;
            hzfpkj.lpsqsj.dpdkHjVO.sehj = parseFloat(hzfpkj.lpsqsj.dpdkHjVO.sehj) == '0' ? hzfpkj.lpsqsj.dpdkHjVO.sehj : '-' + hzfpkj.lpsqsj.dpdkHjVO.sehj;
            hzfpkj.lpsqsj.jrljje = parseFloat(hzfpkj.lpsqsj.jrljje) == '0'? hzfpkj.lpsqsj.jrljje : '-' + hzfpkj.lpsqsj.jrljje;
            for (var index = 0; index < hzfpkj.lpsqsj.zzsptfpFpdksbdVO.fpdkSfmxGrid.fpdkSfmxGridlb.length; index++) {
              hzfpkj.lpsqsj.zzsptfpFpdksbdVO.fpdkSfmxGrid.fpdkSfmxGridlb[index].jsfyj = parseFloat(hzfpkj.lpsqsj.zzsptfpFpdksbdVO.fpdkSfmxGrid.fpdkSfmxGridlb[index].jsfyj) == '0' ? hzfpkj.lpsqsj.zzsptfpFpdksbdVO.fpdkSfmxGrid.fpdkSfmxGridlb[index].jsfyj : '-' + hzfpkj.lpsqsj.zzsptfpFpdksbdVO.fpdkSfmxGrid.fpdkSfmxGridlb[index].jsfyj;
              hzfpkj.lpsqsj.zzsptfpFpdksbdVO.fpdkSfmxGrid.fpdkSfmxGridlb[index].srze = parseFloat(hzfpkj.lpsqsj.zzsptfpFpdksbdVO.fpdkSfmxGrid.fpdkSfmxGridlb[index].srze) == '0' ? hzfpkj.lpsqsj.zzsptfpFpdksbdVO.fpdkSfmxGrid.fpdkSfmxGridlb[index].srze : '-' + hzfpkj.lpsqsj.zzsptfpFpdksbdVO.fpdkSfmxGrid.fpdkSfmxGridlb[index].srze;
              hzfpkj.lpsqsj.zzsptfpFpdksbdVO.fpdkSfmxGrid.fpdkSfmxGridlb[index].ynsfe = parseFloat(hzfpkj.lpsqsj.zzsptfpFpdksbdVO.fpdkSfmxGrid.fpdkSfmxGridlb[index].ynsfe) == '0' ? hzfpkj.lpsqsj.zzsptfpFpdksbdVO.fpdkSfmxGrid.fpdkSfmxGridlb[index].ynsfe : '-' + hzfpkj.lpsqsj.zzsptfpFpdksbdVO.fpdkSfmxGrid.fpdkSfmxGridlb[index].ynsfe;
              hzfpkj.lpsqsj.zzsptfpFpdksbdVO.fpdkSfmxGrid.fpdkSfmxGridlb[index].ybsfe = parseFloat(hzfpkj.lpsqsj.zzsptfpFpdksbdVO.fpdkSfmxGrid.fpdkSfmxGridlb[index].ybsfe) == '0' ? hzfpkj.lpsqsj.zzsptfpFpdksbdVO.fpdkSfmxGrid.fpdkSfmxGridlb[index].ybsfe : '-' + hzfpkj.lpsqsj.zzsptfpFpdksbdVO.fpdkSfmxGrid.fpdkSfmxGridlb[index].ybsfe;
              
            }
            hzfpkj.lpsqsj.zzsptfpFpdksbdVO.fpdkSqVO.dksqje = parseFloat(hzfpkj.lpsqsj.zzsptfpFpdksbdVO.fpdkSqVO.dksqje) == '0' ?hzfpkj.lpsqsj.zzsptfpFpdksbdVO.fpdkSqVO.dksqje : '-' + hzfpkj.lpsqsj.zzsptfpFpdksbdVO.fpdkSqVO.dksqje;
            hzfpkj.lpsqsj.zzsptfpFpdksbdVO.fpdkSqVO.kpje = parseFloat(hzfpkj.lpsqsj.zzsptfpFpdksbdVO.fpdkSqVO.kpje) == '0' ?hzfpkj.lpsqsj.zzsptfpFpdksbdVO.fpdkSqVO.kpje : '-' + hzfpkj.lpsqsj.zzsptfpFpdksbdVO.fpdkSqVO.kpje;
            hzfpkj.lpsqsj.zzsptfpFpdksbdVO.fpdkSqVO.ybsfe = parseFloat(hzfpkj.lpsqsj.zzsptfpFpdksbdVO.fpdkSqVO.ybsfe) == '0' ? hzfpkj.lpsqsj.zzsptfpFpdksbdVO.fpdkSqVO.ybsfe : '-' + hzfpkj.lpsqsj.zzsptfpFpdksbdVO.fpdkSqVO.ybsfe;
            
            for (var index = 0; index < hzfpkj.lpsqsj.zzsptfpFpdksbdVO.fpdkZzsptfpHlmxGrid.fpdkZzsptfpHlmxGridlb.length; index++) {
              hzfpkj.lpsqsj.zzsptfpFpdksbdVO.fpdkZzsptfpHlmxGrid.fpdkZzsptfpHlmxGridlb[index].jsxj = parseFloat(hzfpkj.lpsqsj.zzsptfpFpdksbdVO.fpdkZzsptfpHlmxGrid.fpdkZzsptfpHlmxGridlb[index].jsxj) == '0' ? hzfpkj.lpsqsj.zzsptfpFpdksbdVO.fpdkZzsptfpHlmxGrid.fpdkZzsptfpHlmxGridlb[index].jsxj : '-' + hzfpkj.lpsqsj.zzsptfpFpdksbdVO.fpdkZzsptfpHlmxGrid.fpdkZzsptfpHlmxGridlb[index].jsxj;
              hzfpkj.lpsqsj.zzsptfpFpdksbdVO.fpdkZzsptfpHlmxGrid.fpdkZzsptfpHlmxGridlb[index].je = parseFloat(hzfpkj.lpsqsj.zzsptfpFpdksbdVO.fpdkZzsptfpHlmxGrid.fpdkZzsptfpHlmxGridlb[index].je) == '0' ? hzfpkj.lpsqsj.zzsptfpFpdksbdVO.fpdkZzsptfpHlmxGrid.fpdkZzsptfpHlmxGridlb[index].je : '-' + hzfpkj.lpsqsj.zzsptfpFpdksbdVO.fpdkZzsptfpHlmxGrid.fpdkZzsptfpHlmxGridlb[index].je;
              hzfpkj.lpsqsj.zzsptfpFpdksbdVO.fpdkZzsptfpHlmxGrid.fpdkZzsptfpHlmxGridlb[index].se = parseFloat(hzfpkj.lpsqsj.zzsptfpFpdksbdVO.fpdkZzsptfpHlmxGrid.fpdkZzsptfpHlmxGridlb[index].se) == '0' ? hzfpkj.lpsqsj.zzsptfpFpdksbdVO.fpdkZzsptfpHlmxGrid.fpdkZzsptfpHlmxGridlb[index].se : '-' + hzfpkj.lpsqsj.zzsptfpFpdksbdVO.fpdkZzsptfpHlmxGrid.fpdkZzsptfpHlmxGridlb[index].se;
              hzfpkj.lpsqsj.zzsptfpFpdksbdVO.fpdkZzsptfpHlmxGrid.fpdkZzsptfpHlmxGridlb[index].xse = parseFloat(hzfpkj.lpsqsj.zzsptfpFpdksbdVO.fpdkZzsptfpHlmxGrid.fpdkZzsptfpHlmxGridlb[index].xse) == '0' ? hzfpkj.lpsqsj.zzsptfpFpdksbdVO.fpdkZzsptfpHlmxGrid.fpdkZzsptfpHlmxGridlb[index].xse : '-' + hzfpkj.lpsqsj.zzsptfpFpdksbdVO.fpdkZzsptfpHlmxGrid.fpdkZzsptfpHlmxGridlb[index].xse;
              hzfpkj.lpsqsj.zzsptfpFpdksbdVO.fpdkZzsptfpHlmxGrid.fpdkZzsptfpHlmxGridlb[index].hlsl = parseFloat(hzfpkj.lpsqsj.zzsptfpFpdksbdVO.fpdkZzsptfpHlmxGrid.fpdkZzsptfpHlmxGridlb[index].hlsl) == '0' ? hzfpkj.lpsqsj.zzsptfpFpdksbdVO.fpdkZzsptfpHlmxGrid.fpdkZzsptfpHlmxGridlb[index].hlsl : '-' + hzfpkj.lpsqsj.zzsptfpFpdksbdVO.fpdkZzsptfpHlmxGrid.fpdkZzsptfpHlmxGridlb[index].hlsl;
              hzfpkj.lpsqsj.zzsptfpFpdksbdVO.fpdkZzsptfpHlmxGrid.fpdkZzsptfpHlmxGridlb[index].jeHs = parseFloat(hzfpkj.lpsqsj.zzsptfpFpdksbdVO.fpdkZzsptfpHlmxGrid.fpdkZzsptfpHlmxGridlb[index].jeHs) == '0' ? hzfpkj.lpsqsj.zzsptfpFpdksbdVO.fpdkZzsptfpHlmxGrid.fpdkZzsptfpHlmxGridlb[index].jeHs : '-' + hzfpkj.lpsqsj.zzsptfpFpdksbdVO.fpdkZzsptfpHlmxGrid.fpdkZzsptfpHlmxGridlb[index].jeHs;
            }
            hzfpkj.lpsqsj.zzsptfpFpdksbdVO.fpdkZzsptfpVO.jshj = parseFloat(hzfpkj.lpsqsj.zzsptfpFpdksbdVO.fpdkZzsptfpVO.jshj) == '0' ? hzfpkj.lpsqsj.zzsptfpFpdksbdVO.fpdkZzsptfpVO.jshj : '-' + hzfpkj.lpsqsj.zzsptfpFpdksbdVO.fpdkZzsptfpVO.jshj;
            hzfpkj.lpsqsj.zzsptfpFpdksbdVO.fpdkZzsptfpVO.yjse = parseFloat(hzfpkj.lpsqsj.zzsptfpFpdksbdVO.fpdkZzsptfpVO.yjse) == '0' ? hzfpkj.lpsqsj.zzsptfpFpdksbdVO.fpdkZzsptfpVO.yjse : '-' + hzfpkj.lpsqsj.zzsptfpFpdksbdVO.fpdkZzsptfpVO.yjse;          
            hzfpkj.lpsqsj.zzsptfpFpdksbdVO.fpdkZzsptfpVO.lzfpdm = fpdm;
            hzfpkj.lpsqsj.zzsptfpFpdksbdVO.fpdkZzsptfpVO.lzfphm = fphm;
            hzfpkj.lpviewdata.hjse_yl.jehj = parseFloat(hzfpkj.lpviewdata.hjse_yl.jehj) == '0' ? hzfpkj.lpviewdata.hjse_yl.jehj : '-' + hzfpkj.lpviewdata.hjse_yl.jehj;
            hzfpkj.lpviewdata.hjse_yl.jshj = parseFloat(hzfpkj.lpviewdata.hjse_yl.jshj) == '0' ? hzfpkj.lpviewdata.hjse_yl.jshj : '-' + hzfpkj.lpviewdata.hjse_yl.jshj;
            hzfpkj.lpviewdata.hjse_yl.sehj = parseFloat(hzfpkj.lpviewdata.hjse_yl.sehj) == '0' ? hzfpkj.lpviewdata.hjse_yl.sehj : '-' + hzfpkj.lpviewdata.hjse_yl.sehj;
            hzfpkj.lpviewdata.jshj_yl_view.hjxx = parseFloat(hzfpkj.lpviewdata.jshj_yl_view.hjxx) == '0' ? hzfpkj.lpviewdata.jshj_yl_view.hjxx : '-' + hzfpkj.lpviewdata.jshj_yl_view.hjxx;
            hzfpkj.hwlwxxList = [];
            for (var index = 0; index < hzfpkj.lpviewdata['lwhwYl-grid'].length; index++) {
              if (hzfpkj.lpviewdata['lwhwYl-grid'][index].hwlwmc) {
                hzfpkj.lpviewdata['lwhwYl-grid'][index].hlsl = parseFloat(hzfpkj.lpviewdata['lwhwYl-grid'][index].hlsl) == '0' ? hzfpkj.lpviewdata['lwhwYl-grid'][index].hlsl : '-' + hzfpkj.lpviewdata['lwhwYl-grid'][index].hlsl;
                hzfpkj.lpviewdata['lwhwYl-grid'][index].je = parseFloat(hzfpkj.lpviewdata['lwhwYl-grid'][index].je) == '0' ? hzfpkj.lpviewdata['lwhwYl-grid'][index].je : '-' + hzfpkj.lpviewdata['lwhwYl-grid'][index].je;
                hzfpkj.lpviewdata['lwhwYl-grid'][index].jeHs = parseFloat(hzfpkj.lpviewdata['lwhwYl-grid'][index].jeHs) == '0' ? hzfpkj.lpviewdata['lwhwYl-grid'][index].jeHs : '-' + hzfpkj.lpviewdata['lwhwYl-grid'][index].jeHs;
                hzfpkj.lpviewdata['lwhwYl-grid'][index].se = parseFloat(hzfpkj.lpviewdata['lwhwYl-grid'][index].se) == '0' ? hzfpkj.lpviewdata['lwhwYl-grid'][index].se : '-' + hzfpkj.lpviewdata['lwhwYl-grid'][index].se;
                hzfpkj.lpviewdata['lwhwYl-grid'][index].jsxj = parseFloat(hzfpkj.lpviewdata['lwhwYl-grid'][index].jsxj) == '0' ? hzfpkj.lpviewdata['lwhwYl-grid'][index].jsxj : '-' + hzfpkj.lpviewdata['lwhwYl-grid'][index].jsxj;
                hzfpkj.lpviewdata['lwhwYl-grid'][index].xse = parseFloat(hzfpkj.lpviewdata['lwhwYl-grid'][index].xse) == '0' ? hzfpkj.lpviewdata['lwhwYl-grid'][index].xse : '-' + hzfpkj.lpviewdata['lwhwYl-grid'][index].xse;              
                hzfpkj.hwlwxxList.push(hzfpkj.lpviewdata['lwhwYl-grid'][index]);
              }            
            }
            hzfpkj.lpviewdata.ylHj.jehj = parseFloat(hzfpkj.lpviewdata.ylHj.jehj) == '0' ? hzfpkj.lpviewdata.ylHj.jehj : '-' + hzfpkj.lpviewdata.ylHj.jehj;
            hzfpkj.lpviewdata.ylHj.jshj = parseFloat(hzfpkj.lpviewdata.ylHj.jshj) == '0' ? hzfpkj.lpviewdata.ylHj.jshj : '-' + hzfpkj.lpviewdata.ylHj.jshj;
            hzfpkj.lpviewdata.ylHj.sehj = parseFloat(hzfpkj.lpviewdata.ylHj.sehj) == '0' ? hzfpkj.lpviewdata.ylHj.sehj : '-' + hzfpkj.lpviewdata.ylHj.sehj;
            hzfpkj.lpviewdata.ylHj.hjxx = '-' + hzfpkj.lpviewdata.ylHj.hjxx;
            for (var index = 0; index < hzfpkj.lpviewdata['ynskxx-yl-grid'].length; index++) {
              hzfpkj.lpviewdata['ynskxx-yl-grid'][index].jsyj = parseFloat(hzfpkj.lpviewdata['ynskxx-yl-grid'][index].jsyj) == '0' ? hzfpkj.lpviewdata['ynskxx-yl-grid'][index].jsyj : '-' + hzfpkj.lpviewdata['ynskxx-yl-grid'][index].jsyj;
              hzfpkj.lpviewdata['ynskxx-yl-grid'][index].se = parseFloat(hzfpkj.lpviewdata['ynskxx-yl-grid'][index].se) == '0' ? hzfpkj.lpviewdata['ynskxx-yl-grid'][index].se : '-' + hzfpkj.lpviewdata['ynskxx-yl-grid'][index].se;
            }
            hzfpkj.lpsqsj.zzsptfpFpdksbdVO.fpdkZzsptfpVO.bz = '代开企业税号：' + hzfpkj.lpsqsj.zzsptfpFpdksbdVO.fpdkZzsptfpVO.xhfsfzjhm + '；代开企业名称：' + hzfpkj.lpsqsj.zzsptfpFpdksbdVO.fpdkZzsptfpVO.xhfnsrmc + '；对应正数发票代码：' + hzfpkj.fpdm + ' 号码：' + hzfpkj.fphm;
            hzfpkj.lpviewdata.bz_yl_form.bz = '代开企业税号：' + hzfpkj.lpsqsj.zzsptfpFpdksbdVO.fpdkZzsptfpVO.xhfsfzjhm + '；代开企业名称：' + hzfpkj.lpsqsj.zzsptfpFpdksbdVO.fpdkZzsptfpVO.xhfnsrmc + '；对应正数发票代码：' + hzfpkj.fpdm + ' 号码：' + hzfpkj.fphm;
            hzfpkj.lpviewdata.xhfxx_yl.bz = '代开企业税号：' + hzfpkj.lpsqsj.zzsptfpFpdksbdVO.fpdkZzsptfpVO.xhfsfzjhm + '；代开企业名称：' + hzfpkj.lpsqsj.zzsptfpFpdksbdVO.fpdkZzsptfpVO.xhfnsrmc + '；对应正数发票代码：' + hzfpkj.fpdm + ' 号码：' + hzfpkj.fphm;
            mini.unmask();
            openDbsxsl('hzfpkjxq.html');
          } else {
            mini.unmask();
            mini.alert('未查询到蓝票信息');
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
  }
}