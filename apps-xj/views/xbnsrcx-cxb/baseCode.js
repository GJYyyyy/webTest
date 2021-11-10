/**
 * Created with JetBrains WebStorm
 * Author：lizm
 * Date：2017/2/20
 * Time：18:43
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
        root.baseCode = factory();
    }
}(this, function () {

    var baseCode = {};

    var baseCodeData = store.getLocal('baseCode') || {version: 0};

    // var checkVersionUrl = '/hgzx-gld/api/hgzx/baseCode/get/version';
    var baseCodeUrl = '/dzgzpt-wsys/api/baseCode/get/baseCode2CombSelect5/';

    baseCode.getDataByCodeName = function (codeName) {

        ajax.get(baseCodeUrl + codeName, {}, function (data) {
            baseCodeData[codeName] = data;
            store.setLocal('baseCode', baseCodeData);
        })
        return baseCodeData[codeName];


    };

    baseCode.getMcById = function (codeName, Id) {
        var data = baseCode.getDataByCodeName(codeName);
        var MC = null;
        if (!!data) {
            for (var i = 0; i < data.length; i++) {
                var obj = data[i];
                if (obj.ID == Id) {
                    MC = obj.MC;
                    break;
                }
            }
        }
        return MC;
    };
    return baseCode;

}));
