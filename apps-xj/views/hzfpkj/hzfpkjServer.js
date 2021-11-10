/**
 * Created by yanghui on 2017/9/4.
 */

var hzfpkjService = {
  mock: false
};
$.extend(hzfpkjService, {
  Api: function () {
      if (hzfpkjService.mock) {  // 假数据
          return {
              queryDtsfqy: '',
          }
      } else {  // 真实接口
          return function () {
              var baseUrl = '/dzgzpt-wsys/api/wtgl',
                  // 真实接口
                  real = {
                    getHlKjxx: '/zzsptfp/hpdk/getHlKjxx',
                    getLpDkxx: '/zzsptfp/hpdk/getLpDkxx',
                    submitHpdk: '/zzsptfp/hpdk/submitHpdk',
                    sendYj: '/zzsptfp/hpdk/sendYj'
                  };
              for (var u in real) {
                  real[u] = baseUrl + real[u];
              }
              return real
          }();
      }
  }(),
  getHlKjxx: function (params, successCallback, errCallback) {
      var url = hzfpkjService.Api.getHlKjxx;
      ajax.post(url, params, successCallback, errCallback);
  },
  getLpDkxx: function (params, successCallback, errCallback) {
    var url = hzfpkjService.Api.getLpDkxx;
    ajax.post(url, params, successCallback, errCallback);
  },
  submitHpdk: function (params, successCallback, errCallback) {
    var url = hzfpkjService.Api.submitHpdk;
    ajax.post(url, params, successCallback, errCallback);
  },
  sendYj: function (params, successCallback, errCallback) {
    var url = hzfpkjService.Api.sendYj;
    ajax.post(url, params, successCallback, errCallback);
  },
});

ajax.post = function (url,params, successCallback, errCallback) {
  $.ajax({
      url:url,
      data:params,
      contentType:"application/json",
      success:function(res){
        successCallback(res);
      },
      error:function(res){
        errCallback(res)
      }
  })
}