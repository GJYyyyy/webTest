/**
 * Created by yanghui on 2017/9/4.
 */

var yjbsService = {
    mock: false
};
$.extend(yjbsService, {
    Api: function () {
        if (yjbsService.mock) {  // 假数据
            return {
                queryDtsfqy: '../../data/queryDtsfqy.json',
            }
        } else {  // 真实接口
            return function () {
                var baseUrl = '/dzgzpt-wsys',
                    // 真实接口
                    real = {
                        getAllSljd: '/api/xjYjbs/getSljd',
                        checkYjbsSlr:'/api/xjYjbs/checkYjbsSlr'
                    };

                for (var u in real) {
                    real[u] = baseUrl + real[u];
                }
                return real
            }();
        }
    }(),
    getAllSljd: function (params, successCallback, errCallback) {
        var url = yjbsService.Api.getAllSljd;
        ajax.post(url, params, successCallback, errCallback);
    },
    checkYjbsSlr:function (params, successCallback, errCallback) {
        var url = yjbsService.Api.checkYjbsSlr;
        ajax.post(url, params, successCallback, errCallback);
    }
});

ajax.post = function (url,params, successCallback, errCallback) {
    $.ajax({
        url:url,
        data:params,
        contentType:"application/json",
        success:successCallback,
        error:errCallback
    })
}

