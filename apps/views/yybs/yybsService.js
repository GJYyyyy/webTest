/**
 * Created by yanghui on 2017/5/10.
 */
/**
 * Created with JetBrains WebStorm
 * Author：lmyue
 * Date：2017/1/20
 * Time：20:35
 *
 */


var yybsService = {
    mock: false
};
$.extend(yybsService, {
    Api: function () {
        if (yybsService.mock) {  // 假数据
            return {
                queryDtsfqy: '../../data/queryDtsfqy.json',
                queryBsdt :'../../data/dtDm.json',
                queryAllCK:"../../data/allck.json",
                queryAllYysx:"../../data/allYysx.json",
                querySycksjdXx:'../../data/SycksjdXx.json',
                queryhasSetsx:'../../data/hasSetSx.json',
                yySetSubmit:'',
                queryCkTree:'',
                queryyyYwxzcx:""
            }
        } else {  // 真实接口
            return function () {
                var baseUrl = '/dzgzpt-wsys',
                    // 真实接口
                    real = {
                        getDjNsrxx: '/api/dj/bgdj/get/djNsrxx',
                        getHsfs: '/api/baseCode/get/baseCode2CombSelect2/DM_GY_HSFS',
                        queryBsdt :'/api/yybs/dtxx',
                        queryAllCK:'/api/yybs/cksxs',
                        queryAllYysx:'/api/yybs/yysxs',
                        querySycksjdXx:'/api/yybs/ckszxx',
                        queryhasSetsx:'/api/yybs/yysxszs',
                        yySetSubmit:'/api/yybs/saveckszxx',
                        queryCkTree:"/api/yybs/ywcx",
                        queryyyYwxzcx:"/api/yybs/ywxzcx",
                        yyYwxzsz:"/api/yybs/ywxzsz"
                    };

                for (var u in real) {
                    real[u] = baseUrl + real[u];
                }
                return real
            }();
        }
    }(),
    tj: function (params, successCallback, errCallback) {
        var url = yybsService.Api.tj;
        wssqUtil.tjsq(url, params, successCallback, errCallback);
    },
    getDjNsrxx: function (params, successCallback, errCallback) {
        var url = yybsService.Api.getDjNsrxx;
        ajax.post(url, params, successCallback, errCallback);
    },
    queryBsdt: function (params, successCallback, errCallback) {
        var url = yybsService.Api.queryBsdt;
        ajax.post(url, params, successCallback, errCallback);
    },
    queryAllCK:function (params, successCallback, errCallback) {
        var url = yybsService.Api.queryAllCK;
        ajax.post(url, params, successCallback, errCallback);
    },
    queryAllYysx:function (params, successCallback, errCallback) {
        var url = yybsService.Api.queryAllYysx;
        ajax.post(url, params, successCallback, errCallback);
    },
    querySycksjdXx:function (params, successCallback, errCallback) {
        var url = yybsService.Api.querySycksjdXx;
        ajax.post(url, params, successCallback, errCallback);
    },
    queryhasSetsx:function (params, successCallback, errCallback) {
        var url = yybsService.Api.queryhasSetsx;
        ajax.post(url, params, successCallback, errCallback);
    },
    yySetSubmit:function (params, successCallback, errCallback) {
        var url = yybsService.Api.yySetSubmit;
        ajax.post(url, params, successCallback, errCallback);
    },
//业务办理须知设置
    queryCkTree:function (params, successCallback, errCallback) {
        var url = yybsService.Api.queryCkTree;
        ajax.post(url, params, successCallback, errCallback);
    },
    queryyyYwxzcx:function (params, successCallback, errCallback) {
        var url = yybsService.Api.queryyyYwxzcx;
        ajax.post(url, params, successCallback, errCallback);
    },
    yyYwxzsz:function (params, successCallback, errCallback) {
        var url = yybsService.Api.yyYwxzsz;
        ajax.post(url, params, successCallback, errCallback);
    }
});
