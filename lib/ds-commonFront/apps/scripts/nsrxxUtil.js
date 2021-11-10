/**
 * Created with JetBrains WebStorm
 * Author：lizm
 * Date：2016/11/23
 * Time：13:41
 *
 */

;(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory();
    } else {
        // Browser globals (root is window)
        root.nsrxxUtil = factory();
    }
}(this, function () {

    var nsrxxUtil={};
    // 有参数true，就重新请求
    nsrxxUtil.getUserInfo = function (refresh) {

        var userInfo = mini.decode(store.getSession('getUserInfo'));

        if (refresh===true || !userInfo) {
            ajax.post('../../../api/base/userInfo/get', {}, function (response) {
                if (response.success && !!response.value) {
                    userInfo = response.value;
                    store.setSession('getUserInfo',userInfo);
                }else{
                    mini.alert(response.message);
                    return false;
                }
            });
        }
        return userInfo;
    };
    nsrxxUtil.getNsrInfo = function () {
        var data = nsrxxUtil.getUserInfo();
        if(!!data && !! data.NsrInfo){
            return data.NsrInfo;
        }else{
            return null;
        }
    };
    nsrxxUtil.getAccountInfo = function () {
        var data = nsrxxUtil.getUserInfo();
        if(!!data && !! data.AccountInfo){
            return data.AccountInfo;
        }else{
            return null;
        }
    };
    nsrxxUtil.getNsrxxVO = function (url) {

        var userInfo = nsrxxUtil.getUserInfo(); // 办税桌面缓存
        var nsrxxData = mini.decode(store.getSession("NsrjbxxVO")); // 纳税人信息缓存
        // 获取纳税人信息请求
        var _getNsrxx = function () {
            var nsrxx=null;
            var defaultUrl = !!url ? url : "../../../api/base/nsrxx/get";
            ajax.post(defaultUrl, {}, function (response) {

                if (response.success && !!response.value) {
                    nsrxx = response.value;
                    store.setSession("NsrjbxxVO", mini.encode(nsrxx));
                }else{
                    // 个人模式没有纳税人信息，不弹框提示
                    if(userInfo.NsrInfo){
                        mini.alert('获取纳税人信息失败，请稍后再试');
                    }

                    return false;
                }
            });
            return nsrxx;
        };

        if(!!userInfo){
            if (!!nsrxxData) {
                if(!userInfo.NsrInfo){
                    nsrxxData = null;
                    return false;
                }
                // 判断是否和办税桌面缓存的信息一致
                if(nsrxxData.djxh != userInfo.NsrInfo.djxh){
                    nsrxxData =  _getNsrxx();
                }
            } else {  // 缓存没有 则发请求
                nsrxxData =  _getNsrxx();
            }
            return nsrxxData;

        }else{  // 缓存不存在，未登录或者session过期
            //store.clearSession();
            //store.clearLocal();
            //mini.alert('登录已过期，请重新登录');
            return false;
        }
    };

    return nsrxxUtil;

}));


